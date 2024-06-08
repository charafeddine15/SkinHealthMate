import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { getEntities } from './rendez-vous.reducer';
import axios from 'axios';
import $ from 'jquery';
import 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-responsive-dt/js/responsive.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
const headerColor = {
  backgroundColor: '#54B4D3',
};
export const PatientRendezVous = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const rendezVousList = useAppSelector(state => state.rendezVous.entities);
  const loading = useAppSelector(state => state.rendezVous.loading);
  const userData = JSON.parse(sessionStorage.getItem('user_data'));
  const [patientRendezVous, setPatientRendezVous] = useState([]);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `${sortState.sort},${sortState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?sort=${sortState.sort},${sortState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [sortState.order, sortState.sort]);
  useEffect(() => {
    if (rendezVousList.length > 0) {
      const table = $('#myTable').DataTable();
      table.order([2, 'desc']).draw();
      return () => {
        table.destroy();
      };
    }
  }, [rendezVousList]);
  const sort = p => () => {
    setSortState({
      ...sortState,
      order: sortState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };
  const loadPatientAppointements = () => {
    // console.log(id);
    axios
      .get('/api/rendez-vous/patient/rdvs/' + userData.id)
      .then(response => {
        console.log(response.data);
        setPatientRendezVous(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleSyncList = () => {
    sortEntities();
  };
  useEffect(() => {
    loadPatientAppointements();
  }, []);

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = sortState.sort;
    const order = sortState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    } else {
      return order === ASC ? faSortUp : faSortDown;
    }
  };

  return (
    <div className="p-2 card">
      <h2 id="rendez-vous-heading" data-cy="RendezVousHeading" className="card-header">
        My Appointments
      </h2>
      <div className="card-body">
        {patientRendezVous && patientRendezVous.length > 0 ? (
          <table className="table table-responsive p-3" id="myTable">
            <thead>
              <tr style={headerColor}>
                {/*<th className="hand" onClick={sort('id')}>*/}
                {/*  <Translate contentKey="assistanteDermatologueApp.rendezVous.id">ID</Translate>{' '}*/}
                {/*  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />*/}
                {/*</th>*/}
                <th>Patient</th>
                <th>Dermatologue</th>
                <th>Phone</th>

                <th className="hand">Date</th>
                <th className="hand">Hour</th>
                <th className="hand">Status</th>
              </tr>
            </thead>
            <tbody>
              {patientRendezVous.map((rendezVous, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  {/*<td>*/}
                  {/*  <Button tag={Link} to={`/rendez-vous/${rendezVous.id}`} color="link" size="sm">*/}
                  {/*    {rendezVous.id}*/}
                  {/*  </Button>*/}
                  {/*</td>*/}
                  <td>{rendezVous.dermatologue.user ? rendezVous.patient.user.firstName + ' ' + rendezVous.patient.user.lastName : ' '}</td>
                  <td>{rendezVous.dermatologue.user.firstName + ' ' + rendezVous.dermatologue.user.lastName}</td>
                  <td>{rendezVous.dermatologue.telephone}</td>
                  <td>{rendezVous.dateFin ? new Date(rendezVous.dateFin).toLocaleDateString() : null}</td>
                  <td>
                    {rendezVous.dateFin
                      ? new Date(new Date(rendezVous.dateDebut).getTime() - 60 * 60 * 1000).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : null}
                  </td>

                  <td>{rendezVous.statut ? 'Confirmed' : 'Waiting'}</td>

                  {/* {rendezVous.patients.id} */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="assistanteDermatologueApp.rendezVous.home.notFound">No Rendez Vous found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PatientRendezVous;
