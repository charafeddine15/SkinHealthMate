import React, { useEffect, useState } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBCardHeader } from 'mdb-react-ui-kit';
// import { Table } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import $ from 'jquery';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-responsive-dt/js/responsive.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import ButtonBase from '@mui/material/ButtonBase';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import axios from 'axios';
import { Button, Table } from 'reactstrap';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
// import Transition from '../../constants/transition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardUser } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from 'app/config/store';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { openFile, byteSize, Translate, TextFormat, getSortState } from 'react-jhipster';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
const headerColor = {
  backgroundColor: '#54B4D3',
};
export default function MedicalRecord() {
  const dispatch = useAppDispatch();
  const [details, setDetails] = useState([]);
  const [typeGraph, setTypeGraph] = useState('column');
  const loading = useAppSelector(state => state.diagnostic.loading);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const [probabilities, setProbabilities] = useState([]);
  const dermatologue = JSON.parse(sessionStorage.getItem('user_data'));
  const patientId = sessionStorage.getItem('patient_id');
  const [diagnosticInfos, setDiagnosticInfos] = useState<{
    id: string;
    description: string;
    maladies: {
      fullName: string;
      abbr: string;
    };
    maladiesDetected: {
      fullName: string;
      abbr: string;
    };
    probability: string;
    picture: string;
    pictureContentType: string;
    prescription: string;
    probabilities: string[];
    symptoms: string[];
  } | null>(null);
  const chartstyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    overflowY: 'auto',
    maxHeight: '90vh',
  };

  const [statisticsData, setStatisticsData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderWidth: number;
    }[];
  }>({
    labels: ['akiec', 'bcc', 'bkl', 'df', 'mel', 'nv', 'vasc'],
    datasets: [
      {
        label: 'Probabilities',
        data: [],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
          'rgb(255, 159, 64)',
          'rgb(201, 203, 207)',
        ],
        borderWidth: 1,
      },
    ],
  });
  const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false);
  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);

  const toggleStatisticsModal = (probabilities, diagnostic) => {
    const circularReferenceReplacer = () => {
      const seen = new WeakSet();
      return (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }
        return value;
      };
    };

    console.log('this is my diagnostic: ', diagnostic);
    setDiagnosticInfos(diagnostic);
    console.log('my probabilities: ', probabilities);
    setProbabilities(probabilities);
    setIsStatisticsModalOpen(!isStatisticsModalOpen);
  };

  const diseases = ['akiec', 'bcc', 'bkl', 'df', 'mel', 'nv', 'vasc'];

  useEffect(() => {
    const originalData = probabilities;
    const convertedData = Array.isArray(originalData) ? originalData.map(value => Number(value.toFixed(2))) : [];

    setStatisticsData({
      labels: ['akiec', 'bcc', 'bkl', 'df', 'mel', 'nv', 'vasc'],
      datasets: [
        {
          label: 'Probabilities',
          data: convertedData,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)',
            'rgb(201, 203, 207)',
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [isStatisticsModalOpen]);
  const [data, setData] = useState([]);
  const loadDiagnostics = () => {
    axios
      .get('/api/diagnostics/dermatologue/' + dermatologue.id + '/dossiermedical/patient/' + patientId)
      .then(response => {
        console.log(response.data);
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    loadDiagnostics();
  }, [patientId]);

  useEffect(() => {
    console.log('mydata: ', data);
    if (data.length > 0) {
      const table = $('#myTable').DataTable();
      table.order([0, 'desc']).draw();
      return () => {
        table.destroy();
      };
    }
  }, [data]);
  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = sortState.sort;
    const order = sortState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    } else {
      return order === ASC ? faSortUp : faSortDown;
    }
  };
  const sort = p => () => {
    setSortState({
      ...sortState,
      order: sortState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  //   const fdetails = (diagnostic_id) => {
  //     setTypeGraph("column")
  //     fetchDiagnostic(path,diagnostic_id, updateDiagnostic);
  //     const tabDetails = [];
  //     if (diagnostic && diagnostic._id == diagnostic_id) {
  //         for (let i = 0; i < diagnostic.maladies.length; i++) {
  //             const newDetail = { label: diagnostic.maladies[i].nom, y: parseFloat(diagnostic.probabilities[i]) }
  //             tabDetails.push(newDetail)
  //             console.log(diagnostic.probabilities[i])
  //             if (diagnostic.probabilities[i] == 100.0) {
  //                 console.log("Un 100%")
  //                 setTypeGraph("stackedColumn100")
  //             }
  //         }
  //         setDetails(tabDetails)
  //         modalIsOpen ? setModalIsOpen(false) : setModalIsOpen(true);
  //     }
  // }

  return (
    <section style={{ backgroundColor: '#eee' }}>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src="../../../content/images/user-image/patient.png"
                  alt="IMAGE"
                  className="rounded-circle"
                  style={{ width: '120px' }}
                  fluid
                />
                <p className="text-muted mb-1">{}</p>
                <p className="text-muted mb-4">{}</p>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4 p-2" style={{ width: '500px' }}>
              {data.length > 0 && ( // Check if there is at least one element in the data array
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>First name</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{data[0].patientUserDTO.patient.user.firstName}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Last name</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{data[0].patientUserDTO.patient.user.lastName}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Email</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{data[0].patientUserDTO.patient.user.email}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Tel</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{data[0].patientUserDTO.patient.telephone}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Address</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{data[0].patientUserDTO.patient.adress}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              )}
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol>
            <MDBRow>
              <MDBCol lg="14">
                <MDBCard className="mb-2">
                  <MDBCardHeader>
                    <span className="text-primary font-italic me-1">Patient</span> Visits Details
                  </MDBCardHeader>
                  <MDBCardBody>
                    <div className="table-responsive">
                      {data && data.length > 0 ? (
                        <table className="table table-responsive " id="myTable">
                          <thead>
                            <tr>
                              <th style={{ display: 'none' }}></th>
                              <th className="hand" style={{ width: '150px' }}>
                                Date Diagnostic
                              </th>
                              <th className="hand" style={{ width: '150px' }}>
                                Predicted Disease
                              </th>
                              <th className="hand" style={{ width: '150px' }}>
                                Confirmed Disease
                              </th>

                              <th className="hand">Picture</th>
                              <th className="hand">Description</th>
                              <th>Prescription</th>
                              <th className="hand">Probability</th>
                              <th className="hand" style={{ width: '150px' }}>
                                Symptoms
                              </th>

                              <th />
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((diagnostic, i) => (
                              <tr key={`entity-${i}`} data-cy="entityTable">
                                <td style={{ display: 'none' }}>{i}</td>
                                <td>
                                  {diagnostic.dateDiagnostic ? (
                                    <TextFormat type="date" value={diagnostic.dateDiagnostic} format={APP_DATE_FORMAT} />
                                  ) : null}
                                </td>
                                <td>{diagnostic.maladiesDetected?.[0]?.fullName}</td>
                                <td>{diagnostic.maladies[0]?.fullName}</td>

                                <td>
                                  {diagnostic.picture ? (
                                    <div>
                                      {diagnostic.pictureContentType ? (
                                        <a onClick={openFile(diagnostic.pictureContentType, diagnostic.picture)}>
                                          <img
                                            src={`data:${diagnostic.pictureContentType};base64,${diagnostic.picture}`}
                                            style={{ height: '60px', width: '60px' }}
                                          />
                                          &nbsp;
                                        </a>
                                      ) : null}
                                      {/* <span>
                                        {diagnostic.pictureContentType}, {byteSize(diagnostic.picture)}
                                      </span> */}
                                    </div>
                                  ) : null}
                                </td>
                                <td>{diagnostic.description}</td>
                                <td>{diagnostic.prescription}</td>
                                <td>{diagnostic.probability}</td>
                                <td>{diagnostic.symptoms?.map((desc, index) => <li key={index}>{desc}</li>)}</td>

                                <td className="text-end p-6">
                                  <div className="flex-btn-group-container">
                                    <Button
                                      color="success"
                                      size="sm"
                                      style={{ width: '120px', marginTop: '12px' }}
                                      onClick={() => toggleStatisticsModal(diagnostic.probabilities, diagnostic)}
                                    >
                                      <FontAwesomeIcon icon={faChartLine} /> <span className="d-none d-md-inline">Statistics</span>
                                    </Button>
                                    {/* <Button color="success" size="sm" onClick={() => toggleValidateModal(diagnostic)}>
                          <FontAwesomeIcon icon={faCheck} /> <span className="d-none d-md-inline">Validate</span>
                        </Button> */}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        !loading && (
                          <div className="alert alert-warning">
                            <Translate contentKey="assistanteDermatologueApp.diagnostic.home.notFound">No Diagnostics found</Translate>
                          </div>
                        )
                      )}
                    </div>
                    <Modal
                      open={isStatisticsModalOpen}
                      onClose={toggleStatisticsModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <div>
                        <Box sx={chartstyle}>
                          <Typography id="modal-modal-title" variant="h6" component="h2" style={{ textAlign: 'center' }}>
                            Disease Detection Statistics
                          </Typography>

                          <Bar data={statisticsData} />
                          <br></br>
                          <br></br>
                          {diagnosticInfos && (
                            <div>
                              <Row>
                                <Col lg={6}>
                                  <Card>
                                    <Card.Header>DEGREE OF CERTAINTY</Card.Header>
                                    <Card.Body>
                                      <span>PREDICATED DISEASE : </span>
                                      {diagnosticInfos.maladiesDetected?.[0]?.fullName} <br />
                                      CONFIDENCE :{diagnosticInfos.probability + ' %'}
                                    </Card.Body>
                                  </Card>
                                </Col>
                                <Col lg={6}>
                                  <Card>
                                    <Card.Header>PRESCRIPTION</Card.Header>
                                    <Card.Body>{diagnosticInfos.prescription}</Card.Body>
                                  </Card>
                                </Col>
                              </Row>
                              <Row style={{ marginTop: '10px' }}>
                                <Col lg={6}>
                                  <Card>
                                    <Card.Header>DISEASE SYMPTOMS</Card.Header>

                                    <Card.Body>
                                      <ul>{diagnosticInfos.symptoms?.map((desc, index) => <li key={index}>{desc}</li>)}</ul>
                                    </Card.Body>
                                  </Card>
                                </Col>
                                <Col lg={6}>
                                  <Card>
                                    <Card.Header>DISEASE DESCRIPTION</Card.Header>
                                    <Card.Body>{diagnosticInfos.description}</Card.Body>
                                  </Card>
                                </Col>
                              </Row>
                              <Row style={{ marginTop: '10px' }}>
                                <Col lg={12}>
                                  <Card>
                                    <Card.Header>DIAGNOSTIC IMAGE</Card.Header>
                                    <Card.Body style={{ justifyContent: 'center' }}>
                                      <center>
                                        <ButtonBase sx={{ width: 328, height: 328 }}>
                                          {diagnosticInfos.picture ? (
                                            <div>
                                              {diagnosticInfos.pictureContentType ? (
                                                <a onClick={openFile(diagnosticInfos.pictureContentType, diagnosticInfos.picture)}>
                                                  <img
                                                    src={`data:${diagnosticInfos.pictureContentType};base64,${diagnosticInfos.picture}`}
                                                    style={{ height: '300px', width: '400px', maxHeight: '1020px', maxWidth: '1520px' }}
                                                  />
                                                  &nbsp;
                                                </a>
                                              ) : null}
                                            </div>
                                          ) : null}
                                        </ButtonBase>
                                      </center>
                                    </Card.Body>
                                  </Card>
                                </Col>
                              </Row>
                            </div>
                          )}
                        </Box>
                      </div>
                    </Modal>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
