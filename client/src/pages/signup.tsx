import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";

export default function Signup() {
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name" className="text-gray-300">First name</Label>
                  <Input 
                    id="first-name" 
                    placeholder="John" 
                    className="bg-gray-800 border-gray-600 text-white"
                    data-testid="input-first-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name" className="text-gray-300">Last name</Label>
                  <Input 
                    id="last-name" 
                    placeholder="Doe" 
                    className="bg-gray-800 border-gray-600 text-white"
                    data-testid="input-last-name"
                  />
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
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <Input 
                  id="username" 
                  placeholder="johndoe" 
                  className="bg-gray-800 border-gray-600 text-white"
                  data-testid="input-username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  className="bg-gray-800 border-gray-600 text-white"
                  data-testid="input-password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-gray-300">Confirm Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  className="bg-gray-800 border-gray-600 text-white"
                  data-testid="input-confirm-password"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" data-testid="checkbox-terms" />
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
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700" data-testid="button-signup">
                Create Account
              </Button>
              
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