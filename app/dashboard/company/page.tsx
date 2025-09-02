"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { format, subYears, setYear, getYear } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText, Building, Mail, Shield, CreditCard, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  maxDate 
}: { 
  currentDate: Date; 
  onYearChange: (date: Date) => void;
  maxDate: Date;
}) => {
  const currentYear = getYear(currentDate);
  const maxYear = getYear(maxDate);
  const yearRange = 12;
  const [startYear, setStartYear] = useState(currentYear - Math.floor(yearRange / 2));
  
  const years = Array.from({ length: yearRange }, (_, i) => startYear + i);
  
  const navigateYears = (direction: 'prev' | 'next') => {
    setStartYear(prev => direction === 'prev' ? prev - yearRange : prev + yearRange);
  };
  
  return (
    <div className="flex flex-col p-2 border-t border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigateYears('prev')}
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
          onClick={() => navigateYears('next')}
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
            className={`h-7 text-xs ${currentYear === year ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            {year}
          </Button>
        ))}
      </div>
    </div>
  );
};

// Zod validation schema for company account
const formSchema = z.object({
  customerNumber: z.string().min(10, "Customer number is required"),
  tinNumber: z.string().min(1, "TIN number is required"),
  companyName: z.string().min(1, "Company name is required"),
  businessType: z.string().min(1, "Business type is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  registrationDate: z.date(),
  numberOfEmployees: z.coerce.number().min(1, "Number of employees is required"),
  contactPersonName: z.string().min(1, "Contact person name is required"),
  contactPersonPosition: z.string().min(1, "Contact person position is required"),
  phone: z.string().min(10).max(13).regex(/^\+?\d+$/, "Must be a valid phone number"),
  email: z.string().email("Invalid email address"),
  region: z.string().min(1, "Region is required"),
  zone: z.string().min(1, "Zone is required"),
  city: z.string().min(1, "City is required"),
  subcity: z.string().min(1, "Subcity is required"),
  woreda: z.string().min(1, "Woreda is required"),
  annualRevenue: z.coerce.number().min(1000, "Annual revenue must be at least 1000"),
  businessLicenseUrl: z.string().optional(),
  agreementFormUrl: z.string().optional(),
  accountType: z.string().min(1, "Account type is required"), 
});

type FormData = z.infer<typeof formSchema>;

interface FileUploadProps {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  label: string;
  id: string;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ file, onFileChange, onRemoveFile, label, id, error }) => (
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

export default function AddCompanyCustomerPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setValue, watch, control } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerNumber, setCustomerNumber] = useState("");
  const [calendarMonth, setCalendarMonth] = useState<Date>(subYears(new Date(), 5));
  const [businessLicenseFile, setBusinessLicenseFile] = useState<File | null>(null);
  const [agreementFormFile, setagreementFormFile] = useState<File | null>(null);

  // Calculate the maximum date (current date)
  const maxDate = new Date();

  // Generate customer number on component mount
  useEffect(() => {
    const generatedNumber = "COMP" + Date.now().toString().slice(-6);
    setCustomerNumber(generatedNumber);
    setValue("customerNumber", generatedNumber);
  }, [setValue]);

  const uploadFileToSupabase = async (file: File, type: 'business-license' | 'agreementForm'): Promise<string> => {
    if (file.type !== 'application/pdf') {
      throw new Error('Please select a PDF file');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Upload failed');
      }

      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to upload file');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'business-license' | 'agreementForm') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.type !== 'application/pdf') {
        toast.error("Please select a PDF file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      if (type === 'business-license') {
        setBusinessLicenseFile(file);
      } else {
        setagreementFormFile(file);
      }
    }
  };

  const handleRemoveFile = (type: 'business-license' | 'agreementForm') => {
    if (type === 'business-license') {
      setBusinessLicenseFile(null);
      setValue('businessLicenseUrl', '');
    } else {
      setagreementFormFile(null);
      setValue('agreementFormUrl', '');
    }
  };

  const handleYearChange = (date: Date) => {
    setCalendarMonth(date);
  };

  const onSubmit = async (data: FormData) => {
    if (!businessLicenseFile) {
      toast.error("Business license document is required");
      return;
    }

    if (!agreementFormFile) {
      toast.error("agreementForm of association is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const [businessLicenseUrl, agreementFormUrl] = await Promise.all([
        uploadFileToSupabase(businessLicenseFile, 'business-license'),
        uploadFileToSupabase(agreementFormFile, 'agreementForm')
      ]);

      if (!businessLicenseUrl || !agreementFormUrl) {
        throw new Error("Failed to upload files");
      }

      const formattedRegistrationDate = format(data.registrationDate, 'yyyy-MM-dd');

      const response = await fetch("/api/company-customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          registrationDate: formattedRegistrationDate,
          businessLicenseUrl,
          agreementFormUrl
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create company customer");
      }

      toast.success("Company customer created successfully!");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to create company customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center space-y-1 pb-4">
            <div className="flex items-center justify-center mb-2">
              <Building className="h-8 w-8 text-blue-600 mr-2" />
              <CardTitle className="text-3xl font-bold text-gray-900">
                Company Account Registration
              </CardTitle>
            </div>
            <CardDescription className="text-gray-600 text-lg">
              Fill in the company details below to create a new business account
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Company Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Company Information
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
                    <input type="hidden" {...register("customerNumber")} value={customerNumber} />
                  </div>

                  {/* TIN Number */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">TIN Number*</Label>
                    <Input {...register("tinNumber")} placeholder="TIN Number" className="border-gray-300"/>
                    {errors.tinNumber && <p className="text-red-500 text-xs">{errors.tinNumber.message}</p>}
                  </div>

                  {/* Company Name */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Company Name*</Label>
                    <Input {...register("companyName")} placeholder="Company Name" className="border-gray-300"/>
                    {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName.message}</p>}
                  </div>

                  {/* Business Type */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Business Type*</Label>
                    <Controller
                      name="businessType"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Select business type"/>
                            <CustomSelectArrow />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="corporation">Corporation</SelectItem>
                            <SelectItem value="llc">Limited Liability Company</SelectItem>
                            <SelectItem value="non-profit">Non-Profit Organization</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.businessType && <p className="text-red-500 text-xs">{errors.businessType.message}</p>}
                  </div>

                  {/* Registration Number */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Registration Number*</Label>
                    <Input {...register("registrationNumber")} placeholder="Registration Number" className="border-gray-300"/>
                    {errors.registrationNumber && <p className="text-red-500 text-xs">{errors.registrationNumber.message}</p>}
                  </div>

                  {/* Registration Date */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Registration Date*</Label>
                    <Controller
                      name="registrationDate"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full border-gray-300 text-left font-normal">
                              {field.value ? format(field.value, "PPP") : "Select date"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
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
                    {errors.registrationDate && <p className="text-red-500 text-xs">{errors.registrationDate.message}</p>}
                  </div>

                  {/* Number of Employees */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Number of Employees*</Label>
                    <Input 
                      {...register("numberOfEmployees", { valueAsNumber: true })} 
                      type="number" 
                      placeholder="Number of Employees" 
                      className="border-gray-300"
                    />
                    {errors.numberOfEmployees && <p className="text-red-500 text-xs">{errors.numberOfEmployees.message}</p>}
                  </div>
                </div>
              </div>

              {/* Contact Person Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Contact Person Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contact Person Name */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Contact Person Name*</Label>
                    <Input {...register("contactPersonName")} placeholder="Full Name" className="border-gray-300"/>
                    {errors.contactPersonName && <p className="text-red-500 text-xs">{errors.contactPersonName.message}</p>}
                  </div>

                  {/* Contact Person Position */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Contact Person Position*</Label>
                    <Input {...register("contactPersonPosition")} placeholder="Position" className="border-gray-300"/>
                    {errors.contactPersonPosition && <p className="text-red-500 text-xs">{errors.contactPersonPosition.message}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Phone Number*</Label>
                    <Input {...register("phone")} placeholder="Phone Number" className="border-gray-300"/>
                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Email*</Label>
                    <Input {...register("email")} type="email" placeholder="Email" className="border-gray-300"/>
                    {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Business Address
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Region */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Region*</Label>
                    <Input {...register("region")} placeholder="Region" className="border-gray-300"/>
                    {errors.region && <p className="text-red-500 text-xs">{errors.region.message}</p>}
                  </div>

                  {/* Zone */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Zone*</Label>
                    <Input {...register("zone")} placeholder="Zone" className="border-gray-300"/>
                    {errors.zone && <p className="text-red-500 text-xs">{errors.zone.message}</p>}
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">City*</Label>
                    <Input {...register("city")} placeholder="City" className="border-gray-300"/>
                    {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                  </div>

                  {/* Subcity */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Subcity*</Label>
                    <Input {...register("subcity")} placeholder="Subcity" className="border-gray-300"/>
                    {errors.subcity && <p className="text-red-500 text-xs">{errors.subcity.message}</p>}
                  </div>

                  {/* Woreda */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Woreda*</Label>
                    <Input {...register("woreda")} placeholder="Woreda" className="border-gray-300"/>
                    {errors.woreda && <p className="text-red-500 text-xs">{errors.woreda.message}</p>}
                  </div>

                  {/* Annual Revenue */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Annual Revenue (ETB)*</Label>
                    <Input 
                      {...register("annualRevenue", { valueAsNumber: true })} 
                      type="number" 
                      placeholder="Annual Revenue" 
                      className="border-gray-300"
                    />
                    {errors.annualRevenue && <p className="text-red-500 text-xs">{errors.annualRevenue.message}</p>}
                  </div>
                </div>
              </div>

              {/* Document Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Document Upload</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Business License Upload */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Business License (PDF)*</Label>
                    <FileUpload
                      file={businessLicenseFile}
                      onFileChange={(e) => handleFileChange(e, 'business-license')}
                      onRemoveFile={() => handleRemoveFile('business-license')}
                      label="Upload Business License"
                      id="business-license-upload"
                      error={errors.businessLicenseUrl?.message}
                    />
                  </div>

                  {/* agreementForm of Association Upload */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Agreement Form (PDF)*</Label>
                    <FileUpload
                      file={agreementFormFile}
                      onFileChange={(e) => handleFileChange(e, 'agreementForm')}
                      onRemoveFile={() => handleRemoveFile('agreementForm')}
                      label="Upload Agreement Form"
                      id="agreementForm-upload"
                      error={errors.agreementFormUrl?.message}
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
                        <SelectItem value="Business Checking">Business Checking Account</SelectItem>
                        <SelectItem value="Business Savings">Business Savings Account</SelectItem>
                        <SelectItem value="Merchant">Merchant Account</SelectItem>
                        <SelectItem value="Corporate">Corporate Account</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.accountType && <p className="text-red-500 text-xs">{errors.accountType.message}</p>}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="min-w-32">
                  {isSubmitting ? "Registering..." : "Register Company"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}