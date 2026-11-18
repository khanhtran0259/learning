package com.mycompany.order.web.rest;

import com.mycompany.order.client.ProductClient;
import com.mycompany.order.client.ProductDTO;
import com.mycompany.order.domain.enumeration.OrderStatus;
import com.mycompany.order.service.CustomerOrderService;
import com.mycompany.order.service.OrderItemService;
import com.mycompany.order.service.dto.CustomerOrderDTO;
import com.mycompany.order.service.dto.OrderItemDTO;
import com.mycompany.order.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class OrderCheckoutResource {

    private static final Logger LOG = LoggerFactory.getLogger(OrderCheckoutResource.class);
    private static final String ENTITY_NAME = "orderserviceOrderCheckout";

    private final ProductClient productClient;
    private final CustomerOrderService customerOrderService;
    private final OrderItemService orderItemService;

    public OrderCheckoutResource(
        ProductClient productClient,
        CustomerOrderService customerOrderService,
        OrderItemService orderItemService
    ) {
        this.productClient = productClient;
        this.customerOrderService = customerOrderService;
        this.orderItemService = orderItemService;
    }

    public static class CheckoutItemRequest {

        @NotNull
        private Long productId;

        @NotNull
        @Min(1)
        private Integer quantity;

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }

    public static class CheckoutRequest {

        @NotEmpty
        private List<@Valid CheckoutItemRequest> items;

        public List<CheckoutItemRequest> getItems() {
            return items;
        }

        public void setItems(List<CheckoutItemRequest> items) {
            this.items = items;
        }
    }

    public static class CheckoutResponse {

        private CustomerOrderDTO order;
        private List<OrderItemDTO> items;

        public CheckoutResponse(CustomerOrderDTO order, List<OrderItemDTO> items) {
            this.order = order;
            this.items = items;
        }

        public CustomerOrderDTO getOrder() {
            return order;
        }

        public List<OrderItemDTO> getItems() {
            return items;
        }
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> checkout(@Valid @RequestBody CheckoutRequest request) {
        LOG.info("Processing checkout request for {} items via Feign communication with productservice", request.getItems().size());

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItemDTO> orderItemsToSave = new ArrayList<>();

        for (CheckoutItemRequest itemReq : request.getItems()) {
            ProductDTO product;
            try {
                product = productClient.getProduct(itemReq.getProductId());
            } catch (Exception e) {
                LOG.error("Failed to query productservice for product ID: {}", itemReq.getProductId(), e);
                throw new BadRequestAlertException("Product not found in productservice: " + itemReq.getProductId(), ENTITY_NAME, "productnotfound");
            }

            if (product == null) {
                throw new BadRequestAlertException("Product does not exist: " + itemReq.getProductId(), ENTITY_NAME, "productnotfound");
            }

            if (product.getStockQuantity() == null || product.getStockQuantity() < itemReq.getQuantity()) {
                throw new BadRequestAlertException(
                    "Insufficient stock for product " + product.getName() + " (Available: " + product.getStockQuantity() + ")",
                    ENTITY_NAME,
                    "outofstock"
                );
            }

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setProductId(product.getId());
            itemDTO.setProductName(product.getName());
            itemDTO.setPrice(product.getPrice());
            itemDTO.setQuantity(itemReq.getQuantity());
            orderItemsToSave.add(itemDTO);
        }

        CustomerOrderDTO orderDTO = new CustomerOrderDTO();
        orderDTO.setOrderCode("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        orderDTO.setOrderDate(Instant.now());
        orderDTO.setStatus(OrderStatus.CONFIRMED);
        orderDTO.setTotalAmount(totalAmount);

        CustomerOrderDTO savedOrder = customerOrderService.save(orderDTO);

        List<OrderItemDTO> savedItems = new ArrayList<>();
        for (OrderItemDTO item : orderItemsToSave) {
            item.setOrder(savedOrder);
            savedItems.add(orderItemService.save(item));
        }

        LOG.info("Successfully created order {} with total amount {}", savedOrder.getOrderCode(), savedOrder.getTotalAmount());
        return ResponseEntity.ok(new CheckoutResponse(savedOrder, savedItems));
    }
}
