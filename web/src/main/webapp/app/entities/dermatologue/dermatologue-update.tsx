import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { IDermatologue } from 'app/shared/model/dermatologue.model';
import { getEntity, updateEntity, createEntity, reset } from './dermatologue.reducer';
import axios, { AxiosError, AxiosResponse } from 'axios';

export const DermatologueUpdate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const users = useAppSelector(state => state.userManagement.users);
  const dermatologueEntity = useAppSelector(state => state.dermatologue.entity);
  const loading = useAppSelector(state => state.dermatologue.loading);
  const updating = useAppSelector(state => state.dermatologue.updating);
  const updateSuccess = useAppSelector(state => state.dermatologue.updateSuccess);

  const handleClose = () => {
    navigate('/dermatologue');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getUsers({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  // eslint-disable-next-line complexity
  const saveEntity = values => {
    console.log('ELBAHJA >>>>>>>>>>>>');
    console.log(values);
    const entity = {
      ...dermatologueEntity,
      ...values,
      user: users.find(it => it.id.toString() === values.user.toString()),
    };

    if (isNew) {
      dispatch(createEntity(formData));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...dermatologueEntity,
          user: dermatologueEntity?.user,
        };

  const [formData, setFormData] = useState({
    dermatologue: {
      codeEmp: '',
      telephone: '',
      genre: '',
    },
    user: {
      login: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      activated: true,
      langKey: 'en',
    },
  });

  const showData = () => {
    console.log(defaultValues());
  };
  return (
    <div className="p-2 card p-4">
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="assistanteDermatologueApp.dermatologue.home.createOrEditLabel" data-cy="DermatologueCreateUpdateHeading">
            <Translate contentKey="assistanteDermatologueApp.dermatologue.home.createOrEditLabel">Create or edit a Dermatologue</Translate>
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
                  id="dermatologue-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                  hidden={true}
                />
              ) : null}
              <ValidatedField
                label="Employee code"
                id="dermatologue-codeEmp"
                name="codeEmp"
                data-cy="codeEmp"
                type="text"
                onChange={e => {
                  if (isNew) {
                    setFormData({
                      ...formData,
                      dermatologue: { ...formData.dermatologue, codeEmp: e.target.value },
                    });
                  }
                }}
              />
              <ValidatedField id="dermatologue-user" name="genre" data-cy="genre" label="Gender" type="select">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </ValidatedField>
              {/*<ValidatedField*/}
              {/*  label={translate('assistanteDermatologueApp.dermatologue.genre')}*/}
              {/*  id="dermatologue-genre"*/}
              {/*  name="genre"*/}
              {/*  data-cy="genre"*/}
              {/*  type="text"*/}
              {/*  onChange={e => {*/}
              {/*    if (isNew) {*/}
              {/*      setFormData({*/}
              {/*        ...formData,*/}
              {/*        dermatologue: { ...formData.dermatologue, genre: e.target.value },*/}
              {/*      });*/}
              {/*    }*/}
              {/*  }}*/}
              {/*/>*/}
              <ValidatedField
                label="Phone"
                id="dermatologue-telephone"
                name="telephone"
                data-cy="telephone"
                type="text"
                onChange={e => {
                  if (isNew) {
                    setFormData({
                      ...formData,
                      dermatologue: { ...formData.dermatologue, telephone: e.target.value },
                    });
                  }
                }}
              />
              <ValidatedField
                label="Login"
                // label={translate('assistanteDermatologueApp.dermatologue.user.login')}
                id="login"
                name="user.login"
                data-cy="user.login"
                type="text"
                readOnly={!isNew}
                onChange={e => {
                  if (isNew) {
                    setFormData({
                      ...formData,
                      user: { ...formData.user, login: e.target.value },
                    });
                  }
                }}
              />
              {isNew && (
                <ValidatedField
                  label="Password"
                  id="password"
                  name="user.passwword"
                  data-cy="user.password"
                  type="password"
                  hidden={!isNew}
                  onChange={e => {
                    if (isNew) {
                      setFormData({
                        ...formData,
                        user: { ...formData.user, password: e.target.value },
                      });
                    }
                  }}
                />
              )}
              <ValidatedField
                label="Email"
                // label={translate('assistanteDermatologueApp.dermatologue.user.login')}
                id="lastName"
                name="user.email"
                data-cy="user.email"
                type="text"
                onChange={e => {
                  if (isNew) {
                    setFormData({
                      ...formData,
                      user: { ...formData.user, email: e.target.value },
                    });
                  }
                }}
              />
              <ValidatedField
                label="First name"
                // label={translate('assistanteDermatologueApp.dermatologue.user.login')}
                id="firstName"
                name="user.firstName"
                data-cy="user.firstName"
                type="text"
                onChange={e => {
                  if (isNew) {
                    setFormData({
                      ...formData,
                      user: { ...formData.user, firstName: e.target.value },
                    });
                  }
                }}
              />
              <ValidatedField
                label="Last name"
                // label={translate('assistanteDermatologueApp.dermatologue.user.login')}
                id="lastName"
                name="user.lastName"
                data-cy="user.lastName"
                type="text"
                onChange={e => {
                  if (isNew) {
                    setFormData({
                      ...formData,
                      user: { ...formData.user, lastName: e.target.value },
                    });
                  }
                }}
              />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/dermatologue" replace color="info">
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

export default DermatologueUpdate;
