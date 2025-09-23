export interface IUser {
  _id: string;
  email: string;
  name: string;
  idNumber: number;
  profile?: {
    picture?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    fullname?: string;
    gender?: string;
    address?: {
      street?: string;
      village?: string;
      subDistrict?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  };
  historyTransaction?: string[];
  role: "user" | "admin" | "superadmin";
  deletedAt?: Date | null;
  createdAt: string;
  updatedAt: string;
}
