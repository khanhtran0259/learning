package com.mycompany.product.config;

import org.testcontainers.containers.JdbcDatabaseContainer;

public interface SqlTestContainer {
    JdbcDatabaseContainer<?> getTestContainer();
}
