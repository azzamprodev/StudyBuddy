import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="container max-w-md mx-auto px-4">
        <LoginForm />
      </div>
    </div>
  );
}
