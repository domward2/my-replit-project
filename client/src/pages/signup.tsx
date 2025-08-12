import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { trackSignup } from "@/lib/analytics";
import { setAuthUser } from "@/lib/auth";

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, "You must agree to the terms"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupForm) => {
      const response = await apiRequest("POST", "/api/auth/register", {
        username: data.username,
        email: data.email,
        password: data.password,
      });
      return await response.json();
    },
    onSuccess: (data) => {
      // Store auth token using the auth system
      if (data.token && data.user) {
        // Use the same auth system as login
        setAuthUser(data.user, data.token);
        
        // Track successful signup
        trackSignup(data.user.id);
        
        toast({
          title: "Account created successfully!",
          description: "Welcome to PnL AI. You're now signed in.",
        });
        
        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        toast({
          title: "Signup error",
          description: "Missing authentication data",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      await signupMutation.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MarketingLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Create your account</CardTitle>
              <CardDescription className="text-gray-400">
                Start your AI-powered trading journey today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name" className="text-gray-300">First name</Label>
                    <Input 
                      id="first-name" 
                      placeholder="John" 
                      className="bg-gray-800 border-gray-600 text-white"
                      data-testid="input-first-name"
                      {...form.register("firstName")}
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-red-400 text-sm">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name" className="text-gray-300">Last name</Label>
                    <Input 
                      id="last-name" 
                      placeholder="Doe" 
                      className="bg-gray-800 border-gray-600 text-white"
                      data-testid="input-last-name"
                      {...form.register("lastName")}
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-red-400 text-sm">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    className="bg-gray-800 border-gray-600 text-white"
                    data-testid="input-email"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-400 text-sm">{form.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-300">Username</Label>
                  <Input 
                    id="username" 
                    placeholder="johndoe" 
                    className="bg-gray-800 border-gray-600 text-white"
                    data-testid="input-username"
                    {...form.register("username")}
                  />
                  {form.formState.errors.username && (
                    <p className="text-red-400 text-sm">{form.formState.errors.username.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    className="bg-gray-800 border-gray-600 text-white"
                    data-testid="input-password"
                    {...form.register("password")}
                  />
                  {form.formState.errors.password && (
                    <p className="text-red-400 text-sm">{form.formState.errors.password.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-gray-300">Confirm Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    className="bg-gray-800 border-gray-600 text-white"
                    data-testid="input-confirm-password"
                    {...form.register("confirmPassword")}
                  />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-red-400 text-sm">{form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    data-testid="checkbox-terms"
                    checked={form.watch("terms")}
                    onCheckedChange={(checked) => form.setValue("terms", !!checked)}
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-400">
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {form.formState.errors.terms && (
                  <p className="text-red-400 text-sm">{form.formState.errors.terms.message}</p>
                )}
                
                <Button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  data-testid="button-signup"
                  disabled={isLoading || signupMutation.isPending}
                >
                  {isLoading || signupMutation.isPending ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
              
              
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-400 hover:text-blue-300">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MarketingLayout>
  );
}