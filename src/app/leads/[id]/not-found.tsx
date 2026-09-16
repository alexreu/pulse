import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
} from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";

export default function LeadNotFound() {
  return (
    <Card>
      <EmptyState
        icon={SearchX}
        title="Ce prospect n'existe pas."
        description="La fiche a peut-être été supprimée, ou le lien n'est plus valide. Le tableau des prospects reste accessible."
        action={
          <Button asChild variant="default">
            <Link href="/leads">Retour au tableau</Link>
          </Button>
        }
      />
    </Card>
  );
}
