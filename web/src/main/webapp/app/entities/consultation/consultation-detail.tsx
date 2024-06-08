import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './consultation.reducer';

export const ConsultationDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const consultationEntity = useAppSelector(state => state.consultation.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="consultationDetailsHeading">
          <Translate contentKey="assistanteDermatologueApp.consultation.detail.title">Consultation</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{consultationEntity.id}</dd>
          <dt>
            <span id="dateConsultation">
              <Translate contentKey="assistanteDermatologueApp.consultation.dateConsultation">Date Consultation</Translate>
            </span>
          </dt>
          <dd>
            {consultationEntity.dateConsultation ? (
              <TextFormat value={consultationEntity.dateConsultation} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="assistanteDermatologueApp.consultation.rendezVous">Rendez Vous</Translate>
          </dt>
          <dd>{consultationEntity.rendezVous ? consultationEntity.rendezVous.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/consultation" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/consultation/${consultationEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ConsultationDetail;
