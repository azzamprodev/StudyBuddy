"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getURL } from "@/utils/helpers";

export async function emailLogin(formData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email"),
  };

  const { error } = await supabase.auth.signInWithOtp({
    email: data.email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function oAuthLogin(provider) {
  if (!provider) {
    return redirect("/auth/login");
  }

  const supabase = createClient();
  const redirectUrl = getURL("/auth/callback");
  const { data, error } = await (
    await supabase
  ).auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl,
    },
  });

  if (error) {
    redirect("/auth/login");
  }

  return redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
