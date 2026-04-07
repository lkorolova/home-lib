"use server";

import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import { updateUserProfile } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

const profileFormSchema = z.object({
  name: z.string().trim().max(64).optional(),
  surname: z.string().trim().max(64).optional(),
});

export type UpdateProfileActionState = {
  status: "idle" | "success" | "failed" | "invalid_data";
};

const normalizeOptionalText = (value: string | undefined) => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const updateProfile = async (
  _: UpdateProfileActionState,
  formData: FormData
): Promise<UpdateProfileActionState> => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { status: "failed" };
    }

    const validatedData = profileFormSchema.parse({
      name: formData.get("name") ?? undefined,
      surname: formData.get("surname") ?? undefined,
    });

    await updateUserProfile(session.user.id, {
      name: normalizeOptionalText(validatedData.name),
      surname: normalizeOptionalText(validatedData.surname),
    });

    revalidatePath("/my-profile");

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};
