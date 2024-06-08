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
const buttonContainerStyle = {
  display: 'flex',
  alignItems: 'center',
};

const buttonStyle = {
  marginRight: '10px',
};
const headerColor = {
  backgroundColor: '#54B4D3',
};
export const RendezVous = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const rendezVousList = useAppSelector(state => state.rendezVous.entities);
  const loading = useAppSelector(state => state.rendezVous.loading);

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
      table.order([0, 'desc'], [1, 'asc']).draw();
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

  const handleChangeStatus = id => {
    axios
      .put(`/api/rendez-vous/${id}/change-status`)
      .then(response => {
        console.log('Status changed successfully', response.data);
        getAllEntities();
      })
      .catch(error => {
        console.error('Error changing status', error);
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

  return (
    <div className="p-2 card">
      <h2 id="rendez-vous-heading" data-cy="RendezVousHeading" className="card-header">
        Appointments
        <div className="d-flex justify-content-end">
          {/*<Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>*/}
          {/*  <FontAwesomeIcon icon="sync" spin={loading} />{' '}*/}
          {/*  <Translate contentKey="assistanteDermatologueApp.rendezVous.home.refreshListLabel">Refresh List</Translate>*/}
          {/*</Button>*/}
          <Link
            to="/rendez-vous/newRendezVous"
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create new appointment
          </Link>
        </div>
      </h2>
      <div className="card-body">
        {rendezVousList && rendezVousList.length > 0 ? (
          <table className="table table-responsive p-3" id="myTable">
            <thead>
              <tr>
                {/*<th className="hand" onClick={sort('id')}>*/}
                {/*  <Translate contentKey="assistanteDermatologueApp.rendezVous.id">ID</Translate>{' '}*/}
                {/*  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />*/}
                {/*</th>*/}
                <th className="hand" onClick={sort('dateDebut')}>
                  Date
                  <FontAwesomeIcon icon={getSortIconByFieldName('dateDebut')} />
                </th>
                <th className="hand" onClick={sort('dateFin')}>
                  Hour
                  <FontAwesomeIcon icon={getSortIconByFieldName('dateFin')} />
                </th>
                <th className="hand" onClick={sort('statut')}>
                  Status <FontAwesomeIcon icon={getSortIconByFieldName('statut')} />
                </th>
                <th>
                  <Translate contentKey="assistanteDermatologueApp.rendezVous.dermatologues">Dermatologues</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="assistanteDermatologueApp.rendezVous.patients">Patients</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rendezVousList.map((rendezVous, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  {/*<td>*/}
                  {/*  <Button tag={Link} to={`/rendez-vous/${rendezVous.id}`} color="link" size="sm">*/}
                  {/*    {rendezVous.id}*/}
                  {/*  </Button>*/}
                  {/*</td>*/}
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
                  <td>
                    {rendezVous.dermatologue.user
                      ? rendezVous.dermatologue.user.firstName + ' ' + rendezVous.dermatologue.user.lastName
                      : ' '}
                  </td>
                  {/* {rendezVous.patients.id} */}
                  <td>{rendezVous.dermatologue.user ? rendezVous.patient.user.firstName + ' ' + rendezVous.patient.user.lastName : ' '}</td>
                  <td className="text-end">
                    <div className="flex-btn-group-container" style={buttonContainerStyle}>
                      {rendezVous.statut == false && (
                        <Button onClick={() => handleChangeStatus(rendezVous.id)} color="success" size="sm" style={buttonStyle}>
                          <FontAwesomeIcon icon={faCheck} /> <span className="d-none d-md-inline">Confirm</span>
                        </Button>
                      )}
                      {/* <Button tag={Link} to={`/rendez-vous/${rendezVous.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/rendez-vous/${rendezVous.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button> */}
                      <Button
                        onClick={() => (location.href = `/rendez-vous/${rendezVous.id}/delete`)}
                        color="danger"
                        size="sm"
                        style={buttonStyle}
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

export default RendezVous;
