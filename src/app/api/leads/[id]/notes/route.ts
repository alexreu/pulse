import { NextResponse } from "next/server";
import { RepositoryError, addNote } from "@/features/leads/api/repository";
import { noteSchema } from "@/features/leads/schemas/lead";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Context) {
  const { id } = await params;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Requête illisible." }, { status: 400 });
  }

  const parsed = noteSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Note invalide." },
      { status: 422 },
    );
  }

  try {
    const lead = await addNote(id, parsed.data.body);
    return NextResponse.json({ lead });
  } catch (error) {
    if (error instanceof RepositoryError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    throw error;
  }
}
