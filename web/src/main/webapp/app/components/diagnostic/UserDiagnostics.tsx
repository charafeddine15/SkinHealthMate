import React, { useState, useEffect, MouseEventHandler } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { openFile, byteSize, Translate, TextFormat, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import DiagnosticModel from '../../entities/diagnostic/DiagnosticModel';
import { getEntities, partialUpdateEntity } from '../../entities/diagnostic/diagnostic.reducer';
import $ from 'jquery';
import 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-responsive-dt/js/responsive.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
// import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  borderRadius: 8,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};
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

const validatestyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const buttonStyle = {
  marginTop: 'auto',
  flexDirection: 'column',
  alignItems: 'center',
};
const headerColor = {
  backgroundColor: '#54B4D3',
};

export const UserDiagnostics = () => {
  const dispatch = useAppDispatch();
  const [isModelOpen, setIsModelOpen] = useState(false);
  const toggleModel = () => {
    setIsModelOpen(!isModelOpen);
  };

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const diagnosticList = useAppSelector(state => state.diagnostic.entities);
  const loading = useAppSelector(state => state.diagnostic.loading);
  const searchParams = new URLSearchParams(pageLocation.search);
  const consultationId = sessionStorage.getItem('consultation_id');
  const patientName = sessionStorage.getItem('patientName');
  const [probabilities, setProbabilities] = useState([]);
  const [mydiagnostic, setMyDiagnostic] = useState<{
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

  const [selectedMaladie, setSelectedMaladie] = useState<IMaladie | null>(null);

  interface IMaladie {
    id: string;
    fullName: string;
  }

  const handleUpdate = () => {
    console.log('this is my selected maladie : ', selectedMaladie);
    if (selectedMaladie && diagnosticInfos) {
      const diagnosticToUpdate = {
        id: diagnosticInfos.id,
        maladies: [
          {
            id: selectedMaladie.id,
            fullName: selectedMaladie.fullName,
          },
        ],
      };

      dispatch(partialUpdateEntity(diagnosticToUpdate))
        .unwrap()
        .then(response => {
          console.log('Update successful', response);
        })
        .catch(error => {
          console.error('Update failed', error);
        });
    }

    setIsValidateModalOpen(!isValidateModalOpen);
    setIsModelOpen(!isModelOpen);
    window.location.reload();
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

  const [data, setData] = useState([]);
  const [dataMaladies, setDataMaladies] = useState([]);
  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `${sortState.sort},${sortState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    setIsModelOpen(false);
  };

  useEffect(() => {
    sortEntities();
  }, [sortState.order, sortState.sort]);

  const sort = p => () => {
    setSortState({
      ...sortState,
      order: sortState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handleSyncList = () => {
    sortEntities();
    setIsModelOpen(false);
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = sortState.sort;
    const order = sortState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    } else {
      return order === ASC ? faSortUp : faSortDown;
    }
  };

  const loadDiagnosticsById = id => {
    console.log(id);
    axios
      .get(`/api/diagnostics/consultations/${consultationId}`)
      .then(response => {
        console.log(response.data);
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadDiagnosticsById(consultationId);
  }, [consultationId]);

  useEffect(() => {
    if (data.length > 0) {
      const table = $('#myTable').DataTable();
      table.order([0, 'desc']).draw();
      return () => {
        table.destroy();
      };
    }
  }, [data]);

  // console.log('data16', data[16]?.maladies[0].fullName);

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
    setMyDiagnostic(diagnostic);
    console.log('my probabilities: ', probabilities);
    setProbabilities(probabilities);
    setIsStatisticsModalOpen(!isStatisticsModalOpen);
  };
  useEffect(() => {
    console.log('my diagnosticcc:', mydiagnostic);
  }, [mydiagnostic]);

  const toggleValidateModal = diagnostic => {
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

    const maladies = axios.get(`/api/maladies`).then(response => {
      console.log(response.data);
      setDataMaladies(response.data);
    });
    console.log('dataMaladies:', dataMaladies);
    setDiagnosticInfos(diagnostic);
    setIsValidateModalOpen(!isValidateModalOpen);
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
  const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });

  const handleClose = () => {
    setIsValidateModalOpen(!isValidateModalOpen);
  };

  const handleConfirm = () => {
    setIsValidateModalOpen(!isValidateModalOpen);
  };
  const buttonContainerStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const buttonStyle = {
    marginRight: '10px', // Ajustez selon vos besoins
  };

  if (consultationId != undefined && consultationId != null) {
    return (
      <div className="p-2 card p-4">
        <h2 id="diagnostic-heading" data-cy="DiagnosticHeading">
          Diagnostics for Patient : {patientName}
          <div className="d-flex justify-content-end">
            <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
              <FontAwesomeIcon icon="sync" spin={loading} />{' '}
              <Translate contentKey="assistanteDermatologueApp.diagnostic.home.refreshListLabel">Refresh List</Translate>
            </Button>

            <Button color="primary" onClick={toggleModel}>
              New diagnostic
            </Button>
            <DiagnosticModel isOpen={isModelOpen} toggle={toggleModel} isNew={true} />
          </div>
        </h2>
        <div className="table-responsive">
          {data && data.length > 0 ? (
            <table className="table table-responsive p-3" id="myTable">
              <thead>
                <tr>
                  <th className="hand" onClick={sort('dateDiagnostic')}>
                    <Translate contentKey="assistanteDermatologueApp.diagnostic.dateDiagnostic">Date Diagnostic</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('dateDiagnostic')} />
                  </th>
                  <th className="hand">Disease</th>

                  <th className="hand" onClick={sort('picture')}>
                    <Translate contentKey="assistanteDermatologueApp.diagnostic.picture">Picture</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('picture')} />
                  </th>
                  <th className="hand" onClick={sort('description')}>
                    <Translate contentKey="assistanteDermatologueApp.diagnostic.description">Description</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('description')} />
                  </th>
                  <th className="hand" onClick={sort('prescription')}>
                    <Translate contentKey="assistanteDermatologueApp.diagnostic.prescription">Prescription</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('prescription')} />
                  </th>
                  <th className="hand" onClick={sort('probability')}>
                    <Translate contentKey="assistanteDermatologueApp.diagnostic.probability">Probability</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('probability')} />
                  </th>

                  <th />
                </tr>
              </thead>
              <tbody>
                {data.map((diagnostic, i) => (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>
                      {diagnostic.dateDiagnostic ? (
                        <TextFormat type="date" value={diagnostic.dateDiagnostic} format={APP_DATE_FORMAT} />
                      ) : null}
                    </td>

                    <td>{diagnostic.maladies[0]?.fullName}</td>

                    <td>
                      {diagnostic.picture ? (
                        <div>
                          {diagnostic.pictureContentType ? (
                            <a onClick={openFile(diagnostic.pictureContentType, diagnostic.picture)}>
                              <img
                                src={`data:${diagnostic.pictureContentType};base64,${diagnostic.picture}`}
                                style={{ maxHeight: '30px' }}
                              />
                              &nbsp;
                            </a>
                          ) : null}
                          <span>
                            {diagnostic.pictureContentType}, {byteSize(diagnostic.picture)}
                          </span>
                        </div>
                      ) : null}
                    </td>
                    <td>{diagnostic.description}</td>
                    <td>{diagnostic.prescription}</td>
                    <td>{diagnostic.probability}</td>

                    <td className="text-end">
                      <div className="flex-btn-group-container" style={buttonContainerStyle}>
                        <Button
                          color="info"
                          size="sm"
                          onClick={() => toggleStatisticsModal(diagnostic.probabilities, diagnostic)}
                          style={buttonStyle}
                        >
                          <FontAwesomeIcon icon={faChartLine} /> <span className="d-none d-md-inline">Statistics</span>
                        </Button>

                        <Button
                          tag={Link}
                          to={`/diagnostic/${diagnostic.id}/edit`}
                          color="primary"
                          size="sm"
                          data-cy="entityEditButton"
                          style={buttonStyle}
                        >
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.edit">Edit</Translate>
                          </span>
                        </Button>
                        <Button color="success" size="sm" onClick={() => toggleValidateModal(diagnostic)} style={buttonStyle}>
                          <FontAwesomeIcon icon={faCheck} /> <span className="d-none d-md-inline">Validate</span>
                        </Button>
                        <Button
                          onClick={() => (location.href = `/diagnostic/${diagnostic.id}/delete`)}
                          color="danger"
                          size="sm"
                          data-cy="entityDeleteButton"
                          style={buttonStyle}
                        >
                          <FontAwesomeIcon icon="trash" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.delete">Delete</Translate>
                          </span>
                        </Button>
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
              {mydiagnostic && (
                <div>
                  <Row>
                    <Col lg={6}>
                      <Card>
                        <Card.Header>DEGREE OF CERTAINTY</Card.Header>
                        <Card.Body>
                          <span>PREDICATED DISEASE : </span>
                          {mydiagnostic.maladiesDetected?.[0]?.fullName} <br />
                          CONFIDENCE :{mydiagnostic.probability + ' %'}
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={6}>
                      <Card>
                        <Card.Header>PRESCRIPTION</Card.Header>
                        <Card.Body>{mydiagnostic.prescription}</Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: '10px' }}>
                    <Col lg={6}>
                      <Card>
                        <Card.Header>DISEASE SYMPTOMS</Card.Header>

                        <Card.Body>
                          <ul>{mydiagnostic.symptoms?.map((desc, index) => <li key={index}>{desc}</li>)}</ul>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={6}>
                      <Card>
                        <Card.Header>DISEASE DESCRIPTION</Card.Header>
                        <Card.Body>{mydiagnostic.description}</Card.Body>
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
                              {mydiagnostic.picture ? (
                                <div>
                                  {mydiagnostic.pictureContentType ? (
                                    <a onClick={openFile(mydiagnostic.pictureContentType, mydiagnostic.picture)}>
                                      <img
                                        src={`data:${mydiagnostic.pictureContentType};base64,${mydiagnostic.picture}`}
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

        <Modal
          open={isValidateModalOpen}
          onClose={toggleValidateModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={validatestyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2" style={{ textAlign: 'center' }}>
              Diagnostic Validation
            </Typography>

            <Row>
              <Col>
                {diagnosticInfos && (
                  <div className="form-field">
                    <label>SELECT THE CORRECT DISEASE</label>
                    <select
                      name="maladie_id"
                      style={{ width: '200px', justifyContent: 'initial', fontSize: '20px', color: 'gray' }}
                      required
                      onChange={e => {
                        const selectedMaladie = dataMaladies.find(maladie => maladie.id === e.target.value);
                        setSelectedMaladie(selectedMaladie || null);
                      }}
                      value={selectedMaladie?.id || ''}
                    >
                      <option value="">choose</option>
                      {dataMaladies.map(maladie => (
                        <option key={maladie.id} value={maladie.id}>
                          <Typography variant="body2" gutterBottom>
                            <span>{maladie.fullName}</span>
                          </Typography>
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col>
                <Card>
                  <Card.Header>DISEASE DETECTED BY THE ALGORITHM</Card.Header>
                  <Card.Body>
                    {diagnosticInfos && (
                      <div>
                        <span>PREDICATED DISEASE : {diagnosticInfos.maladiesDetected?.[0]?.fullName} </span> <br></br>
                        <span>CONFIDENCE : {diagnosticInfos.probability + ' '}%</span>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                {diagnosticInfos && (
                  <Card>
                    <Card.Header>DISEASE DETECTECTION RESULTS GIVEN BY THE ALGORTHM</Card.Header>
                    <Card.Body>
                      {diagnosticInfos.probabilities?.map((probability, index) => (
                        <option key={index} value={probability}>
                          <Typography variant="body2" gutterBottom>
                            <span>{diseases[index]}</span> ========= <span>{probability}%</span>
                          </Typography>
                        </option>
                      ))}
                    </Card.Body>
                  </Card>
                )}
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col>
                <Button color="danger" variant="danger" onClick={handleClose}>
                  Close
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button color="primary" variant="success" onClick={handleUpdate}>
                  Confirm
                </Button>
              </Col>
            </Row>
          </Box>
        </Modal>
      </div>
    );
  } else {
    return (
      <div>
        <Modal
          open={true}
          onClose={() => {
            //
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" style={{ background: 'yellow', textAlign: 'center' }}>
              Warning
            </Typography>
            {/*<hr />*/}
            <Typography id="modal-modal-description" sx={{ mt: 2, fontWeight: 'bold' }}>
              You must select a consultation
            </Typography>
            <br />
            <Button
              onClick={() => {
                // Handle any additional logic here
                navigate('/consultation');
                // Close the modal if needed
                // onClose();
              }}
            >
              Ok
            </Button>
          </Box>
        </Modal>
      </div>
    );
  }
};

export default UserDiagnostics;
