export type BikeRow = {
  id: string;
  bikeNumber: string;
  bikeType: string;
  size: string;
  status: 'available' | 'rented' | 'maintenance';
  area: string;
};
