import { IStade } from 'app/shared/model/stade.model';
import { IDiagnostic } from 'app/shared/model/diagnostic.model';

export interface IMaladie {
  id?: string;
  fullName?: string | null;
  abbr?: string | null;
  stades?: IStade[] | null;
  diagnostics?: IDiagnostic | null;
}

export const defaultValue: Readonly<IMaladie> = {};
