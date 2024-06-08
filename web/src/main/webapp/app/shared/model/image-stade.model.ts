import { IStade } from 'app/shared/model/stade.model';

export interface IImageStade {
  id?: string;
  pictureContentType?: string | null;
  picture?: string | null;
  composition?: IStade | null;
}

export const defaultValue: Readonly<IImageStade> = {};
