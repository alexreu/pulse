import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { EmptyState } from "@/components/common/empty-state";

export default function LeadNotFound() {
  return (
    <Panel>
      <EmptyState
        icon={SearchX}
        title="Ce prospect n'existe pas."
        description="La fiche a peut-être été supprimée, ou le lien n'est plus valide. Le tableau des prospects reste accessible."
        action={
          <Button asChild variant="primary">
            <Link href="/leads">Retour au tableau</Link>
          </Button>
        }
      />
    </Panel>
  );
}
