"use client";

import { useState, type ComponentProps } from "react";
import type { ZodType } from "zod";

import { Button } from "@/components/ui/button";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface Props<T extends Record<string, unknown>> {
    schema: ZodType<T>;
    defaultValues: T;
    onSubmit: (
        data: T,
    ) =>
        | Promise<{ success: boolean; error?: string }>
        | { success: boolean; error?: string }
        | void;
    type: "SIGN_IN" | "SIGN_UP";
}

const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
            typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Unable to read image."));
        reader.onerror = () => reject(new Error("Unable to read image."));
        reader.readAsDataURL(file);
    });

const AuthForm = <T extends Record<string, unknown>>({
    type,
    schema,
    defaultValues,
    onSubmit,
}: Props<T>) => {
    const router = useRouter();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState("");
    
    const isSignIn = type === "SIGN_IN";

    const handleSubmit = async (
        event: Parameters<NonNullable<ComponentProps<"form">["onSubmit"]>>[0],
    ) => {
        event.preventDefault();
        setErrors({});
        setSubmitError("");

        const formData = new FormData(event.currentTarget);
        let values: Record<string, unknown>;
        try {
            values = Object.fromEntries(await Promise.all(
                Object.keys(defaultValues).map(async (name) => {
                const value = formData.get(name);
                if (name === "universityCard") {
                    if (!(value instanceof File) || value.size === 0) return [name, ""];
                    if (value.size > 3 * 1024 * 1024) {
                        throw new Error("The university ID image must be smaller than 3 MB.");
                    }
                    if (!value.type.match(/^image\/(jpeg|png|webp)$/)) {
                        throw new Error("Upload a JPG, PNG, or WebP university ID image.");
                    }
                    return [name, await readFileAsDataUrl(value)];
                }
                if (FIELD_TYPES[name as keyof typeof FIELD_TYPES] === "number") {
                    return [
                        name,
                        typeof value === "string" && value !== "" ? Number(value) : undefined,
                    ];
                }
                return [name, typeof value === "string" ? value : ""];
                }),
            ));
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : "Unable to read the uploaded image.");
            return;
        }
        const parsed = schema.safeParse(values);

        if (!parsed.success) {
            const nextErrors: Record<string, string> = {};
            for (const issue of parsed.error.issues) {
                const name = issue.path[0];
                if (typeof name === "string" && !nextErrors[name]) {
                    nextErrors[name] = issue.message;
                }
            }
            setErrors(nextErrors);
            return;
        }

        try {
            const result = await onSubmit(parsed.data);
            if (!result) {
                setSubmitError("Authentication is not configured yet.");
                return;
            }
            if (result.success) {
                                toast({
                                        title: "Success",
                                        description: isSignIn
                                                ? "You have successfully signed in."
                                                : "Your account has been created and you are signed in.",
                                });
                                router.replace("/");
                                router.refresh();
                                return;
                        }

                        setSubmitError(result.error ?? "An error occurred.");
                        toast({
                                title: `Error ${isSignIn ? "signing in" : "signing up"}`,
                                description: result.error ?? "An error occurred.",
                                variant: "destructive",
                        });
        } catch {
            setSubmitError("Unable to submit the form. Please try again.");
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-white">
                {isSignIn ? "Welcome back to BookWise" : "Create your library account"}
            </h1>
            <p className="text-light-100">
                {isSignIn
                    ? "Access the vast collection of resources, and stay updated"
                    : "Please complete all fields and upload a valid university ID to gain access to the library"}
            </p>
            <form onSubmit={handleSubmit} className="w-full space-y-6">
                {Object.keys(defaultValues).map((name) => {
                    const label = FIELD_NAMES[name as keyof typeof FIELD_NAMES] ?? name;
                    const inputType = FIELD_TYPES[name as keyof typeof FIELD_TYPES] ?? "text";
                    const isCardUpload = name === "universityCard";
                    const value = defaultValues[name];
                    const defaultValue =
                        typeof value === "string" || typeof value === "number"
                            ? value
                            : undefined;

                    return (
                        <div key={name} className="space-y-2">
                            <label htmlFor={name} className="capitalize text-light-100">
                                {label}
                            </label>
                            <input
                                id={name}
                                name={name}
                                type={isCardUpload ? "file" : inputType}
                                accept={isCardUpload ? "image/*" : undefined}
                                required
                                defaultValue={isCardUpload ? undefined : defaultValue}
                                className="form-input"
                                aria-invalid={Boolean(errors[name])}
                                aria-describedby={errors[name] ? `${name}-error` : undefined}
                            />
                            {errors[name] && (
                                <p id={`${name}-error`} className="text-sm text-red-300" role="alert">
                                    {errors[name]}
                                </p>
                            )}
                        </div>
                    );
                })}

                {submitError && (
                    <p className="text-sm text-red-300" role="alert">
                        {submitError}
                    </p>
                )}

                <Button type="submit" className="form-btn">
                    {isSignIn ? "Sign In" : "Sign Up"}
                </Button>
            </form>

            <p className="text-center text-base font-medium">
                {isSignIn ? "New to BookWise? " : "Already have an account? "}
                <Link
                    href={isSignIn ? "/sign-up" : "/sign-in"}
                    className="font-bold text-primary"
                >
                    {isSignIn ? "Create an account" : "Sign in"}
                </Link>
            </p>
        </div>
    );
};

export default AuthForm;
