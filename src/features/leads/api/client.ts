import type { Activity, Lead, LeadStatus } from "../types";
import type { LeadEditValues, LeadFormValues } from "../schemas/lead";

/** Erreur renvoyée par les route handlers, déjà rédigée pour l'utilisateur. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  const payload = (await response.json().catch(() => null)) as
    | (T & { message?: string })
    | null;

  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? "Le serveur n'a pas pu traiter la demande.",
      response.status,
    );
  }

  return payload as T;
}

export function fetchLeads(): Promise<{ leads: Lead[] }> {
  return request("/api/leads");
}

export function fetchActivities(): Promise<{ activities: Activity[] }> {
  return request("/api/activities");
}

export function postLead(values: LeadFormValues): Promise<{ lead: Lead }> {
  return request("/api/leads", { method: "POST", body: JSON.stringify(values) });
}

export function putLead(id: string, values: LeadEditValues): Promise<{ lead: Lead }> {
  return request(`/api/leads/${id}`, { method: "PUT", body: JSON.stringify(values) });
}

export function patchLeadStatus(id: string, status: LeadStatus): Promise<{ lead: Lead }> {
  return request(`/api/leads/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
}

export function postNote(id: string, body: string): Promise<{ lead: Lead }> {
  return request(`/api/leads/${id}/notes`, { method: "POST", body: JSON.stringify({ body }) });
}

export function patchBulkStatus(ids: string[], status: LeadStatus): Promise<{ updated: Lead[] }> {
  return request("/api/leads/bulk", {
    method: "PATCH",
    body: JSON.stringify({ action: "status", ids, status }),
  });
}

export function deleteLeads(ids: string[]): Promise<{ removed: string[] }> {
  return request("/api/leads/bulk", {
    method: "PATCH",
    body: JSON.stringify({ action: "delete", ids }),
  });
}

export function restoreDeletedLeads(): Promise<{ leads: Lead[]; restored: number }> {
  return request("/api/leads/bulk", {
    method: "PATCH",
    body: JSON.stringify({ action: "restore" }),
  });
}

export function fetchDemoFailure(): Promise<{ failNextWrite: boolean }> {
  return request("/api/demo/failure");
}

export function resetDemo(): Promise<{ reset: boolean }> {
  return request("/api/demo/reset", { method: "POST" });
}

export function setDemoFailure(enabled: boolean): Promise<{ failNextWrite: boolean }> {
  return request("/api/demo/failure", { method: "PUT", body: JSON.stringify({ enabled }) });
}
