import React from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';

import Login from 'app/modules/login/login';
import Register from 'app/modules/account/register/register';
import Activate from 'app/modules/account/activate/activate';
import PasswordResetInit from 'app/modules/account/password-reset/init/password-reset-init';
import PasswordResetFinish from 'app/modules/account/password-reset/finish/password-reset-finish';
import Logout from 'app/modules/login/logout';
import Home from 'app/modules/home/home';
import EntitiesRoutes from 'app/entities/routes';
import PrivateRoute from 'app/shared/auth/private-route';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PageNotFound from 'app/shared/error/page-not-found';
import { AUTHORITIES } from 'app/config/constants';

import Elbahja from 'app/modules/login/Elbahja';
import ListePatients from './entities/dermatologue/ListePatients';

import { useAppSelector } from 'app/config/store';
import Listpatient from 'app/components/medecin/ListPatient';
import PaginatorBasicDemo from 'app/components/medecin/PaginatorBasicDemo';
import PatientsList from './entities/dermatologue/PatientsList';
import MedicalRecord from './entities/patient/medical-record';
import PatientRendezVous from './entities/rendez-vous/patient-rendez-vous';
import PatientDossierMedical from './entities/patient/patient-medical-dossier';
import ViewMaladie from 'app/components/maladie/ViewMaladie';

// import Elbahja from "app/modules/login/Elbahja";
// import Test from "app/components/medecin/Test";

const loading = <div>loading ...</div>;

const Account = Loadable({
  loader: () => import(/* webpackChunkName: "account" */ 'app/modules/account'),
  loading: () => loading,
});

const Admin = Loadable({
  loader: () => import(/* webpackChunkName: "administration" */ 'app/modules/administration'),
  loading: () => loading,
});
const AppRoutes = () => {
  const isAuthenicated = useAppSelector(state => state.authentication.isAuthenticated);
  const data: any = sessionStorage.getItem('user_data');
  const userData = data ? JSON.parse(data) : null;

  return (
    <div className="view-routes">
      <ErrorBoundaryRoutes>
        <Route
          path="/dashboard"
          element={<Home isAuthenticated={isAuthenicated} isAdmin={userData && userData.authorities[0] === 'ROLE_ADMIN' ? true : null} />}
        />
        <Route index path="login" element={<Login />} />
        {/* Dermatologue patients Liste */}
        <Route path="/dermatologue/patientsliste" element={<PatientsList />} />
        <Route path="/medicalRecord" element={<MedicalRecord />} />
        <Route path="/patient/appointements" element={<PatientRendezVous />} />
        <Route path="/MyMedicalRecord" element={<PatientDossierMedical />} />

        <Route path="logout" element={<Logout />} />
        <Route path="account">
          <Route
            path="*"
            element={
              <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER, AUTHORITIES.SECRETAIRE, AUTHORITIES.DERMATOLOGUE]}>
                <Account />
              </PrivateRoute>
            }
          />
          {/*<Route path="register" element={<Register />} />*/}
          <Route path="activate" element={<Activate />} />
          <Route path="reset">
            <Route path="request" element={<PasswordResetInit />} />
            <Route path="finish" element={<PasswordResetFinish />} />
          </Route>
        </Route>
        <Route
          path="admin/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.DERMATOLOGUE, AUTHORITIES.SECRETAIRE]}>
              <EntitiesRoutes />
            </PrivateRoute>
          }
        />

        <Route
          path="/dermatologue/all-patient/:dermatologue_id"
          element={<Listpatient nom={'elbahja'} isAuthen={isAuthenicated} role={data ? userData.authorities : null} />}
        />
        <Route path={'/dermatologue/my-scheduler'} element={<Elbahja isAuthenticated={true} role={data ? userData.authorities : null} />} />
        {/*<Route path={'/maladies/check'} element={<ViewMaladie />} />*/}
        <Route path="*" element={<PageNotFound />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};

export default AppRoutes;
