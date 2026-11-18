package com.mycompany.order.config;

import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableFeignClients(basePackages = "com.mycompany.order.client")
public class FeignConfiguration {
}
