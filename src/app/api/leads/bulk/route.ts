import { NextResponse } from "next/server";
import { RepositoryError, bulkDelete, bulkUpdateStatus, restoreLastDeleted } from "@/features/leads/api/repository";
import { bulkActionSchema } from "@/features/leads/schemas/lead";

export async function PATCH(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Requête illisible." }, { status: 400 });
  }

  const parsed = bulkActionSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ message: "Action groupée invalide." }, { status: 422 });
  }

  try {
    if (parsed.data.action === "restore") {
      return NextResponse.json(await restoreLastDeleted());
    }
    if (parsed.data.action === "delete") {
      const removed = await bulkDelete(parsed.data.ids);
      return NextResponse.json({ removed });
    }
    const updated = await bulkUpdateStatus(parsed.data.ids, parsed.data.status);
    return NextResponse.json({ updated });
  } catch (error) {
    if (error instanceof RepositoryError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    throw error;
  }
}
