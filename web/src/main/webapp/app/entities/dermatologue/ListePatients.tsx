import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './dermatologue.reducer';
import axios from 'axios';

export const ListePatients = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const [ListePatients, setListePatients] = useState([]);
  const loading = useAppSelector(state => state.dermatologue.loading);

  const fetchPatientData = id => {
    axios
      .get(`/api/dermatologuePatients/${id}`)
      .then(response => {
        setListePatients(response.data);
      })
      .catch(error => {
        console.error('Error fetching patient data', error);
      });
  };

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

  //   useEffect(() => {
  //     sortEntities();
  //   }, [sortState.order, sortState.sort]);
  useEffect(() => {
    getAllEntities();
    const userData = JSON.parse(sessionStorage.getItem('user_data'));
    const dermatologueId = userData ? userData.id : null;

    if (dermatologueId) {
      fetchPatientData(dermatologueId);
    }
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

  const showData = () => {
    console.log(ListePatients);
  };

  return (
    <div>
      <h2 id="dermatologue-heading" data-cy="DermatologueHeading">
        Patients Liste
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="assistanteDermatologueApp.dermatologue.home.refreshListLabel">Refresh List</Translate>
          </Button>
          {/* <Link to="/dermatologue/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="assistanteDermatologueApp.dermatologue.home.createLabel"></Translate>
          </Link> */}
        </div>
      </h2>
      <div className="table-responsive">
        {ListePatients && ListePatients.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>First name</th>
                <th>Last name</th>
              </tr>
            </thead>
            <tbody>
              {ListePatients.map((patient, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  {/* <td>
                    <Button tag={Link} to={`/dermatologue/${dermatologue.id}`} color="link" size="sm">
                      {dermatologue.id}
                    </Button>
                  </td> */}
                  <td>{patient.patient.user.firstName}</td>
                  <td>{patient.patient.user.lastName}</td>

                  {/*<td>{dermatologue.user ? dermatologue.user : ''}</td>*/}
                  {/* <td>{patient.user ? dermatologue.user.firstName + ' ' + dermatologue.user.lastName : ''}</td> */}
                  {/* <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/dermatologue/${dermatologue.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/dermatologue/${dermatologue.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => (location.href = `/dermatologue/${dermatologue.id}/delete`)}
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
                  </td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="assistanteDermatologueApp.dermatologue.home.notFound">No Patients found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ListePatients;
