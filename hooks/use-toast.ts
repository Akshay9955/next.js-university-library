"use client";

import { toast as sonnerToast } from "sonner";

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function toast({ title, description, variant }: ToastOptions) {
  const message = title ?? "Notification";
  const options = description ? { description } : undefined;

  if (variant === "destructive") {
    sonnerToast.error(message, options);
    return;
  }

  sonnerToast(message, options);
}