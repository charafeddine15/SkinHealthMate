import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IDiagnostic } from 'app/shared/model/diagnostic.model';
import { getEntities as getDiagnostics } from 'app/entities/diagnostic/diagnostic.reducer';
import { IMaladie } from 'app/shared/model/maladie.model';
import { getEntity, updateEntity, createEntity, reset } from './maladie.reducer';

export const MaladieUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const diagnostics = useAppSelector(state => state.diagnostic.entities);
  const maladieEntity = useAppSelector(state => state.maladie.entity);
  const loading = useAppSelector(state => state.maladie.loading);
  const updating = useAppSelector(state => state.maladie.updating);
  const updateSuccess = useAppSelector(state => state.maladie.updateSuccess);
  //
  const handleClose = () => {
    navigate('/maladie');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getDiagnostics({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  // eslint-disable-next-line complexity
  const saveEntity = values => {
    const entity = {
      ...maladieEntity,
      ...values,
      diagnostics: diagnostics.find(it => it.id.toString() === values.diagnostics.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...maladieEntity,
          diagnostics: maladieEntity?.diagnostics?.id,
        };

  return (
    <div className="p-2 card p-4">
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="assistanteDermatologueApp.maladie.home.createOrEditLabel" data-cy="MaladieCreateUpdateHeading">
            <Translate contentKey="assistanteDermatologueApp.maladie.home.createOrEditLabel">Create or edit a Maladie</Translate>
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
                  id="maladie-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('assistanteDermatologueApp.maladie.fullName')}
                id="maladie-fullName"
                name="fullName"
                data-cy="fullName"
                type="text"
              />
              <ValidatedField
                label={translate('assistanteDermatologueApp.maladie.abbr')}
                id="maladie-abbr"
                name="abbr"
                data-cy="abbr"
                type="text"
              />
              <ValidatedField
                id="maladie-diagnostics"
                name="diagnostics"
                data-cy="diagnostics"
                label={translate('assistanteDermatologueApp.maladie.diagnostics')}
                type="select"
              >
                <option value="" key="0" />
                {diagnostics
                  ? diagnostics.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/maladie" replace color="info">
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

export default MaladieUpdate;
