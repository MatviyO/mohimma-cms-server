export interface IUser {
    id: number;
    fullName: string;
    email: string;
    password?: string;
    role: "USER" | "ADMIN";
    isActive: boolean;
    isVerified: boolean;
    refreshToken?: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}
