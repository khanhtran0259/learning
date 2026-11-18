package com.mycompany.order.service.mapper;

import com.mycompany.order.domain.CustomerOrder;
import com.mycompany.order.service.dto.CustomerOrderDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link CustomerOrder} and its DTO {@link CustomerOrderDTO}.
 */
@Mapper(componentModel = "spring")
public interface CustomerOrderMapper extends EntityMapper<CustomerOrderDTO, CustomerOrder> {}
