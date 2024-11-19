import ThemeToggle from "./ThemeToggle";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/app/auth/login/actions";
import { Button } from "./ui/button";
import Link from "next/link";

export const Navbar = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/">
            <div className="text-xl font-bold">StudyBuddy</div>
          </Link>
          <div className="flex items-center justify-center gap-2">
            <ThemeToggle />
            {user ? (
              <form action={signOut}>
                <Button>Sign out</Button>
              </form>
            ) : (
              <div>
                <Link href="/auth/login">
                  <Button>Sign in</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
