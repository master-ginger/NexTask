import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const projectId = searchParams.get("projectId");

    const tasks = await prisma.task.findMany({
      where: projectId
        ? {
            projectId,
          }
        : {},

      include: {
        project: true,
        assignee: true,
      },

      orderBy: {
        deadline: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      tasks,
    });

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );

  }
}

export async function POST(request) {

  try {

    const body = await request.json();

    const task = await prisma.task.create({

      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        priority: body.priority,
        deadline: new Date(body.deadline),

        projectId: body.projectId,
        assigneeId: body.assigneeId,
      },

    });

    return NextResponse.json({
      success: true,
      message: "Task created successfully",
      task,
    });

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );

  }

}
