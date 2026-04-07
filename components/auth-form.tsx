"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormProps {
  action: (formData: FormData) => void;
  defaultEmail?: string;
  children: React.ReactNode;
}

export function AuthForm({ action, defaultEmail, children }: AuthFormProps) {
  return (
    <form action={action} className="flex flex-col gap-4 px-4 sm:px-16">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className="text-zinc-600 font-normal dark:text-zinc-400">
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="user@example.com"
          autoComplete="email"
          required
          defaultValue={defaultEmail}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password" className="text-zinc-600 font-normal dark:text-zinc-400">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••"
          autoComplete="current-password"
          required
          minLength={6}
        />
      </div>
      {children}
    </form>
  );
}
