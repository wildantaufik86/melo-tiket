import VerificationCodeType from "./verificationCodeType";

export interface VerificationCodeDocument {
  userId: string;
  type: VerificationCodeType;
  expiresAt: Date;
  createdAt: Date;
}
