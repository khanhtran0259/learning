package com.mycompany.order.domain;

import static com.mycompany.order.domain.CustomerOrderTestSamples.*;
import static com.mycompany.order.domain.OrderItemTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.order.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrderItemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrderItem.class);
        OrderItem orderItem1 = getOrderItemSample1();
        OrderItem orderItem2 = new OrderItem();
        assertThat(orderItem1).isNotEqualTo(orderItem2);

        orderItem2.setId(orderItem1.getId());
        assertThat(orderItem1).isEqualTo(orderItem2);

        orderItem2 = getOrderItemSample2();
        assertThat(orderItem1).isNotEqualTo(orderItem2);
    }

    @Test
    void orderTest() {
        OrderItem orderItem = getOrderItemRandomSampleGenerator();
        CustomerOrder customerOrderBack = getCustomerOrderRandomSampleGenerator();

        orderItem.setOrder(customerOrderBack);
        assertThat(orderItem.getOrder()).isEqualTo(customerOrderBack);

        orderItem.order(null);
        assertThat(orderItem.getOrder()).isNull();
    }
}
