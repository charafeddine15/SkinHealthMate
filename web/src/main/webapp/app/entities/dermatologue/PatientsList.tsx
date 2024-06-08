import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from '../patient/patient.reducer';
import $ from 'jquery';
import 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-responsive-dt/js/responsive.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
import Avatar from '@mui/material/Avatar';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const buttonContainerStyle = {
  display: 'flex',
  alignItems: 'center',
};

const buttonStyle = {
  marginRight: '10px',
};
const headerColor = {
  backgroundColor: '#54B4D3',
};

export const PatientsList = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [adress, setAdress] = useState('');
  const [gender, setGender] = useState('');
  const [dateToModal, setDate] = useState('');

  const dispatch = useAppDispatch();
  const [visible, setVisible] = useState(false);
  const handleOpen = () => setVisible(true);
  const handleClose = () => {
    setVisible(false);
    setUpdate(false);
  };

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const patientList = useAppSelector(state => state.patient.entities);
  const loading = useAppSelector(state => state.patient.loading);
  const [ListePatients, setListePatients] = useState([]);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `${sortState.sort},${sortState.order}`,
      }),
    );
  };
  useEffect(() => {
    if (patientList.length > 0) {
      const table = $('#myTable').DataTable();
      return () => {
        table.destroy();
      };
    }
  }, [ListePatients]);

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?sort=${sortState.sort},${sortState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
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

  const extractBirthdate = date => {
    var birthDate = new Date(date);
    var year = birthDate.getFullYear();
    var month = birthDate.getMonth() + 1;
    var day = birthDate.getDate();
    return `${year}-${month}-${day}`;
  };
  const viewPatient = id => {
    setVisible(true);
    console.log(id + ' patient id');
    const element = patientList.find(e => e.id === id);
    if (element) {
      console.log(element);
      setFirstName(element.user.firstName);
      setLastName(element.user.lastName);
      setEmail(element.user.email);
      setAdress(element.adress);
      setDate(extractBirthdate(element.birthdate));
      setBirthdate(element.birthdate);
      setPhone(element.telephone);
      setGender(element.genre);
    } else {
      console.log('error');
    }
  };

  const [isupdate, setUpdate] = useState(false);
  const [id, setId] = useState(1);
  const editPatient = id => {
    setVisible(true);
    setUpdate(true);
    const patient = patientList.find(e => e.id === id);
    if (patient) {
      console.log(patient);
      setFirstName(patient.user.firstName);
      setLastName(patient.user.lastName);
      setEmail(patient.user.email);
      setAdress(patient.adress);
      setDate(extractBirthdate(patient.birthdate));
      setBirthdate(patient.birthdate);
      setPhone(patient.telephone);
      setGender(patient.genre);
      setId(id);
    } else {
      console.log('patient not found');
    }
  };

  const dataJson = {
    id: id,
    adress: adress,
    genre: gender,
    telephone: phone,
    birthdate: birthdate,
    user: {
      email: email,
      firstName: firstName,
      lastName: lastName,
    },
  };

  const viewMedicalRecord = id => {
    sessionStorage.setItem('patient_id', id);
    navigate('/medicalRecord');
  };

  const sendUpdate = () => {
    axios
      .put('/api/patients/update/' + id, dataJson)
      .then(response => {
        console.log(response.data);
        getAllEntities();
        setVisible(false);
        setUpdate(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fetchPatientData = id => {
    axios
      .get(`/api/dermatologuePatients/${id}`)
      .then(response => {
        setListePatients(response.data);
      })
      .catch(error => {
        console.error('Error fetching patient data', error);
      });
  };
  useEffect(() => {
    getAllEntities();
    const userData = JSON.parse(sessionStorage.getItem('user_data'));
    const dermatologueId = userData ? userData.id : null;

    if (dermatologueId) {
      fetchPatientData(dermatologueId);
    }
  }, [sortState.order, sortState.sort]);

  return (
    <div className="p-2 card">
      <h2 id="patient-heading" data-cy="PatientHeading" className="card-header">
        <Translate contentKey="assistanteDermatologueApp.patient.home.title">Patients</Translate>
        <div className="d-flex justify-content-end">
          {/*<Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>*/}
          {/*  <FontAwesomeIcon icon="sync" spin={loading} />{' '}*/}
          {/*  <Translate contentKey="assistanteDermatologueApp.patient.home.refreshListLabel">Refresh List</Translate>*/}
          {/*</Button>*/}
        </div>
      </h2>
      <div className="table-responsive card-body p-3 ">
        {ListePatients && ListePatients.length > 0 ? (
          <Table className="table table-responsive" id="myTable">
            <thead>
              <tr>
                {/*<th className="hand" onClick={sort('id')}>*/}
                {/*  <Translate contentKey="assistanteDermatologueApp.patient.id">ID</Translate>{' '}*/}
                {/*  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />*/}
                {/*</th>*/}
                <th className="hand">
                  <Translate contentKey="assistanteDermatologueApp.patient.birthdate">Birthdate</Translate>{' '}
                  {/*<FontAwesomeIcon icon={getSortIconByFieldName('birthdate')} />*/}
                </th>
                <th className="hand">
                  <Translate contentKey="assistanteDermatologueApp.patient.adress">Adress</Translate>{' '}
                  {/*<FontAwesomeIcon icon={getSortIconByFieldName('adress')} />*/}
                </th>
                <th className="hand">
                  Gender
                  {/*<FontAwesomeIcon icon={getSortIconByFieldName('genre')} />*/}
                </th>
                <th className="hand">
                  Phone
                  {/*<FontAwesomeIcon icon={getSortIconByFieldName('telephone')} />*/}
                </th>
                <th>Full name</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {ListePatients.map((patient, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  {/*<td>*/}
                  {/*  <Button tag={Link} to={`/patient/${patient.id}`} color="link" size="sm">*/}
                  {/*    {patient.id}*/}
                  {/*  </Button>*/}
                  {/*</td>*/}
                  {/*<td>{patient.birthdate ? <TextFormat type="date" value={patient.birthdate} format={APP_DATE_FORMAT} /> : null}</td>*/}
                  <td>{patient.patient.birthdate ? new Date(patient.patient.birthdate).toLocaleDateString() : null}</td>

                  <td>{patient.patient.adress}</td>
                  <td>{patient.patient.genre}</td>
                  <td>{patient.patient.telephone}</td>
                  <td>{patient.patient.user ? patient.patient.user.firstName + ' ' + patient.patient.user.lastName : ''}</td>
                  <td className="text-end">
                    <div className="flex-btn-group-container" style={buttonContainerStyle}>
                      <Button onClick={() => viewMedicalRecord(patient.patient.id)} color="info" size="sm" style={buttonStyle}>
                        <FontAwesomeIcon icon="plus" />
                        &nbsp; medical record
                      </Button>

                      <Button onClick={() => viewPatient(patient.patient.id)} color="success" size="sm" style={buttonStyle}>
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => editPatient(patient.patient.id)}
                        // tag={Link} to={`/patient/${patient.id}/edit`}
                        color="primary"
                        size="sm"
                        style={buttonStyle}
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => (location.href = `/patient/${patient.patient.id}/delete`)}
                        color="danger"
                        size="sm"
                        style={buttonStyle}
                        data-cy="entityDeleteButton"
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
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="assistanteDermatologueApp.patient.home.notFound">No Patients found</Translate>
            </div>
          )
        )}
      </div>

      <Modal open={visible} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className="card card-responsive">
            <div className="card-header">Patient data</div>
            <div className="row">
              <div className="col-2">
                <Avatar
                  className="m-1"
                  alt="User Image"
                  src="../../../content/images/user-image/patient.png"
                  sx={{ width: 100, height: 100 }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-5">
                <TextField
                  aria-readonly={true}
                  className="m-2"
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  value={firstName}
                  {...(isupdate && { onChange: e => setFirstName(e.target.value) })}
                />
              </div>

              <div className="col-6">
                <TextField
                  className="m-2"
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  value={lastName}
                  {...(isupdate && { onChange: e => setLastName(e.target.value) })}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-5">
                <TextField
                  className="m-2"
                  label="Phone"
                  variant="outlined"
                  fullWidth
                  value={phone}
                  {...(isupdate && { onChange: e => setPhone(e.target.value) })}
                />
              </div>

              <div className="col-6">
                <TextField
                  className="m-2"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  {...(isupdate && { onChange: e => setEmail(e.target.value) })}
                />
              </div>
            </div>

            <div className="row">
              {!isupdate && (
                <div className="col-5">
                  <TextField className="m-2" label="Gender" variant="outlined" fullWidth value={gender} />
                </div>
              )}
              {isupdate && (
                <div className="col-5 mt-2" style={{ marginLeft: '10px' }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={gender}
                      label="Gender"
                      onChange={e => {
                        setGender(e.target.value);
                      }}
                    >
                      <MenuItem value="male" selected={gender === 'male'}>
                        Male
                      </MenuItem>
                      <MenuItem value="female" selected={gender === 'female'}>
                        Female
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
              )}

              <div className="col-6">
                <TextField
                  className="m-2"
                  label="Birthdate"
                  variant="outlined"
                  fullWidth
                  value={dateToModal}
                  {...(isupdate && { onChange: e => setBirthdate(e.target.value) })}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-11">
                <TextField
                  className="m-2"
                  label="Adress"
                  variant="outlined"
                  fullWidth
                  value={adress}
                  {...(isupdate && { onChange: e => setAdress(e.target.value) })}
                />
              </div>
            </div>
            {isupdate && (
              <div className="d-flex justufy-content-end">
                <button className="m-2 btn btn-primary" onClick={sendUpdate}>
                  Update
                </button>
              </div>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default PatientsList;
