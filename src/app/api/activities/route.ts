import { NextResponse } from "next/server";
import { listActivities } from "@/features/leads/api/repository";

export async function GET() {
  const activities = await listActivities();
  return NextResponse.json({ activities });
}
