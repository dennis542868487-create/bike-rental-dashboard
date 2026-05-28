import { DashboardBackLink } from '@/components/dashboard-back-link';
import { DetailInfoGrid } from '@/components/detail-info-grid';
import { DetailSection } from '@/components/detail-section';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { PendingRentalDetailsForm } from '@/components/pending-rental-details-form';
import { getAvailableBikes } from '@/lib/available-bikes';
import { getFullSubmissionIdForPendingDetail } from '@/lib/full-id';
import { getPendingSubmissionDetail } from '@/lib/pending-submission-detail';

type PendingDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PendingDetailPage({ params }: PendingDetailPageProps) {
  const { id } = await params;
  const submission = await getPendingSubmissionDetail(id);
  const availableBikes = await getAvailableBikes();
  const fullIdNumber = submission ? await getFullSubmissionIdForPendingDetail(submission.id) : null;

  if (!submission) {
    notFound();
  }

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <DashboardBackLink href="/dashboard/pending" label="Back to Pending Submissions" />
      <PageHeader
        title={`Pending Submission ${submission.submissionNumber}`}
        description="Review customer intake details before starting the rental."
      />

      <DetailSection>
        <DetailInfoGrid>
          <div><strong>Submission Number:</strong> {submission.submissionNumber}</div>
          <div><strong>Customer Name:</strong> {submission.firstName} {submission.lastName}</div>
          <div><strong>Phone:</strong> {submission.phoneNumber}</div>
          <div><strong>Email:</strong> {submission.email || '—'}</div>
          <div><strong>ID Type:</strong> {submission.idType}</div>
          <div><strong>ID (masked):</strong> ******{submission.idLast4}</div>
          <div><strong>Full ID:</strong> {fullIdNumber ?? 'Unavailable'}</div>
          <div><strong>Waiver Accepted:</strong> {submission.waiverAccepted ? 'Yes' : 'No'}</div>
          <div><strong>Submitted At:</strong> {submission.submittedAt}</div>
        </DetailInfoGrid>
      </DetailSection>

      <PendingRentalDetailsForm submissionId={submission.id} availableBikes={availableBikes} />
    </main>
  );
}
