import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useNavigation } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './consultation.reducer';
import $ from 'jquery';
import 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-responsive-dt/js/responsive.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
import { redirect } from 'react-router';

export const Consultation = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const consultationList = useAppSelector(state => state.consultation.entities);
  const loading = useAppSelector(state => state.consultation.loading);
  const userData = JSON.parse(sessionStorage.getItem('user_data'));

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
    if (consultationList.length > 0) {
      const table = $('#myTable').DataTable();
      table.order([0, 'desc']).draw();
      return () => {
        table.destroy();
      };
    }
  }, [consultationList]);

  useEffect(() => {
    sortEntities();
  }, [sortState.order, sortState.sort]);

  const sort = p => () => {
    setSortState({
      ...sortState,
      order: sortState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = sortState.sort;
    const order = sortState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    } else {
      return order === ASC ? faSortUp : faSortDown;
    }
  };

  const toNavigate = (id, patient) => {
    sessionStorage.setItem('consultation_id', id);
    sessionStorage.setItem('patientName', patient);
    navigate('/diagnostic');
  };

  return (
    <div className="p-2">
      <h2 id="consultation-heading" data-cy="ConsultationHeading">
        <Translate contentKey="assistanteDermatologueApp.consultation.home.title">Consultations</Translate>
        <div className="d-flex justify-content-end">
          {/*<Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>*/}
          {/*  <FontAwesomeIcon icon="sync" spin={loading} />{' '}*/}
          {/*  <Translate contentKey="assistanteDermatologueApp.consultation.home.refreshListLabel">Refresh List</Translate>*/}
          {/*</Button>*/}
          {/*<Link to="/consultation/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">*/}
          {/*  <FontAwesomeIcon icon="plus" />*/}
          {/*  &nbsp;*/}
          {/*  <Translate contentKey="assistanteDermatologueApp.consultation.home.createLabel">Create new Consultation</Translate>*/}
          {/*</Link>*/}
        </div>
      </h2>
      <div className="table-responsive">
        {consultationList && consultationList.length > 0 ? (
          <table className="table table-responsive p-3" id="myTable">
            <thead>
              <tr>
                <th className="hand" onClick={sort('dateConsultation')}>
                  <Translate contentKey="assistanteDermatologueApp.consultation.dateConsultation">Date Consultation</Translate>{' '}
                  {/*<FontAwesomeIcon icon={getSortIconByFieldName('dateConsultation')} />*/}
                </th>
                <th>Hour</th>
                <th>Patient</th>
                <th>Patient phone</th>
                <th>Doctor</th>

                <th />
              </tr>
            </thead>
            <tbody>
              {consultationList.map((consultation, i) =>
                consultation.rendezVous.dermatologue.user.id === userData.id ? (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>{consultation.dateConsultation ? new Date(consultation.dateConsultation).toLocaleDateString() : null}</td>
                    <td>
                      {consultation.dateConsultation
                        ? new Date(consultation.dateConsultation).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : null}
                    </td>

                    <td>
                      {consultation.rendezVous ? (
                        <Link to={`/rendez-vous/${consultation.rendezVous.id}`}>
                          {consultation.rendezVous.patient.user.firstName + ' ' + consultation.rendezVous.patient.user.lastName}
                        </Link>
                      ) : (
                        ''
                      )}
                    </td>
                    <td>
                      {consultation.rendezVous ? (
                        <Link to={`/rendez-vous/${consultation.rendezVous.id}`}>{consultation.rendezVous.patient.telephone}</Link>
                      ) : (
                        ''
                      )}
                    </td>
                    <td>
                      {consultation.rendezVous ? (
                        <Link to={`/rendez-vous/${consultation.rendezVous.id}`}>
                          {consultation.rendezVous.dermatologue.user.firstName + ' ' + consultation.rendezVous.dermatologue.user.lastName}
                        </Link>
                      ) : (
                        ''
                      )}
                    </td>
                    <td className="text-end">
                      <div className="btn-group flex-btn-group-container">
                        <Button
                          // tag={Link}
                          // to={`/diagnostic?consultationId=${consultation.id}&patientName=${consultation.rendezVous.patient.user.firstName} ${consultation.rendezVous.patient.user.lastName}`}
                          color="primary"
                          size="sm"
                          data-cy="entityEditButton"
                          onClick={() => {
                            toNavigate(
                              consultation.id,
                              consultation.rendezVous.patient.user.firstName + ' ' + consultation.rendezVous.patient.user.lastName,
                            );
                          }}
                        >
                          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Diagnostic</span>
                        </Button>

                        {/* <Button tag={Link} to={`/consultation/${consultation.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          Diagnostic
                        </span>
                      </Button> */}
                        <Button
                          onClick={() => (location.href = `/consultation/${consultation.id}/delete`)}
                          color="danger"
                          size="sm"
                          data-cy="entityDeleteButton"
                        >
                          <FontAwesomeIcon icon="trash" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.delete">Delete</Translate>
                          </span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : null,
              )}
            </tbody>
          </table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="assistanteDermatologueApp.consultation.home.notFound">No Consultations found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Consultation;
