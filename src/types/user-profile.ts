export type UserProfileRole = 'owner' | 'staff';

export type UserProfileRow = {
  id: string;
  email: string;
  fullName: string;
  role: UserProfileRole;
  isActive: boolean;
};
