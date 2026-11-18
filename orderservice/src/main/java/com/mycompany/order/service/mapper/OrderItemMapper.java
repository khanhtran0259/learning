package com.mycompany.order.service.mapper;

import com.mycompany.order.domain.CustomerOrder;
import com.mycompany.order.domain.OrderItem;
import com.mycompany.order.service.dto.CustomerOrderDTO;
import com.mycompany.order.service.dto.OrderItemDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link OrderItem} and its DTO {@link OrderItemDTO}.
 */
@Mapper(componentModel = "spring")
public interface OrderItemMapper extends EntityMapper<OrderItemDTO, OrderItem> {
    @Mapping(target = "order", source = "order", qualifiedByName = "customerOrderId")
    OrderItemDTO toDto(OrderItem s);

    @Named("customerOrderId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CustomerOrderDTO toDtoCustomerOrderId(CustomerOrder customerOrder);
}
