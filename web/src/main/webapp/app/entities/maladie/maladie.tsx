import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import $ from 'jquery';
import 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-responsive-dt/js/responsive.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';

import Modal from '@mui/material/Modal';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Skeleton } from 'primereact/skeleton';
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
import { ProgressBar } from 'primereact/progressbar';

import { getEntities } from './maladie.reducer';
import Box from '@mui/material/Box';
import axios from 'axios';
import ImageListItem from '@mui/material/ImageListItem';
import ImageList from '@mui/material/ImageList';
import _default from 'chart.js/dist/plugins/plugin.tooltip';
import borderColor = _default.defaults.borderColor;

const buttonContainerStyle = {
  display: 'flex',
  alignItems: 'center',
};
const headerColor = {
  backgroundColor: '#54B4D3',
};
const buttonStyle = {
  marginRight: '10px',
};

interface Maladie {
  fullName: string;
}
export const Maladie = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const maladieList = useAppSelector(state => state.maladie.entities);
  const loading = useAppSelector(state => state.maladie.loading);

  const [visibleModal, setModalVisible] = useState(false);
  const [data, setData] = useState<Maladie | {}>({});
  const [stades, setStades] = useState([]);
  const [images, setImages] = useState([]);
  const [indice, setIndice] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentImages = images && images[0] && images[indice].slice(indexOfFirstItem, indexOfLastItem);
  const [loadingM, setLoadingM] = useState(true);

  const changeIndice = i => {
    setIndice(i);
  };
  const handlePageChange = newPage => {
    setCurrentPage(newPage);
  };

  const ViewDisease = async id => {
    console.log(id);
    setModalVisible(true);
    try {
      let response = await axios
        .get('/api/maladies/' + id)
        .then(response => {
          setData(response.data.maladie);
          setStades(response.data.stades);
          const stadeImages = response.data.stades.map(e => e.imageStades);
          setLoadingM(false);
          setImages(stadeImages);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
      setModalVisible(false);
    }
  };

  const handleClose = () => {
    setModalVisible(false);
    setData({});
    setImages([]);
    setStades([]);
    setCurrentPage(1);
    setIndice(0);
    setLoadingM(true);
  };

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

  useEffect(() => {
    if (maladieList.length > 0) {
      const table = $('#myTable').DataTable();
      return () => {
        table.destroy();
      };
    }
  }, [maladieList]);

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = sortState.sort;
    const order = sortState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    } else {
      return order === ASC ? faSortUp : faSortDown;
    }
  };

  return (
    <div className="p-2 card p-4">
      <h2 id="maladie-heading" data-cy="MaladieHeading">
        <Translate contentKey="assistanteDermatologueApp.maladie.home.title">Maladies</Translate>
        <div className="d-flex justify-content-end">
          {/*<Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>*/}
          {/*  <FontAwesomeIcon icon="sync" spin={loading} />{' '}*/}
          {/*  <Translate contentKey="assistanteDermatologueApp.maladie.home.refreshListLabel">Refresh List</Translate>*/}
          {/*</Button>*/}
          <Link to="/maladie/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="assistanteDermatologueApp.maladie.home.createLabel">Create new Maladie</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {maladieList && maladieList.length > 0 ? (
          <Table className="table table-responsive" id="myTable">
            <thead>
              <tr>
                <th className="hand" onClick={sort('fullName')}>
                  <Translate contentKey="assistanteDermatologueApp.maladie.fullName">Full Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('fullName')} />
                </th>
                <th className="hand" onClick={sort('abbr')}>
                  <Translate contentKey="assistanteDermatologueApp.maladie.abbr">Abbr</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('abbr')} />
                </th>

                <th />
              </tr>
            </thead>
            <tbody>
              {maladieList.map((maladie, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>{maladie.fullName}</td>
                  <td>{maladie.abbr}</td>

                  <td className="text-end">
                    <div className="flex-btn-group-container" style={buttonContainerStyle}>
                      <Button
                        // tag={Link}
                        // to={`/maladie/${maladie.id}`}
                        onClick={() => ViewDisease(maladie.id)}
                        color="info"
                        size="sm"
                        data-cy="entityDetailsButton"
                        style={buttonStyle}
                      >
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/maladie/${maladie.id}/edit`}
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
                      <Button
                        onClick={() => (location.href = `/maladie/${maladie.id}/delete`)}
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
              <Translate contentKey="assistanteDermatologueApp.maladie.home.notFound">No Maladies found</Translate>
            </div>
          )
        )}
      </div>

      <Modal open={visibleModal} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className="card card-responsive" style={{ overflowY: 'auto' }}>
            <div style={{ textAlign: 'center' }}>
              {Object.keys(data).length > 0 && <div className="card-header">Details of {'fullName' in data ? data.fullName : ''} </div>}
            </div>

            <div style={{ marginBottom: '20px', justifyContent: 'space-between' }}>
              {stades.map((e, index) => (
                <Button
                  className="btn btn-secondary"
                  key={index}
                  variant="outlined"
                  onClick={() => changeIndice(index)}
                  style={{
                    border: indice === index ? '2px solid blue' : '2px solid transparent',
                    marginRight: '8px',
                  }}
                >
                  {e.stade}
                </Button>
              ))}
            </div>
            {loadingM ? (
              <div className="card flex justify-content-center">
                <ProgressSpinner />
              </div>
            ) : (
              <div className="">
                <ImageList sx={{ height: 350 }} cols={3} rowHeight={100}>
                  {currentImages &&
                    currentImages.map(item => (
                      <ImageListItem key={item.picture}>
                        <img
                          srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                          src={`data:image/jpeg;base64,${item.picture}`}
                          alt={item.id}
                          loading="lazy"
                        />
                      </ImageListItem>
                    ))}
                </ImageList>
              </div>
            )}

            <hr />
            <div>
              {images && images[0] && images[indice].length > itemsPerPage && (
                <div>
                  {Array.from({ length: Math.ceil(images[indice].length / itemsPerPage) }).map((_, index) => (
                    <Button
                      key={index}
                      variant={currentPage === index + 1 ? 'contained' : 'outlined'}
                      onClick={() => handlePageChange(index + 1)}
                      style={{ margin: '5px' }}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Maladie;
