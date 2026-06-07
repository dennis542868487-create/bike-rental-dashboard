import { DashboardBackLink } from '@/components/dashboard-back-link';
import { DetailInfoGrid } from '@/components/detail-info-grid';
import { DetailSection } from '@/components/detail-section';
import { notFound } from 'next/navigation';
import { ActiveRentalBikeSwapForm } from '@/components/active-rental-bike-swap-form';
import { ActiveRentalEditForm } from '@/components/active-rental-edit-form';
import { CompleteRentalForm } from '@/components/complete-rental-form';
import { CreateIncidentReportForm } from '@/components/create-incident-report-form';
import { PageHeader } from '@/components/page-header';
import { getActiveRentalDetail } from '@/lib/active-rental-detail';
import { getAvailableBikes } from '@/lib/available-bikes';
import { formatDateTime } from '@/lib/format-date-time';

type ActiveRentalDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ActiveRentalDetailPage({ params }: ActiveRentalDetailPageProps) {
  const { id } = await params;
  const rental = await getActiveRentalDetail(id);
  const availableBikes = await getAvailableBikes();

  if (!rental) {
    notFound();
  }

  const displayAmount = rental.amountCollected && rental.amountCollected !== '0'
    ? `$${rental.amountCollected}`
    : '—';

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <DashboardBackLink href="/dashboard/active" label="Back to Active Rentals" />
      <PageHeader
        title={`Active Rental ${rental.rentalNumber}`}
        description="View the current rental details and assigned bikes."
      />

      <DetailSection>
        <DetailInfoGrid>
          <div><strong>Rental Number:</strong> {rental.rentalNumber}</div>
          <div><strong>Customer:</strong> {rental.customerName}</div>
          <div><strong>Phone:</strong> {rental.phoneNumber}</div>
          {rental.submittedAt ? (
            <div><strong>Customer Submitted At:</strong> {formatDateTime(rental.submittedAt)}</div>
          ) : null}
          <div><strong>Start Time:</strong> {formatDateTime(rental.startTime)}</div>
          <div>
            <strong>Return / Completion Time:</strong>{' '}
            {rental.returnTime ? formatDateTime(rental.returnTime) : 'Not completed yet'}
          </div>
          <div><strong>Amount Collected:</strong> {displayAmount}</div>
        </DetailInfoGrid>

        <div>
          <strong>Assigned Bikes</strong>
          <div style={{ marginTop: 8, color: 'var(--text-secondary)' }}>{rental.bikeNumbers.join(', ') || '—'}</div>
        </div>

        <div>
          <strong>Notes</strong>
          <div style={{ marginTop: 8, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{rental.notes || '—'}</div>
        </div>
      </DetailSection>

      <ActiveRentalEditForm
        rentalId={rental.id}
        currentStartTime={rental.startTime}
        currentReturnTime={rental.returnTime}
        currentAmountCollected={rental.amountCollected}
        currentNotes={rental.notes}
      />
      <ActiveRentalBikeSwapForm rentalId={rental.id} currentBikeNumbers={rental.bikeNumbers} availableBikes={availableBikes} />
      <CreateIncidentReportForm
        rentalId={rental.id}
        bikes={rental.bikeNumbers.map((bikeNumber, index) => ({
          id: rental.bikeIds[index],
          label: bikeNumber,
        }))}
      />
      <CompleteRentalForm rentalId={rental.id} />
    </main>
  );
}
