import { DashboardBackLink } from '@/components/dashboard-back-link';
import { DetailInfoGrid } from '@/components/detail-info-grid';
import { DetailSection } from '@/components/detail-section';
import { RevealIdButton } from '@/components/reveal-id-button';
import { VoidRentalForm } from '@/components/void-rental-form';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { getServerSessionProfile } from '@/lib/auth';
import { formatDateTime } from '@/lib/format-date-time';
import { getRentalHistoryDetail } from '@/lib/rental-history-detail';

type RentalHistoryDetailPageProps = {
  params: Promise<{ id: string }>;
};

const ID_TYPE_LABELS: Record<string, string> = {
  drivers_licence: "Driver's Licence",
  passport: 'Passport',
  bcid: 'BCID',
  other_gov_id: 'Other Gov. Photo ID',
  other: 'Other',
};

export default async function RentalHistoryDetailPage({ params }: RentalHistoryDetailPageProps) {
  const { id } = await params;
  const rental = await getRentalHistoryDetail(id);
  const { profile } = await getServerSessionProfile();
  const userRole = (profile as { role?: string } | null)?.role;
  const isOwner = userRole === 'owner';

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
          <div><strong>Phone:</strong> {rental.phone || '—'}</div>
          {rental.email ? <div><strong>Email:</strong> {rental.email}</div> : null}
          <div><strong>Status:</strong> {rental.status}</div>
          <div><strong>Start Time:</strong> {rental.startTime ? formatDateTime(rental.startTime) : '—'}</div>
          <div><strong>Completed At:</strong> {rental.completedAt ? formatDateTime(rental.completedAt) : '—'}</div>
          <div><strong>Final Fee:</strong> {rental.finalFee}</div>
        </DetailInfoGrid>

        <div>
          <strong>Assigned Bikes</strong>
          <div style={{ marginTop: 8, color: 'var(--text-secondary)' }}>{rental.bikeNumbers.join(', ') || '—'}</div>
        </div>

        {/* Photo ID — visible to all staff/owner */}
        {rental.submissionId ? (
          <div>
            <strong>Photo ID</strong>
            <div style={{ marginTop: 8, display: 'grid', gap: 6 }}>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Type: </span>
                {(ID_TYPE_LABELS[rental.idType] ?? rental.idType) || '—'}
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--text-muted)' }}>ID (masked): </span>
                ****{rental.idLast4 || '—'}
              </div>
              {isOwner ? (
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Full ID: </span>
                  <RevealIdButton submissionId={rental.submissionId} />
                </div>
              ) : null}
              {!isOwner ? (
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Full ID visible to owner only.
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div>
            <strong>Photo ID</strong>
            <div style={{ marginTop: 8, fontSize: 14, color: 'var(--text-muted)' }}>
              No submission record linked to this rental.
            </div>
          </div>
        )}

        <div>
          <strong>Notes</strong>
          <div style={{ marginTop: 8, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{rental.notes || '—'}</div>
        </div>
      </DetailSection>

      {isOwner && rental.status !== 'voided' ? <VoidRentalForm rentalId={rental.id} /> : null}
    </main>
  );
}
