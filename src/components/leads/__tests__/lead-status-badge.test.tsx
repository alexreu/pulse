import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LEAD_STATUSES } from "@/features/leads/types";
import { STATUS_CONFIG } from "@/features/leads/utils/status";
import { LeadStatusBadge } from "../lead-status-badge";

describe("LeadStatusBadge", () => {
  it.each(LEAD_STATUSES)("écrit le mot de l'étape « %s »", (status) => {
    render(<LeadStatusBadge status={status} />);
    expect(screen.getByText(STATUS_CONFIG[status].label)).toBeInTheDocument();
  });

  it("ne confie jamais l'information à la seule couleur : la pastille est décorative", () => {
    const { container } = render(<LeadStatusBadge status="won" />);
    const dot = container.querySelector("[aria-hidden]");
    expect(dot).not.toBeNull();
    // Le texte reste lisible même si la pastille et le fond disparaissent.
    expect(container.textContent?.trim()).toBe("Gagné");
  });
});
