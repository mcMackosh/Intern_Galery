export interface IProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string ;
    updatedAt: Date;
    createdAt: Date;
}

export type UpdateProfile = Partial<Omit<IProfile, "id" | "createdAt" | "updatedAt">>;

export interface ResetPasswordDtoByToken {
  oldPassword: string;
  newPassword: string;
}