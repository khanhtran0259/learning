import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate, ValidatedField, ValidatedForm, isNumber, translate } from 'react-jhipster';
import { Link, useNavigate, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { OrderStatus } from 'app/shared/model/enumerations/order-status.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';

import { createEntity, getEntity, reset, updateEntity } from './customer-order.reducer';

export const CustomerOrderUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const customerOrderEntity = useAppSelector(state => state.gateway.customerOrder.entity);
  const loading = useAppSelector(state => state.gateway.customerOrder.loading);
  const updating = useAppSelector(state => state.gateway.customerOrder.updating);
  const updateSuccess = useAppSelector(state => state.gateway.customerOrder.updateSuccess);
  const orderStatusValues = Object.keys(OrderStatus);

  const handleClose = () => {
    navigate(`/customer-order${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }
    values.orderDate = convertDateTimeToServer(values.orderDate);
    if (values.totalAmount !== undefined && typeof values.totalAmount !== 'number') {
      values.totalAmount = Number(values.totalAmount);
    }

    const entity = {
      ...customerOrderEntity,
      ...values,
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          orderDate: displayDefaultDateTime(),
        }
      : {
          status: 'PENDING',
          ...customerOrderEntity,
          orderDate: convertDateTimeFromServer(customerOrderEntity.orderDate),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="gatewayApp.orderserviceCustomerOrder.home.createOrEditLabel" data-cy="CustomerOrderCreateUpdateHeading">
            <Translate contentKey="gatewayApp.orderserviceCustomerOrder.home.createOrEditLabel">Create or edit a CustomerOrder</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm mode="all" defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew && (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="customer-order-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              )}
              <ValidatedField
                label={translate('gatewayApp.orderserviceCustomerOrder.orderCode')}
                id="customer-order-orderCode"
                name="orderCode"
                data-cy="orderCode"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.orderserviceCustomerOrder.orderDate')}
                id="customer-order-orderDate"
                name="orderDate"
                data-cy="orderDate"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.orderserviceCustomerOrder.totalAmount')}
                id="customer-order-totalAmount"
                name="totalAmount"
                data-cy="totalAmount"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.orderserviceCustomerOrder.status')}
                id="customer-order-status"
                name="status"
                data-cy="status"
                type="select"
              >
                {orderStatusValues.map(orderStatus => (
                  <option value={orderStatus} key={orderStatus}>
                    {translate(`gatewayApp.OrderStatus.${orderStatus}`)}
                  </option>
                ))}
              </ValidatedField>
              <Button as={Link as any} id="cancel-save" data-cy="entityCreateCancelButton" to="/customer-order" replace variant="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button variant="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CustomerOrderUpdate;
