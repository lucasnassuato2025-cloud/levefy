import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalUsers, premiumUsers, startUsers, totalMeals, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { plan: "premium" } }),
      prisma.user.count({ where: { plan: "start" } }),
      prisma.mealHistory.count(),
      prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 10, select: { id: true, email: true, name: true, plan: true, createdAt: true, xp: true } }),
    ]);
    const mrr = premiumUsers * 19;
    return NextResponse.json({ totalUsers, premiumUsers, startUsers, totalMeals, mrr, recentUsers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
