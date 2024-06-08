import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Maladie from './maladie';
import MaladieDetail from './maladie-detail';
import MaladieUpdate from './maladie-update';
import MaladieDeleteDialog from './maladie-delete-dialog';
import MyForm from 'app/components/MyForm';
import MaladieCreate from 'app/components/maladie/MaladieCreate';

const MaladieRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Maladie />} />
    {/*<Route path="new" element={<MaladieUpdate />} />*/}
    <Route path="new" element={<MaladieCreate />} />
    {/*<Route path="new" element={<MyForm />} />*/}
    <Route path=":id">
      <Route index element={<MaladieDetail />} />
      <Route path="edit" element={<MaladieUpdate />} />
      <Route path="delete" element={<MaladieDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default MaladieRoutes;
