import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './customer-order.reducer';

export const CustomerOrderDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id!));
  }, []);

  const customerOrderEntity = useAppSelector(state => state.gateway.customerOrder.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="customerOrderDetailsHeading">
          <Translate contentKey="gatewayApp.orderserviceCustomerOrder.detail.title">CustomerOrder</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{customerOrderEntity.id}</dd>
          <dt>
            <span id="orderCode">
              <Translate contentKey="gatewayApp.orderserviceCustomerOrder.orderCode">Order Code</Translate>
            </span>
          </dt>
          <dd>{customerOrderEntity.orderCode}</dd>
          <dt>
            <span id="orderDate">
              <Translate contentKey="gatewayApp.orderserviceCustomerOrder.orderDate">Order Date</Translate>
            </span>
          </dt>
          <dd>
            {customerOrderEntity.orderDate ? (
              <TextFormat value={customerOrderEntity.orderDate} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="totalAmount">
              <Translate contentKey="gatewayApp.orderserviceCustomerOrder.totalAmount">Total Amount</Translate>
            </span>
          </dt>
          <dd>{customerOrderEntity.totalAmount}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="gatewayApp.orderserviceCustomerOrder.status">Status</Translate>
            </span>
          </dt>
          <dd>{customerOrderEntity.status}</dd>
        </dl>
        <Button as={Link as any} to="/customer-order" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/customer-order/${customerOrderEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default CustomerOrderDetail;
