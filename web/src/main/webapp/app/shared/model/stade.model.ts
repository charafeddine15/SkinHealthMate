import { IImageStade } from 'app/shared/model/image-stade.model';
import { IMaladie } from 'app/shared/model/maladie.model';

export interface IStade {
  id?: string;
  stade?: string | null;
  description?: string | null;
  imageStades?: IImageStade[] | null;
  composition?: IMaladie | null;
}

export const defaultValue: Readonly<IStade> = {};
