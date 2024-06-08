import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './dermatologue.reducer';

export const DermatologueDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const dermatologueEntity = useAppSelector(state => state.dermatologue.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="dermatologueDetailsHeading">
          <Translate contentKey="assistanteDermatologueApp.dermatologue.detail.title">Dermatologue</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{dermatologueEntity.id}</dd>
          <dt>
            <span id="codeEmp">
              <Translate contentKey="assistanteDermatologueApp.dermatologue.codeEmp">Code Emp</Translate>
            </span>
          </dt>
          <dd>{dermatologueEntity.codeEmp}</dd>
          <dt>
            <span id="genre">
              <Translate contentKey="assistanteDermatologueApp.dermatologue.genre">Genre</Translate>
            </span>
          </dt>
          <dd>{dermatologueEntity.genre}</dd>
          <dt>
            <span id="telephone">
              <Translate contentKey="assistanteDermatologueApp.dermatologue.telephone">Telephone</Translate>
            </span>
          </dt>
          <dd>{dermatologueEntity.telephone}</dd>
          <dt>Full name</dt>
          <dd>{dermatologueEntity.user ? dermatologueEntity.user.firstName + ' ' + dermatologueEntity.user.lastName : ''}</dd>
        </dl>
        <Button tag={Link} to="/dermatologue" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/dermatologue/${dermatologueEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default DermatologueDetail;
