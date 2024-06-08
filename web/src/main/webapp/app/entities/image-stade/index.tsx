import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ImageStade from './image-stade';
import ImageStadeDetail from './image-stade-detail';
import ImageStadeUpdate from './image-stade-update';
import ImageStadeDeleteDialog from './image-stade-delete-dialog';

const ImageStadeRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ImageStade />} />
    <Route path="new" element={<ImageStadeUpdate />} />
    <Route path=":id">
      <Route index element={<ImageStadeDetail />} />
      <Route path="edit" element={<ImageStadeUpdate />} />
      <Route path="delete" element={<ImageStadeDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ImageStadeRoutes;
