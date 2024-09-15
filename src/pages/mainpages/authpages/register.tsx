import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const signUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  preferences: z.object({
    style: z.string().min(1, { message: "Please select a style preference" }),
    favoriteColors: z
      .array(z.string())
      .min(1, { message: "Please select at least one favorite color" }),
    preferredMaterials: z
      .array(z.string())
      .min(1, { message: "Please select at least one preferred material" }),
  }),
  avatar: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const styleOptions = ["Casual", "Formal", "Sporty", "Vintage", "Bohemian"];
const colorOptions = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Purple",
  "Pink",
];
const materialOptions = [
  "Cotton",
  "Linen",
  "Silk",
  "Wool",
  "Polyester",
  "Denim",
];

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const avatarFile = watch("avatar");

  useEffect(() => {
    if (avatarFile && avatarFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(avatarFile[0]);
    } else {
      setAvatarPreview(null);
    }
  }, [avatarFile]);

  const onSubmit = async (data: SignUpFormValues) => {
    setSignUpError(null);
    try {
      // Here you would typically call your API to create a new user
      console.log("Sign up attempt with:", data);
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // If sign-up is successful, you might redirect the user or update the app state
      console.log("Sign up successful");
    } catch (error) {
      setSignUpError("An error occurred during sign up. Please try again.");
    }
  };

  const handleRemoveAvatar = () => {
    setValue("avatar", null);
    setAvatarPreview(null);
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-12">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl text-center">
            Sign Up for TrendSphere
          </CardTitle>
          <CardDescription className="text-center">
            Create your account to start shopping
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register("username")}
                aria-invalid={errors.username ? "true" : "false"}
              />
              {errors.username && (
                <p className="text-sm text-destructive font-bold italic">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-sm text-destructive font-bold italic">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive font-bold italic">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <Label>Preferences</Label>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="style">Style</Label>
                  <Controller
                    name="preferences.style"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your style" />
                        </SelectTrigger>
                        <SelectContent>
                          {styleOptions.map((style) => (
                            <SelectItem key={style} value={style}>
                              {style}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.preferences?.style && (
                    <p className="text-sm text-destructive font-bold italic">
                      {errors.preferences.style.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Favorite Colors</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <div key={color} className="flex items-center space-x-2">
                        <Controller
                          name="preferences.favoriteColors"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id={`color-${color}`}
                              checked={field.value?.includes(color)}
                              onCheckedChange={(checked) => {
                                const updatedColors = checked
                                  ? [...(field.value || []), color]
                                  : (field.value || []).filter(
                                      (c) => c !== color
                                    );
                                field.onChange(updatedColors);
                              }}
                            />
                          )}
                        />
                        <Label htmlFor={`color-${color}`}>{color}</Label>
                      </div>
                    ))}
                  </div>
                  {errors.preferences?.favoriteColors && (
                    <p className="text-sm text-destructive font-bold italic">
                      {errors.preferences.favoriteColors.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Preferred Materials</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {materialOptions.map((material) => (
                      <div
                        key={material}
                        className="flex items-center space-x-2"
                      >
                        <Controller
                          name="preferences.preferredMaterials"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id={`material-${material}`}
                              checked={field.value?.includes(material)}
                              onCheckedChange={(checked) => {
                                const updatedMaterials = checked
                                  ? [...(field.value || []), material]
                                  : (field.value || []).filter(
                                      (m) => m !== material
                                    );
                                field.onChange(updatedMaterials);
                              }}
                            />
                          )}
                        />
                        <Label htmlFor={`material-${material}`}>
                          {material}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.preferences?.preferredMaterials && (
                    <p className="text-sm text-destructive font-bold italic">
                      {errors.preferences.preferredMaterials.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  {...register("avatar")}
                  className="hidden"
                  onChange={(e) => {
                    register("avatar").onChange(e);
                  }}
                />
                {avatarPreview ? (
                  <div className="relative w-32 h-32">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2"
                      onClick={handleRemoveAvatar}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Label
                    htmlFor="avatar"
                    className="cursor-pointer flex items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <span className="mt-2 block text-sm font-medium text-muted-foreground">
                        Upload avatar
                      </span>
                    </div>
                  </Label>
                )}
              </div>
              {errors.avatar && (
                <p className="text-sm text-destructive font-bold italic">
                  {errors.avatar.message as string}
                </p>
              )}
            </div>

            {signUpError && (
              <Alert variant="destructive">
                <AlertDescription>{signUpError}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="#" className="text-primary hover:underline">
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
