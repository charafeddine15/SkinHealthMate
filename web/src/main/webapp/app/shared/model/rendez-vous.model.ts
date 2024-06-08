import { IDermatologue } from 'app/shared/model/dermatologue.model';
import { IPatient } from 'app/shared/model/patient.model';
import { IConsultation } from 'app/shared/model/consultation.model';

export interface IRendezVous {
  id?: string;
  dateDebut?: string | null;
  dateFin?: string | null;
  statut?: boolean | null;
  dermatologues?: IDermatologue | null;
  patients?: IPatient | null;
  consultations?: IConsultation[] | null;
}

export const defaultValue: Readonly<IRendezVous> = {
  statut: false,
};
