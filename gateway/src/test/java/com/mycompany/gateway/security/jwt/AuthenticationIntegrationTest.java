package com.mycompany.gateway.security.jwt;

import com.mycompany.gateway.config.SecurityConfiguration;
import com.mycompany.gateway.config.SecurityJwtConfiguration;
import com.mycompany.gateway.config.WebConfigurer;
import com.mycompany.gateway.management.SecurityMetersService;
import com.mycompany.gateway.repository.UserRepository;
import com.mycompany.gateway.web.rest.AuthenticateController;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.webflux.test.autoconfigure.WebFluxTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import tech.jhipster.config.JHipsterProperties;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Import({
    JHipsterProperties.class,
    WebConfigurer.class,
    SecurityConfiguration.class,
    SecurityJwtConfiguration.class,
    SecurityMetersService.class,
    JwtAuthenticationTestUtils.class,
})
@WebFluxTest(
    controllers = { AuthenticateController.class },
    properties = {
        "jhipster.security.authentication.jwt.base64-secret=fd54a45s65fds737b9aafcb3412e07ed99b267f33413274720ddbb7f6c5e64e9f14075f2d7ed041592f0b7657baf8",
        "jhipster.security.authentication.jwt.token-validity-in-seconds=60000",
    }
)
@ComponentScan({})
@MockitoBean(types = ReactiveUserDetailsService.class)
@MockitoBean(types = UserRepository.class)
public @interface AuthenticationIntegrationTest {}
