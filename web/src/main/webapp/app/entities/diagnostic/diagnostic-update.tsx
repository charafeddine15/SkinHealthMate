import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm, ValidatedBlobField } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IConsultation } from 'app/shared/model/consultation.model';
import { getEntities as getConsultations } from 'app/entities/consultation/consultation.reducer';
import { IDiagnostic } from 'app/shared/model/diagnostic.model';
import { getEntity, updateEntity, createEntity, reset } from './diagnostic.reducer';

export const DiagnosticUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const consultations = useAppSelector(state => state.consultation.entities);
  const diagnosticEntity = useAppSelector(state => state.diagnostic.entity);
  const loading = useAppSelector(state => state.diagnostic.loading);
  const updating = useAppSelector(state => state.diagnostic.updating);
  const updateSuccess = useAppSelector(state => state.diagnostic.updateSuccess);

  const handleClose = () => {
    navigate('/diagnostic');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getConsultations({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  // eslint-disable-next-line complexity
  const saveEntity = values => {
    values.dateDiagnostic = convertDateTimeToServer(values.dateDiagnostic);
    if (values.probability !== undefined && typeof values.probability !== 'number') {
      values.probability = Number(values.probability);
    }

    const entity = {
      ...diagnosticEntity,
      ...values,
      consultations: consultations.find(it => it.id.toString() === values.consultations.toString()),
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
          dateDiagnostic: displayDefaultDateTime(),
        }
      : {
          ...diagnosticEntity,
          dateDiagnostic: convertDateTimeFromServer(diagnosticEntity.dateDiagnostic),
          consultations: diagnosticEntity?.consultations?.id,
        };

  return (
    <div className="p-2 card p-4">
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="assistanteDermatologueApp.diagnostic.home.createOrEditLabel" data-cy="DiagnosticCreateUpdateHeading">
            <Translate contentKey="assistanteDermatologueApp.diagnostic.home.createOrEditLabel">Create or edit a Diagnostic</Translate>
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
                  id="diagnostic-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                  hidden={true}
                />
              ) : null}
              <ValidatedField
                label={translate('assistanteDermatologueApp.diagnostic.dateDiagnostic')}
                id="diagnostic-dateDiagnostic"
                name="dateDiagnostic"
                data-cy="dateDiagnostic"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                hidden={true}
              />
              <ValidatedBlobField
                label={translate('assistanteDermatologueApp.diagnostic.picture')}
                id="diagnostic-picture"
                name="picture"
                data-cy="picture"
                isImage
                accept="image/*"
                readOnly={true}
              />
              <ValidatedField
                label={translate('assistanteDermatologueApp.diagnostic.description')}
                id="diagnostic-description"
                name="description"
                data-cy="description"
                type="text"
              />
              <ValidatedField
                label={translate('assistanteDermatologueApp.diagnostic.prescription')}
                id="diagnostic-prescription"
                name="prescription"
                data-cy="prescription"
                type="textarea"
              />
              <ValidatedField
                label={translate('assistanteDermatologueApp.diagnostic.probability')}
                id="diagnostic-probability"
                name="probability"
                data-cy="probability"
                type="text"
                hidden={true}
              />
              <ValidatedField
                id="diagnostic-consultations"
                name="consultations"
                data-cy="consultations"
                label={translate('assistanteDermatologueApp.diagnostic.consultations')}
                type="select"
                hidden={true}
              >
                <option value="" key="0" />
                {consultations
                  ? consultations.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/diagnostic" replace color="info">
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

export default DiagnosticUpdate;
