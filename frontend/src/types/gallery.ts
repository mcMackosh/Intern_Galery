import { UserRole } from "./membership";

export interface IGallery {
  id: string;
  title: string;
  description: string;
  role: UserRole;
}