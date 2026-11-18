# HƯỚNG DẪN KIẾN TRÚC SPRING BOOT MICROSERVICES VỚI JHIPSTER

Hệ thống Microservices đã được sinh và cấu hình hoàn chỉnh tại workspace `d:\Learning\Java\learning`.

---

## 1. Sơ đồ Kiến trúc Tổng thể (Architecture Diagram)

```
                            [ Client / Browser ]
                                     |
                                     v (Port 8080)
                     +-------------------------------+
                     |      Spring Cloud Gateway     |  <---+
                     | (React UI + JWT Auth + Router)|      |
                     +---------------+---------------+      |
                                     |                      |
            +------------------------+-------------------+  |
            | /services/productservice/**                |  |
            v (Port 8081)                                v (Port 8082)
+-----------------------+              +-----------------------+
|    productservice     |              |     orderservice      |
|  (Spring MVC REST +   | <=========== |  (Spring MVC REST +   |
|   Spring Data JPA +   |  OpenFeign   |   Spring Data JPA +   |
|   Liquibase + Redis)  |  (@Client)   |   Liquibase + Redis)  |
+-----------+-----------+              +-----------+-----------+
            |                                      |
            +------------------+-------------------+
                               |
                               v
                     +-------------------+
                     | JHipster Registry | (Eureka Discovery + Config)
                     |    (Port 8761)    |
                     +-------------------+
```

---

## 2. Các Thành phần & Công nghệ đã tích hợp theo yêu cầu

| STT | Công nghệ / Yêu cầu | Vị trí áp dụng & File cấu hình |
|---|---|---|
| 1 | **Spring Boot** | Từng service: `GatewayApp.java`, `ProductserviceApp.java`, `OrderserviceApp.java` |
| 2 | **Maven Wrapper** | `mvnw.cmd` (Windows) / `./mvnw` (Linux/Mac) trong từng thư mục |
| 3 | **Dev & Prod Profiles** | `application-dev.yml` (H2 Database) & `application-prod.yml` (PostgreSQL) |
| 4 | **Spring Security** | JWT Stateless Auth, `SecurityConfiguration.java`, `SecurityJwtConfiguration.java` |
| 5 | **Spring MVC REST & Jackson** | `ProductResource.java`, `CustomerOrderResource.java`, Jackson `ObjectMapper` |
| 6 | **Inter-service Communication** | **Spring Cloud OpenFeign**: `OrderCheckoutResource.java` gọi `ProductClient.java` |
| 7 | **Spring Data JPA + Validation** | `ProductRepository.java`, `CustomerOrderRepository.java`, Bean Validation (`@NotNull`, `@Min`) |
| 8 | **Liquibase** | `src/main/resources/config/liquibase/master.xml` quản lý version database |
| 9 | **Spring Cloud Gateway** | `gateway/src/main/resources/config/application.yml` định tuyến `/services/**` |
| 10 | **Netflix Eureka** | JHipster Registry (Eureka Server port 8761) + `spring-cloud-starter-netflix-eureka-client` |
| 11 | **Monitoring with Metrics** | Micrometer Prometheus tại `/management/prometheus` & `/management/health` |
| 12 | **Redis Caching** | Redisson Cache trong `productservice` và `orderservice` (`CacheConfiguration.java`) |
| 13 | **Gzip & HTTP Cache** | Bật gzip nén trong `application.yml` (`server.compression.enabled=true`) |
| 14 | **Logback Runtime** | `logback-spring.xml` điều chỉnh mức log động qua `/management/loggers` |
| 15 | **HikariCP** | Connection Pool hiệu năng cao trong `DatabaseConfiguration.java` |
| 16 | **Docker Compose** | File gốc `docker-compose.yml` chạy Registry, Redis, PostgreSQL |

---

## 3. Thứ tự khởi chạy từng bước (Step-by-Step Execution)

### Bước 1: Khởi động Hạ tầng Docker (Eureka Registry, Redis, PostgreSQL)
Tại thư mục gốc `d:\Learning\Java\learning`:
```powershell
docker compose up -d jhipster-registry redis-product redis-order
```
> Đợi khoảng 15-20 giây để Eureka Registry khởi động hoàn toàn. Bạn có thể mở trình duyệt vào:
> **URL**: `http://localhost:8761`
> **User/Pass**: `admin` / `admin`

---

### Bước 2: Khởi động Microservice 1 (`productservice`)
Mở Terminal 1:
```powershell
cd d:\Learning\Java\learning\productservice
.\mvnw.cmd
```
> ProductService chạy ở cổng **8081**, kết nối Redis cache (6379), dùng cơ sở dữ liệu H2 (dev) và tự động đăng ký với Eureka!

---

### Bước 3: Khởi động Microservice 2 (`orderservice`)
Mở Terminal 2:
```powershell
cd d:\Learning\Java\learning\orderservice
.\mvnw.cmd
```
> OrderService chạy ở cổng **8082**, kết nối Redis cache (6380) và tự động đăng ký với Eureka!

---

### Bước 4: Khởi động Gateway (`gateway`)
Mở Terminal 3:
```powershell
cd d:\Learning\Java\learning\gateway
.\mvnw.cmd
```
> Gateway chạy ở cổng **8080**, tích hợp sẵn giao diện React.
> Mở trình duyệt: `http://localhost:8080` (Đăng nhập: `admin` / `admin`).

---

## 4. Kiểm thử Giao tiếp liên Dịch vụ (Inter-service Communication)

1. **Lấy JWT Token** từ Gateway:
```powershell
$auth = Invoke-RestMethod -Uri "http://localhost:8080/api/authenticate" -Method Post -ContentType "application/json" -Body '{"username":"admin","password":"admin","rememberMe":true}'
$token = $auth.id_token
$headers = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }
```

2. **Tạo Sản phẩm mới trong `productservice`**:
```powershell
$product = @{
    name = "MacBook Pro M3"
    description = "Apple Silicon 16-inch Laptop"
    price = 1999.99
    stockQuantity = 10
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/services/productservice/api/products" -Method Post -Headers $headers -Body $product
```

3. **Đặt hàng qua `orderservice` (gọi sang `productservice` để kiểm tra tồn kho & giá)**:
```powershell
$order = @{
    items = @(
        @{
            productId = 1
            quantity = 2
        }
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/services/orderservice/api/checkout" -Method Post -Headers $headers -Body $order
```
> **Kết quả**: `orderservice` dùng FeignClient gọi sang `productservice`, xác thực sản phẩm ID `1`, kiểm tra còn đủ 10 máy, lấy đơn giá `1999.99`, tính tổng tiền `3999.98`, tạo đơn hàng `CustomerOrder` và các `OrderItem` thành công!
