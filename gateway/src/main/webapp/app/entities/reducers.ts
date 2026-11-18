import customerOrder from 'app/entities/orderservice/customer-order/customer-order.reducer';
import orderItem from 'app/entities/orderservice/order-item/order-item.reducer';
import product from 'app/entities/productservice/product/product.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  product,
  customerOrder,
  orderItem,
  // jhipster-needle-add-reducer-combine - JHipster will add reducer here
};

export default entitiesReducers;
