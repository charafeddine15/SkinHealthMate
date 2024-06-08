import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Stade from './stade';
import StadeDetail from './stade-detail';
import StadeUpdate from './stade-update';
import StadeDeleteDialog from './stade-delete-dialog';

const StadeRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Stade />} />
    <Route path="new" element={<StadeUpdate />} />
    <Route path=":id">
      <Route index element={<StadeDetail />} />
      <Route path="edit" element={<StadeUpdate />} />
      <Route path="delete" element={<StadeDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default StadeRoutes;
