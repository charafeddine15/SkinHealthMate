import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Dermatologue from './dermatologue';
import DermatologueDetail from './dermatologue-detail';
import DermatologueUpdate from './dermatologue-update';
import DermatologueDeleteDialog from './dermatologue-delete-dialog';

const DermatologueRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Dermatologue />} />
    <Route path="new" element={<DermatologueUpdate />} />
    <Route path=":id">
      <Route index element={<DermatologueDetail />} />
      <Route path="edit" element={<DermatologueUpdate />} />
      <Route path="delete" element={<DermatologueDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default DermatologueRoutes;
