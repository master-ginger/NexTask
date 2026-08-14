import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


// GET - Get members of a project
export async function GET(request, { params }) {

    try {

        const { projectId } = await params;

        const members = await prisma.projectMember.findMany({

            where: {
                projectId: projectId
            },

            include: {
                user: true
            }

        });

        return NextResponse.json({
            success: true,
            members
        });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: error.message
            },
            {
                status: 500
            }
        );

    }
}


// POST - Add members to a project
export async function POST(request, { params }) {

    try {

        const { projectId } = await params;

        const body = await request.json();

        const { memberIds } = body;

        if (!memberIds || !Array.isArray(memberIds)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "memberIds must be an array"
                },
                {
                    status: 400
                }
            );
        }

        // Check that project exists
        const project = await prisma.project.findUnique({
            where: {
                id: projectId
            }
        });

        if (!project) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Project not found"
                },
                {
                    status: 404
                }
            );
        }


        // Check that all users exist
        const users = await prisma.user.findMany({
            where: {
                id: {
                    in: memberIds
                }
            },
            select: {
                id: true
            }
        });

        if (users.length !== memberIds.length) {
            return NextResponse.json(
                {
                    success: false,
                    message: "One or more users do not exist"
                },
                {
                    status: 400
                }
            );
        }


        // Add members
        const members = await prisma.projectMember.createMany({
            data: memberIds.map((userId) => ({
                projectId: projectId,
                userId: userId
            })),
            skipDuplicates: true
        });


        return NextResponse.json(
            {
                success: true,
                message: "Members added successfully",
                count: members.count
            },
            {
                status: 201
            }
        );

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: error.message
            },
            {
                status: 500
            }
        );

    }
}