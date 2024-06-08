import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm, ValidatedBlobField } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IStade } from 'app/shared/model/stade.model';
import { getEntities as getStades } from 'app/entities/stade/stade.reducer';
import { IImageStade } from 'app/shared/model/image-stade.model';
import { getEntity, updateEntity, createEntity, reset } from './image-stade.reducer';

export const ImageStadeUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const stades = useAppSelector(state => state.stade.entities);
  const imageStadeEntity = useAppSelector(state => state.imageStade.entity);
  const loading = useAppSelector(state => state.imageStade.loading);
  const updating = useAppSelector(state => state.imageStade.updating);
  const updateSuccess = useAppSelector(state => state.imageStade.updateSuccess);

  const handleClose = () => {
    navigate('/image-stade');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getStades({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  // eslint-disable-next-line complexity
  const saveEntity = values => {
    const entity = {
      ...imageStadeEntity,
      ...values,
      composition: stades.find(it => it.id.toString() === values.composition.toString()),
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
          ...imageStadeEntity,
          composition: imageStadeEntity?.composition?.id,
        };

  return (
    <div className="p-2 card p-4">
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="assistanteDermatologueApp.imageStade.home.createOrEditLabel" data-cy="ImageStadeCreateUpdateHeading">
            <Translate contentKey="assistanteDermatologueApp.imageStade.home.createOrEditLabel">Create or edit a ImageStade</Translate>
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
                  id="image-stade-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedBlobField
                label={translate('assistanteDermatologueApp.imageStade.picture')}
                id="image-stade-picture"
                name="picture"
                data-cy="picture"
                isImage
                accept="image/*"
              />
              <ValidatedField
                id="image-stade-composition"
                name="composition"
                data-cy="composition"
                label={translate('assistanteDermatologueApp.imageStade.composition')}
                type="select"
              >
                <option value="" key="0" />
                {stades
                  ? stades.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/image-stade" replace color="info">
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

export default ImageStadeUpdate;
