
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/state-manager/hook";
import Loader from "@/helper/Loader";
import { ForgotPassword } from "@/state-manager/slices/authSlice";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";

// Zod schema for email validation
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type forgotPassword = z.infer<typeof forgotPasswordSchema>;

export default function Forgotpassword() {
  const { isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  // Initialize the form with validation
  const form = useForm<forgotPassword>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: forgotPassword) => {
    console.log("on submit is called of the forgot password", data);
    dispatch(ForgotPassword(data))
      .then(() => {
        toast({
          title: "Link sent successfully",
          description: "Check your mail",
        });
      })
      .catch((error) => {
        toast({
          title: error,
          variant: "destructive",
        });
      });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto max-w-md space-y-6 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground">
          Enter your email to reset your password
        </p>
      </div>

    
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="m@example.com"
                    {...field}  
                  />
                </FormControl>
                <FormDescription>
                  We'll send you a password reset link.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit button */}
          <Button type="submit" className="w-full">
            Send Reset Email
          </Button>
        </form>
      </Form>
    </div>
  );
}
