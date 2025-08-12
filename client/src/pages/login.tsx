import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { setAuthUser } from "@/lib/auth";
import { handlePostLoginRedirect } from "@/lib/deployment-router";
import { loginSchema, registerSchema, type LoginRequest, type RegisterRequest } from "@shared/schema";

export default function Login() {
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const loginForm = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Debug form state
  console.log('Login form state:', {
    isValid: loginForm.formState.isValid,
    errors: loginForm.formState.errors,
    values: loginForm.getValues()
  });

  const registerForm = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      paperTradingEnabled: true,
      dailyLossLimit: "1000.00",
      positionSizeLimit: "5.00",
      circuitBreakerEnabled: true,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return await response.json();
    },
    onSuccess: (response: any) => {
      console.log('Login response:', response);

      // Verify token exists in response
      if (!response.token) {
        console.error('No token in login response!');
        toast({
          title: "Login error", 
          description: "Authentication token missing",
          variant: "destructive"
        });
        return;
      }

      // Store auth user data and token
      console.log('Storing token:', response.token.substring(0, 20) + '...');
      setAuthUser(response.user, response.token);

      // Verify token was stored
      const storedToken = localStorage.getItem('pnl-ai-token');
      console.log('Token stored successfully:', !!storedToken);

      toast({
        title: "Login successful", 
        description: "Redirecting to dashboard...",
      });

      // Use deployment-aware redirect with desktop cache clearing
      console.log('Login successful with token - triggering redirect');

      // Force cache clear for desktop browsers
      const isDesktop = !(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
      if (isDesktop) {
        console.log('Desktop login - clearing caches');
        if ('caches' in window) {
          caches.keys().then(names => names.forEach(name => caches.delete(name)));
        }
      }

      handlePostLoginRedirect();
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return await response.json();
    },
    onSuccess: (response: any) => {
      // Store auth user data and token
      setAuthUser(response.user, response.token);

      toast({
        title: "Registration successful",
        description: "Account created! Redirecting to dashboard...",
      });

      // Use deployment-aware redirect
      console.log('Registration successful with token - triggering redirect');
      handlePostLoginRedirect();
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  const onLogin = (data: LoginRequest) => {
    console.log('Desktop login attempt started with data:', data);
    console.log('Current mutation state:', { isPending: loginMutation.isPending, isError: loginMutation.isError });
    
    loginMutation.mutate(data);
  };

  const onRegister = (data: RegisterRequest) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <Card className="w-full max-w-md bg-dark-card border-dark-border">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-trading-blue to-trading-green rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">PA</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">PnL AI</CardTitle>
          <CardDescription className="text-slate-400">
            AI-powered crypto trading platform
          </CardDescription>
          <div className="bg-trading-blue/10 border border-trading-blue/20 rounded-lg p-3 mt-4">
            <p className="text-sm text-trading-blue font-medium">Demo Credentials</p>
            <p className="text-xs text-slate-400">Username: demo | Password: demo123</p>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
              <TabsTrigger value="register" data-testid="tab-register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={(e) => {
                  console.log('Form submit event triggered');
                  return loginForm.handleSubmit(onLogin)(e);
                }} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Username</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your username" 
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="input-username"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter your password" 
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="input-password"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-trading-blue hover:bg-trading-blue/90"
                    disabled={loginMutation.isPending}
                    data-testid="button-login"
                    onClick={() => console.log('Login button clicked!')}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Username</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Choose a username" 
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="input-register-username"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="input-email"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Create a password" 
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="input-register-password"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Confirm Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Confirm your password" 
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="input-confirm-password"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-trading-green hover:bg-trading-green/90"
                    disabled={registerMutation.isPending}
                    data-testid="button-register"
                  >
                    {registerMutation.isPending ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}