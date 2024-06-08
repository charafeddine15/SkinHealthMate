import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './dermatologue.reducer';
import $ from 'jquery';
import 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-responsive-dt/js/responsive.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';

import Avatar from '@mui/material/Avatar';
import { Row, Col, FormText } from 'reactstrap';
import { isNumber, translate, ValidatedField, ValidatedForm } from 'react-jhipster';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { getEntity, updateEntity, createEntity, reset } from './dermatologue.reducer';
import axios from 'axios';
import DermatologueModal from './DermatologueCreateModal';

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

export const Dermatologue = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [codeEmp, setCodeEmpl] = useState('');
  const [gender, setGender] = useState('');
  const [dateToModal, setDate] = useState('');
  const [visible, setVisible] = useState(false);
  const [isupdate, setUpdate] = useState(false);
  const users = useAppSelector(state => state.userManagement.users);
  const dermatologueEntity = useAppSelector(state => state.dermatologue.entity);
  // const loading = useAppSelector(state => state.dermatologue.loading);
  const updating = useAppSelector(state => state.dermatologue.updating);
  const updateSuccess = useAppSelector(state => state.dermatologue.updateSuccess);
  const [id, setId] = useState(1);
  const handleClose = () => {
    setVisible(false);
    setUpdate(false);
  };
  const toggle = () => {
    setIsModelOpen(false);
  };
  const [isClicked, setIsClicked] = useState(false);
  const saveDermatologueEntity = values => {
    console.log('dermatologue');
    console.log(values);
    // const entity = {
    //   ...dermatologueEntity,
    //   ...values,
    //   user: users.find(it => it.id.toString() === values.user.toString()),
    // };
    setIsClicked(!isClicked);
    console.log(values);
    if (
      formData.dermatologue.codeEmp !== '' &&
      formData.dermatologue.telephone !== '' &&
      formData.dermatologue.genre !== '' &&
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
  const [formData, setFormData] = useState({
    dermatologue: {
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
  //ajouté recement by Amine
  const [isModelOpen, setIsModelOpen] = useState(false);
  const toggleModel = () => {
    setIsModelOpen(!isModelOpen);
  };

  const extractBirthdate = date => {
    var birthDate = new Date(date);
    var year = birthDate.getFullYear();
    var month = birthDate.getMonth() + 1;
    var day = birthDate.getDate();
    return `${year}-${month}-${day}`;
  };
  const viewDermatologue = id => {
    setVisible(true);
    console.log(id + ' dermatologue id');
    const element = dermatologueList.find(e => e.id === id);
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

  const editDermatologue = id => {
    setVisible(true);
    setUpdate(true);
    const dermatologue = dermatologueList.find(e => e.id === id);
    console.log(dermatologue);
    if (dermatologue) {
      console.log(dermatologue);
      setFirstName(dermatologue.user.firstName);
      setLastName(dermatologue.user.lastName);
      setEmail(dermatologue.user.email);
      setDate(extractBirthdate(dermatologue.birthdate));
      setPhone(dermatologue.telephone);
      setGender(dermatologue.genre);
      setCodeEmpl(dermatologue.codeEmp);
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
      .put('/api/dermatologues/update/' + id, dataJson, {
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

  const dermatologueList = useAppSelector(state => state.dermatologue.entities);
  const loading = useAppSelector(state => state.dermatologue.loading);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `${sortState.sort},${sortState.order}`,
      }),
    );
  };

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

  useEffect(() => {
    if (dermatologueList.length > 0) {
      const table = $('#myTable').DataTable();
      return () => {
        table.destroy();
      };
    }
  }, [dermatologueList]);

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

  const showData = () => {
    console.log(dermatologueList);
  };

  return (
    <div className="p-2 card">
      <h2 id="dermatologue-heading" data-cy="DermatologueHeading" className="card-header">
        Dermatologists
        <div className="d-flex justify-content-end">
          {/*<Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>*/}
          {/*  <FontAwesomeIcon icon="sync" spin={loading} />{' '}*/}
          {/*  <Translate contentKey="assistanteDermatologueApp.dermatologue.home.refreshListLabel">Refresh List</Translate>*/}
          {/*</Button>*/}
          {/* <Link to="/dermatologue/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="assistanteDermatologueApp.dermatologue.home.createLabel">Create new Dermatologue</Translate>
          </Link> */}
          <Button color="primary" onClick={toggleModel}>
            Create new Dermatologue
          </Button>
          {/* <DermatologueModal isOpen={isModelOpen} toggle={toggleModel} isNew={true} /> */}
        </div>
      </h2>
      <div className="card-body p-3">
        {dermatologueList && dermatologueList.length > 0 ? (
          <table className="table table-responsive p-2" id="myTable">
            <thead>
              <tr>
                <th className="hand" onClick={sort('codeEmp')}>
                  <Translate contentKey="assistanteDermatologueApp.dermatologue.codeEmp">Code Emp</Translate>{' '}
                </th>
                <th className="hand" onClick={sort('genre')}>
                  Gender
                </th>
                <th className="hand" onClick={sort('telephone')}>
                  Phone
                </th>
                <th>Full name</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {dermatologueList.map((dermatologue, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>{dermatologue.codeEmp}</td>
                  <td>{dermatologue.genre}</td>
                  <td>{dermatologue.telephone}</td>
                  {/*<td>{dermatologue.user ? dermatologue.user : ''}</td>*/}
                  <td>{dermatologue.user ? dermatologue.user.firstName + ' ' + dermatologue.user.lastName : ''}</td>
                  <td className="text-end">
                    <div className="flex-btn-group-container" style={buttonContainerStyle}>
                      <Button
                        onClick={() => viewDermatologue(dermatologue.id)}
                        // tag={Link} to={`/dermatologue/${dermatologue.id}`}
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
                        onClick={() => editDermatologue(dermatologue.id)}
                        // tag={Link} to={`/dermatologue/${dermatologue.id}/edit`}
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
                      <Button tag={Link} to={`/dermatologue/all-patient/${dermatologue.id}`} color="warning" size="sm" style={buttonStyle}>
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline m-1">Patients info</span>
                      </Button>

                      <Button
                        onClick={() => (location.href = `/dermatologue/${dermatologue.id}/delete`)}
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
              <Translate contentKey="assistanteDermatologueApp.dermatologue.home.notFound">No Dermatologues found</Translate>
            </div>
          )
        )}
      </div>

      <Modal open={visible} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className="card card-responsive">
            <div className="card-header">Dermatologist data</div>
            <div className="row">
              <div className="col-2">
                <Avatar
                  className="m-1"
                  alt="User Image"
                  src="../../../content/images/user-image/dermatologue.png"
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
              <ValidatedForm onSubmit={saveDermatologueEntity}>
                <Row className="mb-3">
                  <Col md="6">
                    {false ? (
                      <ValidatedField
                        name="id"
                        required
                        readOnly
                        id="dermatologue-id"
                        label={translate('global.field.id')}
                        validate={{ required: true }}
                        hidden={true}
                      />
                    ) : null}
                    <ValidatedField
                      label="Employee code"
                      id="dermatologue-codeEmp"
                      name="codeEmp"
                      data-cy="codeEmp"
                      type="text"
                      style={isClicked === true && formData.dermatologue.codeEmp === '' ? inputBorderStyle : null}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          dermatologue: { ...formData.dermatologue, codeEmp: e.target.value },
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
                      id="dermatologue-genre"
                      name="genre"
                      data-cy="genre"
                      label={translate('assistanteDermatologueApp.dermatologue.genre')}
                      type="select"
                      style={isClicked === true && formData.dermatologue.genre === '' ? inputBorderStyle : null}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          dermatologue: {
                            ...formData.dermatologue,
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
                      label="Phone"
                      id="dermatologue-telephone"
                      name="telephone"
                      data-cy="telephone"
                      type="text"
                      style={isClicked === true && formData.dermatologue.telephone === '' ? inputBorderStyle : null}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          dermatologue: { ...formData.dermatologue, telephone: e.target.value },
                        });
                      }}
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

export default Dermatologue;
