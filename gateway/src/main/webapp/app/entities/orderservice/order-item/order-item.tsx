import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Translate, getSortState } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router';

import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC } from 'app/shared/util/pagination.constants';

import { getEntities } from './order-item.reducer';

export const OrderItem = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const orderItemList = useAppSelector(state => state.gateway.orderItem.entities);
  const loading = useAppSelector(state => state.gateway.orderItem.loading);

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

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = sortState.sort;
    const { order } = sortState;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  return (
    <div>
      <h2 id="order-item-heading" data-cy="OrderItemHeading">
        <Translate contentKey="gatewayApp.orderserviceOrderItem.home.title">Order Items</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="gatewayApp.orderserviceOrderItem.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/order-item/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="gatewayApp.orderserviceOrderItem.home.createLabel">Create new Order Item</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {orderItemList?.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="gatewayApp.orderserviceOrderItem.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('productId')}>
                  <Translate contentKey="gatewayApp.orderserviceOrderItem.productId">Product Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('productId')} />
                </th>
                <th className="hand" onClick={sort('productName')}>
                  <Translate contentKey="gatewayApp.orderserviceOrderItem.productName">Product Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('productName')} />
                </th>
                <th className="hand" onClick={sort('price')}>
                  <Translate contentKey="gatewayApp.orderserviceOrderItem.price">Price</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('price')} />
                </th>
                <th className="hand" onClick={sort('quantity')}>
                  <Translate contentKey="gatewayApp.orderserviceOrderItem.quantity">Quantity</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('quantity')} />
                </th>
                <th>
                  <Translate contentKey="gatewayApp.orderserviceOrderItem.order">Order</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {orderItemList.map(orderItem => (
                <tr key={`entity-${orderItem.id}`} data-cy="entityTable">
                  <td>
                    <Button as={Link as any} to={`/order-item/${orderItem.id}`} variant="link" size="sm">
                      {orderItem.id}
                    </Button>
                  </td>
                  <td>{orderItem.productId}</td>
                  <td>{orderItem.productName}</td>
                  <td>{orderItem.price}</td>
                  <td>{orderItem.quantity}</td>
                  <td>{orderItem.order ? <Link to={`/customer-order/${orderItem.order.id}`}>{orderItem.order.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button as={Link as any} to={`/order-item/${orderItem.id}`} variant="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        as={Link as any}
                        to={`/order-item/${orderItem.id}/edit`}
                        variant="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => (globalThis.location.href = `/order-item/${orderItem.id}/delete`)}
                        variant="danger"
                        size="sm"
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
              <Translate contentKey="gatewayApp.orderserviceOrderItem.home.notFound">No Order Items found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default OrderItem;
