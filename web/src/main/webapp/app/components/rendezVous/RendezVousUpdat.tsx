import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getDermatologues } from 'app/entities/dermatologue/dermatologue.reducer';
import { getEntities as getPatients } from 'app/entities/patient/patient.reducer';
import { getEntity, updateEntity, createEntity, reset } from '../../entities/rendez-vous/rendez-vous.reducer';

const RendezVousUpdat = () => {
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

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

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

  const [selectedValues, setSelectedValues] = useState({
    patients: defaultValues().patients || '',
    dermatologues: defaultValues().dermatologues || '',
    dateDebut: defaultValues().dateDebut || displayDefaultDateTime(),
    dateFin: defaultValues().dateFin || displayDefaultDateTime(),
  });

  const handleInputChange = (name, value) => {
    setSelectedValues(prevState => ({ ...prevState, [name]: value }));
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
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
    if (updateSuccess && currentStep === totalSteps + 1) {
      handleClose();
    }
  }, [updateSuccess, currentStep]);

  const handleClose = () => {
    navigate('/rendez-vous');
  };

  const saveEntity = values => {
    values.dateDebut = convertDateTimeToServer(values.dateDebut);
    values.dateFin = convertDateTimeToServer(values.dateFin);
    const entity = {
      ...rendezVousEntity,
      ...values,
      dermatologues: dermatologues.find(it => it.id.toString() === values.dermatologues),
      patients: patients.find(it => it.id.toString() === values.patients),
    };

    console.log(entity);
    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <ValidatedField
              id="rendez-vous-patients"
              name="patients"
              label="Patient"
              type="select"
              value={selectedValues.patients}
              onChange={e => handleInputChange('patients', e.target.value)}
            >
              <option value="" />
              {patients
                ? patients.map(otherEntity => (
                    <option value={otherEntity.id} key={otherEntity.id}>
                      {otherEntity.user ? otherEntity.user.firstName + ' ' + otherEntity.user.lastName : ''}
                    </option>
                  ))
                : null}
            </ValidatedField>
            <Button color="primary" onClick={nextStep}>
              Next
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <ValidatedField
              id="rendez-vous-dermatologues"
              name="dermatologues"
              label="Dermatologist"
              type="select"
              value={selectedValues.dermatologues}
              onChange={e => {
                handleInputChange('dermatologues', e.target.value);
                console.log(e.target.value);
              }}
            >
              <option value="" />
              {dermatologues
                ? dermatologues.map(otherEntity => (
                    <option value={otherEntity.id} key={otherEntity.id}>
                      {otherEntity.user ? otherEntity.user.firstName + ' ' + otherEntity.user.lastName : ''}
                    </option>
                  ))
                : null}
            </ValidatedField>
            <Button color="secondary" onClick={prevStep}>
              Previous
            </Button>
            <Button color="primary" onClick={nextStep}>
              Next
            </Button>
          </>
        );
      case 3:
        return (
          <>
            <ValidatedField
              label="Start date"
              id="rendez-vous-dateDebut"
              name="dateDebut"
              type="datetime-local"
              placeholder="YYYY-MM-DD HH:mm"
              value={selectedValues.dateDebut}
              onChange={e => handleInputChange('dateDebut', e.target.value)}
            />
            <ValidatedField
              label="End date"
              id="rendez-vous-dateFin"
              name="dateFin"
              type="datetime-local"
              placeholder="YYYY-MM-DD HH:mm"
              value={selectedValues.dateFin}
              onChange={e => handleInputChange('dateFin', e.target.value)}
            />
            <Button color="secondary" onClick={prevStep}>
              Previous
            </Button>
            <Button color="primary" type="submit">
              Save
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="assistanteDermatologueApp.rendezVous.home.createOrEditLabel">Create or edit an appointment</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
                {renderStep()}
              </ValidatedForm>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default RendezVousUpdat;
