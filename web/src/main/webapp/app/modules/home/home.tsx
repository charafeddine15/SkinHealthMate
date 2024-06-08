// import './home.scss';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { Row, Col, Alert } from 'reactstrap';
// import { FaUser, FaHospital, FaClipboardList } from 'react-icons/fa'; // Import Font Awesome icons
import { Bar } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd } from '@fortawesome/free-solid-svg-icons';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import { faBiohazard } from '@fortawesome/free-solid-svg-icons';

import { useAppSelector } from 'app/config/store';

import { LineChart, AreaChart, ScatterChart, ColumnChart, PieChart } from 'react-chartkick';
import 'chartkick/chart.js';
import axios from 'axios';

const Home = ({ isAuthenticated, isAdmin }) => {
  const account = useAppSelector(state => state.authentication.account);
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [maladies, setmaladies] = useState(0);
  const [secretary, setSecretary] = useState(0);
  const [data, setData] = useState({});

  useEffect(() => {
    axios
      .get('/api/rendez-vous/statistics')
      .then(response => {
        // console.log(response.data[0])
        setDoctorsCount(response.data[0]);
        setSecretary(response.data[1]);
        setAppointmentsCount(response.data[3]);
        setmaladies(response.data[2]);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get('/api/rendez-vous/jours-du-mois')
      .then(response => {
        console.log(response);
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const [dataDermatologues, setDataDermatologues] = useState([]);
  useEffect(() => {
    axios
      .get('/api/rendez-vous/about-dermatologues')
      .then(response => {
        console.log(response.data);
        setDataDermatologues(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const timingForxtitle = () => {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 1);
    const date = currentDate.toISOString().slice(0, 10);
    return date;
  };
  if (isAuthenticated && isAdmin) {
    return (
      <div className="home" style={{ overflow: 'auto' }}>
        <div className="m-4">
          <div className="card m-4">
            <div className="card-header m-1">Dashboard</div>
            <div className="card-body">
              <Row>
                <Col md="3">
                  <div className="card">
                    <div className="card-header">
                      <FontAwesomeIcon icon={faUserMd} className="mr-2" />
                      Doctors
                    </div>
                    <div className="card-body">
                      <h3>{doctorsCount}</h3>
                    </div>
                  </div>
                </Col>
                <Col md="3">
                  <div className="card">
                    <div className="card-header">
                      <FontAwesomeIcon icon={faUserTie} className="mr-2" />
                      Secretary
                    </div>
                    <div className="card-body">
                      <h3>{secretary}</h3>
                    </div>
                  </div>
                </Col>
                <Col md="3">
                  <div className="card">
                    <div className="card-header">
                      <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" /> Appointments
                    </div>
                    <div className="card-body">
                      <h3>{appointmentsCount}</h3>
                    </div>
                  </div>
                </Col>
                <Col md="3">
                  <div className="card">
                    <div className="card-header">
                      <FontAwesomeIcon icon={faBiohazard} className="mr-2" /> Diseases
                    </div>
                    <div className="card-body">
                      <h3>{maladies}</h3>
                    </div>
                  </div>
                </Col>

                <Row>
                  <Col md="12" style={{ marginTop: '50px' }}>
                    <LineChart title="Appointment by month" data={data} download={{ background: '#fff' }} />
                  </Col>
                </Row>

                <Row>
                  <Col md="12" style={{ marginTop: '50px' }}>
                    <ColumnChart
                      data={dataDermatologues}
                      xtitle={`Time: ` + timingForxtitle()}
                      ytitle="Number of Appointments"
                      download={{ background: '#fff' }}
                      colors={['#FF7125', '#DDA9F5', '#00DCF7']}
                    />
                  </Col>
                </Row>

                {/*<AreaChart data={{"2021-01-01": 11, "2021-01-02": 6}} />*/}

                {/*<PieChart data={[["Blueberry", 44], ["Strawberry", 23]]} />*/}
                {/*<ColumnChart data={[["Sun", 32], ["Mon", 46], ["Tue", 28]]} />*/}
                {/*<ScatterChart data={[[174.0, 80.0], [176.5, 82.3]]} xtitle="Size" ytitle="Population" />*/}
              </Row>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default Home;
