"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function handleDeleteLecture(lectureId) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated.");
  }
  const { error } = await supabase
    .from("lectures")
    .delete()
    .eq("id", lectureId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}

export async function handleEditLecture(lectureId, updatedLectureData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated.");
  }

  const { error } = await supabase
    .from("lectures")
    .update(updatedLectureData)
    .eq("id", lectureId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}
