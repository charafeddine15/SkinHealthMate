import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { openFile, byteSize, Translate, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './image-stade.reducer';

export const ImageStade = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const imageStadeList = useAppSelector(state => state.imageStade.entities);
  const loading = useAppSelector(state => state.imageStade.loading);

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

  return (
    <div className="p-2 card p-4">
      <h2 id="image-stade-heading" data-cy="ImageStadeHeading">
        <Translate contentKey="assistanteDermatologueApp.imageStade.home.title">Image Stades</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="assistanteDermatologueApp.imageStade.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/image-stade/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="assistanteDermatologueApp.imageStade.home.createLabel">Create new Image Stade</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {imageStadeList && imageStadeList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="assistanteDermatologueApp.imageStade.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('picture')}>
                  <Translate contentKey="assistanteDermatologueApp.imageStade.picture">Picture</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('picture')} />
                </th>
                <th>
                  <Translate contentKey="assistanteDermatologueApp.imageStade.composition">Composition</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {imageStadeList.map((imageStade, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/image-stade/${imageStade.id}`} color="link" size="sm">
                      {imageStade.id}
                    </Button>
                  </td>
                  <td>
                    {imageStade.picture ? (
                      <div>
                        {imageStade.pictureContentType ? (
                          <a onClick={openFile(imageStade.pictureContentType, imageStade.picture)}>
                            <img src={`data:${imageStade.pictureContentType};base64,${imageStade.picture}`} style={{ maxHeight: '30px' }} />
                            &nbsp;
                          </a>
                        ) : null}
                        <span>
                          {imageStade.pictureContentType}, {byteSize(imageStade.picture)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>
                    {imageStade.composition ? <Link to={`/stade/${imageStade.composition.id}`}>{imageStade.composition.id}</Link> : ''}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/image-stade/${imageStade.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/image-stade/${imageStade.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => (location.href = `/image-stade/${imageStade.id}/delete`)}
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
              <Translate contentKey="assistanteDermatologueApp.imageStade.home.notFound">No Image Stades found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ImageStade;
