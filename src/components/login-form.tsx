"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface LoginFormProps {
  onLogin: (username: string) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    if (username.trim()) {
      setIsLoading(true);
      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      onLogin(username.trim());
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col md:flex-row min-h-screen font-jakartaSans overflow-hidden")}>
      {/* Left Side - Welcome Section */}
      <div className="bg-emerald-600 text-white flex-1 flex flex-col p-16 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 right-16 w-32 h-32 border-8 rounded-full"></div>
          <div className="absolute top-36 left-0 w-60 h-60 border-8 rounded-full"></div>
          <div className="absolute sm:block hidden bottom-36 right-0 w-60 h-60 border-8 rounded-full"></div>
          <div className="hidden absolute bottom-1/2 left-1/2 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute -bottom-10 left-1/2 w-16 h-16 bg-white rounded-full"></div>
        </div>

        

        {/* Logo with entrance animation */}
        <div
          className={cn(
            "logo flex items-center gap-2 transition-all duration-1000 ease-out",
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
          )}
        >
          <div className="w-6 h-6 bg-white rounded-sm transform transition-transform duration-500 hover:rotate-12 hover:scale-110" />
          <h1 className="text-4xl font-bold">QuizIn</h1>
        </div>

        {/* Welcome text with staggered animation */}
        <div className="welcomingText my-16 md:mt-44 relative z-10">
          <h1
            className={cn(
              "text-5xl sm:text-6xl font-bold leading-12 sm:leading-14 transition-all duration-1200 ease-out",
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-12 opacity-0"
            )}
          >
            <span className="inline-block transition-all duration-700 hover:text-emerald-100">
              Hello,
            </span>{" "}
            <br />
            <span className="inline-block transition-all duration-700 animation-delay-300 hover:text-emerald-100">
              welcome
            </span>
          </h1>

          <div
            className={cn(
              "mt-8 transition-all duration-1000 ease-out animation-delay-600",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            )}
          >
            <p className="font-bold transform transition-all duration-300 hover:scale-105 hover:text-emerald-100">
              Test Your Knowledge, Challenge Your Mind!
            </p>
            <p
              className={cn(
                "font-base mt-4 transition-all duration-800 ease-out animation-delay-800",
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              )}
            >
              Take fun quizzes across different categories. <br /> Choose your
              favorite topic or go random and see how far you can go!
            </p>
          </div>
        </div>

        {/* Floating quiz icons */}
        <div className="absolute bottom-16 left-16 flex gap-4">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-bounce animation-delay-200">
            <span className="text-xs">?</span>
          </div>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-bounce animation-delay-400">
            <span className="text-xs">!</span>
          </div>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-bounce animation-delay-600">
            <span className="text-xs">★</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Card */}
      <Card
        className={cn(
          "flex-1 justify-center border-0 shadow-none transition-all duration-1000 ease-out",
          isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
        )}
      >
        <CardHeader className="transition-all duration-700 ease-out animation-delay-400">
          <CardTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
            Login to your account
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent
          className={cn(
            "transition-all duration-800 ease-out animation-delay-600",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
                  className={cn(
                    "transition-all duration-300 ease-in-out",
                    "focus:scale-105 focus:shadow-lg focus:border-emerald-500",
                    "hover:border-emerald-300"
                  )}
                  required
                />
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className={cn(
                    "w-full bg-emerald-600 hover:bg-emerald-700",
                    "transition-all duration-300 ease-in-out",
                    "hover:scale-105 hover:shadow-xl",
                    "active:scale-95",
                    isLoading && "animate-pulse"
                  )}
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Logging in...
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <a
                href="#"
                className={cn(
                  "underline underline-offset-4 text-emerald-600",
                  "transition-all duration-300 hover:text-emerald-800",
                  "hover:underline-offset-2"
                )}
              >
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>

      <style jsx>{`
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        .animation-delay-700 {
          animation-delay: 0.7s;
        }
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
