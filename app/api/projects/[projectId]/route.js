import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const { projectId } = await params;

        const project = await prisma.project.findUnique({
            where: {
                id: projectId,
            },
            include: {
                projectUsers: {
                    include: {
                        user: true,
                    },
                },
                tasks: {
                    include: {
                        assignee: true,
                    },
                },
            },
        });

        if (!project) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Project not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            project,
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}