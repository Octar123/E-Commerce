export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  code?: string;
  currentUser?: unknown;
}

export interface SessionResponse {
  currentUser: {
    id: string;
    role: string;
    name: string;
  } | null;
}
