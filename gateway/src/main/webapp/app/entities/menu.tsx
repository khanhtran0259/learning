import React from 'react';
import { Translate } from 'react-jhipster';

import MenuItem from 'app/shared/layout/menus/menu-item';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="asterisk" to="/product">
        <Translate contentKey="global.menu.entities.productserviceProduct" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/customer-order">
        <Translate contentKey="global.menu.entities.orderserviceCustomerOrder" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/order-item">
        <Translate contentKey="global.menu.entities.orderserviceOrderItem" />
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
