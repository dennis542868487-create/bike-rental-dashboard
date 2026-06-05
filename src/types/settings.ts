export type SettingsEntry = {
  id: string;
  title: string;
  description: string;
};

export const settingsEntries: SettingsEntry[] = [
  {
    id: 'customer-form',
    title: 'Customer Form Settings',
    description: 'Customize the public rental form title, instructions, ID options, waiver text, and success message.',
  },
  {
    id: 'users',
    title: 'Users & Roles',
    description: 'Manage owner and staff access.',
  },
  {
    id: 'morning-check',
    title: 'Morning Check Areas',
    description: 'Manage daily inspection areas and defaults.',
  },
];
