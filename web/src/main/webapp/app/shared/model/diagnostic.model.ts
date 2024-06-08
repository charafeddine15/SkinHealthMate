import { IConsultation } from 'app/shared/model/consultation.model';
import { IMaladie } from 'app/shared/model/maladie.model';

export interface IDiagnostic {
  id?: string;
  dateDiagnostic?: string | null;
  pictureContentType?: string | null;
  picture?: string | null;
  description?: string | null;
  prescription?: string | null;
  probability?: number | null;
  consultations?: IConsultation | null;
  maladies?: IMaladie[] | null;
}

export const defaultValue: Readonly<IDiagnostic> = {};
