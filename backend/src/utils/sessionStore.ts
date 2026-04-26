import { UserRole } from "../entities/User";

export const sessionStore = new Map<string, {id: string, role: UserRole}>();