import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './secretaire.reducer';

export const SecretaireDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const secretaireEntity = useAppSelector(state => state.secretaire.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="secretaireDetailsHeading">
          <Translate contentKey="assistanteDermatologueApp.secretaire.detail.title">Secretaire</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{secretaireEntity.id}</dd>
          <dt>
            <span id="codeEmp">
              <Translate contentKey="assistanteDermatologueApp.secretaire.codeEmp">Code Emp</Translate>
            </span>
          </dt>
          <dd>{secretaireEntity.codeEmp}</dd>
          <dt>
            <span id="genre">
              <Translate contentKey="assistanteDermatologueApp.secretaire.genre">Genre</Translate>
            </span>
          </dt>
          <dd>{secretaireEntity.genre}</dd>
          <dt>
            <span id="telephone">
              <Translate contentKey="assistanteDermatologueApp.secretaire.telephone">Telephone</Translate>
            </span>
          </dt>
          <dd>{secretaireEntity.telephone}</dd>
          <dt>Full name</dt>
          <dd>{secretaireEntity.user ? secretaireEntity.user.firstName + ' ' + secretaireEntity.user.lastName : ''}</dd>
        </dl>
        <Button tag={Link} to="/secretaire" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/secretaire/${secretaireEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default SecretaireDetail;
