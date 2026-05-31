import { DashboardBackLink } from '@/components/dashboard-back-link';
import { DetailInfoGrid } from '@/components/detail-info-grid';
import { DetailSection } from '@/components/detail-section';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { VoidRentalForm } from '@/components/void-rental-form';
import { getServerSessionProfile } from '@/lib/auth';
import { getRentalHistoryDetail } from '@/lib/rental-history-detail';

type RentalHistoryDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RentalHistoryDetailPage({ params }: RentalHistoryDetailPageProps) {
  const { id } = await params;
  const rental = await getRentalHistoryDetail(id);
  const { profile } = await getServerSessionProfile();
  const userRole = (profile as { role?: string } | null)?.role;

  if (!rental) {
    notFound();
  }

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <DashboardBackLink href="/dashboard/history" label="Back to Rental History" />
      <PageHeader
        title={`Rental History ${rental.rentalNumber}`}
        description="Completed rental record details."
      />

      <DetailSection>
        <DetailInfoGrid>
          <div><strong>Rental Number:</strong> {rental.rentalNumber}</div>
          <div><strong>Customer:</strong> {rental.customerName}</div>
          <div><strong>Status:</strong> {rental.status}</div>
          <div><strong>Completed At:</strong> {rental.completedAt || '—'}</div>
          <div><strong>Final Fee:</strong> {rental.finalFee}</div>
        </DetailInfoGrid>

        <div>
          <strong>Bikes</strong>
          <div style={{ marginTop: 8, color: '#374151' }}>{rental.bikeNumbers.join(', ') || '—'}</div>
        </div>

        <div>
          <strong>Notes</strong>
          <div style={{ marginTop: 8, color: '#374151', whiteSpace: 'pre-wrap' }}>{rental.notes || '—'}</div>
        </div>
      </DetailSection>

      {userRole === 'owner' && rental.status !== 'voided' ? <VoidRentalForm rentalId={rental.id} /> : null}
    </main>
  );
}
