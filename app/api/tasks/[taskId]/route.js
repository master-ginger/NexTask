import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const body = await request.json();

    const updatedTask = await prisma.task.update({
      where: {
        id: params.taskId,
      },
      data: {
        title: body.title,
        description: body.description,
        priority: body.priority,
        status: body.status,
        deadline: new Date(body.deadline),
        projectId: body.projectId,
        assigneeId: body.assigneeId,
      },
      include: {
        project: true,
        assignee: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
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

export async function DELETE(request, { params }) {
  try {
    await prisma.task.delete({
      where: {
        id: params.taskId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
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