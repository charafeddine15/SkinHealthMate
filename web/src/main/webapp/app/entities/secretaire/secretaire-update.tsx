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
import { ISecretaire } from 'app/shared/model/secretaire.model';
import { getEntity, updateEntity, createEntity, reset } from './secretaire.reducer';

export const SecretaireUpdate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const users = useAppSelector(state => state.userManagement.users);
  // localStorage.setItem('Users', users);
  const secretaireEntity = useAppSelector(state => state.secretaire.entity);
  const loading = useAppSelector(state => state.secretaire.loading);
  const updating = useAppSelector(state => state.secretaire.updating);
  const updateSuccess = useAppSelector(state => state.secretaire.updateSuccess);

  const handleClose = () => {
    navigate('/secretaire');
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
    // localStorage.setItem("SecretaryUser",secretaireEntity.user);

    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  // eslint-disable-next-line complexity
  const saveEntity = values => {
    const entity = {
      ...secretaireEntity,
      ...values,
      user: users.find(it => it.id.toString() === values.user.toString()),
    };

    if (isNew) {
      dispatch(createEntity(formData));
    } else {
      dispatch(updateEntity(entity));
    }
    // localStorage.setItem('SecretaireUser', JSON.stringify(entity.user));
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...secretaireEntity,
          user: secretaireEntity?.user,
        };

  const [formData, setFormData] = useState({
    secretaire: {
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

  //
  return (
    <div className="p-2 card p-4">
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="assistanteDermatologueApp.secretaire.home.createOrEditLabel" data-cy="SecretaireCreateUpdateHeading">
            <Translate contentKey="assistanteDermatologueApp.secretaire.home.createOrEditLabel">Create or edit a Secretaire</Translate>
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
                  id="secretaire-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                  hidden={true}
                />
              ) : null}
              <ValidatedField
                label={translate('assistanteDermatologueApp.secretaire.codeEmp')}
                id="secretaire-codeEmp"
                name="codeEmp"
                data-cy="codeEmp"
                type="text"
                onChange={e => {
                  if (isNew) {
                    setFormData({
                      ...formData,
                      secretaire: { ...formData.secretaire, codeEmp: e.target.value },
                    });
                  }
                }}
              />
              <ValidatedField
                label="Gender"
                id="secretaire-genre"
                name="genre"
                data-cy="genre"
                type="select"
                onChange={e => {
                  if (isNew) {
                    setFormData({
                      ...formData,
                      secretaire: { ...formData.secretaire, genre: e.target.value },
                    });
                  }
                }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </ValidatedField>
              <ValidatedField
                label="Phone"
                id="secretaire-telephone"
                name="telephone"
                data-cy="telephone"
                type="text"
                onChange={e => {
                  if (isNew) {
                    setFormData({
                      ...formData,
                      secretaire: { ...formData.secretaire, telephone: e.target.value },
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
                label="email"
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
              {/* <ValidatedField
                id="secretaire-user"
                name="user"
                data-cy="user"
                label={translate('assistanteDermatologueApp.secretaire.user')}
                type="select"
              >
                <option value="" key="0" />
                {users
                  ? users.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField> */}
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/secretaire" replace color="info">
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

export default SecretaireUpdate;
