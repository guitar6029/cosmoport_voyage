/** Public shape of an application registry row (no database credentials). */
export interface CosmoportApp {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}
