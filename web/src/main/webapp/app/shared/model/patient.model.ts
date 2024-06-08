import { IUser } from 'app/shared/model/user.model';
import { IRendezVous } from 'app/shared/model/rendez-vous.model';

export interface IPatient {
  id?: string;
  birthdate?: string | null;
  adress?: string | null;
  genre?: string | null;
  telephone?: string | null;
  user?: IUser | null;
  dermatologuePatients?: IRendezVous[] | null;
}

export const defaultValue: Readonly<IPatient> = {};
