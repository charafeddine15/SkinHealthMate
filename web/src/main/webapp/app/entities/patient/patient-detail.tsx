import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './patient.reducer';

export const PatientDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const patientEntity = useAppSelector(state => state.patient.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="patientDetailsHeading">
          <Translate contentKey="assistanteDermatologueApp.patient.detail.title">Patient</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{patientEntity.id}</dd>
          <dt>
            <span id="birthdate">
              <Translate contentKey="assistanteDermatologueApp.patient.birthdate">Birthdate</Translate>
            </span>
          </dt>
          <dd>{patientEntity.birthdate ? <TextFormat value={patientEntity.birthdate} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="adress">
              <Translate contentKey="assistanteDermatologueApp.patient.adress">Adress</Translate>
            </span>
          </dt>
          <dd>{patientEntity.adress}</dd>
          <dt>
            <span id="genre">
              <Translate contentKey="assistanteDermatologueApp.patient.genre">Genre</Translate>
            </span>
          </dt>
          <dd>{patientEntity.genre}</dd>
          <dt>
            <span id="telephone">
              <Translate contentKey="assistanteDermatologueApp.patient.telephone">Telephone</Translate>
            </span>
          </dt>
          <dd>{patientEntity.telephone}</dd>
          <dt>
            <Translate contentKey="assistanteDermatologueApp.patient.user">User</Translate>
          </dt>
          <dd>{patientEntity.user ? patientEntity.user.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/patient" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/patient/${patientEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default PatientDetail;
