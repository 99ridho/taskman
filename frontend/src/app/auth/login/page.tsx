"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { loginAction } from "./action";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [actionState, formAction, pending] = useActionState(loginAction, {
    success: false,
  });

  useEffect(() => {
    if (actionState.success) {
      router.push("/");
    }
  }, [actionState]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <h2 className="text-3xl font-bold text-center">
            Sign in to your account
          </h2>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            {!actionState.success && actionState.error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {actionState.error}
              </div>
            )}
            {searchParams.get("message") === "register-success" && (
              <div className="bg-blue-100 border border-blue-400 text-blue-500 px-4 py-3 rounded relative">
                {"Register success, you can login"}
              </div>
            )}
            <div className="space-y-2">
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                required
              />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <div className="text-sm">
              <Link
                href="/auth/register"
                className="text-primary hover:text-primary/90"
              >
                Don&apos;t have an account? Register
              </Link>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full mt-4" disabled={pending}>
              {pending ? "Logging in" : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
