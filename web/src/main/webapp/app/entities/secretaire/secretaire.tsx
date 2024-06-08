import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './secretaire.reducer';
import $ from 'jquery';
import 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-responsive-dt/js/responsive.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';

import Avatar from '@mui/material/Avatar';
import { Row, Col, FormText } from 'reactstrap';
import { isNumber, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
import { getEntity, updateEntity, createEntity, reset } from './secretaire.reducer';
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

export const Secretaire = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [codeEmp, setCodeEmpl] = useState('');
  const [gender, setGender] = useState('');
  const [dateToModal, setDate] = useState('');
  const [visible, setVisible] = useState(false);
  const [isupdate, setUpdate] = useState(false);
  const [id, setId] = useState(1);
  const users = useAppSelector(state => state.userManagement.users);
  // localStorage.setItem('Users', users);
  const secretaireEntity = useAppSelector(state => state.secretaire.entity);
  // const loading = useAppSelector(state => state.secretaire.loading);
  const updating = useAppSelector(state => state.secretaire.updating);
  const updateSuccess = useAppSelector(state => state.secretaire.updateSuccess);

  const handleClose = () => {
    setVisible(false);
    setUpdate(false);
  };
  const toggle = () => {
    setIsModelOpen(false);
  };

  const extractBirthdate = date => {
    var birthDate = new Date(date);
    var year = birthDate.getFullYear();
    var month = birthDate.getMonth() + 1;
    var day = birthDate.getDate();
    return `${year}-${month}-${day}`;
  };
  const viewSecretaire = id => {
    setVisible(true);
    console.log(id + ' secretaire id');
    const element = secretaireList.find(e => e.id === id);
    if (element) {
      console.log(element);
      setFirstName(element.user.firstName);
      setLastName(element.user.lastName);
      setEmail(element.user.email);
      setDate(extractBirthdate(element.birthdate));
      setPhone(element.telephone);
      setGender(element.genre);
      setCodeEmpl(element.codeEmp);
    } else {
      console.log('error');
    }
  };
  const [isClicked, setIsClicked] = useState(false);
  const saveSecretaireEntity = values => {
    setIsClicked(!isClicked);
    console.log(values);
    if (
      formData.secretaire.codeEmp !== '' &&
      formData.secretaire.telephone !== '' &&
      formData.secretaire.genre !== '' &&
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

  const [isModelOpen, setIsModelOpen] = useState(false);

  const toggleModel = () => {
    setIsModelOpen(!isModelOpen);
  };

  const [formData, setFormData] = useState({
    secretaire: {
      codeEmp: '',
      telephone: '',
      genre: '',
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

  const editSecretaire = id => {
    setVisible(true);
    setUpdate(true);
    const secretaire = secretaireList.find(e => e.id === id);
    console.log(secretaire);
    if (secretaire) {
      console.log(secretaire);
      setFirstName(secretaire.user.firstName);
      setLastName(secretaire.user.lastName);
      setEmail(secretaire.user.email);
      setDate(extractBirthdate(secretaire.birthdate));
      setPhone(secretaire.telephone);
      setGender(secretaire.genre);
      setCodeEmpl(secretaire.codeEmp);
      setId(id);
    } else {
      console.log('patient not found');
    }
  };

  const dataJson = {
    id: id,
    codeEmp: codeEmp,
    genre: gender,
    telephone: phone,
    user: {
      email: email,
      firstName: firstName,
      lastName: lastName,
    },
  };

  const sendUpdate = () => {
    axios
      .put('/api/secretaires/update/' + id, dataJson, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('jhi-authenticationToken')}`,
        },
      })
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

  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const secretaireList = useAppSelector(state => state.secretaire.entities);
  const loading = useAppSelector(state => state.secretaire.loading);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `${sortState.sort},${sortState.order}`,
      }),
    );
  };

  useEffect(() => {
    if (secretaireList.length > 0) {
      const table = $('#myTable').DataTable();
      return () => {
        table.destroy();
      };
    }
  }, [secretaireList]);

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
  // const storedUser = JSON.parse(localStorage.getItem('SecretaireUser'));

  return (
    <div className="p-2 card">
      <h2 id="secretaire-heading" data-cy="SecretaireHeading" className="card-header">
        Secretaries
        <div className="d-flex justify-content-end">
          {/*<Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>*/}
          {/*  <FontAwesomeIcon icon="sync" spin={loading} />{' '}*/}
          {/*  <Translate contentKey="assistanteDermatologueApp.secretaire.home.refreshListLabel">Refresh List</Translate>*/}
          {/*</Button>*/}
          {/* <Link to="/secretaire/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="assistanteDermatologueApp.secretaire.home.createLabel">Create new Secretaire</Translate>
          </Link> */}
          <Button color="primary" onClick={toggleModel}>
            Create new Secretaire
          </Button>
        </div>
      </h2>
      <div className="card-body">
        {secretaireList && secretaireList.length > 0 ? (
          <table className="table table-responsive p-3" id="myTable">
            <thead>
              <tr>
                {/*<th className="hand" onClick={sort('id')}>*/}
                {/*  <Translate contentKey="assistanteDermatologueApp.secretaire.id">ID</Translate>{' '}*/}
                {/*  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />*/}
                {/*</th>*/}
                <th className="hand" onClick={sort('codeEmp')}>
                  <Translate contentKey="assistanteDermatologueApp.secretaire.codeEmp">Code Emp</Translate>{' '}
                </th>
                <th className="hand" onClick={sort('genre')}>
                  Gender
                  {/*<FontAwesomeIcon icon={getSortIconByFieldName('genre')} />*/}
                </th>
                <th className="hand" onClick={sort('telephone')}>
                  Phone
                </th>
                <th>Full Name</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {secretaireList.map((secretaire, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  {/*<td>*/}
                  {/*  <Button tag={Link} to={`/secretaire/${secretaire.id}`} color="link" size="sm">*/}
                  {/*    {secretaire.id}*/}
                  {/*  </Button>*/}
                  {/*</td>*/}
                  <td>{secretaire.codeEmp}</td>
                  <td>{secretaire.genre}</td>
                  <td>{secretaire.telephone}</td>
                  <td>{secretaire.user ? secretaire.user.firstName + ' ' + secretaire.user.lastName : ''}</td>
                  <td className="text-end">
                    <div className="flex-btn-group-container" style={buttonContainerStyle}>
                      <Button
                        onClick={() => viewSecretaire(secretaire.id)}
                        // tag={Link} to={`/secretaire/${secretaire.id}`}
                        color="info"
                        size="sm"
                        style={buttonStyle}
                        data-cy="entityDetailsButton"
                      >
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => editSecretaire(secretaire.id)}
                        // tag={Link} to={`/secretaire/${secretaire.id}/edit`}
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
                        onClick={() => (location.href = `/secretaire/${secretaire.id}/delete`)}
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
              <Translate contentKey="assistanteDermatologueApp.secretaire.home.notFound">No Secretaires found</Translate>
            </div>
          )
        )}
      </div>

      <Modal open={visible} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className="card card-responsive">
            <div className="card-header">Secretary data</div>
            <div className="row">
              <div className="col-2">
                <Avatar
                  className="m-1"
                  alt="User Image"
                  src="../../../content/images/user-image/secretaire.png"
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
                  label="code Employee"
                  variant="outlined"
                  fullWidth
                  value={codeEmp}
                  {...(isupdate && { onChange: e => setCodeEmpl(e.target.value) })}
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
      <Modal open={isModelOpen} onClose={toggle} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-creation">
        <Box sx={style}>
          <Row className="justify-content-center">
            <Col md="15">
              <ValidatedForm onSubmit={saveSecretaireEntity}>
                <Row className="mb-3">
                  <Col md="6">
                    {false ? (
                      <ValidatedField
                        name="id"
                        required
                        readOnly
                        id="secretaire-id"
                        label={translate('global.field.id')}
                        validate={{ required: true }}
                        hidden={true}
                      />
                    ) : null}
                    <ValidatedField
                      label="Employee code"
                      id="secretaire-codeEmp"
                      name="codeEmp"
                      data-cy="codeEmp"
                      type="text"
                      validate={{ required: true }}
                      style={isClicked === true && formData.secretaire.codeEmp === '' ? inputBorderStyle : null}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          secretaire: { ...formData.secretaire, codeEmp: e.target.value },
                        });
                      }}
                    />
                  </Col>
                  <Col md="6">
                    {/* <ValidatedField id="secretaire-user" name="genre" data-cy="genre" label="Gender" type="select">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </ValidatedField> */}
                    <ValidatedField
                      id="secretaire-genre"
                      name="genre"
                      data-cy="genre"
                      label={translate('assistanteDermatologueApp.secretaire.genre')}
                      type="select"
                      validate={{ required: true }}
                      style={isClicked === true && formData.secretaire.genre === '' ? inputBorderStyle : null}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          secretaire: {
                            ...formData.secretaire,
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
                    {/*  label={translate('assistanteDermatologueApp.secretaire.genre')}*/}
                    {/*  id="secretaire-genre"*/}
                    {/*  name="genre"*/}
                    {/*  data-cy="genre"*/}
                    {/*  type="text"*/}
                    {/*  onChange={e => {*/}
                    {/*    if (isNew) {*/}
                    {/*      setFormData({*/}
                    {/*        ...formData,*/}
                    {/*        secretaire: { ...formData.secretaire, genre: e.target.value },*/}
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
                      // label={translate('assistanteDermatologueApp.secretaire.user.login')}
                      id="firstName"
                      name="user.firstName"
                      data-cy="user.firstName"
                      type="text"
                      style={isClicked === true && formData.user.firstName === '' ? inputBorderStyle : null}
                      validate={{ required: true }}
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
                      // label={translate('assistanteDermatologueApp.secretaire.user.login')}
                      id="lastName"
                      name="user.lastName"
                      data-cy="user.lastName"
                      type="text"
                      style={isClicked === true && formData.user.lastName === '' ? inputBorderStyle : null}
                      validate={{ required: true }}
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
                      validate={{ required: true }}
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
                      // label={translate('assistanteDermatologueApp.secretaire.user.login')}
                      id="lastName"
                      name="user.email"
                      data-cy="user.email"
                      type="text"
                      style={isClicked === true && formData.user.email === '' ? inputBorderStyle : null}
                      validate={{ required: true }}
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
                      label="Phone"
                      id="secretaire-telephone"
                      name="telephone"
                      data-cy="telephone"
                      type="text"
                      style={isClicked === true && formData.secretaire.telephone === '' ? inputBorderStyle : null}
                      validate={{ required: true }}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          secretaire: { ...formData.secretaire, telephone: e.target.value },
                        });
                      }}
                    />
                  </Col>
                  <Col md="6">
                    <ValidatedField
                      label="Login"
                      // label={translate('assistanteDermatologueApp.secretaire.user.login')}
                      id="login"
                      name="user.login"
                      data-cy="user.login"
                      type="text"
                      style={isClicked === true && formData.user.login === '' ? inputBorderStyle : null}
                      validate={{ required: true }}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          user: { ...formData.user, login: e.target.value },
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
          {/* </ModalBody> */}
        </Box>
      </Modal>
    </div>
  );
};

export default Secretaire;
