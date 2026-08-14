import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();

    // --------------------------------------------------
    // Fetch all tasks
    // --------------------------------------------------

    const tasks = await prisma.task.findMany({
      include: {
        project: true,
        assignee: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });


    // --------------------------------------------------
    // Basic task statistics
    // --------------------------------------------------

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
      (task) => task.status === "Completed"
    );

    const completedCount = completedTasks.length;


    // --------------------------------------------------
    // On-time completion
    // --------------------------------------------------

    const onTimeTasks = completedTasks.filter(
      (task) =>
        task.completedAt &&
        task.completedAt <= task.deadline
    );

    const onTimeRate =
      completedCount > 0
        ? Math.round(
            (onTimeTasks.length / completedCount) * 100
          )
        : 0;


    // --------------------------------------------------
    // Overdue tasks
    // --------------------------------------------------

    const overdueTasks = tasks.filter(
      (task) =>
        task.status !== "Completed" &&
        new Date(task.deadline) < now
    );

    const overdueCount = overdueTasks.length;

    const overdueRate =
      totalTasks > 0
        ? Math.round(
            (overdueCount / totalTasks) * 100
          )
        : 0;


    // --------------------------------------------------
    // Average completion time
    // --------------------------------------------------

    let totalCompletionTime = 0;
    let completionTimeCount = 0;

    completedTasks.forEach((task) => {
      if (task.completedAt && task.createdAt) {
        const time =
          new Date(task.completedAt).getTime() -
          new Date(task.createdAt).getTime();

        totalCompletionTime += time;
        completionTimeCount++;
      }
    });

    const averageCompletionDays =
      completionTimeCount > 0
        ? totalCompletionTime /
          completionTimeCount /
          (1000 * 60 * 60 * 24)
        : 0;

    const averageCompletionTime =
      `${averageCompletionDays.toFixed(1)} days`;


    // --------------------------------------------------
    // Productivity score
    // --------------------------------------------------

    const completionRate =
      totalTasks > 0
        ? (completedCount / totalTasks) * 100
        : 0;

    const throughputScore =
      Math.min(completedCount / 100, 1) * 100;

    const productivityScore = Math.round(
      completionRate * 0.5 +
      onTimeRate * 0.3 +
      throughputScore * 0.2
    );


    // --------------------------------------------------
    // 30-day completion trend
    // --------------------------------------------------

    const completionTrend = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const completedOnDate = completedTasks.filter(
        (task) =>
          task.completedAt &&
          new Date(task.completedAt) >= date &&
          new Date(task.completedAt) < nextDate
      ).length;

      completionTrend.push({
        date: date.toISOString().split("T")[0],
        completed: completedOnDate,
      });
    }


    // --------------------------------------------------
    // Member analysis
    // --------------------------------------------------

    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
      },
      orderBy: {
        fullName: "asc",
      },
    });


    const members = users.map((user) => {

      const userTasks = tasks.filter(
        (task) => task.assigneeId === user.id
      );

      const userCompleted = userTasks.filter(
        (task) => task.status === "Completed"
      );

      const userActive = userTasks.filter(
        (task) => task.status !== "Completed"
      );

      const userOnTime = userCompleted.filter(
        (task) =>
          task.completedAt &&
          task.completedAt <= task.deadline
      );

      const userOnTimeRate =
        userCompleted.length > 0
          ? Math.round(
              (userOnTime.length /
                userCompleted.length) *
                100
            )
          : 0;


      // Average completion time

      let completionTime = 0;
      let completionCount = 0;

      userCompleted.forEach((task) => {
        if (task.completedAt) {
          completionTime +=
            new Date(task.completedAt).getTime() -
            new Date(task.createdAt).getTime();

          completionCount++;
        }
      });

      const avgDays =
        completionCount > 0
          ? completionTime /
            completionCount /
            (1000 * 60 * 60 * 24)
          : 0;


      // Bugs solved

      const bugsSolved = userCompleted.filter(
        (task) => task.taskType === "BUG"
      ).length;


      // Active high priority tasks

      const highPriorityTasks = userActive.filter(
        (task) => task.priority === "High"
      ).length;


      // Overdue tasks

      const userOverdue = userActive.filter(
        (task) =>
          new Date(task.deadline) < now
      ).length;


      // --------------------------------------------------
      // Burnout risk
      // --------------------------------------------------

      let riskScore = 0;

      if (userActive.length >= 8) {
        riskScore += 40;
      } else if (userActive.length >= 5) {
        riskScore += 25;
      } else if (userActive.length >= 3) {
        riskScore += 10;
      }

      if (highPriorityTasks >= 4) {
        riskScore += 30;
      } else if (highPriorityTasks >= 2) {
        riskScore += 20;
      } else if (highPriorityTasks >= 1) {
        riskScore += 10;
      }

      if (userOverdue >= 3) {
        riskScore += 30;
      } else if (userOverdue >= 1) {
        riskScore += 15;
      }


      let burnoutRisk = "Low";

      if (riskScore >= 60) {
        burnoutRisk = "High";
      } else if (riskScore >= 30) {
        burnoutRisk = "Moderate";
      }


      return {
        id: user.id,
        fullName: user.fullName,

        completedTasks: userCompleted.length,

        onTimeRate: userOnTimeRate,

        averageCompletionTime:
          `${avgDays.toFixed(1)} days`,

        bugsSolved,

        activeTasks: userActive.length,

        burnoutRisk,
      };
    });


    // --------------------------------------------------
    // Top performers
    // --------------------------------------------------

    const topPerformers = [...members]
      .sort(
        (a, b) =>
          b.completedTasks -
          a.completedTasks
      )
      .slice(0, 5);


    // --------------------------------------------------
    // Project analysis
    // --------------------------------------------------

    const projects = await prisma.project.findMany({
      include: {
        tasks: true,
      },
      orderBy: {
        startDate: "desc",
      },
    });


    const projectAnalysis = projects.map(
      (project) => {

        const projectTasks = project.tasks;

        const projectCompleted =
          projectTasks.filter(
            (task) =>
              task.status === "Completed"
          );

        const projectCompletion =
          projectTasks.length > 0
            ? Math.round(
                (projectCompleted.length /
                  projectTasks.length) *
                  100
              )
            : 0;


        const projectOnTime =
          projectCompleted.filter(
            (task) =>
              task.completedAt &&
              task.completedAt <= task.deadline
          );

        const projectOnTimeRate =
          projectCompleted.length > 0
            ? Math.round(
                (projectOnTime.length /
                  projectCompleted.length) *
                  100
              )
            : 0;


        const projectOverdue =
          projectTasks.filter(
            (task) =>
              task.status !== "Completed" &&
              new Date(task.deadline) < now
          ).length;


        // Project health

        let health = "Healthy";

        if (
          projectOverdue >= 3 ||
          projectCompletion < 40
        ) {
          health = "Critical";
        } else if (
          projectOverdue >= 1 ||
          projectCompletion < 70
        ) {
          health = "At Risk";
        }


        return {
          id: project.id,
          name: project.name,

          completion: projectCompletion,

          onTimeRate: projectOnTimeRate,

          overdueTasks: projectOverdue,

          health,
        };
      }
    );


    // --------------------------------------------------
    // Final response
    // --------------------------------------------------

    return NextResponse.json({
      success: true,

      stats: {
        productivityScore,
        completedTasks: completedCount,
        averageCompletionTime,
        overdueRate,
      },

      completionTrend,

      topPerformers,

      projects: projectAnalysis,

      members,
    });

  } catch (error) {

    console.error(error);

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