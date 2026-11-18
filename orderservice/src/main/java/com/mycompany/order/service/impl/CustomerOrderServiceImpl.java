package com.mycompany.order.service.impl;

import com.mycompany.order.domain.CustomerOrder;
import com.mycompany.order.repository.CustomerOrderRepository;
import com.mycompany.order.service.CustomerOrderService;
import com.mycompany.order.service.dto.CustomerOrderDTO;
import com.mycompany.order.service.mapper.CustomerOrderMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.order.domain.CustomerOrder}.
 */
@Service
@Transactional
public class CustomerOrderServiceImpl implements CustomerOrderService {

    private static final Logger LOG = LoggerFactory.getLogger(CustomerOrderServiceImpl.class);

    private final CustomerOrderRepository customerOrderRepository;

    private final CustomerOrderMapper customerOrderMapper;

    public CustomerOrderServiceImpl(CustomerOrderRepository customerOrderRepository, CustomerOrderMapper customerOrderMapper) {
        this.customerOrderRepository = customerOrderRepository;
        this.customerOrderMapper = customerOrderMapper;
    }

    @Override
    public CustomerOrderDTO save(CustomerOrderDTO customerOrderDTO) {
        LOG.debug("Request to save CustomerOrder : {}", customerOrderDTO);
        CustomerOrder customerOrder = customerOrderMapper.toEntity(customerOrderDTO);
        customerOrder = customerOrderRepository.save(customerOrder);
        return customerOrderMapper.toDto(customerOrder);
    }

    @Override
    public CustomerOrderDTO update(CustomerOrderDTO customerOrderDTO) {
        LOG.debug("Request to update CustomerOrder : {}", customerOrderDTO);
        CustomerOrder customerOrder = customerOrderMapper.toEntity(customerOrderDTO);
        customerOrder = customerOrderRepository.save(customerOrder);
        return customerOrderMapper.toDto(customerOrder);
    }

    @Override
    public Optional<CustomerOrderDTO> partialUpdate(CustomerOrderDTO customerOrderDTO) {
        LOG.debug("Request to partially update CustomerOrder : {}", customerOrderDTO);

        return customerOrderRepository
            .findById(customerOrderDTO.getId())
            .map(existingCustomerOrder -> {
                customerOrderMapper.partialUpdate(existingCustomerOrder, customerOrderDTO);

                return existingCustomerOrder;
            })
            .map(customerOrderRepository::save)
            .map(customerOrderMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerOrderDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all CustomerOrders");
        return customerOrderRepository.findAll(pageable).map(customerOrderMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CustomerOrderDTO> findOne(Long id) {
        LOG.debug("Request to get CustomerOrder : {}", id);
        return customerOrderRepository.findById(id).map(customerOrderMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete CustomerOrder : {}", id);
        customerOrderRepository.deleteById(id);
    }
}
