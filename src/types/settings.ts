export type SettingsEntry = {
  id: string;
  title: string;
  description: string;
};

export const settingsEntries: SettingsEntry[] = [
  {
    id: 'waiver',
    title: 'Waiver Settings',
    description: 'Manage waiver text, instructions, and versioning.',
  },
  {
    id: 'id-types',
    title: 'ID Type Options',
    description: 'Control the ID types available in the customer intake form.',
  },
  {
    id: 'business',
    title: 'Business Settings',
    description: 'Review core business defaults such as shop identity, timezone, and currency.',
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
