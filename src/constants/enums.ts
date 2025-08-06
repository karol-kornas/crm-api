// Role user
export const ROLES = ["client", "user", "admin"] as const;
export type Role = (typeof ROLES)[number];

// Environment project access
export const ENVIRONMENTS = ["dev", "staging", "production"] as const;
export type Environment = (typeof ENVIRONMENTS)[number];

// Status project
export const PROJECT_STATUSES = ["new", "in_progress", "completed", "on_hold"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

// User position
export const USER_POSITION = [
  "client",
  "frontend_developer",
  "backend_developer",
  "designer",
  "fullstack_developer",
  "pm",
  "tester",
  "dev_ops",
  "ceo",
] as const;
export type UserPosition = (typeof USER_POSITION)[number];

// Status ticket
export const TICKET_STATUSES = ["open", "in_progress", "resolved", "closed"] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

// Priority
export const PRIORITY = ["low", "medium", "high", "urgent"] as const;
export type Priority = (typeof TICKET_STATUSES)[number];
