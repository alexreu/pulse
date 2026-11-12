import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";

export const metadata: Metadata = {
  title: "Page introuvable",
};

/** Une adresse inconnue : on le dit, puis on rend la main sur les deux destinations utiles. */
export default function NotFound() {
  return (
    <Card>
      <EmptyState
        icon={Compass}
        title="Cette page n'existe pas."
        description="L'adresse est peut-être mal saisie, ou la page a été déplacée. Les prospects et la vue d'ensemble restent à un clic."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild variant="default">
              <Link href="/dashboard">Vue d&apos;ensemble</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/leads">Prospects</Link>
            </Button>
          </div>
        }
      />
    </Card>
  );
}
