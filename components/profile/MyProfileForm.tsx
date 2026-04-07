"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/toast";
import { type UpdateProfileActionState, updateProfile } from "@/app/(profile)/actions";

type MyProfileFormProps = {
  email: string;
  name: string | null;
  surname: string | null;
};

const initialState: UpdateProfileActionState = {
  status: "idle",
};

const MyProfileForm = ({ email, name, surname }: MyProfileFormProps) => {
  const router = useRouter();
  const [state, formAction] = useActionState<UpdateProfileActionState, FormData>(
    updateProfile,
    initialState
  );

  useEffect(() => {
    if (state.status === "success") {
      toast({ type: "success", description: "User info updated successfully!" });
      router.refresh();
    } else if (state.status === "invalid_data") {
      toast({ type: "error", description: "Failed validating your submission!" });
    } else if (state.status === "failed") {
      toast({ type: "error", description: "Error while updating user info." });
    }
  }, [router, state.status]);

  return (
    <form action={formAction} className="mt-6 space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} disabled />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="Enter your name" defaultValue={name ?? ""} maxLength={64} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="surname">Surname</Label>
        <Input
          id="surname"
          name="surname"
          placeholder="Enter your surname"
          defaultValue={surname ?? ""}
          maxLength={64}
        />
      </div>

      <Button type="submit">Save Profile</Button>
    </form>
  );
};

export default MyProfileForm;
