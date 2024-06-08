import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, openFile, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './image-stade.reducer';

export const ImageStadeDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const imageStadeEntity = useAppSelector(state => state.imageStade.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="imageStadeDetailsHeading">
          <Translate contentKey="assistanteDermatologueApp.imageStade.detail.title">ImageStade</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{imageStadeEntity.id}</dd>
          <dt>
            <span id="picture">
              <Translate contentKey="assistanteDermatologueApp.imageStade.picture">Picture</Translate>
            </span>
          </dt>
          <dd>
            {imageStadeEntity.picture ? (
              <div>
                {imageStadeEntity.pictureContentType ? (
                  <a onClick={openFile(imageStadeEntity.pictureContentType, imageStadeEntity.picture)}>
                    <img
                      src={`data:${imageStadeEntity.pictureContentType};base64,${imageStadeEntity.picture}`}
                      style={{ maxHeight: '30px' }}
                    />
                  </a>
                ) : null}
                <span>
                  {imageStadeEntity.pictureContentType}, {byteSize(imageStadeEntity.picture)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="assistanteDermatologueApp.imageStade.composition">Composition</Translate>
          </dt>
          <dd>{imageStadeEntity.composition ? imageStadeEntity.composition.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/image-stade" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/image-stade/${imageStadeEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ImageStadeDetail;
