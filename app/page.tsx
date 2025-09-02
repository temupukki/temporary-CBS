import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Full-page background with logo watermark */}
      <div className="fixed inset-0 -z-10">
        <img
          src="/dashen logo.png"
          alt="Background"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-700 mix-blend-multiply"></div>
      </div>

      <DashboardHeader/>

      <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-180px)] p-4">
        {/* Glass card container */}
        <div className="w-full max-w-4xl bg-white/5 backdrop-blur-sm border-white/20 rounded-xl p-8 shadow-xl">
          {/* Centered register button */}
          <div className="flex flex-col items-center justify-center space-y-8">
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              Customer Management Dashboard
            </h2>
            
            <Link href="/register" className="w-full max-w-xs">
              <Button 
                className="w-full bg-white text-blue-900 hover:bg-blue-100 px-8 py-6 text-xl font-bold transition-all transform hover:scale-105"
              >
                Register New Customer
              </Button>
            </Link>
               <Link href="/company" className="w-full max-w-xs">
              <Button 
                className="w-full bg-white text-blue-900 hover:bg-blue-100 px-8 py-6 text-xl font-bold transition-all transform hover:scale-105"
              >
                Register New Company
              </Button>
            </Link>
                  <Link href="/manage" className="w-full max-w-xs">
              <Button 
                className="w-full bg-white text-blue-900 hover:bg-blue-100 px-8 py-6 text-xl font-bold transition-all transform hover:scale-105"
              >
                See Registered Customers
              </Button>
            </Link>
                 <Link href="/companymanage" className="w-full max-w-xs">
              <Button 
                className="w-full bg-white text-blue-900 hover:bg-blue-100 px-8 py-6 text-xl font-bold transition-all transform hover:scale-105"
              >
                See Registered Companies
              </Button>
            </Link>
            

         
          </div>
        </div>
      </div>
    </div>
  );
}
