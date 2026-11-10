import { NextResponse } from "next/server";
import { resetStore } from "@/features/leads/api/repository";

/** Remet le jeu de données du visiteur courant dans son état initial. */
export async function POST() {
  await resetStore();
  return NextResponse.json({ reset: true });
}
