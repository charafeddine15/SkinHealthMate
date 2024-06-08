import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './symptoms.reducer';

export const SymptomsDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const symptomsEntity = useAppSelector(state => state.symptoms.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="symptomsDetailsHeading">
          <Translate contentKey="assistanteDermatologueApp.symptoms.detail.title">Symptoms</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{symptomsEntity.id}</dd>
          <dt>
            <span id="nom">
              <Translate contentKey="assistanteDermatologueApp.symptoms.nom">Nom</Translate>
            </span>
          </dt>
          <dd>{symptomsEntity.nom}</dd>
        </dl>
        <Button tag={Link} to="/symptoms" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/symptoms/${symptomsEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default SymptomsDetail;
