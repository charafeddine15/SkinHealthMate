import dermatologue from 'app/entities/dermatologue/dermatologue.reducer';
import patient from 'app/entities/patient/patient.reducer';
import secretaire from 'app/entities/secretaire/secretaire.reducer';
import rendezVous from 'app/entities/rendez-vous/rendez-vous.reducer';
import consultation from 'app/entities/consultation/consultation.reducer';
import diagnostic from 'app/entities/diagnostic/diagnostic.reducer';
import maladie from 'app/entities/maladie/maladie.reducer';
import stade from 'app/entities/stade/stade.reducer';
import imageStade from 'app/entities/image-stade/image-stade.reducer';
import symptoms from 'app/entities/symptoms/symptoms.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  dermatologue,
  patient,
  secretaire,
  rendezVous,
  consultation,
  diagnostic,
  maladie,
  stade,
  imageStade,
  symptoms,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
