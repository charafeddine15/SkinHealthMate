import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Dermatologue from './dermatologue';
import Patient from './patient';
import Secretaire from './secretaire';
import RendezVous from './rendez-vous';
import Consultation from './consultation';
import Diagnostic from './diagnostic';
import Maladie from './maladie';
import Stade from './stade';
import ImageStade from './image-stade';
import Symptoms from './symptoms';
import ListePatients from './dermatologue/ListePatients';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}

        <Route path="dermatologue/*" element={<Dermatologue />} />
        <Route path="patient/*" element={<Patient />} />
        <Route path="secretaire/*" element={<Secretaire />} />
        <Route path="rendez-vous/*" element={<RendezVous />} />
        <Route path="consultation/*" element={<Consultation />} />
        <Route path="diagnostic/*" element={<Diagnostic />} />
        <Route path="maladie/*" element={<Maladie />} />
        <Route path="stade/*" element={<Stade />} />
        <Route path="image-stade/*" element={<ImageStade />} />
        <Route path="symptoms/*" element={<Symptoms />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
