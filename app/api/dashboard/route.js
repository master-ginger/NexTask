import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // =========================
    // Top Cards
    // =========================

    const totalProjects = await prisma.project.count();

    const totalTasks = await prisma.task.count();

    const completedTasks = await prisma.task.count({
      where: {
        status: "Completed",
      },
    });

    const overdueTasks = await prisma.task.count({
      where: {
        deadline: {
          lt: new Date(),
        },
        NOT: {
          status: "Completed",
        },
      },
    });

    // =========================
    // Active Projects
    // =========================

    const projects = await prisma.project.findMany({
      include: {
        tasks: true,
        projectUsers: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        deadline: "asc",
      },
    });

    const projectData = projects.map((project) => {

      const total = project.tasks.length;

      const completed = project.tasks.filter(
        (task) => task.status === "Completed"
      ).length;

      const progress =
        total === 0
          ? 0
          : Math.round((completed / total) * 100);

      return {
        id: project.id,
        name: project.name,
        deadline: project.deadline,
        members: project.projectUsers.length,
        progress,
      };
    });

    // =========================
    // Top Performers
    // =========================

    const users = await prisma.user.findMany({
      include: {
        tasks: true,
      },
    });

    const topPerformers = users
      .map((user) => ({
        id: user.id,
        fullName: user.fullName,
        completedTasks: user.tasks.filter(
          (task) => task.status === "Completed"
        ).length,
      }))
      .sort(
        (a, b) => b.completedTasks - a.completedTasks
      )
      .slice(0, 5);

    // =========================
    // High Priority Tasks
    // =========================

    const highPriorityTasks = await prisma.task.findMany({
      where: {
        priority: "High",
        NOT: {
          status: "Completed",
        },
      },
      include: {
        project: true,
        assignee: true,
      },
      orderBy: {
        deadline: "asc",
      },
      take: 5,
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 29);

    const completionMap = {};

    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(thirtyDaysAgo.getDate() + i);

      const key = date.toISOString().split("T")[0];

      completionMap[key] = 0;
    }

    const completedTasksTrends = await prisma.task.findMany({
      where: {
        status: "Completed",
        completedAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        completedAt: true,
      },
    });
    

    completedTasksTrends.forEach((task) => {
      const key = task.completedAt
        .toISOString()
        .split("T")[0];

      if (completionMap[key] !== undefined) {
        completionMap[key]++;
      }
    });

    const completionTrend = Object.entries(completionMap).map(
      ([date, completed]) => ({
        date,
        completed,
      })
    );
    return NextResponse.json({
      success: true,

      stats: {
        totalProjects,
        totalTasks,
        completedTasks,
        overdueTasks,
      },

      projects: projectData,

      topPerformers,

      highPriorityTasks,
      completionTrend
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