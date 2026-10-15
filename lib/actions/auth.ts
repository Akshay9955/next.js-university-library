"use server";

import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { headers } from "next/headers";
import ImageKit from "imagekit";
import config from "@/lib/config";
import { CredentialsSignin } from "next-auth";
import { workflowClient } from "../workflow";

const localRateLimits = new Map<string, { count: number; resetAt: number }>();

class RateLimitUnavailableError extends Error {}

const checkRateLimit = async (identifier: string) => {
  if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
    if (process.env.NODE_ENV === "production") {
      throw new RateLimitUnavailableError();
    }

    const now = Date.now();
    const current = localRateLimits.get(identifier);

    if (!current || current.resetAt <= now) {
      localRateLimits.set(identifier, { count: 1, resetAt: now + 60_000 });
      return true;
    }

    if (current.count >= 5) return false;

    current.count += 1;
    return true;
  }

  try {
    const { default: ratelimit } = await import("@/lib/ratelimit");
    return (await ratelimit.limit(identifier)).success;
  } catch {
    throw new RateLimitUnavailableError();
  }
};

const authenticate = async (email: string, password: string) => {
  const redirectUrl = await signIn("credentials", {
    email,
    password,
    redirect: false,
    redirectTo: "/",
  });

  if (new URL(redirectUrl, "http://localhost").searchParams.has("error")) {
    return { success: false, error: "Invalid email or password." };
  }

  return { success: true };
};

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">,
) => {
  const email = params.email.trim().toLowerCase();
  const { password } = params;

  try {
    const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    if (!(await checkRateLimit(`sign-in:${ip}`))) {
      return {
        success: false,
        error: "Too many sign-in attempts. Please wait a minute and try again.",
      };
    }

    return await authenticate(email, password);
  } catch (error) {
    if (error instanceof RateLimitUnavailableError) {
      return { success: false, error: "Unable to verify request limits. Please try again shortly." };
    }
    if (error instanceof CredentialsSignin) {
      return { success: false, error: "Invalid email or password." };
    }

    console.error("Sign-in failed", error);
    return { success: false, error: "Unable to sign in. Please try again." };
  }
};

export const logout = async () => {
  await signOut({ redirectTo: "/sign-in" });
};


export const signUp = async (params: AuthCredentials) => {
  const { fullName, universityId, password, universityCard } = params;
  const email = params.email.trim().toLowerCase();

  try {
    const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    if (!(await checkRateLimit(`sign-up:${ip}`))) {
      return {
        success: false,
        error: "Too many sign-up attempts. Please wait a minute and try again.",
      };
    }

    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: "An account with this email already exists." };
    }

    const imageMatch = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+=*)$/.exec(
      universityCard,
    );
    if (!imageMatch) {
      return { success: false, error: "Upload a valid JPG, PNG, or WebP university ID image." };
    }

    const imageBuffer = Buffer.from(imageMatch[2], "base64");
    if (imageBuffer.length === 0 || imageBuffer.length > 3 * 1024 * 1024) {
      return { success: false, error: "The university ID image must be smaller than 3 MB." };
    }

    const extension = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[
      imageMatch[1]
    ];
    const imagekit = new ImageKit({
      publicKey: config.env.imagekit.publicKey,
      privateKey: config.env.imagekit.privateKey,
      urlEndpoint: config.env.imagekit.urlEndpoint,
    });
    const uploadedCard = await imagekit.upload({
      file: imageBuffer,
      fileName: `university-card-${crypto.randomUUID()}.${extension}`,
      folder: "/university-cards",
      isPrivateFile: true,
    });

    const hashedPassword = await hash(password, 10);
    await db.insert(users).values({
      fullName,
      email,
      universityId,
      password: hashedPassword,
      universityCard: uploadedCard.url,
    });

    try {
      await workflowClient.trigger({
        url: `${config.env.prodApiEndpoint}/api/workflow/onboarding`,
        body: { email, fullName },
      });
    } catch (error) {
      console.error("Unable to start onboarding workflow", error);
    }
  
    return await authenticate(email, password);
  } catch (error) {
    if (error instanceof RateLimitUnavailableError) {
      return { success: false, error: "Unable to verify request limits. Please try again shortly." };
    }
    console.error("Sign-up failed", error);
    return { success: false, error: "Unable to create your account. Please try again." };
  }
};
