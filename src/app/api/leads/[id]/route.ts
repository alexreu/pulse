import { NextResponse } from "next/server";
import { z } from "zod";
import { RepositoryError, getLead, updateLead, updateLeadStatus } from "@/features/leads/api/repository";
import { leadEditSchema, statusUpdateSchema } from "@/features/leads/schemas/lead";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  try {
    const lead = await getLead(id);
    return NextResponse.json({ lead });
  } catch (error) {
    if (error instanceof RepositoryError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    throw error;
  }
}

export async function PATCH(request: Request, { params }: Context) {
  const { id } = await params;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Requête illisible." }, { status: 400 });
  }

  const parsed = statusUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ message: "Statut invalide." }, { status: 422 });
  }

  try {
    const lead = await updateLeadStatus(id, parsed.data.status);
    return NextResponse.json({ lead });
  } catch (error) {
    if (error instanceof RepositoryError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    throw error;
  }
}

/** Modifie les coordonnées et le montant d'une fiche. */
export async function PUT(request: Request, { params }: Context) {
  const { id } = await params;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Requête illisible." }, { status: 400 });
  }

  const parsed = leadEditSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Les données envoyées sont invalides.", issues: z.flattenError(parsed.error).fieldErrors },
      { status: 422 },
    );
  }

  try {
    const lead = await updateLead(id, parsed.data);
    return NextResponse.json({ lead });
  } catch (error) {
    if (error instanceof RepositoryError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    throw error;
  }
}
