import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { redirect } from 'react-router';
import PageNotFound from 'app/shared/error/page-not-found';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const today = new Date();
console.log('today is' + today);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(today.getDate() + 2);

interface ElbahjaProps {
  isAuthenticated: boolean;
  role: string;
}

const Elbahja: React.FC<ElbahjaProps> = ({ isAuthenticated, role }) => {
  const userData = sessionStorage.getItem('user_data') ? sessionStorage.getItem('user_data') : null;
  const userDataJson = JSON.parse(userData);
  const id = userData ? userDataJson.id : undefined;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [events, setEvents] = useState([]);
  useEffect(() => {
    axios
      .get('/api/rendez-vous/dermatologue/' + id)
      .then(response => {
        console.log(response.data);
        // se(response.data);
        const convertedData = response.data.map(item => {
          console.log(item);
          const dateObject = new Date(item.dateDebut);
          dateObject.setHours(dateObject.getHours() - 1);
          const timeString = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          console.log(timeString);
          return {
            id: item.id,
            hour: timeString,
            adress: item.patients.adress,
            user: `${item.patientUserDTO.patient.user.firstName} ${item.patientUserDTO.patient.user.lastName}`,
            title: `${timeString} / ${item.patientUserDTO.patient.user.firstName}  ${item.patientUserDTO.patient.user.lastName}`,
            start: new Date(item.dateDebut),
            end: new Date(item.dateFin),
            status: item.statut,
          };
        });

        setEvents([...events, ...convertedData]);
      })
      .catch(error => {
        console.log(error.data);
      });
  }, []);

  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
  });
  const [allEvents, setAllEvents] = useState(events);
  const eventStyleGetter = (event: Event, start: Date, end: Date, isSelected: boolean) => {
    const backgroundColor = event.status ? 'green' : '#EC770F';
    return {
      style: {
        backgroundColor: backgroundColor,
      },
    };
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Function to open modal
  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setSelectedEvent(null);
    setModalOpen(false);
  };

  function handleAddEvent() {
    for (let i = 0; i < allEvents.length; i++) {
      const d1 = new Date(allEvents[i].start);
      const d2 = new Date(newEvent.start);
      const d3 = new Date(allEvents[i].end);
      const d4 = new Date(newEvent.end);

      if ((d1 <= d2 && d2 <= d3) || (d1 <= d4 && d4 <= d3)) {
        alert('CLASH');
        break;
      }
    }

    setAllEvents([...allEvents, newEvent]);
  }

  if (role == 'ROLE_DERMATOLOGUE') {
    return (
      <div className="App p-2 ">
        <h1>Calendar</h1>
        {/*<h2>Add New Event</h2>*/}
        {/*<div>*/}
        {/*  <input*/}
        {/*      type="text"*/}
        {/*      placeholder="Add Title"*/}
        {/*      style={{ width: "20%", marginRight: "10px" }}*/}
        {/*      value={newEvent.title}*/}
        {/*      onChange={(e) =>*/}
        {/*          setNewEvent({ ...newEvent, title: e.target.value })*/}
        {/*      }*/}
        {/*  />*/}
        {/*  <DatePicker*/}
        {/*      placeholderText="Start Date"*/}
        {/*      style={{ marginRight: "10px" }}*/}
        {/*      selected={newEvent.start}*/}
        {/*      showTimeSelect*/}
        {/*      dateFormat="yyyy-MM-dd HH:mm:ss"*/}
        {/*      onChange={(start) => setNewEvent({ ...newEvent, start })}*/}
        {/*  />*/}
        {/*  <DatePicker*/}
        {/*      placeholderText="End Date"*/}
        {/*      selected={newEvent.end}*/}
        {/*      showTimeSelect*/}
        {/*      dateFormat="yyyy-MM-dd HH:mm:ss"*/}
        {/*      onChange={(end) => setNewEvent({ ...newEvent, end })}*/}
        {/*  />*/}
        {/*  <button style={{ marginTop: "10px" }} onClick={handleAddEvent}>*/}
        {/*    Add Event*/}
        {/*  </button>*/}
        {/*</div>*/}
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, margin: '50px' }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={openModal}
        />

        <Modal
          keepMounted
          open={open}
          onClose={handleClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="keep-mounted-modal-title"
              variant="h6"
              component="h2"
              style={{ textAlign: 'center', backgroundColor: selectedEvent && selectedEvent.status ? 'green' : '#EC770F' }}
            >
              Appointment {selectedEvent && !selectedEvent.status && 'is not'} confirmed
            </Typography>
            <br />
            <hr />
            <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
              {selectedEvent && (
                <div>
                  <p>Patient : {selectedEvent.user}</p>
                  <p>Hour : {selectedEvent.hour}</p>
                  {/* Add more details as needed */}
                </div>
              )}
            </Typography>
          </Box>
        </Modal>
      </div>
    );
  } else {
    return <PageNotFound />;
  }
};

export default Elbahja;
