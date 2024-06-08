import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './rendez-vous.reducer';

export const RendezVousDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const rendezVousEntity = useAppSelector(state => state.rendezVous.entity);
  return (
    <Row className="p-2 card p-4">
      <Col md="8">
        <h2 data-cy="rendezVousDetailsHeading">
          <Translate contentKey="assistanteDermatologueApp.rendezVous.detail.title">RendezVous</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{rendezVousEntity.id}</dd>
          <dt>
            <span id="dateDebut">
              <Translate contentKey="assistanteDermatologueApp.rendezVous.dateDebut">Date Debut</Translate>
            </span>
          </dt>
          <dd>
            {rendezVousEntity.dateDebut ? <TextFormat value={rendezVousEntity.dateDebut} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="dateFin">
              <Translate contentKey="assistanteDermatologueApp.rendezVous.dateFin">Date Fin</Translate>
            </span>
          </dt>
          <dd>{rendezVousEntity.dateFin ? <TextFormat value={rendezVousEntity.dateFin} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="statut">
              <Translate contentKey="assistanteDermatologueApp.rendezVous.statut">Statut</Translate>
            </span>
          </dt>
          <dd>{rendezVousEntity.statut ? 'Confirmed' : 'Waiting'}</dd>
          <dt>
            <Translate contentKey="assistanteDermatologueApp.rendezVous.dermatologues">Dermatologues</Translate>
          </dt>
          <dd>{rendezVousEntity.dermatologues ? rendezVousEntity.dermatologues.id : ''}</dd>
          <dt>
            <Translate contentKey="assistanteDermatologueApp.rendezVous.patients">Patients</Translate>
          </dt>
          <dd>{rendezVousEntity.patients ? rendezVousEntity.patients.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/rendez-vous" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/rendez-vous/${rendezVousEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default RendezVousDetail;
