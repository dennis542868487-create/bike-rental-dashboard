import { ArchiveBikeForm } from '@/components/archive-bike-form';
import { CreateMaintenanceRecordForm } from '@/components/create-maintenance-record-form';
import { DashboardBackLink } from '@/components/dashboard-back-link';
import { DetailInfoGrid } from '@/components/detail-info-grid';
import { DetailSection } from '@/components/detail-section';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { SaveBikeForm } from '@/components/save-bike-form';
import { UpdateBikeStatusForm } from '@/components/update-bike-status-form';
import { UploadBikePhotoForm } from '@/components/upload-bike-photo-form';
import { getBikeDetail } from '@/lib/bike-detail';

type BikeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BikeDetailPage({ params }: BikeDetailPageProps) {
  const { id } = await params;
  const bike = await getBikeDetail(id);

  if (!bike) {
    notFound();
  }

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <DashboardBackLink href="/dashboard/bikes" label="Back to Bikes" />
      <PageHeader title={`Bike ${bike.bikeNumber}`} description="Bike detail, status, and operational notes." />

      <DetailSection>
        <DetailInfoGrid>
          <div><strong>Bike Number:</strong> {bike.bikeNumber}</div>
          <div><strong>Type:</strong> {bike.bikeType}</div>
          <div><strong>Size:</strong> {bike.size || '—'}</div>
          <div><strong>Status:</strong> {bike.status}</div>
          <div><strong>Area:</strong> {bike.area}</div>
        </DetailInfoGrid>

        <div>
          <strong>Operational Notes</strong>
          <div style={{ marginTop: 8, color: '#374151', whiteSpace: 'pre-wrap' }}>{bike.notes || '—'}</div>
        </div>
      </DetailSection>

      <SaveBikeForm
        bikeId={bike.id}
        defaultValues={{
          bikeNumber: bike.bikeNumber,
          bikeType: bike.bikeType,
          size: bike.size,
          notes: bike.notes,
        }}
      />

      <UpdateBikeStatusForm bikeId={bike.id} currentStatus={bike.status as 'available' | 'rented' | 'maintenance'} />

      <ArchiveBikeForm bikeId={bike.id} />

      <UploadBikePhotoForm bikeId={bike.id} />

      <DetailSection>
        <div>
          <strong>Deletion Policy</strong>
          <div style={{ marginTop: 8, color: '#374151' }}>
            Bikes are preserved for rental and maintenance history. Use archive instead of hard delete.
          </div>
        </div>
      </DetailSection>

      <DetailSection>
        <div>
          <strong>Maintenance History</strong>
          <div style={{ marginTop: 8, color: '#374151', display: 'grid', gap: 8 }}>
            {bike.maintenanceHistory.length === 0
              ? 'No maintenance records yet.'
              : bike.maintenanceHistory.map((record) => (
                  <div key={record.id} style={{ borderTop: '1px solid #e5e7eb', paddingTop: 8 }}>
                    <div><strong>{record.date}</strong> • {record.workDone} • {record.cost}</div>
                    <div>{record.notes || '—'}</div>
                  </div>
                ))}
          </div>
        </div>

        <div>
          <strong>Rental History</strong>
          <div style={{ marginTop: 8, color: '#374151', display: 'grid', gap: 8 }}>
            {bike.rentalHistory.length === 0
              ? 'No rental history yet.'
              : bike.rentalHistory.map((rental) => (
                  <div key={rental.id} style={{ borderTop: '1px solid #e5e7eb', paddingTop: 8 }}>
                    <div><strong>{rental.rentalNumber}</strong> • {rental.status}</div>
                    <div>{rental.completedAt || '—'}</div>
                  </div>
                ))}
          </div>
        </div>
      </DetailSection>

      <CreateMaintenanceRecordForm bikeId={bike.id} />
    </main>
  );
}
