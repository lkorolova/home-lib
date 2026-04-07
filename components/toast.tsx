import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  type: "success" | "error" | "info";
  description: string;
}

export function toast({ type, description }: ToastOptions) {
  if (type === "success") {
    sonnerToast.success(description);
  } else if (type === "error") {
    sonnerToast.error(description);
  } else {
    sonnerToast.info(description);
  }
}
