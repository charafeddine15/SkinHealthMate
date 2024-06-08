import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { openFile, byteSize, Translate, TextFormat, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import DiagnosticModel from './DiagnosticModel';
import { getEntities } from './diagnostic.reducer';
const headerColor = {
  backgroundColor: '#54B4D3',
};
export const Diagnostic = () => {
  const dispatch = useAppDispatch();
  const [isModelOpen, setIsModelOpen] = useState(false);
  const toggleModel = () => {
    setIsModelOpen(!isModelOpen);
  };

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const diagnosticList = useAppSelector(state => state.diagnostic.entities);
  const loading = useAppSelector(state => state.diagnostic.loading);
  // const location = useLocation();
  const searchParams = new URLSearchParams(pageLocation.search);
  const consultationId = searchParams.get('consultationId');
  const patientName = searchParams.get('patientName');

  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `${sortState.sort},${sortState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    setIsModelOpen(false);

    // const endURL = `?sort=${sortState.sort},${sortState.order}`;
    // if (pageLocation.search !== endURL) {
    //   navigate(`${pageLocation.pathname}${endURL}`);
    // }
  };

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
    setIsModelOpen(false);
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
    <div>
      <h2 id="diagnostic-heading" data-cy="DiagnosticHeading">
        Diagnostics for Patient : {patientName}
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="assistanteDermatologueApp.diagnostic.home.refreshListLabel">Refresh List</Translate>
          </Button>

          <Button color="primary" onClick={toggleModel}>
            New diagnostic
          </Button>
          <DiagnosticModel isOpen={isModelOpen} toggle={toggleModel} isNew={true} />
          {/* <Link to="/diagnostic/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="assistanteDermatologueApp.diagnostic.home.createLabel">Create new Diagnostic</Translate>
          </Link> */}
        </div>
      </h2>
      <div className="table-responsive">
        {diagnosticList && diagnosticList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                {/* <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="assistanteDermatologueApp.diagnostic.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th> */}
                <th className="hand" onClick={sort('dateDiagnostic')}>
                  <Translate contentKey="assistanteDermatologueApp.diagnostic.dateDiagnostic">Date Diagnostic</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('dateDiagnostic')} />
                </th>
                <th className="hand" onClick={sort('picture')}>
                  <Translate contentKey="assistanteDermatologueApp.diagnostic.picture">Picture</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('picture')} />
                </th>
                <th className="hand" onClick={sort('description')}>
                  <Translate contentKey="assistanteDermatologueApp.diagnostic.description">Description</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('description')} />
                </th>
                <th className="hand" onClick={sort('prescription')}>
                  <Translate contentKey="assistanteDermatologueApp.diagnostic.prescription">Prescription</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('prescription')} />
                </th>
                <th className="hand" onClick={sort('probability')}>
                  <Translate contentKey="assistanteDermatologueApp.diagnostic.probability">Probability</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('probability')} />
                </th>
                {/* <th>
                  <Translate contentKey="assistanteDermatologueApp.diagnostic.consultations">Consultations</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th> */}
                <th />
              </tr>
            </thead>
            <tbody>
              {diagnosticList.map((diagnostic, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  {/* <td>
                    <Button tag={Link} to={`/diagnostic/${diagnostic.id}`} color="link" size="sm">
                      {diagnostic.id}
                    </Button>
                  </td> */}
                  <td>
                    {diagnostic.dateDiagnostic ? (
                      <TextFormat type="date" value={diagnostic.dateDiagnostic} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>
                    {diagnostic.picture ? (
                      <div>
                        {diagnostic.pictureContentType ? (
                          <a onClick={openFile(diagnostic.pictureContentType, diagnostic.picture)}>
                            <img src={`data:${diagnostic.pictureContentType};base64,${diagnostic.picture}`} style={{ maxHeight: '30px' }} />
                            &nbsp;
                          </a>
                        ) : null}
                        <span>
                          {diagnostic.pictureContentType}, {byteSize(diagnostic.picture)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>{diagnostic.description}</td>
                  <td>{diagnostic.prescription}</td>
                  <td>{diagnostic.probability}</td>
                  {/* <td>
                    {diagnostic.consultations ? (
                      <Link to={`/consultation/${diagnostic.consultations.id}`}>{diagnostic.consultations.id}</Link>
                    ) : (
                      ''
                    )}
                  </td> */}
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/diagnostic/${diagnostic.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/diagnostic/${diagnostic.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => (location.href = `/diagnostic/${diagnostic.id}/delete`)}
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
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="assistanteDermatologueApp.diagnostic.home.notFound">No Diagnostics found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Diagnostic;
