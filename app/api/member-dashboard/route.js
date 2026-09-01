import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }

    // Get all tasks assigned to this member
    const tasks = await prisma.task.findMany({
      where: {
        assigneeId: userId,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        deadline: "asc",
      },
    });

    // -----------------------------
    // Statistics
    // -----------------------------

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
      (task) => task.status === "Completed"
    ).length;

    const inProgressTasks = tasks.filter(
      (task) => task.status === "In Progress"
    ).length;


    // -----------------------------
    // Task type distribution
    // -----------------------------

    const taskTypeMap = {};

    tasks.forEach((task) => {
      if (!taskTypeMap[task.taskType]) {
        taskTypeMap[task.taskType] = 0;
      }

      taskTypeMap[task.taskType]++;
    });

    const taskTypes = Object.entries(taskTypeMap).map(
      ([type, count]) => ({
        type,
        count,
      })
    );


    // -----------------------------
    // Today's tasks
    // -----------------------------

    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const todaysTasks = tasks.filter((task) => {
      const deadline = new Date(task.deadline);

      return (
        deadline >= startOfToday &&
        deadline <= endOfToday &&
        task.status !== "Completed"
      );
    });


    // -----------------------------
    // Approaching deadlines
    // Next 5 incomplete tasks
    // -----------------------------

    const upcomingTasks = tasks
      .filter(
        (task) =>
          task.status !== "Completed" &&
          new Date(task.deadline) >= now
      )
      .slice(0, 5);

      // -----------------------------
    // Overdue tasks
    // -----------------------------

    const overdueTasks = tasks
    .filter(
        (task) =>
        task.status !== "Completed" &&
        new Date(task.deadline) < now
    )
    .sort(
        (a, b) =>
        new Date(a.deadline) - new Date(b.deadline)
    )
    .slice(0, 5);
    // -----------------------------
    // Response
    // -----------------------------

    return NextResponse.json({
      success: true,

      stats: {
        totalTasks,
        completedTasks,
        inProgressTasks,
      },

      taskTypes,

      todaysTasks,

      upcomingTasks,

      overdueTasks,
    });

  } catch (error) {
    console.error("Member dashboard error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}