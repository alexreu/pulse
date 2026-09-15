import { NextResponse } from "next/server";
import { RepositoryError, createLead, listLeads } from "@/features/leads/api/repository";
import { leadFormSchema } from "@/features/leads/schemas/lead";

export async function GET() {
  const leads = await listLeads();
  return NextResponse.json({ leads });
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Requête illisible." }, { status: 400 });
  }

  const parsed = leadFormSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Les données envoyées sont invalides.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  try {
    const lead = await createLead(parsed.data);
    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    if (error instanceof RepositoryError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    throw error;
  }
}
