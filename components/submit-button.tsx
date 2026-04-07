"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

interface SubmitButtonProps {
  isSuccessful: boolean;
  children: React.ReactNode;
}

export function SubmitButton({ isSuccessful, children }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full"
      disabled={pending || isSuccessful}
    >
      {pending || isSuccessful ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        children
      )}
    </Button>
  );
}
