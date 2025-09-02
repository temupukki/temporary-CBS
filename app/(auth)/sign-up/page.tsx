"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

// Zod schema for employee registration.
const RegisterEmployeeSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  middleName: z.string().optional(),
  lastName: z.string().min(2, "Last name is required."),
  nationalId: z.string().min(5, "National ID is required."),
  address: z.string().optional(),
  phone: z.string().min(9, "Phone number must be at least 9 digits."),
  role: z.enum(["ADMIN", "USER"]),
});
type SignupFormData = z.infer<typeof RegisterEmployeeSchema>;

export default function BankSignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(RegisterEmployeeSchema),
  });

  async function onSubmit(values: SignupFormData) {
    setIsSubmitting(true);
    let loadingToastId = null;

    try {
      loadingToastId = toast.loading("Registering employee...");

      // Step 1: Register the user with the authentication client
      const defaultPassword = `${values.lastName}@12341234`;
      const employeeEmail = `${values.lastName.toLowerCase()}@dashenbank.com`;

      const { error: signUpError } = await authClient.signUp.email({
        email: employeeEmail,
        password: defaultPassword,
        name: `${values.firstName} ${values.middleName ? values.middleName + ' ' : ''}${values.lastName}`,
      });

      if (signUpError) {
        throw new Error(signUpError.message || "User creation failed, please try again.");
      }

      // Step 2: Call your custom API endpoint to set the role
      const response = await fetch("/api/set-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: employeeEmail,
          role: values.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to assign role.");
      }

      // Step 3: Create employee profile in your database (you'll need to create this API endpoint)
      const profileResponse = await fetch("/api/set-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: employeeEmail,
          firstName: values.firstName,
          middleName: values.middleName,
          lastName: values.lastName,
          nationalId: values.nationalId,
          phone: values.phone,
          address: values.address,
          role: values.role,
        }),
      });

      if (!profileResponse.ok) {
        const profileData = await profileResponse.json();
        throw new Error(profileData.error || "Failed to create employee profile.");
      }

      // Success!
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
      toast.success(
        "Employee registered successfully! The default password is their last name followed by @12341234"
      );
      router.push("/dashboard");
    } catch (err: any) {
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
      toast.error(err.message || "An unexpected error occurred.");
      console.error("Registration error →", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-4 sm:p-6">
      <title>Employee Registration | Loan Origination</title>
      <Card className="w-full max-w-2xl bg-white rounded-xl shadow-sm border-0">
        <CardHeader className="text-center space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold text-blue-700">
            Register Employee
          </CardTitle>
          <CardDescription className="text-blue-500">
            Onboard to the Loan Origination
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-blue-700">First Name</Label>
                <Input
                  {...register("firstName")}
                  placeholder="Enter employee first name"
                />
                {errors.firstName && (
                  <p className="text-xs text-blue-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-blue-700">Middle Name</Label>
                <Input
                  {...register("middleName")}
                  placeholder="Enter employee middle name"
                />
                {errors.middleName && (
                  <p className="text-xs text-blue-600">
                    {errors.middleName.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-blue-700">Last Name</Label>
                <Input
                  {...register("lastName")}
                  placeholder="Enter employee last name"
                />
                {errors.lastName && (
                  <p className="text-xs text-blue-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-blue-700">National Id</Label>
                <Input
                  {...register("nationalId")}
                  placeholder="123xxxxxxxxxx"
                />
                {errors.nationalId && (
                  <p className="text-xs text-blue-600">
                    {errors.nationalId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-blue-700">Role</Label>
                <select
                  {...register("role")}
                  className="w-full border rounded-md p-2 text-blue-700 focus:ring focus:ring-blue-300"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  <option value="ADMIN">Admin</option>
                  <option value="USER">User</option>
                </select>
                {errors.role && (
                  <p className="text-xs text-blue-600">{errors.role.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label className="text-blue-700">Address</Label>
              <Input {...register("address")} placeholder="Bole, Addis Ababa" />
              {errors.address && (
                <p className="text-xs text-blue-600">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div>
              <Label className="text-blue-700">Phone</Label>
              <Input {...register("phone")} placeholder="0912345678" />
              {errors.phone && (
                <p className="text-xs text-blue-600">{errors.phone.message}</p>
              )}
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-700">
                Default password will be automatically generated as:{" "}
                <strong>yourlastname@12341234</strong>
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-transform"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering Employee...
                </>
              ) : (
                "Register Employee"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}