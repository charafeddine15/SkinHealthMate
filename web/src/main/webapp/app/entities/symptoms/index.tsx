import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Symptoms from './symptoms';
import SymptomsDetail from './symptoms-detail';
import SymptomsUpdate from './symptoms-update';
import SymptomsDeleteDialog from './symptoms-delete-dialog';

const SymptomsRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Symptoms />} />
    <Route path="new" element={<SymptomsUpdate />} />
    <Route path=":id">
      <Route index element={<SymptomsDetail />} />
      <Route path="edit" element={<SymptomsUpdate />} />
      <Route path="delete" element={<SymptomsDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default SymptomsRoutes;
