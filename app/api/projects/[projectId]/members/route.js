import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {

    try {

        const members = await prisma.projectMember.findMany({

            where:{
                projectId: params.projectId
            },

            include:{
                user:true
            }

        });

        return NextResponse.json({

            success:true,
            members

        });

    } catch(error){

        return NextResponse.json(
            {
                success:false,
                message:error.message
            },
            {
                status:500
            }
        );

    }

}