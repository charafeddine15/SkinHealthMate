import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './stade.reducer';

export const StadeDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const stadeEntity = useAppSelector(state => state.stade.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="stadeDetailsHeading">
          <Translate contentKey="assistanteDermatologueApp.stade.detail.title">Stade</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{stadeEntity.id}</dd>
          <dt>
            <span id="stade">
              <Translate contentKey="assistanteDermatologueApp.stade.stade">Stade</Translate>
            </span>
          </dt>
          <dd>{stadeEntity.stade}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="assistanteDermatologueApp.stade.description">Description</Translate>
            </span>
          </dt>
          <dd>{stadeEntity.description}</dd>
          <dt>
            <Translate contentKey="assistanteDermatologueApp.stade.composition">Composition</Translate>
          </dt>
          <dd>{stadeEntity.composition ? stadeEntity.composition.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/stade" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/stade/${stadeEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default StadeDetail;
