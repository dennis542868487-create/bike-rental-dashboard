export type MorningCheckItem = {
  id: string;
  bikeNumber: string;
  area: string;
  status: 'all_good' | 'front_tire_flat' | 'rear_tire_flat' | 'sent_to_maintenance';
  notes?: string;
};

export const morningCheckMockData: MorningCheckItem[] = [
  {
    id: '1',
    bikeNumber: 'A-003',
    area: 'Area A',
    status: 'all_good',
  },
  {
    id: '2',
    bikeNumber: 'K-002',
    area: 'Area C',
    status: 'sent_to_maintenance',
    notes: 'Rear wheel inspection needed',
  },
];
