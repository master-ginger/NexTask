import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { success } from "zod";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();

    const existingUser = await prisma.user.findUnique({
        where: {
            email: body.email
        }
    });

    if(existingUser){
        return NextResponse.json({
            success:false,
            message:"User already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    await prisma.user.create({
        data: {
            fullName: body.fullName,
            email: body.email,
            password: hashedPassword,
            role: body.role
        }
    });

    return NextResponse.json({
    success: true,
    message: "Account created successfully"
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}