import { NextResponse } from "next/server";
import { getFailNextWrite, setFailNextWrite } from "@/features/leads/api/repository";

export async function GET() {
  return NextResponse.json({ failNextWrite: getFailNextWrite() });
}

export async function PUT(request: Request) {
  const payload = (await request.json().catch(() => null)) as { enabled?: boolean } | null;
  if (typeof payload?.enabled !== "boolean") {
    return NextResponse.json({ message: "Valeur attendue : { enabled: boolean }." }, { status: 422 });
  }
  return NextResponse.json({ failNextWrite: setFailNextWrite(payload.enabled) });
}
