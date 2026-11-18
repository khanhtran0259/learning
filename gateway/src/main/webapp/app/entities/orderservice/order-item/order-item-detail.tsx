import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './order-item.reducer';

export const OrderItemDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id!));
  }, []);

  const orderItemEntity = useAppSelector(state => state.gateway.orderItem.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="orderItemDetailsHeading">
          <Translate contentKey="gatewayApp.orderserviceOrderItem.detail.title">OrderItem</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{orderItemEntity.id}</dd>
          <dt>
            <span id="productId">
              <Translate contentKey="gatewayApp.orderserviceOrderItem.productId">Product Id</Translate>
            </span>
          </dt>
          <dd>{orderItemEntity.productId}</dd>
          <dt>
            <span id="productName">
              <Translate contentKey="gatewayApp.orderserviceOrderItem.productName">Product Name</Translate>
            </span>
          </dt>
          <dd>{orderItemEntity.productName}</dd>
          <dt>
            <span id="price">
              <Translate contentKey="gatewayApp.orderserviceOrderItem.price">Price</Translate>
            </span>
          </dt>
          <dd>{orderItemEntity.price}</dd>
          <dt>
            <span id="quantity">
              <Translate contentKey="gatewayApp.orderserviceOrderItem.quantity">Quantity</Translate>
            </span>
          </dt>
          <dd>{orderItemEntity.quantity}</dd>
          <dt>
            <Translate contentKey="gatewayApp.orderserviceOrderItem.order">Order</Translate>
          </dt>
          <dd>{orderItemEntity.order ? orderItemEntity.order.id : ''}</dd>
        </dl>
        <Button as={Link as any} to="/order-item" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/order-item/${orderItemEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default OrderItemDetail;
