package com.mycompany.order.service.dto;

import com.mycompany.order.domain.enumeration.OrderStatus;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.mycompany.order.domain.CustomerOrder} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CustomerOrderDTO implements Serializable {

    private Long id;

    @NotNull
    private String orderCode;

    @NotNull
    private Instant orderDate;

    @NotNull
    private BigDecimal totalAmount;

    @NotNull
    private OrderStatus status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderCode() {
        return orderCode;
    }

    public void setOrderCode(String orderCode) {
        this.orderCode = orderCode;
    }

    public Instant getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Instant orderDate) {
        this.orderDate = orderDate;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CustomerOrderDTO)) {
            return false;
        }

        CustomerOrderDTO customerOrderDTO = (CustomerOrderDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, customerOrderDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CustomerOrderDTO{" +
            "id=" + getId() +
            ", orderCode='" + getOrderCode() + "'" +
            ", orderDate='" + getOrderDate() + "'" +
            ", totalAmount=" + getTotalAmount() +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
