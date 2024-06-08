import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';
import $ from 'jquery';
import 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-responsive-dt/js/responsive.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
import axios from 'axios';
import { faFileMedical } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'reactstrap';
const headerColor = {
  backgroundColor: '#54B4D3',
};
export const ConsultationList = () => {
  const [consultationList, setConsultationList] = useState([]);
  const [conAll, setConAll] = useState([]);
  const userData = JSON.parse(sessionStorage.getItem('user_data'));
  const [choix, setChoix] = useState('All');
  const [isToday, setToday] = useState(true);
  const buttonContainerStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const buttonStyle = {
    marginRight: '10px',
  };

  const consultationForToday = () => {
    axios
      .get('/api/consultations/listeConsultations/dematologue/' + userData.id)
      .then(response => {
        console.log(response.data);
        setConsultationList(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const allConsultation = () => {
    axios
      .get('/api/consultations/all-Consultations/dematologue/' + userData.id)
      .then(response => {
        console.log(response.data);
        setConAll(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const extractDate = dateTimeString => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const extractTime = dateTimeString => {
    const date = new Date(dateTimeString);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const changeChoix = () => {
    console.log('today is ' + isToday);
    console.log(choix);
    if (choix === 'All') {
      setToday(false);
      setChoix('Today');
      allConsultation();
    } else {
      setToday(true);
      setChoix('All');
      allConsultation();
      consultationForToday();
    }
  };

  const navigate = useNavigate();
  const toNavigate = (id, patient) => {
    sessionStorage.setItem('consultation_id', id);
    sessionStorage.setItem('patientName', patient);
    navigate('/diagnostic');
  };

  useEffect(() => {
    const table = $('#myTable').DataTable();
    table.order([0, 'desc']).draw();
    return () => {
      table.destroy();
    };
  }, [consultationList]);

  useEffect(() => {
    const table = $('#myTableAll').DataTable();
    table.order([0, 'desc']).draw();
    return () => {
      table.destroy();
    };
  }, [conAll]);

  useEffect(() => {
    consultationForToday();
  }, []);

  return (
    <>
      <div className="p-2 card p-4">
        <h2 id="consultation-heading" data-cy="ConsultationHeading" className="card-header">
          My consultations
          <div className="d-flex justify-content-end">
            <button className="btn btn-secondary  btn-lg" onClick={() => changeChoix()}>
              {choix}
            </button>
          </div>
        </h2>
        {isToday && (
          <div className="card-body table-reponsive">
            {consultationList && consultationList.length > 0 ? (
              <table className="table table-responsive" id="myTable">
                <thead>
                  <tr>
                    <th className="hand">Date consultation</th>
                    <th>Hour</th>
                    <th>Patient</th>
                    <th>Patient phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {consultationList.map((consultation, index) => (
                    <tr key={index}>
                      <td>{extractDate(consultation.dateConsultation)}</td>
                      <td>{extractTime(consultation.dateConsultation)}</td>
                      <td>{consultation.rendezVous.patient.user.firstName + ' ' + consultation.rendezVous.patient.user.lastName}</td>
                      <td>{consultation.rendezVous.patient.telephone}</td>
                      <td style={buttonContainerStyle}>
                        <button
                          className="btn btn-primary m-1"
                          title="Diagnostic"
                          style={buttonStyle}
                          onClick={() =>
                            toNavigate(
                              consultation.id,
                              consultation.rendezVous.patient.user.firstName + ' ' + consultation.rendezVous.patient.user.lastName,
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faFileMedical} /> <span className="d-none d-md-inline">Diagnostic</span>
                        </button>
                        <button className="btn btn-danger" style={buttonStyle}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <>No data</>
            )}
          </div>
        )}

        {!isToday && (
          <div className="card-body table-reponsive">
            {conAll && conAll.length > 0 ? (
              <table className="table table-responsive" id="myTableAll">
                <thead>
                  <tr>
                    <th className="hand">Date consultation</th>
                    <th>Hour</th>
                    <th>Patient</th>
                    <th>Patient phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {conAll.map((consultation, index) => (
                    <tr key={index}>
                      <td>{extractDate(consultation.dateConsultation)}</td>
                      <td>{extractTime(consultation.dateConsultation)}</td>
                      <td>{consultation.rendezVous.patient.user.firstName + ' ' + consultation.rendezVous.patient.user.lastName}</td>
                      <td>{consultation.rendezVous.patient.telephone}</td>
                      <td style={buttonContainerStyle}>
                        {/* <button
                          className="btn btn-primary m-1"
                          title="Diagnostic"
                          onClick={() =>
                            toNavigate(
                              consultation.id,
                              consultation.rendezVous.patient.user.firstName + ' ' + consultation.rendezVous.patient.user.lastName,
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faFileMedical} /> <span className="d-none d-md-inline">Diagnostic</span>
                        </button> */}
                        {/* <button className="btn btn-danger">Delete</button> */}

                        <Button
                          onClick={() =>
                            toNavigate(
                              consultation.id,
                              consultation.rendezVous.patient.user.firstName + ' ' + consultation.rendezVous.patient.user.lastName,
                            )
                          }
                          color="primary"
                          size="sm"
                          style={buttonStyle}
                          data-cy="entityDeleteButton"
                        >
                          <FontAwesomeIcon icon={faFileMedical} /> <span className="d-none d-md-inline">Diagnostic</span>
                        </Button>
                        <Button color="danger" size="sm" data-cy="entityDeleteButton" style={buttonStyle}>
                          <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <>No data</>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ConsultationList;
