import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const { taskId } = await params;
    const body = await request.json();

    // Find the existing task first
    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found",
        },
        { status: 404 }
      );
    }

    // Object containing only fields that need to be updated
    const updateData = {};

    // Add fields only if they are provided
    if (body.title !== undefined) {
      updateData.title = body.title;
    }

    if (body.description !== undefined) {
      updateData.description = body.description;
    }

    if (body.priority !== undefined) {
      updateData.priority = body.priority;
    }

    if (body.status !== undefined) {
      updateData.status = body.status;
    }

    if (body.deadline !== undefined) {
      const deadline = new Date(body.deadline);

      if (Number.isNaN(deadline.getTime())) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid deadline",
          },
          { status: 400 }
        );
      }

      updateData.deadline = deadline;
    }

    if (body.projectId !== undefined) {
      updateData.projectId = body.projectId;
    }

    if (body.assigneeId !== undefined) {
      updateData.assigneeId = body.assigneeId;
    }

    if (body.taskType !== undefined) {
      updateData.taskType = body.taskType;
    }

    // -----------------------------------------
    // Handle completedAt
    // -----------------------------------------

    if (body.status !== undefined) {
      // Task has just been completed
      if (
        body.status === "Completed" &&
        existingTask.status !== "Completed"
      ) {
        updateData.completedAt = new Date();
      }

      // Task was reopened / moved out of Completed
      else if (
        body.status !== "Completed" &&
        existingTask.status === "Completed"
      ) {
        updateData.completedAt = null;
      }
    }

    // -----------------------------------------
    // Update task
    // -----------------------------------------

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: updateData,
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
    console.error("Update task error:", error);

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

    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found",
        },
        { status: 404 }
      );
    }

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
    console.error("Delete task error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}