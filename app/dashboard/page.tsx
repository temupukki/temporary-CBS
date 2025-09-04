"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Loader2,
  RefreshCw,
  Shield,
  Filter,
  Info,
  ClipboardCheck,
  AlertTriangle,
  Mail,
  HelpCircle,
  Download,
  Calendar,
  TrendingUp,
  Gavel,
  Scale,
  CalendarCheck,
  Award,
  FileBarChart,
  Network,
  Handshake,
  UserPlus,
  MessageSquare,
  BarChart2,
  Server,
  UserCog,
  Ban,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

interface UserSession {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    image?: string;
  };
}

interface Customer {
  id: string;
  applicationReferenceNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  loanAmount: number;
  loanType: string;
  applicationStatus: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export default function Dashboard() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    async function getSession() {
      try {
        const { data, error } = await authClient.getSession();

        if (error || !data) {
          router.push("/");
          return;
        }

        const sessionData = data as unknown as UserSession;

        // Check if user has appropriate role
        if (!["ADMIN", "USER"].includes(sessionData.user.role)) {
          router.push("/sign-in");
          return;
        }

        setSession(sessionData);
      } catch (error) {
        console.error("Session error:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    getSession();
  }, [router]);

  
  

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStats = () => {
    const total = customers.length;
    const pending = customers.filter((c) =>
      c.applicationStatus.toLowerCase().includes("pending")
    ).length;
    const under_review = customers.filter(
      (c) => c.applicationStatus.toLowerCase() === "under_review"
    ).length;
    const approved = customers.filter(
      (c) => c.applicationStatus.toLowerCase() === "approved"
    ).length;
    const rejected = customers.filter(
      (c) => c.applicationStatus.toLowerCase() === "rejected"
    ).length;
    const supervised = customers.filter(
      (c) => c.applicationStatus.toLowerCase() === "supervised"
    ).length;
    const committe_reversed = customers.filter(
      (c) => c.applicationStatus.toLowerCase() === "committe_reversed"
    ).length;
    const final_analysis = customers.filter(
      (c) => c.applicationStatus.toLowerCase() === "final_analysis"
    ).length;
    const analysis_completed = customers.filter(
      (c) => c.applicationStatus.toLowerCase() === "analysis_completed"
    ).length;
    const supervisor_reviewing = customers.filter(
      (c) => c.applicationStatus.toLowerCase() === "supervisor_reviewing"
    ).length;
    const member_review = customers.filter(
      (c) => c.applicationStatus.toLowerCase() === "member_review"
    ).length;
    const committee_review = customers.filter(
      (c) => c.applicationStatus.toLowerCase() === "committee_review"
    ).length;
    return {
      total,
      pending,
      approved,
      rejected,
      under_review,
      supervised,
      committe_reversed,
      final_analysis,
      analysis_completed,
      supervisor_reviewing,
      member_review,
      committee_review,
    };
  };

  const getFilteredCustomers = () => {
    if (session?.user.role === "credit_analyst") {
      // For credit analysts, only show pending applications assigned to them
      return customers.filter(
        (customer) =>
          (customer.applicationStatus.toLowerCase().includes("pending") ||
            customer.applicationStatus.toLowerCase().includes("under_review") ||
            customer.applicationStatus
              .toLowerCase()
              .includes("committee_review") ||
            customer.applicationStatus.toLowerCase().includes("supervised") ||
            customer.applicationStatus
              .toLowerCase()
              .includes("analysis_completed") ||
            customer.applicationStatus
              .toLowerCase()
              .includes("rm_recomendation") ||
            customer.applicationStatus
              .toLowerCase()
              .includes("supervisor_reviewing") ||
            customer.applicationStatus
              .toLowerCase()
              .includes("final_analysis") ||
            customer.applicationStatus
              .toLowerCase()
              .includes("under_review")) &&
          customer.assignedTo === session.user.id
      );
    }

    // For relationship managers, apply the selected filter
    if (filter === "pending") {
      return customers.filter(
        (customer) =>
          customer.applicationStatus.toLowerCase().includes("pending") ||
          customer.applicationStatus.toLowerCase().includes("under_review") ||
          customer.applicationStatus.toLowerCase().includes("analysis")
      );
    } else if (filter === "approved") {
      return customers.filter(
        (customer) => customer.applicationStatus.toLowerCase() === "approved"
      );
    } else if (filter === "rejected") {
      return customers.filter(
        (customer) => customer.applicationStatus.toLowerCase() === "rejected"
      );
    }

    // Default: show all applications for relationship managers
    return customers;
  };

  const stats = getStats();
  const filteredCustomers = getFilteredCustomers();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <title>Dashboard | CBS</title>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Temporary CBS
            </h1>
            <Badge variant="outline" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {session.user.role
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">Manage and review applications</p>
        </div>
     
      </div>

      {session.user.role === "ADMIN" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {/* User Management Card */}
            <Link href="/dashboard/user">
              <Card className="border-2 border-blue-300 hover:border-blue-500 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    User Management
                  </CardTitle>
                  <svg
                    className="h-5 w-5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    Manage Users
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Create, edit, and manage system users
                  </p>
                  <div className="flex items-center mt-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Admin only
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* User Registration Card */}
            <Link href="/dashboard/register">
              <Card className="border-2 border-green-300 hover:border-green-500 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    User Registration
                  </CardTitle>
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    Register Users
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Add new users to the system
                  </p>
                  <div className="flex items-center mt-3">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Admin Only
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-3 rounded-xl mr-4 shadow-md">
                  <UserCog className="h-6 w-6 text-gray-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    System Administrator Guidelines
                  </h3>
                  <p className="text-gray-600">
                    System management, user administration, and security
                    oversight
                  </p>
                </div>
              </div>
              <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-3 py-1">
                Updated Today
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <div className="flex items-center mb-3">
                  <div className="bg-gray-100 p-2 rounded-lg mr-3">
                    <UserCog className="h-5 w-5 text-gray-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">
                    User & Access Management
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-gray-800">1</span>
                    </div>
                    <span>
                      Create and manage user accounts and assign appropriate
                      roles and permissions.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-gray-800">2</span>
                    </div>
                    <span>
                      Deactivate user accounts promptly upon employee
                      termination or role change.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-gray-800">3</span>
                    </div>
                    <span>
                      Regularly audit user access logs to ensure compliance and
                      prevent unauthorized access.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Server className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">
                    System Maintenance & Monitoring
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-blue-800">1</span>
                    </div>
                    <span>
                      Monitor system performance and address any uptime or
                      latency issues immediately.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-blue-800">2</span>
                    </div>
                    <span>
                      Schedule and oversee system updates and patches during
                      off-peak hours.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-blue-800">3</span>
                    </div>
                    <span>
                      Manage regular data backups to ensure business continuity.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                <div className="flex items-center mb-3">
                  <h4 className="font-semibold text-gray-800">
                    Security & Compliance
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-green-800">
                        1
                      </span>
                    </div>
                    <span>
                      Enforce strong password policies and multi-factor
                      authentication for all users.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-green-800">
                        2
                      </span>
                    </div>
                    <span>
                      Monitor for and respond to security threats and
                      vulnerabilities.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-green-800">
                        3
                      </span>
                    </div>
                    <span>
                      Ensure all system operations adhere to relevant data
                      protection and financial regulations.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                <div className="flex items-center mb-3">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <BarChart2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">
                    Reporting & Analytics
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-purple-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-purple-800">
                        1
                      </span>
                    </div>
                    <span>
                      Generate regular reports on system usage, performance, and
                      user activity.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-purple-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-purple-800">
                        2
                      </span>
                    </div>
                    <span>
                      Analyze system data to identify potential bottlenecks and
                      areas for improvement.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-purple-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-purple-800">
                        3
                      </span>
                    </div>
                    <span>
                      Provide executive summaries on system health and security
                      to senior management.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

     
          </div>
        </>
      )}
      {session.user.role === "USER" && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>All Applications</CardTitle>
              <div className="flex items-center gap-2">
                <>
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border rounded-md p-2 text-sm"
                  >
                    <option value="all">All Applications</option>
                    <option value="pending">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </>

                <span className="text-sm font-normal text-gray-500">
                  {filteredCustomers.length} application(s)
                </span>
              </div>
            </CardHeader>
         
        
          </Card>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-3 rounded-xl mr-4 shadow-md">
                  <Handshake className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Relationship Manager Guidelines
                  </h3>
                  <p className="text-gray-600">
                    Client engagement and application submission best practices
                  </p>
                </div>
              </div>
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 px-3 py-1">
                Updated Today
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                <div className="flex items-center mb-3">
                  <div className="bg-orange-100 p-2 rounded-lg mr-3">
                    <UserPlus className="h-5 w-5 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">
                    Client Onboarding & Applications
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-orange-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-orange-800">
                        1
                      </span>
                    </div>
                    <span>
                      Ensure all client applications are complete and accurately
                      filled out.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-orange-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-orange-800">
                        2
                      </span>
                    </div>
                    <span>
                      Verify that all required supporting documents are attached
                      before submission.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-orange-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-orange-800">
                        3
                      </span>
                    </div>
                    <span>
                      Educate clients on the loan process and set realistic
                      expectations for timelines.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-teal-50 p-5 rounded-xl border border-teal-100">
                <div className="flex items-center mb-3">
                  <div className="bg-teal-100 p-2 rounded-lg mr-3">
                    <MessageSquare className="h-5 w-5 text-teal-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">
                    Communication & Follow-up
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-teal-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-teal-800">1</span>
                    </div>
                    <span>
                      Provide timely updates to clients on their application
                      status.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-teal-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-teal-800">2</span>
                    </div>
                    <span>
                      Respond to client inquiries within **2 business hours**.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-teal-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-teal-800">3</span>
                    </div>
                    <span>
                      Maintain a professional and empathetic tone in all client
                      interactions.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-cyan-50 p-5 rounded-xl border border-cyan-100">
                <div className="flex items-center mb-3">
                  <div className="bg-cyan-100 p-2 rounded-lg mr-3">
                    <TrendingUp className="h-5 w-5 text-cyan-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">
                    Sales & Business Development
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-cyan-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-cyan-800">1</span>
                    </div>
                    <span>
                      Actively seek new leads and business opportunities to grow
                      the loan portfolio.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-cyan-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-cyan-800">2</span>
                    </div>
                    <span>
                      Cross-sell additional products and services to existing
                      clients.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-cyan-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-cyan-800">3</span>
                    </div>
                    <span>
                      Maintain a target of **5 new client meetings** per week.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                <div className="flex items-center mb-3">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <Network className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">
                    Internal Collaboration
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-indigo-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-indigo-800">
                        1
                      </span>
                    </div>
                    <span>
                      Serve as the primary liaison between the client and the
                      credit analysis team.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-indigo-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-indigo-800">
                        2
                      </span>
                    </div>
                    <span>
                      Clearly communicate any client concerns or specific needs
                      to the team.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-indigo-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-indigo-800">
                        3
                      </span>
                    </div>
                    <span>
                      Proactively coordinate with analysts to gather updates on
                      application progress.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Dashen Bank. All rights reserved.
          </div>
        </>
      )}

      {session.user.role === "BANNED" && (
        <div className="min-h-screen flex items-start justify-center bg-gray-50 sm:p-6">
          <title>Account Disabled</title>
          <Card className="w-full max-w-2xl bg-white rounded-xl shadow-lg border-0">
            <CardHeader className="text-center space-y-2 p-6 bg-red-50 rounded-t-xl">
              <Ban className="h-16 w-16 text-red-500 mx-auto" />
              <CardTitle className="text-2xl font-bold text-red-800">
                Account Disabled
              </CardTitle>
              <CardDescription className="text-red-700">
                Your access to this system has been suspended.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-gray-600">
                This action may have been taken due to a violation of our terms
                of service or security protocols. Please contact support for
                more information and assistance with your account.
              </p>
              <p>For more information communicate the system admin </p>
            </CardContent>
            <CardFooter>
              <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Dashen Bank. All rights
                reserved.
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
