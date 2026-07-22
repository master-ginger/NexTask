import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();

    const existingUser = await prisma.user.findUnique({
        where: {
            email: body.email
        }
    });

    const users = await prisma.user.findMany();
    console.log("users",users)

    if(!existingUser){
        return NextResponse.json({
            success:false,
            message:"User does not exist"
        },
        {status:404}
    );
    }

    const isPasswordCorrect = await bcrypt.compare(
        body.password,
        existingUser.password
    );

    if(!isPasswordCorrect){
        return NextResponse.json({
            success:false,
            message:"Password incorrect"
        },
        {status:401}
    )
    }
    
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: existingUser.id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        role: existingUser.role,
      },
    });

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        message: "Login Failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}