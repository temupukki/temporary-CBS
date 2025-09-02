// app/api/customers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

// POST - Create a new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      customerNumber,
      tinNumber,
      firstName,
      middleName,
      lastName,
      mothersName,
      gender,
      maritalStatus,
      dateOfBirth,
      nationalId,
      phone,
      email,
      region,
      zone,
      city,
      subcity,
      woreda,
      monthlyIncome,
      status,
      nationlidUrl,  // Fixed: Changed from nationalidUrl to match frontend
      agreementFormUrl,  // Fixed: Changed from agreementFormUrl to match frontend
      accountType  // Added: accountType field
    } = body;

    const customer = await prisma.personalCustomer.create({
      data: {
        customerNumber,
        tinNumber: tinNumber || null,
        firstName,
        middleName,
        lastName,
        mothersName,
        gender,
        maritalStatus,
        dateOfBirth: new Date(dateOfBirth),
        nationalId,
        phone,
        email: email || null,
        region,
        zone,
        city,
        subcity,
        woreda,
        monthlyIncome,
      
        nationalidUrl: nationlidUrl || null,  // Fixed: Changed from nationalidUrl
        agreementFormUrl: agreementFormUrl || null, // Added: accountType field
        accountType
      },
    });

    return NextResponse.json(
      { message: "Customer created successfully", data: customer },
      { status: 201 }
    );
  } catch (error) {
    console.error("Server error:", error);

    if (error instanceof Error && error.message.includes("Unique constraint failed")) {
      return NextResponse.json(
        { error: "Customer with this number, national ID, phone or email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// GET - Retrieve customers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerNumber = searchParams.get("customerNumber");

    let customers;

    if (customerNumber) {
      customers = await prisma.personalCustomer.findUnique({
        where: { customerNumber },
      });
    } else {
      customers = await prisma.personalCustomer.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
      });
    }

    return NextResponse.json({ data: customers });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// PUT - Update customer
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }

    const customer = await prisma.personalCustomer.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ message: "Customer updated successfully", data: customer });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete customer
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }

    await prisma.personalCustomer.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// PATCH - Partial update
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }

    const customer = await prisma.personalCustomer.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ message: "Customer updated successfully", data: customer });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}