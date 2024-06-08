import { IUser } from 'app/shared/model/user.model';

export interface ISecretaire {
  id?: string;
  codeEmp?: string | null;
  genre?: string | null;
  telephone?: string | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<ISecretaire> = {};
