import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // adjust path if needed

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerNumber = searchParams.get("customerNumber");

    if (!customerNumber) {
      const res = NextResponse.json(
        { error: "customerNumber is required" },
        { status: 400 }
      );
      res.headers.set("Access-Control-Allow-Origin", "*"); // allow CORS
      return res;
    }

    const customer = await prisma.companyCustomer.findUnique({
      where: { customerNumber },
    });

    if (!customer) {
      const res = NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
      res.headers.set("Access-Control-Allow-Origin", "*"); // allow CORS
      return res;
    }

    const res = NextResponse.json(customer, { status: 200 });
    res.headers.set("Access-Control-Allow-Origin", "*"); // allow CORS
    return res;

  } catch (error) {
    console.error(error);
    const res = NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
    res.headers.set("Access-Control-Allow-Origin", "*"); // allow CORS
    return res;
  }
}
