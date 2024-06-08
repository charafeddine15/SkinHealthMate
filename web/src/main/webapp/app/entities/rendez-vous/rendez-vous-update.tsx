import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IDermatologue } from 'app/shared/model/dermatologue.model';
import { getEntities as getDermatologues } from 'app/entities/dermatologue/dermatologue.reducer';
import { IPatient } from 'app/shared/model/patient.model';
import { getEntities as getPatients } from 'app/entities/patient/patient.reducer';
import { IRendezVous } from 'app/shared/model/rendez-vous.model';
import { getEntity, updateEntity, createEntity, reset } from './rendez-vous.reducer';

export const RendezVousUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const dermatologues = useAppSelector(state => state.dermatologue.entities);
  const patients = useAppSelector(state => state.patient.entities);
  const rendezVousEntity = useAppSelector(state => state.rendezVous.entity);
  const loading = useAppSelector(state => state.rendezVous.loading);
  const updating = useAppSelector(state => state.rendezVous.updating);
  const updateSuccess = useAppSelector(state => state.rendezVous.updateSuccess);

  const handleClose = () => {
    navigate('/rendez-vous');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getDermatologues({}));
    dispatch(getPatients({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  // eslint-disable-next-line complexity
  const saveEntity = values => {
    values.dateDebut = convertDateTimeToServer(values.dateDebut);
    values.dateFin = convertDateTimeToServer(values.dateFin);

    const entity = {
      ...rendezVousEntity,
      ...values,
      dermatologues: dermatologues.find(it => it.id.toString() === values.dermatologues.toString()),
      patients: patients.find(it => it.id.toString() === values.patients.toString()),
    };

    if (isNew) {
      console.log('ELBAHJA hahiya entity');
      console.log(entity);
      console.log(entity);
      console.log(entity);
      console.log(entity);
      console.log(entity);
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          dateDebut: displayDefaultDateTime(),
          dateFin: displayDefaultDateTime(),
        }
      : {
          ...rendezVousEntity,
          dateDebut: convertDateTimeFromServer(rendezVousEntity.dateDebut),
          dateFin: convertDateTimeFromServer(rendezVousEntity.dateFin),
          dermatologues: rendezVousEntity?.dermatologues?.id,
          patients: rendezVousEntity?.patients?.id,
        };

  return (
    <div className="p-2 card p-4">
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="assistanteDermatologueApp.rendezVous.home.createOrEditLabel" data-cy="RendezVousCreateUpdateHeading">
            Create or edit a appointment
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="rendez-vous-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                  hidden={true}
                />
              ) : null}
              <ValidatedField
                label="Start date"
                id="rendez-vous-dateDebut"
                name="dateDebut"
                data-cy="dateDebut"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label="End date"
                id="rendez-vous-dateFin"
                name="dateFin"
                data-cy="dateFin"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              {/* <ValidatedField
                label={translate('assistanteDermatologueApp.rendezVous.statut')}
                id="rendez-vous-statut"
                name="statut"
                data-cy="statut"
                check
                type="checkbox"
              /> */}
              <ValidatedField
                id="rendez-vous-dermatologues"
                name="dermatologues"
                data-cy="dermatologues"
                label="Dermatologist"
                type="select"
              >
                <option value="" key="0" />
                {dermatologues
                  ? dermatologues.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.user ? otherEntity.user.firstName + ' ' + otherEntity.user.lastName : ''}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField id="rendez-vous-patients" name="patients" data-cy="patients" label="Patient" type="select">
                <option value="" key="0" />
                {patients
                  ? patients.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.user ? otherEntity.user.firstName + ' ' + otherEntity.user.lastName : ''}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/rendez-vous" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default RendezVousUpdate;
