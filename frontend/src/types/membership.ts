
export enum UserRole {
  ADMIN = 'ADMIN',
  REGULAR = 'REGULAR'
}

export interface IMembershipRequestUpdate {
  userId: string;
  role: UserRole;
}

export interface IMembershipRequestDelete {
  userId: string;
  spaceId: string;
}

export interface IUserMembership {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}