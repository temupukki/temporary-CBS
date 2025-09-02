// app/api/company-customers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

// POST - Create a new company customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      customerNumber,
      tinNumber,
      companyName,
      businessType,
      registrationNumber,
      registrationDate,
      numberOfEmployees,
      contactPersonName,
      contactPersonPosition,
      phone,
      email,
      region,
      zone,
      city,
      subcity,
      woreda,
      annualRevenue,
      businessLicenseUrl,
      agreementFormUrl,
      accountType
    } = body;

    // Validate required fields
    if (!customerNumber || !tinNumber || !companyName || !registrationNumber) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    const companyCustomer = await prisma.companyCustomer.create({
      data: {
        customerNumber,
        tinNumber,
        companyName,
        businessType,
        registrationNumber,
        registrationDate: new Date(registrationDate),
        numberOfEmployees: parseInt(numberOfEmployees),
        contactPersonName,
        contactPersonPosition,
        phone,
        email,
        region,
        zone,
        city,
        subcity,
        woreda,
        annualRevenue: parseFloat(annualRevenue),
        businessLicenseUrl,
        agreementFormUrl,
        accountType
      },
    });

    return NextResponse.json(
      { message: "Company customer created successfully", data: companyCustomer },
      { status: 201 }
    );
  } catch (error) {
    console.error("Server error:", error);

    if (error instanceof Error && error.message.includes("Unique constraint failed")) {
      return NextResponse.json(
        { error: "Company with this customer number, TIN, or registration number already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// GET - Retrieve company customers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerNumber = searchParams.get("customerNumber");
    const companyName = searchParams.get("companyName");
    const tinNumber = searchParams.get("tinNumber");

    let companyCustomers;

    if (customerNumber) {
      companyCustomers = await prisma.companyCustomer.findUnique({
        where: { customerNumber },
      });
    } else if (companyName) {
      companyCustomers = await prisma.companyCustomer.findMany({
        where: {
          companyName: {
            contains: companyName,
            mode: 'insensitive'
          }
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    } else if (tinNumber) {
      companyCustomers = await prisma.companyCustomer.findUnique({
        where: { tinNumber },
      });
    } else {
      companyCustomers = await prisma.companyCustomer.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
      });
    }

    return NextResponse.json({ data: companyCustomers });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// PUT - Update company customer
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Company customer ID is required" }, { status: 400 });
    }

    // Handle date conversion if registrationDate is being updated
    if (updateData.registrationDate) {
      updateData.registrationDate = new Date(updateData.registrationDate);
    }

    // Handle number conversions
    if (updateData.numberOfEmployees) {
      updateData.numberOfEmployees = parseInt(updateData.numberOfEmployees);
    }

    if (updateData.annualRevenue) {
      updateData.annualRevenue = parseFloat(updateData.annualRevenue);
    }

    const companyCustomer = await prisma.companyCustomer.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ message: "Company customer updated successfully", data: companyCustomer });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete company customer
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Company customer ID is required" }, { status: 400 });
    }

    await prisma.companyCustomer.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Company customer deleted successfully" });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// PATCH - Partial update for company customer
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Company customer ID is required" }, { status: 400 });
    }

    // Handle date conversion if registrationDate is being updated
    if (updateData.registrationDate) {
      updateData.registrationDate = new Date(updateData.registrationDate);
    }

    // Handle number conversions
    if (updateData.numberOfEmployees) {
      updateData.numberOfEmployees = parseInt(updateData.numberOfEmployees);
    }

    if (updateData.annualRevenue) {
      updateData.annualRevenue = parseFloat(updateData.annualRevenue);
    }

    const companyCustomer = await prisma.companyCustomer.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ message: "Company customer updated successfully", data: companyCustomer });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}