import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
    
  try {

    const body = await request.json();

    const { taskId } = await params;
    const completedAt = body.status === 'Completed' ? new Date() : null;
    console.log("Task ID:", taskId);
    console.log("Assignee ID:", body.assigneeId);
    console.log("Project ID:", body.projectId);
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title: body.title,
        description: body.description,
        priority: body.priority,
        status: body.status,
        deadline: new Date(body.deadline),
        taskType:body.taskType,
        projectId: body.projectId,
        assigneeId: body.assigneeId,
        completedAt:completedAt
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

    const { taskId } = await params;
    await prisma.task.delete({
      where: {
        id: taskId,
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