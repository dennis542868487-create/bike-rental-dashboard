export type ActiveRentalRow = {
  id: string;
  rentalNumber: string;
  customerName: string;
  phoneNumber: string;
  bikes: string;
  expectedReturnTime: string;
  fee: string;
  status: 'active';
};
