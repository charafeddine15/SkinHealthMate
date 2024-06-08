import React, { useState, useEffect, useMemo } from 'react';
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
import {
  Week,
  Month,
  Day,
  WorkWeek,
  TimelineViews,
  TimelineMonth,
  Agenda,
  ScheduleComponent,
  Inject,
} from '@syncfusion/ej2-react-schedule';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-buttons/styles/material.css';
import '@syncfusion/ej2-react-calendars/styles/material.css';
import '@syncfusion/ej2-react-dropdowns/styles/material.css';
import '@syncfusion/ej2-react-inputs/styles/material.css';
import '@syncfusion/ej2-react-popups/styles/material.css';
import '@syncfusion/ej2-react-schedule/styles/material.css';
import Select from 'react-select';
import './form.css';
import axios from 'axios';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';
import { isBefore } from 'date-fns';
export const CreateRendezVous = () => {
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
  const [daysDisplay, setDaysDisplay] = useState(false);
  const [monthDisplay, setMonthDisplay] = useState(false);
  const [dateSelected, setDateSelected] = useState<Date | undefined>(new Date());
  const [dateDebutRdv, setDateDebutRdv] = useState();
  const [dateFinRdv, setDateFinRdv] = useState();
  const [eventSettings, setEventSettings] = useState([]);
  const [eventSettingsOff, setEventSettingsOff] = useState([]);
  const [timesExclude, setTimeExclude] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState();
  const [daysOfMonthSelected, setDaysOfMonthSelected] = useState(false);
  const [selectedDermatologue, setSelectedDermatologue] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();

  // const [dateSelected, setDateSelected] = useState();

  const handleClose = () => {
    navigate('/rendez-vous');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
      const keepItem1 = 'user_data';
      const keepItem2 = 'jhi-authenticationToken';
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const key = sessionStorage.key(i);
        if (key !== keepItem1 && key !== keepItem2) {
          sessionStorage.removeItem(key);
        }
      }
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
    const date_debut = sessionStorage.getItem('date_debut');
    const dermatologue_id = sessionStorage.getItem('selectedDermatologueId');
    const patient_id = sessionStorage.getItem('selectedPatientId');
    console.log('date_debut____date_debut: ', date_debut);
    const date_fin = sessionStorage.getItem('date_fin');
    values.dateDebut = convertDateTimeToServer(date_debut); //values.dateDebut

    values.dateFin = convertDateTimeToServer(date_fin); //values.dateFin

    const entity = {
      ...rendezVousEntity,
      ...values,
      dermatologues: dermatologues.find(it => it.id.toString() === values.dermatologues.toString()),
      patients: patients.find(it => it.id.toString() === values.patients.toString()),
    };

    if (isNew && entity.dermatologues != null && entity.patients != null && entity.dateDebut != null) {
      const keepItem1 = 'user_data';
      const keepItem2 = 'jhi-authenticationToken';
      const keepItem3 = 'selectedDermatologue';
      const keepItem4 = 'selectedPatient';
      const keepItem5 = 'date_debut';
      const keepItem6 = 'date_fin';
      const keepItem7 = 'AppointmentHours';

      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const key = sessionStorage.key(i);
        if (
          key !== keepItem1 &&
          key !== keepItem2 &&
          key !== keepItem3 &&
          key !== keepItem4 &&
          key !== keepItem7 &&
          key !== keepItem5 &&
          key !== keepItem6
        ) {
          sessionStorage.removeItem(key);
        }
      }
      console.log(entity);
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
    setDaysOfMonthSelected(false);
    setDaysDisplay(true);
    setMonthDisplay(false);
    const keepItem1 = 'user_data';
    const keepItem2 = 'jhi-authenticationToken';
    const keepItem3 = 'selectedDermatologue';
    const keepItem4 = 'selectedPatient';
    const keepItem5 = 'date_debut';
    const keepItem6 = 'date_fin'; //
    const keepItem7 = 'AppointmentHours';

    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (
        key !== keepItem1 &&
        key !== keepItem2 &&
        key !== keepItem3 &&
        key !== keepItem4 &&
        key !== keepItem5 &&
        key !== keepItem6 &&
        key !== keepItem7
      ) {
        sessionStorage.removeItem(key);
      }
    }
  };
  const handleDermatologueChange = event => {
    const selectedValue = event.target.value;
    setSelectedDermatologue(selectedValue);
    sessionStorage.setItem('selectedDermatologue', selectedValue);
  };
  const handlePatientChange = event => {
    const selectedValue = event.target.value;
    setSelectedPatient(selectedValue);
    sessionStorage.setItem('selectedPatient', selectedValue);
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

  const handleCellClick = async (event, args) => {
    event.preventDefault();
    const dateClicked = args instanceof Date ? args : new Date(args);

    // Extract the date
    const year = dateClicked.getFullYear();
    const month = dateClicked.getMonth() + 1; // Months are 0-indexed
    const day = dateClicked.getDate();

    // Format the date as needed
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    console.log('Date clicked BY ME:', formattedDate);

    sessionStorage.setItem('Clicked_date', formattedDate);

    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();
    const ChooseDate = new Date(new Date(args).getFullYear(), new Date(args).getMonth(), new Date(args).getDate()).getTime();
    const ChooseDate2 = new Date(new Date(args).getDay());
    console.log('ChooseDate: ', ChooseDate);
    console.log('times 1 : ', today, ' times 2 : ', ChooseDate);
    if (ChooseDate < today) {
      alert('Please choose a valid date');
      return;
    }
    const formatDate2 = `${new Date(args).getFullYear()}${new Date(args).getMonth()}${new Date(args).getDate()}`;
    setDateSelected(args ? new Date(args) : undefined);
    const excludeTimeList = [];
    for (let day of eventSettings) {
      const formatDate1 = `${new Date(day.StartTime).getFullYear()}${new Date(day.StartTime).getMonth()}${new Date(
        day.StartTime,
      ).getDate()}`;
      // console.log("today1: ",formatDate1);
      if (formatDate2 == formatDate1) {
        const formatTime = `${new Date(day.StartTime).getHours().toString().padStart(2, '0')}:${new Date(day.StartTime)
          .getMinutes()
          .toString()
          .padStart(2, '0')}`;
        excludeTimeList.push(formatTime);
      }
    }
    console.log('today2: ', formatDate2);
    console.log('datehhhhhh: ', excludeTimeList);
    setTimeExclude(excludeTimeList);
    setDateSelected(args);
    setDaysOfMonthSelected(true);
    setDaysDisplay(true);
    setMonthDisplay(false);
  };

  function MonthButtonGroup({ daysOff }) {
    const [daysOfMonth, setDaysOfMonth] = useState([]);
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    useEffect(() => {
      const today = new Date();
      const firstDayOfMonth = startOfMonth(today);
      const lastDayOfMonth = endOfMonth(today);
      const listDate = [];
      const days = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
      for (let day of days) {
        const formatDay = `${new Date(day).getFullYear()}${new Date(day).getMonth()}${new Date(day).getDate()}`;
        if (!daysOff.includes(formatDay)) {
          listDate.push(day);
        }
        // console.log(formatDay)
      }
      setDaysOfMonth(listDate);
    }, []);

    return (
      <div className="button-container">
        <h2 className="day-title">DAYS OF THE MONTH ({monthNames[new Date().getMonth()]})</h2>
        <div className="button-group">
          {daysOfMonth.map(day => (
            <button key={day} className="day-button" onClick={event => handleCellClick(event, day)} disabled={isBefore(day, currentDate)}>
              {format(day, 'dd')}
            </button>
          ))}
        </div>
      </div>
    );
  }

  function generateTimeSlots(appointmentHours) {
    const timeSlots = [];
    let currentHour = 6;
    let currentMinute = 0;

    while (currentHour <= 17 || (currentHour === 17 && currentMinute <= 30)) {
      const formattedHour = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      const isAppointmentHour = appointmentHours.includes(formattedHour);

      timeSlots.push({
        time: formattedHour,
        isAppointmentHour: isAppointmentHour,
      });

      currentMinute += 30;
      if (currentMinute === 60) {
        currentMinute = 0;
        currentHour += 1;
      }
    }

    return timeSlots;
  }

  function TimeSlotPicker() {
    const appointementHoursSelected = sessionStorage.getItem('AppointmentHours');
    // console.log("appointementHoursSelected:", appointementHoursSelected);

    const appointmentHours = appointementHoursSelected ? JSON.parse(appointementHoursSelected) : [];
    // const timeSlots = generateTimeSlots(appointmentHours);
    const [timeSlots, setTimeSlots] = useState(generateTimeSlots(appointmentHours));
    // console.log("generateTimeSlots: ",generateTimeSlots(appointmentHours))
    // const [selectedTimeSlot, setSelectedTimeSlot] = useState();
    const rdvHoure = sessionStorage.getItem('rdv_hour');
    // const rdvHour =rdvHoure ? JSON.parse(rdvHoure) : '';
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(rdvHoure);
    useEffect(() => {
      // Regenerate time slots when dateSelected changes
      const newTimeSlots = generateTimeSlots(appointmentHours);
      setTimeSlots(newTimeSlots);
    }, [appointmentHours, dateSelected]);

    const handleTimeSlotClick = async (event, timeSlot) => {
      event.preventDefault();
      const heure = timeSlot.split(':');
      await setSelectedTimeSlot(timeSlot);
      console.log('====> : ', heure);
      const formatDate = dateSelected
        ? new Date(dateSelected.getFullYear(), dateSelected.getMonth(), dateSelected.getDate(), parseInt(heure[0]), parseInt(heure[1]))
        : null;
      console.log('AMINE-houre: ', formatDate);
      const actual_hour = `${formatDate.getHours().toString().padStart(2, '0')}:${formatDate.getMinutes().toString().padStart(2, '0')}`;
      console.log('actual hour: ', actual_hour);
      sessionStorage.setItem('rdv_hour', actual_hour);
      formatDate.setHours(formatDate.getHours() + 1);

      // Convert the date to the desired format (ISO 8601)
      const formattedDate = formatDate.toISOString();
      sessionStorage.setItem('date_debut', formattedDate);
      console.log('Date-Time-debut-rendez-vous: ', formattedDate);
      formatDate.setMinutes(formatDate.getMinutes() + 30);
      const formattedDateFin = formatDate.toISOString();
      sessionStorage.setItem('date_fin', formattedDateFin);
      console.log('Date-Time-fin-rendez-vous: ', formattedDateFin);

      if (formatDate) {
        const formatDate2 = new Date(formatDate);
        formatDate2.setMinutes(formatDate2.getMinutes() + 30);
      }

      console.log(selectedTimeSlot);
    };

    return (
      <div className="hour-container">
        <div>
          {timeSlots.map((timeSlot, index) => (
            <button
              key={index}
              onClick={event => handleTimeSlotClick(event, timeSlot.time)}
              className={timeSlot.isAppointmentHour ? 'appointment-hour' : selectedTimeSlot === timeSlot.time ? 'selected' : 'notSelected'}
              disabled={timeSlot.isAppointmentHour}
            >
              {timeSlot.time}
            </button>
          ))}
        </div>
        <p>
          <span className="hour-selected">Selected timeslot : </span> {selectedTimeSlot || 'Aucun'}
        </p>
      </div>
    );
  }

  async function fetchData() {
    const clickedDate = sessionStorage.getItem('Clicked_date');

    try {
      // const getRendezvousConfirmed = await axios.get(`/api/rendez-vous/dermatologue/6561f3665b5a615b11e0091d`);
      const selectedDermatologue = sessionStorage.getItem('selectedDermatologue');
      const getRendezvousConfirmed = await axios.get(`/api/rendez-vous/dermatologue/${selectedDermatologue}`);

      const filteredData = getRendezvousConfirmed.data.filter(item => {
        const dateDebut = new Date(item.dateDebut);
        const itemDate = dateDebut.toISOString().split('T')[0];
        return itemDate === clickedDate;
      });
      const AppointmentHours = filteredData.map(item => {
        const dateDebut = new Date(item.dateDebut);
        const hoursUTC = dateDebut.getUTCHours().toString().padStart(2, '0');
        const minutesUTC = dateDebut.getUTCMinutes().toString().padStart(2, '0');
        return `${hoursUTC}:${minutesUTC}`;
      });

      const appointementHoursString = JSON.stringify(AppointmentHours);
      sessionStorage.setItem('AppointmentHours', appointementHoursString);
      console.log('AppointmentHours(hhhh): ', appointementHoursString);
      // sessionStorage.setItem('AppointmentHours', appointementHoursString);

      // sessionStorage.setItem('AppointmentHours', AppointmentHours);

      console.log('Filtered Data:', filteredData);
      console.log('Appointements hours Data:', AppointmentHours);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    //   const getRendezvousConfirmed = await axios.get(`/api/rendez-vous/dermatologue/6561f3665b5a615b11e0091d`);
    //   const dateDebut = new Date(getRendezvousConfirmed.data[0].dateDebut);
    //   const timeString = dateDebut.toISOString().split('T')[1].split('.')[0];
    //   const hoursUTC = dateDebut.getUTCHours().toString().padStart(2, '0');
    //   const minutesUTC = dateDebut.getUTCMinutes().toString().padStart(2, '0');
    //   const houreRdv = `${hoursUTC}:${minutesUTC}`;
    //   console.log("info: ", getRendezvousConfirmed.data[0].dateDebut);
    //   const date = dateDebut.toISOString().split('T')[0];
    // //   const clickedDate = sessionStorage.getItem('Clicked_date');
    //   console.log('Clicked Date:', clickedDate);
    //   console.log("info by the clicked date: ", );
    //   console.log("myDate: ",date);

    //   console.log("dateDebut: ", dateDebut);
    //   console.log("Houre appointement: ", houreRdv);
    // } catch (error) {
    //   console.error('Error fetching data:', error);
    // }
  }

  // Call the async function
  fetchData();

  return (
    <div className="p-2 card p-4">
      <Row className="justify-content-center">
        <Col md="4">
          <h1 id="assistanteDermatologueApp.rendezVous.home.createOrEditLabel" data-cy="RendezVousCreateUpdateHeading">
            Create an appointment
          </h1>
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
                id="rendez-vous-dermatologues"
                name="dermatologues"
                data-cy="dermatologues"
                label="Dermatologist"
                type="select"
                value={selectedDermatologue}
                onChange={handleDermatologueChange}
              >
                <option value="choose a dermatologue" key="0" />
                {dermatologues
                  ? dermatologues.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.user ? otherEntity.user.firstName + ' ' + otherEntity.user.lastName : ''}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              {/* <div className="form-field">
                    {<MonthButtonGroup daysOff={eventSettingsOff} />}
                </div>
                <div>
                {<TimeSlotPicker />}

            </div> */}
              <div className="form-field">{daysOfMonthSelected ? <TimeSlotPicker /> : <MonthButtonGroup daysOff={eventSettingsOff} />}</div>
              {/* <ValidatedField
              label="Start date"
              id="rendez-vous-dateDebut"
              name="dateDebut"
              data-cy="dateDebut"
              // type="datetime-local"
              placeholder="YYYY-MM-DD HH:mm"
              defaultValue={date_debut}
              validate={{ required: true }}
            />

            <ValidatedField
              label="End date"
              id="rendez-vous-dateFin"
              name="dateFin"
              data-cy="dateFin"
              // type="datetime-local"
              placeholder="YYYY-MM-DD HH:mm"
              defaultValue={date_fin}
              validate={{ required: true }}
            /> */}
              <ValidatedField
                id="rendez-vous-patients"
                name="patients"
                data-cy="patients"
                label="Patient"
                type="select"
                value={selectedPatient}
                onChange={handlePatientChange}
              >
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

export default CreateRendezVous;
