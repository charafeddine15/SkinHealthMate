import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IMaladie } from 'app/shared/model/maladie.model';
import { getEntities as getMaladies } from 'app/entities/maladie/maladie.reducer';
import { IStade } from 'app/shared/model/stade.model';
import { getEntity, updateEntity, createEntity, reset } from './stade.reducer';

export const StadeUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const maladies = useAppSelector(state => state.maladie.entities);
  const stadeEntity = useAppSelector(state => state.stade.entity);
  const loading = useAppSelector(state => state.stade.loading);
  const updating = useAppSelector(state => state.stade.updating);
  const updateSuccess = useAppSelector(state => state.stade.updateSuccess);

  const handleClose = () => {
    navigate('/stade');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getMaladies({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  // eslint-disable-next-line complexity
  const saveEntity = values => {
    const entity = {
      ...stadeEntity,
      ...values,
      composition: maladies.find(it => it.id.toString() === values.composition.toString()),
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
          ...stadeEntity,
          composition: stadeEntity?.composition?.id,
        };

  return (
    <div className="p-2 card p-4">
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="assistanteDermatologueApp.stade.home.createOrEditLabel" data-cy="StadeCreateUpdateHeading">
            <Translate contentKey="assistanteDermatologueApp.stade.home.createOrEditLabel">Create or edit a Stade</Translate>
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
                  id="stade-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('assistanteDermatologueApp.stade.stade')}
                id="stade-stade"
                name="stade"
                data-cy="stade"
                type="text"
              />
              <ValidatedField
                label={translate('assistanteDermatologueApp.stade.description')}
                id="stade-description"
                name="description"
                data-cy="description"
                type="text"
              />
              <ValidatedField
                id="stade-composition"
                name="composition"
                data-cy="composition"
                label={translate('assistanteDermatologueApp.stade.composition')}
                type="select"
              >
                <option value="" key="0" />
                {maladies
                  ? maladies.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/stade" replace color="info">
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

export default StadeUpdate;
