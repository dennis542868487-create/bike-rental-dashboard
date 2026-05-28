export type BusinessSettings = {
  businessName: string;
  timezone: string;
  primaryCurrency: string;
  deploymentStageNote: string;
};

export async function getBusinessSettings(): Promise<BusinessSettings> {
  return {
    businessName: 'Wander Bike',
    timezone: 'America/Vancouver',
    primaryCurrency: 'CAD',
    deploymentStageNote: 'Business settings are currently documented as app-level defaults and can be moved to persistent storage later.',
  };
}
