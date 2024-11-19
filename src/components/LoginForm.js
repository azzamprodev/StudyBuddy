"use client";
import { emailLogin } from "@/app/auth/login/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import OAuthButtons from "@/app/auth/login/oauth";

export const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.target);

    try {
      const response = await emailLogin(formData);
      if (response.success) {
        setEmailSent(true);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {emailSent ? (
        <Card>
          <CardHeader>
            <CardTitle>
              <h1 className="text-2xl">
                <span className="text-green-500">Email Sent</span>
              </h1>
            </CardTitle>
            <CardDescription>
              <p className="">
                Please check your inbox to complete the login process using
                magic link.
              </p>
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <a
              href="https://mail.google.com"
              target="_blank"
              className="w-full"
            >
              <Button className="w-full">Open Email</Button>
            </a>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              <h1 className="text-2xl">Login to StudyBuddy</h1>
            </CardTitle>
            <CardDescription>
              Enter your email and sign in with Magic Link
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              {/* OAuth */}
              <div className="flex flex-col items-center justify-center w-full gap-2">
                <OAuthButtons />
              </div>
              <div className="flex items-center justify-center my-6">
                <hr className="border w-full" />
                <span className="mx-4 text-border ">OR</span>
                <hr className="border w-full" />
              </div>
              <div className="flex flex-col items-center justify-center gap-3">
                <Input
                  className="text-sm"
                  placeholder="m@example.com"
                  type="email"
                  name="email"
                  required
                />
                {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    "Get Magic Link"
                  )}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      )}
    </>
  );
};
