import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  RepositoryError,
  getLead,
  listActivitiesForLead,
} from "@/features/leads/api/repository";
import { LeadDetail } from "@/components/leads/lead-detail";
import { formatFullName } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const lead = await getLead(id);
    return { title: `${formatFullName(lead.firstName, lead.lastName)} — ${lead.company}` };
  } catch {
    return { title: "Prospect introuvable" };
  }
}

/**
 * La lecture est isolée du rendu : le `try/catch` n'entoure que la récupération
 * des données, jamais du JSX, dont les erreurs relèvent de la frontière
 * d'erreur voisine.
 */
async function loadLead(id: string) {
  try {
    return await Promise.all([getLead(id), listActivitiesForLead(id)]);
  } catch (error) {
    if (error instanceof RepositoryError && error.status === 404) return null;
    throw error;
  }
}

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await loadLead(id);

  if (!data) notFound();
  const [lead, activities] = data;

  return (
      <LeadDetail lead={lead} initialActivities={activities} />
  );
}
