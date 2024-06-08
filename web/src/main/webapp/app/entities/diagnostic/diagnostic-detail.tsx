import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, openFile, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './diagnostic.reducer';

export const DiagnosticDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const diagnosticEntity = useAppSelector(state => state.diagnostic.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="diagnosticDetailsHeading">
          <Translate contentKey="assistanteDermatologueApp.diagnostic.detail.title">Diagnostic</Translate>
        </h2>
        <dl className="jh-entity-details">
          {/* <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{diagnosticEntity.id}</dd> */}
          <dt>
            <span id="dateDiagnostic">
              <Translate contentKey="assistanteDermatologueApp.diagnostic.dateDiagnostic">Date Diagnostic</Translate>
            </span>
          </dt>
          <dd>
            {diagnosticEntity.dateDiagnostic ? (
              <TextFormat value={diagnosticEntity.dateDiagnostic} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="picture">
              <Translate contentKey="assistanteDermatologueApp.diagnostic.picture">Picture</Translate>
            </span>
          </dt>
          <dd>
            {diagnosticEntity.picture ? (
              <div>
                {diagnosticEntity.pictureContentType ? (
                  <a onClick={openFile(diagnosticEntity.pictureContentType, diagnosticEntity.picture)}>
                    <img
                      src={`data:${diagnosticEntity.pictureContentType};base64,${diagnosticEntity.picture}`}
                      style={{ maxHeight: '30px' }}
                    />
                  </a>
                ) : null}
                <span>
                  {diagnosticEntity.pictureContentType}, {byteSize(diagnosticEntity.picture)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="description">
              <Translate contentKey="assistanteDermatologueApp.diagnostic.description">Description</Translate>
            </span>
          </dt>
          <dd>{diagnosticEntity.description}</dd>
          <dt>
            <span id="prescription">
              <Translate contentKey="assistanteDermatologueApp.diagnostic.prescription">Prescription</Translate>
            </span>
          </dt>
          <dd>{diagnosticEntity.prescription}</dd>
          <dt>
            <span id="probability">
              <Translate contentKey="assistanteDermatologueApp.diagnostic.probability">Probability</Translate>
            </span>
          </dt>
          <dd>{diagnosticEntity.probability}</dd>
          {/* <dt>
            <Translate contentKey="assistanteDermatologueApp.diagnostic.consultations">Consultations</Translate>
          </dt>
          <dd>{diagnosticEntity.consultations ? diagnosticEntity.consultations.id : ''}</dd> */}
        </dl>
        <Button tag={Link} to="/diagnostic" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/diagnostic/${diagnosticEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default DiagnosticDetail;
