import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/state-manager/hook";
import { VerifyCode } from "@/state-manager/slices/authSlice";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

// Define schema using Zod for OTP validation
export const VerifySchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
  email: z.string().email({ message: "Please Enter Email in correct format" }),
});

export default function VerifyOTP() {
  const { email } = useParams();
  const [signUpError, setSignUpError] = useState<string | null>(null);
  // Set up form handling using react-hook-form and zod
  const form = useForm<z.infer<typeof VerifySchema>>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      code: "",
      email: email,
    },
  });
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  function onSubmit(data: z.infer<typeof VerifySchema>) {
    dispatch(VerifyCode(data))
      .then(() => {
        toast({
          title: "Your Account Verified Successfuly ",
          description: "Please Login to continue",
        });
        navigate("/sign-in");
      })
      .catch(() => {
        setSignUpError(
          "An Error is occured while verifying user Account Please Try Again ."
        );
      });
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 dark:bg-[#1e1e1e]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Verify OTP</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to {email}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Integrating the form component */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the OTP sent to your phone number.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {signUpError && (
                <Alert variant="destructive">
                  <AlertDescription>{signUpError}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                ) : (
                  "Verify"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
