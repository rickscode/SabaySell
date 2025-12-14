"use server";

import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(data: {
  phone?: string;
  telegram?: string;
  whatsapp?: string;
}) {
  try {
    const supabase = createServerClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    // Update user profile with contact information
    const updateData: any = {};
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.telegram !== undefined) updateData.telegram = data.telegram;
    if (data.whatsapp !== undefined) updateData.whatsapp = data.whatsapp;

    const { error: updateError } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating user profile:", updateError);
      return {
        success: false,
        error: "Failed to update profile",
      };
    }

    // Revalidate paths that might display user info
    revalidatePath("/profile");
    revalidatePath("/listings");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Unexpected error updating user profile:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
