"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { format, subYears, setYear, getYear } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  X,
  FileText,
  User,
  Mail,
  Shield,
  CreditCard,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Custom dropdown arrow
const CustomSelectArrow = () => (
  <svg
    className="ml-2 h-4 w-4 text-gray-500"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

// Year Navigation Component
const YearNavigation = ({
  currentDate,
  onYearChange,
  maxDate,
}: {
  currentDate: Date;
  onYearChange: (date: Date) => void;
  maxDate: Date;
}) => {
  const currentYear = getYear(currentDate);
  const maxYear = getYear(maxDate);
  const yearRange = 12;
  const [startYear, setStartYear] = useState(
    currentYear - Math.floor(yearRange / 2)
  );

  const years = Array.from({ length: yearRange }, (_, i) => startYear + i);

  const navigateYears = (direction: "prev" | "next") => {
    setStartYear((prev) =>
      direction === "prev" ? prev - yearRange : prev + yearRange
    );
  };

  return (
    <div className="flex flex-col p-2 border-t border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigateYears("prev")}
          className="h-7 w-7 p-0 text-gray-700 hover:bg-gray-100"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-gray-700">
          {years[0]} - {years[years.length - 1]}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigateYears("next")}
          disabled={years[years.length - 1] >= maxYear}
          className="h-7 w-7 p-0 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {years.map((year) => (
          <Button
            key={year}
            type="button"
            variant={currentYear === year ? "default" : "ghost"}
            size="sm"
            onClick={() => onYearChange(setYear(new Date(), year))}
            disabled={year > maxYear}
            className={`h-7 text-xs ${
              currentYear === year
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {year}
          </Button>
        ))}
      </div>
    </div>
  );
};

interface FormData {
  customerNumber: string;
  tinNumber?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  mothersName: string;
  gender: string;
  maritalStatus: string;
  dateOfBirth: Date | null;
  nationalId: string;
  phone: string;
  email?: string;
  region: string;
  zone: string;
  city: string;
  subcity: string;
  woreda: string;
  monthlyIncome: number | string;
  nationalidUrl?: string;
  agreementFormUrl?: string;
  accountType: string;
}

interface FileUploadProps {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  label: string;
  id: string;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  file,
  onFileChange,
  onRemoveFile,
  label,
  id,
  error,
}) => (
  <div className="space-y-2">
    <div className="flex flex-col gap-2">
      {file ? (
        <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-gray-50">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="text-gray-700 text-sm">{file.name}</span>
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-6 w-6 rounded-full hover:bg-gray-200"
            onClick={onRemoveFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border border-dashed border-gray-300 rounded-md p-4 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
          <Label
            htmlFor={id}
            className="cursor-pointer flex flex-col items-center justify-center gap-2"
          >
            <Upload className="h-8 w-8 text-gray-500" />
            <span className="text-sm text-gray-700">{label}</span>
            <span className="text-xs text-gray-500">PDF only (Max 5MB)</span>
          </Label>
          <input
            id={id}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={onFileChange}
          />
        </div>
      )}
    </div>
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

export default function AddBankCustomerPage() {
  const router = useRouter();
  const { register, handleSubmit, setValue, control } = useForm<FormData>({
    defaultValues: {
      email: "",
      monthlyIncome: "",
      dateOfBirth: null,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerNumber, setCustomerNumber] = useState("");
  const [calendarMonth, setCalendarMonth] = useState<Date>(
    subYears(new Date(), 30)
  );
  const [nationalidFile, setNationalidFile] = useState<File | null>(null);
  const [agreementFormFile, setAgreementFormFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof FormData, string>>
  >({});

  // Calculate the maximum date (18 years ago)
  const maxDate = subYears(new Date(), 18);

  // Generate customer number on component mount
  useEffect(() => {
    const generatedNumber = "CUST" + Date.now().toString().slice(-6);
    setCustomerNumber(generatedNumber);
    setValue("customerNumber", generatedNumber);
  }, [setValue]);

  const uploadFileToSupabase = async (
    file: File,
    type: "nationalid" | "agreement"
  ): Promise<string> => {
    if (file.type !== "application/pdf") {
      throw new Error("Please select a PDF file");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size must be less than 5MB");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || errorData.details || "Upload failed"
        );
      }

      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to upload file"
      );
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "nationalid" | "agreement"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.type !== "application/pdf") {
        toast.error("Please select a PDF file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      if (type === "nationalid") {
        setNationalidFile(file);
      } else {
        setAgreementFormFile(file);
      }
    }
  };

  const handleRemoveFile = (type: "nationalid" | "agreement") => {
    if (type === "nationalid") {
      setNationalidFile(null);
      setValue("nationalidUrl", "");
    } else {
      setAgreementFormFile(null);
      setValue("agreementFormUrl", "");
    }
  };

  const handleYearChange = (date: Date) => {
    setCalendarMonth(date);
  };

  const validateForm = (
    data: FormData
  ): Partial<Record<keyof FormData, string>> => {
    const errors: Partial<Record<keyof FormData, string>> = {};

    if (!data.firstName) errors.firstName = "First name is required";
    if (!data.lastName) errors.lastName = "Last name is required";
    if (!data.mothersName) errors.mothersName = "Mother's name is required";
    if (!data.gender) errors.gender = "Gender is required";
    if (!data.maritalStatus)
      errors.maritalStatus = "Marital status is required";
    if (!data.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
    if (!data.nationalId) errors.nationalId = "National ID is required";
    if (data.nationalId && !/^\d{12}$/.test(data.nationalId))
      errors.nationalId = "Must contain exactly 12 digits";
    if (data.tinNumber && !/^\d{10}$/.test(data.tinNumber))
      errors.tinNumber = "Must contain exactly 10 digits";

    if (!data.phone) errors.phone = "Phone number is required";
    if (
      data.phone &&
      (!/^\+?\d+$/.test(data.phone) ||
        data.phone.length < 10 ||
        data.phone.length > 13)
    )
      errors.phone = "Must be a valid phone number";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errors.email = "Invalid email address";
    if (!data.region) errors.region = "Region is required";
    if (!data.zone) errors.zone = "Zone is required";
    if (!data.city) errors.city = "City is required";
    if (!data.subcity) errors.subcity = "Subcity is required";
    if (!data.woreda) errors.woreda = "Woreda is required";
    if (!data.monthlyIncome)
      errors.monthlyIncome = "Monthly income is required";
    if (data.monthlyIncome && Number(data.monthlyIncome) < 100)
      errors.monthlyIncome = "Monthly income must be at least 100";
    if (!data.accountType) errors.accountType = "Account type is required";

    return errors;
  };

  const onSubmit = async (data: FormData) => {
    const errors = validateForm(data);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix the form errors");
      return;
    }

    if (!nationalidFile) {
      toast.error("National ID document is required");
      return;
    }

    if (!agreementFormFile) {
      toast.error("Agreement form is required");
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      const [nationlidUrl, agreementFormUrl] = await Promise.all([
        uploadFileToSupabase(nationalidFile, "nationalid"),
        uploadFileToSupabase(agreementFormFile, "agreement"),
      ]);

      if (!nationlidUrl || !agreementFormUrl) {
        throw new Error("Failed to upload files");
      }

      const formattedDateOfBirth = data.dateOfBirth
        ? format(data.dateOfBirth, "yyyy-MM-dd")
        : "";

      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          dateOfBirth: formattedDateOfBirth,
          nationlidUrl,
          agreementFormUrl,
          monthlyIncome: Number(data.monthlyIncome),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create customer");
      }

      toast.success("Customer created successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create customer"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <title>Individual | CBS</title>
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center space-y-1 pb-4">
            <div className="flex items-center justify-center mb-2">
              <CreditCard className="h-8 w-8 text-blue-600 mr-2" />
              <CardTitle className="text-3xl font-bold text-gray-900">
                New Customer Registration
              </CardTitle>
            </div>
            <CardDescription className="text-gray-600 text-lg">
              Fill in the customer details below to create a new account
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Customer Number */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Customer Number*</Label>
                    <Input
                      value={customerNumber}
                      readOnly
                      className="bg-gray-100 border-gray-300"
                    />
                    <input
                      type="hidden"
                      {...register("customerNumber")}
                      value={customerNumber}
                    />
                  </div>

                  {/* TIN Number */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">TIN Number</Label>
                    <Input
                      {...register("tinNumber")}
                      placeholder="TIN Number"
                      className="border-gray-300"
                    />
                  </div>

                  {/* First Name */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">First Name*</Label>
                    <Input
                      {...register("firstName")}
                      placeholder="First Name"
                      className="border-gray-300"
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-xs">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Middle Name */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Middle Name</Label>
                    <Input
                      {...register("middleName")}
                      placeholder="Middle Name"
                      className="border-gray-300"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Last Name*</Label>
                    <Input
                      {...register("lastName")}
                      placeholder="Last Name"
                      className="border-gray-300"
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-xs">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>

                  {/* Mother's Name */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Mother's Name*</Label>
                    <Input
                      {...register("mothersName")}
                      placeholder="Mother's Name"
                      className="border-gray-300"
                    />
                    {formErrors.mothersName && (
                      <p className="text-red-500 text-xs">
                        {formErrors.mothersName}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Gender*</Label>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Select gender" />
                            <CustomSelectArrow />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {formErrors.gender && (
                      <p className="text-red-500 text-xs">
                        {formErrors.gender}
                      </p>
                    )}
                  </div>

                  {/* Marital Status */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Marital Status*</Label>
                    <Controller
                      name="maritalStatus"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Select marital status" />
                            <CustomSelectArrow />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married">Married</SelectItem>
                            <SelectItem value="divorced">Divorced</SelectItem>
                            <SelectItem value="widowed">Widowed</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {formErrors.maritalStatus && (
                      <p className="text-red-500 text-xs">
                        {formErrors.maritalStatus}
                      </p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Date of Birth*</Label>
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full border-gray-300 text-left font-normal"
                            >
                              {field.value
                                ? format(field.value, "PPP")
                                : "Select date"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              month={calendarMonth}
                              onMonthChange={setCalendarMonth}
                              toDate={maxDate}
                              disabled={(date) => date > maxDate}
                              initialFocus
                              className="p-3 border-b"
                            />
                            <YearNavigation
                              currentDate={calendarMonth}
                              onYearChange={handleYearChange}
                              maxDate={maxDate}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {formErrors.dateOfBirth && (
                      <p className="text-red-500 text-xs">
                        {formErrors.dateOfBirth}
                      </p>
                    )}
                  </div>

                  {/* National ID */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">National ID*</Label>
                    <Input
                      {...register("nationalId")}
                      placeholder="National ID (12 digits)"
                      className="border-gray-300"
                    />
                    {formErrors.nationalId && (
                      <p className="text-red-500 text-xs">
                        {formErrors.nationalId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Phone Number*</Label>
                    <Input
                      {...register("phone")}
                      placeholder="Phone Number"
                      className="border-gray-300"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs">{formErrors.phone}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Email</Label>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="Email"
                      className="border-gray-300"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs">{formErrors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Address Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Region */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Region*</Label>
                    <Input
                      {...register("region")}
                      placeholder="Region"
                      className="border-gray-300"
                    />
                    {formErrors.region && (
                      <p className="text-red-500 text-xs">
                        {formErrors.region}
                      </p>
                    )}
                  </div>

                  {/* Zone */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Zone*</Label>
                    <Input
                      {...register("zone")}
                      placeholder="Zone"
                      className="border-gray-300"
                    />
                    {formErrors.zone && (
                      <p className="text-red-500 text-xs">{formErrors.zone}</p>
                    )}
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">City*</Label>
                    <Input
                      {...register("city")}
                      placeholder="City"
                      className="border-gray-300"
                    />
                    {formErrors.city && (
                      <p className="text-red-500 text-xs">{formErrors.city}</p>
                    )}
                  </div>

                  {/* Subcity */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Subcity*</Label>
                    <Input
                      {...register("subcity")}
                      placeholder="Subcity"
                      className="border-gray-300"
                    />
                    {formErrors.subcity && (
                      <p className="text-red-500 text-xs">
                        {formErrors.subcity}
                      </p>
                    )}
                  </div>

                  {/* Woreda */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Woreda*</Label>
                    <Input
                      {...register("woreda")}
                      placeholder="Woreda"
                      className="border-gray-300"
                    />
                    {formErrors.woreda && (
                      <p className="text-red-500 text-xs">
                        {formErrors.woreda}
                      </p>
                    )}
                  </div>

                  {/* Monthly Income */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Monthly Income*</Label>
                    <Input
                      {...register("monthlyIncome")}
                      type="number"
                      placeholder="Monthly Income"
                      className="border-gray-300"
                    />
                    {formErrors.monthlyIncome && (
                      <p className="text-red-500 text-xs">
                        {formErrors.monthlyIncome}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Document Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Document Upload
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* National ID Document Upload */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">
                      National ID Document (PDF)*
                    </Label>
                    <FileUpload
                      file={nationalidFile}
                      onFileChange={(e) => handleFileChange(e, "nationalid")}
                      onRemoveFile={() => handleRemoveFile("nationalid")}
                      label="Upload National ID Document"
                      id="nationalid-upload"
                    />
                  </div>

                  {/* Agreement Form Upload */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">
                      Agreement Form (PDF)*
                    </Label>
                    <FileUpload
                      file={agreementFormFile}
                      onFileChange={(e) => handleFileChange(e, "agreement")}
                      onRemoveFile={() => handleRemoveFile("agreement")}
                      label="Upload Agreement Form"
                      id="agreement-upload"
                    />
                  </div>
                </div>
              </div>

              {/* Account Type */}
              <div className="space-y-2">
                <Label className="text-gray-700">Account Type*</Label>
                <Controller
                  name="accountType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select account type" />
                        <CustomSelectArrow />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Savings">Savings Account</SelectItem>
                        <SelectItem value="Current">Current Account</SelectItem>
                        <SelectItem value="Fixed">Fixed Deposit</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {formErrors.accountType && (
                  <p className="text-red-500 text-xs">
                    {formErrors.accountType}
                  </p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-32"
                >
                  {isSubmitting ? "Registering..." : "Register Customer"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
