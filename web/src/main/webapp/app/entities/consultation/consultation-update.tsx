import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IRendezVous } from 'app/shared/model/rendez-vous.model';
import { getEntities as getRendezVous } from 'app/entities/rendez-vous/rendez-vous.reducer';
import { IConsultation } from 'app/shared/model/consultation.model';
import { getEntity, updateEntity, createEntity, reset } from './consultation.reducer';

export const ConsultationUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const rendezVous = useAppSelector(state => state.rendezVous.entities);
  const consultationEntity = useAppSelector(state => state.consultation.entity);
  const loading = useAppSelector(state => state.consultation.loading);
  const updating = useAppSelector(state => state.consultation.updating);
  const updateSuccess = useAppSelector(state => state.consultation.updateSuccess);

  const handleClose = () => {
    navigate('/consultation');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getRendezVous({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  // eslint-disable-next-line complexity
  const saveEntity = values => {
    values.dateConsultation = convertDateTimeToServer(values.dateConsultation);

    const entity = {
      ...consultationEntity,
      ...values,
      rendezVous: rendezVous.find(it => it.id.toString() === values.rendezVous.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          dateConsultation: displayDefaultDateTime(),
        }
      : {
          ...consultationEntity,
          dateConsultation: convertDateTimeFromServer(consultationEntity.dateConsultation),
          rendezVous: consultationEntity?.rendezVous?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="assistanteDermatologueApp.consultation.home.createOrEditLabel" data-cy="ConsultationCreateUpdateHeading">
            <Translate contentKey="assistanteDermatologueApp.consultation.home.createOrEditLabel">Create or edit a Consultation</Translate>
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
                  id="consultation-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('assistanteDermatologueApp.consultation.dateConsultation')}
                id="consultation-dateConsultation"
                name="dateConsultation"
                data-cy="dateConsultation"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                id="consultation-rendezVous"
                name="rendezVous"
                data-cy="rendezVous"
                label={translate('assistanteDermatologueApp.consultation.rendezVous')}
                type="select"
              >
                <option value="" key="0" />
                {rendezVous
                  ? rendezVous.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/consultation" replace color="info">
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

export default ConsultationUpdate;
