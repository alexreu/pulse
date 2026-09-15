export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** Les étapes du pipeline commercial, dans l'ordre du flux. `lost` en est exclu. */
export const PIPELINE_STAGES = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
] as const satisfies readonly LeadStatus[];

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

/** Les étapes encore ouvertes : ce qui compose la valeur du pipeline. */
export const OPEN_STAGES = [
  "new",
  "contacted",
  "qualified",
  "proposal",
] as const satisfies readonly LeadStatus[];

export interface LeadNote {
  id: string;
  body: string;
  createdAt: string;
  author: string;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone?: string;
  estimatedValue: number;
  status: LeadStatus;
  createdAt: string;
  lastContactAt?: string;
  notes: LeadNote[];
}

export const ACTIVITY_TYPES = [
  "lead_created",
  "status_changed",
  "note_added",
  "email_sent",
  "meeting_scheduled",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export interface Activity {
  id: string;
  leadId: string;
  leadName: string;
  company: string;
  type: ActivityType;
  createdAt: string;
  /** Ce qui s'est passé, déjà rédigé en français. */
  summary: string;
  fromStatus?: LeadStatus;
  toStatus?: LeadStatus;
}

export type ValueBracket = "all" | "under-1000" | "1000-5000" | "over-5000";

export type SortField = "name" | "estimatedValue" | "createdAt";
export type SortDirection = "asc" | "desc";

export interface LeadSort {
  field: SortField;
  direction: SortDirection;
}

export interface LeadFilters {
  search: string;
  statuses: LeadStatus[];
  valueBracket: ValueBracket;
  /** Bornes ISO inclusives sur `createdAt`. */
  createdFrom?: string;
  createdTo?: string;
}

export const EMPTY_FILTERS: LeadFilters = {
  search: "",
  statuses: [],
  valueBracket: "all",
};
