export interface SessionDocument {
  userId?: string;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
}
