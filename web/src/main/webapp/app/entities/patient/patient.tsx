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
import { Row, Col, FormText } from 'reactstrap';
import { isNumber, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { IPatient } from 'app/shared/model/patient.model';
import { getEntity, updateEntity, createEntity, reset } from './patient.reducer';

import { getEntities } from './patient.reducer';
import $ from 'jquery';
import 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-responsive-dt/js/responsive.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
import Avatar from '@mui/material/Avatar';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
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
const inputBorderStyle = {
  border: '1px solid red',
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

export const Patient = () => {
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
  const users = useAppSelector(state => state.userManagement.users);
  const patientEntity = useAppSelector(state => state.patient.entity);
  // const loading = useAppSelector(state => state.patient.loading);
  const updating = useAppSelector(state => state.patient.updating);
  const updateSuccess = useAppSelector(state => state.patient.updateSuccess);

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
  }, [patientList]);
  const sortEntities = () => {
    getAllEntities();
    const endURL = `?sort=${sortState.sort},${sortState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };
  const [isClicked, setIsClicked] = useState(false);
  const savePatientEntity = values => {
    setIsClicked(!isClicked);
    values.birthdate = convertDateTimeToServer(values.birthdate);

    // const entity = {
    //   ...patientEntity,
    //   ...values,
    //   user: users.find(it => it.id.toString() === values.user.toString()),
    // };
    if (
      formData.patient.birthdate !== '' &&
      formData.patient.telephone !== '' &&
      formData.patient.genre !== '' &&
      formData.patient.adress !== '' &&
      formData.user.login !== '' &&
      formData.user.password !== '' &&
      formData.user.firstName !== '' &&
      formData.user.lastName !== '' &&
      formData.user.email !== ''
    ) {
      try {
        dispatch(createEntity(formData));
        toggleModel();
        getAllEntities();
        window.location.reload();
      } catch (error) {
        console.error('Error in API request:', error);
      }
    } else {
      console.log('Veuillez remplir tous les champs du formulaire.');
    }
  };
  const handleDatetimeLocalChange = e => {
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
  };

  const [formData, setFormData] = useState({
    patient: {
      birthdate: '',
      telephone: '',
      genre: '',
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
  const toggle = () => {
    setIsModelOpen(false);
  };

  const [isModelOpen, setIsModelOpen] = useState(false);
  const toggleModel = () => {
    setIsModelOpen(!isModelOpen);
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

  const [variable, setVariable] = useState(false);
  const deletePatinet = id => {
    console.log(id);
    axios
      .delete('/api/patients/' + id)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      });
    setVariable(!variable);
  };

  useEffect(() => {
    getAllEntities();
  }, [variable]);

  return (
    <div className="p-2 card">
      <h2 id="patient-heading" data-cy="PatientHeading" className="card-header">
        <Translate contentKey="assistanteDermatologueApp.patient.home.title">Patients</Translate>
        <div className="d-flex justify-content-end">
          {/*<Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>*/}
          {/*  <FontAwesomeIcon icon="sync" spin={loading} />{' '}*/}
          {/*  <Translate contentKey="assistanteDermatologueApp.patient.home.refreshListLabel">Refresh List</Translate>*/}
          {/*</Button>*/}

          <Button color="primary" onClick={toggleModel}>
            Create new Patient
          </Button>
        </div>
      </h2>
      <div className="card-body p-3 ">
        {patientList && patientList.length > 0 ? (
          <table className="table table-responsive" id="myTable">
            <thead>
              <tr>
                {/*<th className="hand" onClick={sort('id')}>*/}
                {/*  <Translate contentKey="assistanteDermatologueApp.patient.id">ID</Translate>{' '}*/}
                {/*  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />*/}
                {/*</th>*/}
                <th className="hand" onClick={sort('birthdate')}>
                  <Translate contentKey="assistanteDermatologueApp.patient.birthdate">Birthdate</Translate>{' '}
                  {/*<FontAwesomeIcon icon={getSortIconByFieldName('birthdate')} />*/}
                </th>
                <th className="hand" onClick={sort('adress')}>
                  <Translate contentKey="assistanteDermatologueApp.patient.adress">Adress</Translate>{' '}
                  {/*<FontAwesomeIcon icon={getSortIconByFieldName('adress')} />*/}
                </th>
                <th className="hand" onClick={sort('genre')}>
                  Gender
                  {/*<FontAwesomeIcon icon={getSortIconByFieldName('genre')} />*/}
                </th>
                <th className="hand" onClick={sort('telephone')}>
                  Phone
                  {/*<FontAwesomeIcon icon={getSortIconByFieldName('telephone')} />*/}
                </th>
                <th>Full name</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {patientList.map((patient, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  {/*<td>*/}
                  {/*  <Button tag={Link} to={`/patient/${patient.id}`} color="link" size="sm">*/}
                  {/*    {patient.id}*/}
                  {/*  </Button>*/}
                  {/*</td>*/}
                  {/*<td>{patient.birthdate ? <TextFormat type="date" value={patient.birthdate} format={APP_DATE_FORMAT} /> : null}</td>*/}
                  <td>{patient.birthdate ? new Date(patient.birthdate).toLocaleDateString() : null}</td>

                  <td>{patient.adress}</td>
                  <td>{patient.genre}</td>
                  <td>{patient.telephone}</td>
                  <td>{patient.user ? patient.user.firstName + ' ' + patient.user.lastName : ''}</td>
                  <td className="text-end">
                    <div className="flex-btn-group-container" style={buttonContainerStyle}>
                      <Button onClick={() => viewPatient(patient.id)} color="info" size="sm" style={buttonStyle}>
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => editPatient(patient.id)}
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
                        onClick={() => (location.href = `/patient/${patient.id}/delete`)}
                        // onClick={() =>{deletePatinet(patient.id)}}
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
          </table>
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
      <Modal open={isModelOpen} onClose={toggle} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Row className="justify-content-center">
            <Col md="15">
              <ValidatedForm onSubmit={savePatientEntity}>
                <Row className="mb-3">
                  <Col md="6">
                    {false ? (
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
                      label={translate('assistanteDermatologueApp.patient.adress')}
                      id="patient-adress"
                      name="adress"
                      data-cy="adress"
                      type="text"
                      style={isClicked === true && formData.patient.adress === '' ? inputBorderStyle : null}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          patient: { ...formData.patient, adress: e.target.value },
                        });
                      }}
                    />
                  </Col>
                  <Col md="6">
                    {/* <ValidatedField id="dermatologue-user" name="genre" data-cy="genre" label="Gender" type="select">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </ValidatedField> */}
                    <ValidatedField
                      id="patient-genre"
                      name="genre"
                      data-cy="genre"
                      label={translate('assistanteDermatologueApp.patient.genre')}
                      type="select"
                      validate={{ required: true }}
                      style={isClicked === true && formData.patient.genre === '' ? inputBorderStyle : null}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          patient: {
                            ...formData.patient,
                            genre: e.target.value,
                          },
                        });
                      }}
                    >
                      <option disabled selected>
                        Choose a value
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </ValidatedField>

                    {/* <ValidatedField*/}
                    {/*  label={translate('assistanteDermatologueApp.dermatologue.genre')}*/}
                    {/*  id="dermatologue-genre"*/}
                    {/*  name="genre"*/}
                    {/*  data-cy="genre"*/}
                    {/*  type="text"*/}
                    {/*  onChange={e => {*/}
                    {/*    if (isNew) {*/}
                    {/*      setFormData({*/}
                    {/*        ...formData,*/}
                    {/*        dermatologue: { ...formData.dermatologue, genre: e.target.value },*/}
                    {/*      });*/}
                    {/*    }*/}
                    {/*  }}*/}
                    {/*/> */}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md="6">
                    <ValidatedField
                      label="First name"
                      // label={translate('assistanteDermatologueApp.dermatologue.user.login')}
                      id="firstName"
                      name="user.firstName"
                      data-cy="user.firstName"
                      type="text"
                      style={isClicked === true && formData.user.firstName === '' ? inputBorderStyle : null}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          user: { ...formData.user, firstName: e.target.value },
                        });
                      }}
                    />
                  </Col>
                  <Col md="6">
                    <ValidatedField
                      label="Last name"
                      // label={translate('assistanteDermatologueApp.dermatologue.user.login')}
                      id="lastName"
                      name="user.lastName"
                      data-cy="user.lastName"
                      type="text"
                      style={isClicked === true && formData.user.lastName === '' ? inputBorderStyle : null}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          user: { ...formData.user, lastName: e.target.value },
                        });
                      }}
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md="6">
                    <ValidatedField
                      label="Password"
                      id="password"
                      name="user.passwword"
                      data-cy="user.password"
                      type="password"
                      style={isClicked === true && formData.user.password === '' ? inputBorderStyle : null}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          user: { ...formData.user, password: e.target.value },
                        });
                      }}
                    />
                  </Col>
                  <Col md="6">
                    <ValidatedField
                      label="Email"
                      // label={translate('assistanteDermatologueApp.dermatologue.user.login')}
                      id="lastName"
                      name="user.email"
                      data-cy="user.email"
                      type="text"
                      style={isClicked === true && formData.user.email === '' ? inputBorderStyle : null}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          user: { ...formData.user, email: e.target.value },
                        });
                      }}
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md="6">
                    <ValidatedField
                      label={translate('assistanteDermatologueApp.patient.birthdate')}
                      id="patient-birthdate"
                      name="birthdat"
                      data-cy="birthdat"
                      type="datetime-local"
                      style={isClicked === true && formData.patient.birthdate === '' ? inputBorderStyle : null}
                      placeholder="YYYY-MM-DD"
                      onChange={handleDatetimeLocalChange}
                    />
                  </Col>
                  <Col md="6">
                    <ValidatedField
                      label="Login"
                      // label={translate('assistanteDermatologueApp.dermatologue.user.login')}
                      id="login"
                      name="user.login"
                      data-cy="user.login"
                      type="text"
                      style={isClicked === true && formData.user.login === '' ? inputBorderStyle : null}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          user: { ...formData.user, login: e.target.value },
                        });
                      }}
                    />
                    <ValidatedField
                      label="Phone"
                      id="patient-telephone"
                      name="telephone"
                      data-cy="telephone"
                      type="text"
                      style={isClicked === true && formData.patient.telephone === '' ? inputBorderStyle : null}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          patient: { ...formData.patient, telephone: e.target.value },
                        });
                      }}
                    />
                  </Col>
                </Row>
                {/* </Row>
              </Col> */}
                <Button color="danger" onClick={toggle}>
                  Close
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </ValidatedForm>
            </Col>
          </Row>
        </Box>
      </Modal>
    </div>
  );
};

export default Patient;
