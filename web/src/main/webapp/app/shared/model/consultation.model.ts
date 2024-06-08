import { IRendezVous } from 'app/shared/model/rendez-vous.model';
import { IDiagnostic } from 'app/shared/model/diagnostic.model';

export interface IConsultation {
  id?: string;
  dateConsultation?: string | null;
  rendezVous?: IRendezVous | null;
  diagnostics?: IDiagnostic[] | null;
}

export const defaultValue: Readonly<IConsultation> = {};
