import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Secretaire from './secretaire';
import SecretaireDetail from './secretaire-detail';
import SecretaireUpdate from './secretaire-update';
import SecretaireDeleteDialog from './secretaire-delete-dialog';

const SecretaireRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Secretaire />} />
    <Route path="new" element={<SecretaireUpdate />} />
    <Route path=":id">
      <Route index element={<SecretaireDetail />} />
      <Route path="edit" element={<SecretaireUpdate />} />
      <Route path="delete" element={<SecretaireDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default SecretaireRoutes;
