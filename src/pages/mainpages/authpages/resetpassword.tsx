import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"; // Assuming these components exist
import Loader from "@/helper/Loader";
import { useAppDispatch, useAppSelector } from "@/state-manager/hook";

import { useToast } from "@/hooks/use-toast";
import { SVGProps } from "react";
import { ResetuserPassword } from "@/state-manager/slices/authSlice";
import { useNavigate, useParams } from "react-router-dom";

// Zod schema for validating new password and confirm password fields
const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const { isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { token } = useParams();
  const navigate = useNavigate();

  // Initializing useForm with zod validation schema
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    console.log("Password reset data submitted:", data);

    if (token) {
      dispatch(ResetuserPassword({ token, password: data.newPassword }))
        .then(() => {
          toast({
            title: "Password reset successfully",
            description: "Your password has been updated.",
          });
          navigate("/Sign-in");
        })
        .catch((error) => {
          toast({
            title: error,
            variant: "destructive",
          });
        });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <TrendingUpIcon className="h-12 w-12" />
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground">
            Enter your new password and confirm to reset your account.
          </p>
        </div>

        {/* Reset Password Form */}
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <CardContent className="space-y-4">
                {/* New Password Field */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="newPassword">New Password</FormLabel>
                      <FormControl>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Enter a new password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm your new password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter>
                <Button type="submit" className="w-full">
                  Reset Password
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}

function TrendingUpIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
