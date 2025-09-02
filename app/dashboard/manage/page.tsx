"use client";

import { useEffect, useState } from "react";

// Define Customer types
interface PersonalCustomer {
  id: string;
  customerNumber: string;
  tinNumber?: string | null;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  mothersName: string;
  gender: string;
  maritalStatus: string;
  dateOfBirth: string;
  nationalId: string;
  phone: string;
  email?: string | null;
  region: string;
  zone: string;
  city: string;
  subcity: string;
  woreda: string;
  monthlyIncome: number;
  status: string;
  nationalidUrl?: string | null;
  agreementFormUrl?: string | null;
  accountType: string;
  createdAt: string;
  updatedAt: string;
}

interface CompanyCustomer {
  id: string;
  customerNumber: string;
  tinNumber: string;
  companyName: string;
  businessType: string;
  registrationNumber: string;
  registrationDate: string;
  numberOfEmployees: number;
  contactPersonName: string;
  contactPersonPosition: string;
  phone: string;
  email: string;
  region: string;
  zone: string;
  city: string;
  subcity: string;
  woreda: string;
  annualRevenue: number;
  businessLicenseUrl: string;
  agreementFormUrl: string;
  accountType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

type CustomerType = "personal" | "company";

export default function CustomersPage() {
  const [customerType, setCustomerType] = useState<CustomerType>("personal");
  const [personalCustomers, setPersonalCustomers] = useState<
    PersonalCustomer[]
  >([]);
  const [companyCustomers, setCompanyCustomers] = useState<CompanyCustomer[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<
    "nationalid" | "agreement" | "business-license" | "agreementFormUrl" | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true);
        const endpoint =
          customerType === "personal"
            ? "/api/customers"
            : "/api/company-customers";
        const res = await fetch(endpoint);
        const json = await res.json();

        if (customerType === "personal") {
          const customerArray: PersonalCustomer[] = Array.isArray(json.data)
            ? json.data
            : json.data
            ? [json.data]
            : [];
          setPersonalCustomers(customerArray);
        } else {
          const customerArray: CompanyCustomer[] = Array.isArray(json.data)
            ? json.data
            : json.data
            ? [json.data]
            : [];
          setCompanyCustomers(customerArray);
        }
      } catch (err) {
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, [customerType]);

  const handlePreview = (
    url: string,
    type: "nationalid" | "agreement" | "business-license" | "agreementFormUrl"
  ) => {
    setPreviewUrl(url);
    setPreviewType(type);
  };

  const openInNewTab = (url: string) => {
    window.open(url, "_blank");
  };

  // Filter customers based on search term and status
  const filteredPersonalCustomers = personalCustomers.filter((customer) => {
    const matchesSearch =
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerNumber.includes(searchTerm) ||
      customer.phone.includes(searchTerm) ||
      customer.nationalId.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredCompanyCustomers = companyCustomers.filter((customer) => {
    const matchesSearch =
      customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerNumber.includes(searchTerm) ||
      customer.tinNumber.includes(searchTerm) ||
      customer.phone.includes(searchTerm) ||
      customer.registrationNumber.includes(searchTerm) ||
      customer.contactPersonName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const currentCustomers =
    customerType === "personal"
      ? filteredPersonalCustomers
      : filteredCompanyCustomers;
  const totalCustomers =
    customerType === "personal"
      ? personalCustomers.length
      : companyCustomers.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Customer Management
          </h1>
          <p className="text-gray-600">View and manage all customer records</p>
        </div>

        {/* Customer Type Toggle */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Customer Type
              </h2>
              <p className="text-gray-600">
                Select the type of customers to view
              </p>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCustomerType("personal")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  customerType === "personal"
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Personal Customers
              </button>
              <button
                onClick={() => setCustomerType("company")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  customerType === "company"
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Company Customers
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search {customerType === "personal" ? "Personal" : "Company"}{" "}
                Customers
              </label>
              <input
                type="text"
                id="search"
                placeholder={
                  customerType === "personal"
                    ? "Search by name, ID, phone, or customer number..."
                    : "Search by company name, TIN, registration number, or contact person..."
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold">{currentCustomers.length}</span> of{" "}
            <span className="font-semibold">{totalCustomers}</span>{" "}
            {customerType} customers
          </p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            onClick={() =>
              (window.location.href =
                customerType === "personal"
                  ? "/add-customer"
                  : "/add-company-customer")
            }
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add {customerType === "personal" ? "Personal" : "Company"} Customer
          </button>
        </div>

        {/* Customer Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {customerType === "personal" ? (
                    <>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Personal Details
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Contact
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Location
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Income
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Documents
                      </th>
                    </>
                  ) : (
                    <>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Company
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Business Details
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Contact Person
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Location
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Revenue
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Documents
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    {customerType === "personal" ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="font-medium text-blue-800">
                                {(customer as PersonalCustomer).firstName[0]}
                                {(customer as PersonalCustomer).lastName[0]}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {(customer as PersonalCustomer).firstName}{" "}
                                {(customer as PersonalCustomer).middleName}{" "}
                                {(customer as PersonalCustomer).lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                #{(customer as PersonalCustomer).customerNumber}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                Created:{" "}
                                {new Date(
                                  customer.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">DOB:</span>{" "}
                            {new Date(
                              (customer as PersonalCustomer).dateOfBirth
                            ).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">Gender:</span>{" "}
                            {(customer as PersonalCustomer).gender}
                          </div>
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">Marital:</span>{" "}
                            {(customer as PersonalCustomer).maritalStatus}
                          </div>
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">National ID:</span>{" "}
                            {(customer as PersonalCustomer).nationalId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {(customer as PersonalCustomer).phone}
                          </div>
                          <div className="text-sm text-gray-500">
                            {(customer as PersonalCustomer).email || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {(customer as PersonalCustomer).city}
                          </div>
                          <div className="text-sm text-gray-500">
                            {(customer as PersonalCustomer).subcity},{" "}
                            {(customer as PersonalCustomer).woreda}
                          </div>
                          <div className="text-sm text-gray-500">
                            {(customer as PersonalCustomer).zone},{" "}
                            {(customer as PersonalCustomer).region}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ETB{" "}
                            {(
                              customer as PersonalCustomer
                            ).monthlyIncome.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Monthly</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${
                              customer.status === "active"
                                ? "bg-green-100 text-green-800"
                                : customer.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {customer.status}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            Updated:{" "}
                            {new Date(customer.updatedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-col space-y-2">
                            {(customer as PersonalCustomer).nationalidUrl ? (
                              <button
                                onClick={() =>
                                  handlePreview(
                                    (customer as PersonalCustomer)
                                      .nationalidUrl!,
                                    "nationalid"
                                  )
                                }
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                National ID
                              </button>
                            ) : (
                              <span className="text-gray-400">
                                No ID Document
                              </span>
                            )}
                            {(customer as PersonalCustomer).agreementFormUrl ? (
                              <button
                                onClick={() =>
                                  handlePreview(
                                    (customer as PersonalCustomer)
                                      .agreementFormUrl!,
                                    "agreement"
                                  )
                                }
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                Agreement Form
                              </button>
                            ) : (
                              <span className="text-gray-400">
                                No Agreement
                              </span>
                            )}
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="font-medium text-green-800">
                                {(customer as CompanyCustomer).companyName[0]}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {(customer as CompanyCustomer).companyName}
                              </div>
                              <div className="text-sm text-gray-500">
                                #{(customer as CompanyCustomer).customerNumber}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                TIN: {(customer as CompanyCustomer).tinNumber}
                              </div>
                              <div className="text-xs text-gray-400">
                                Created:{" "}
                                {new Date(
                                  customer.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">Type:</span>{" "}
                            {(customer as CompanyCustomer).businessType}
                          </div>
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">Reg #:</span>{" "}
                            {(customer as CompanyCustomer).registrationNumber}
                          </div>
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">Reg Date:</span>{" "}
                            {new Date(
                              (customer as CompanyCustomer).registrationDate
                            ).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">Employees:</span>{" "}
                            {(customer as CompanyCustomer).numberOfEmployees}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {(customer as CompanyCustomer).contactPersonName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {
                              (customer as CompanyCustomer)
                                .contactPersonPosition
                            }
                          </div>
                          <div className="text-sm text-gray-900">
                            {(customer as CompanyCustomer).phone}
                          </div>
                          <div className="text-sm text-gray-500">
                            {(customer as CompanyCustomer).email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {(customer as CompanyCustomer).city}
                          </div>
                          <div className="text-sm text-gray-500">
                            {(customer as CompanyCustomer).subcity},{" "}
                            {(customer as CompanyCustomer).woreda}
                          </div>
                          <div className="text-sm text-gray-500">
                            {(customer as CompanyCustomer).zone},{" "}
                            {(customer as CompanyCustomer).region}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ETB{" "}
                            {(
                              customer as CompanyCustomer
                            ).annualRevenue.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Annual</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${
                              customer.status === "active"
                                ? "bg-green-100 text-green-800"
                                : customer.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {customer.status}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            Updated:{" "}
                            {new Date(customer.updatedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-col space-y-2">
                            {(customer as CompanyCustomer)
                              .businessLicenseUrl ? (
                              <button
                                onClick={() =>
                                  handlePreview(
                                    (customer as CompanyCustomer)
                                      .businessLicenseUrl,
                                    "business-license"
                                  )
                                }
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                Business License
                              </button>
                            ) : (
                              <span className="text-gray-400">No License</span>
                            )}
                            {(customer as CompanyCustomer).agreementFormUrl ? (
                              <button
                                onClick={() =>
                                  handlePreview(
                                    (customer as CompanyCustomer)
                                      .agreementFormUrl,
                                    "agreementFormUrl"
                                  )
                                }
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                agreementFormUrl
                              </button>
                            ) : (
                              <span className="text-gray-400">
                                No agreementFormUrl
                              </span>
                            )}
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {currentCustomers.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No {customerType} customers found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
            </div>
          )}
        </div>

        {/* PDF Preview Modal */}
        {previewUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">
                  {previewType === "nationalid"
                    ? "National ID Document"
                    : previewType === "agreement"
                    ? "Agreement Form"
                    : previewType === "business-license"
                    ? "Business License"
                    : "agreementFormUrl of Association"}{" "}
                  Preview
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => openInNewTab(previewUrl)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Open in New Tab
                  </button>
                  <button
                    onClick={() => {
                      setPreviewUrl(null);
                      setPreviewType(null);
                    }}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4">
                <iframe
                  src={previewUrl}
                  className="w-full h-full border rounded"
                  title="PDF Preview"
                >
                  <p className="p-4">
                    Your browser does not support PDF preview.
                    <button
                      onClick={() => openInNewTab(previewUrl)}
                      className="text-blue-500 underline ml-2"
                    >
                      Open PDF in new tab
                    </button>
                  </p>
                </iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
