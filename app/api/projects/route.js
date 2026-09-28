import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        startDate: "desc",
      },
      include: {
        _count: {
          select: {
            tasks: true,
            projectUsers: true,
          },
        },
        tasks: {
          select: {
            status: true,
          },
        },
      },
    });

    const projectsWithProgress = projects.map((project) => {
      const totalTasks = project._count.tasks;

      const completedTasks = project.tasks.filter(
        (task) => task.status === "Completed"
      ).length;

      const progress =
        totalTasks === 0
          ? 0
          : Math.round((completedTasks / totalTasks) * 100);

      return {
        ...project,
        progress,
      };
    });

    return NextResponse.json({
      success: true,
      projects: projectsWithProgress,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const project = await prisma.project.create({
      data: {
        name: body.name,
        startDate: new Date(body.startDate),
        deadline: new Date(body.deadline),

        projectUsers: {
          create: body.members.map((userId) => ({
            user: {
              connect: {
                id: userId,
              },
            },
          })),
        },
      },

      include: {
        projectUsers: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        project,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}