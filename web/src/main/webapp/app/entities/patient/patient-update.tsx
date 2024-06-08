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
import { IPatient } from 'app/shared/model/patient.model';
import { getEntity, updateEntity, createEntity, reset } from './patient.reducer';

export const PatientUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const users = useAppSelector(state => state.userManagement.users);
  const patientEntity = useAppSelector(state => state.patient.entity);
  const loading = useAppSelector(state => state.patient.loading);
  const updating = useAppSelector(state => state.patient.updating);
  const updateSuccess = useAppSelector(state => state.patient.updateSuccess);

  const handleClose = () => {
    navigate('/patient');
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
    values.birthdate = convertDateTimeToServer(values.birthdate);

    const entity = {
      ...patientEntity,
      ...values,
      user: users.find(it => it.id.toString() === values.user.toString()),
    };

    if (isNew) {
      console.log(formData);
      dispatch(createEntity(formData));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const handleDatetimeLocalChange = e => {
    if (isNew) {
      const datetimeLocalValue = e.target.value;
      const selectedDate = new Date(datetimeLocalValue);
      const instantValue = selectedDate.toISOString();

      setFormData({
        ...formData,
        patient: {
          ...formData.patient,
          birthdate: instantValue,
        },
      });
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          birthdate: displayDefaultDateTime(),
        }
      : {
          ...patientEntity,
          birthdate: convertDateTimeFromServer(patientEntity.birthdate),
          user: patientEntity?.user?.id,
        };

  const [formData, setFormData] = useState({
    patient: {
      birthdate: '',
      telephone: '',
      genre: 'male',
      adress: '',
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

  return (
    <div className="p-2 card p-4">
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="assistanteDermatologueApp.patient.home.createOrEditLabel" data-cy="PatientCreateUpdateHeading">
            <Translate contentKey="assistanteDermatologueApp.patient.home.createOrEditLabel">Create or edit a Patient</Translate>
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
                  id="patient-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                  hidden={true}
                />
              ) : null}
              <ValidatedField
                label={translate('assistanteDermatologueApp.patient.birthdate')}
                id="patient-birthdate"
                name="birthdat"
                data-cy="birthdat"
                type="datetime-local"
                placeholder="YYYY-MM-DD"
                onChange={handleDatetimeLocalChange}
              />
              <ValidatedField
                label={translate('assistanteDermatologueApp.patient.adress')}
                id="patient-adress"
                name="adress"
                data-cy="adress"
                type="text"
                onChange={e => {
                  if (isNew) {
                    setFormData({
                      ...formData,
                      patient: { ...formData.patient, adress: e.target.value },
                    });
                  }
                }}
              />
              {/*<ValidatedField*/}
              {/*  label={translate('assistanteDermatologueApp.patient.genre')}*/}
              {/*  id="patient-genre"*/}
              {/*  name="genre"*/}
              {/*  data-cy="genre"*/}
              {/*  type="text"*/}
              {/*/>*/}
              <ValidatedField
                id="patient-user"
                name="genre"
                data-cy="genre"
                label="Gender"
                type="select"
                onChange={e => {
                  if (isNew) {
                    setFormData({
                      ...formData,
                      patient: { ...formData.patient, genre: e.target.value },
                    });
                  }
                }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </ValidatedField>
              <ValidatedField
                label="Phone"
                id="patient-telephone"
                name="telephone"
                data-cy="telephone"
                type="text"
                onChange={e => {
                  if (isNew) {
                    setFormData({
                      ...formData,
                      patient: { ...formData.patient, telephone: e.target.value },
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
                  name="user.password"
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
              {/*<ValidatedField*/}
              {/*  id="patient-user"*/}
              {/*  name="user"*/}
              {/*  data-cy="user"*/}
              {/*  label={translate('assistanteDermatologueApp.patient.user')}*/}
              {/*  type="select"*/}
              {/*>*/}
              {/*  <option value="" key="0" />*/}
              {/*  {users*/}
              {/*    ? users.map(otherEntity => (*/}
              {/*        <option value={otherEntity.id} key={otherEntity.id}>*/}
              {/*          {otherEntity.id}*/}
              {/*        </option>*/}
              {/*      ))*/}
              {/*    : null}*/}
              {/*</ValidatedField>*/}
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/patient" replace color="info">
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

export default PatientUpdate;
