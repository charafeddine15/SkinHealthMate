import { IUser } from 'app/shared/model/user.model';
import { IRendezVous } from 'app/shared/model/rendez-vous.model';

export interface IDermatologue {
  id?: string;
  codeEmp?: string | null;
  genre?: string | null;
  telephone?: string | null;
  user?: IUser | null;
  dermatologuePatients?: IRendezVous[] | null;
}

export const defaultValue: Readonly<IDermatologue> = {};
