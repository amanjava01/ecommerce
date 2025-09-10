# E-Commerce Application
# application you can find 
https://ecommerceeasybuy.netlify.app/
A complete e-commerce web application with vanilla HTML/CSS/JS frontend and Spring Boot backend.

## Features

- **Frontend**: Responsive HTML5/CSS3/JS with real-time updates
- **Backend**: Spring Boot 3.x with JWT auth, JPA, Redis caching
- **Database**: MySQL with Flyway migrations
- **Real-time**: WebSocket for live metrics and notifications
- **Security**: JWT tokens, rate limiting, input validation
- **Admin**: Dashboard with live metrics, product/order management
- **Payment**: Mock payment system (easily replaceable)

## Quick Start

1. **Prerequisites**: Docker & Docker Compose

2. **Start the application**:
   ```bash
   docker-compose up -d
   ```

3. **Access the application**:
   - Frontend: https://localhost
   - Admin Panel: https://localhost/admin
   - API Docs: https://localhost/api/swagger-ui.html

4. **Default Admin Credentials**:
   - Email: admin@ecommerce.com
   - Password: Admin123!

## Development

### Backend Development
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend Development
Serve the frontend directory with any HTTP server or use the included nginx configuration.

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecommerce
DB_USER=ecommerce
DB_PASS=password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=86400

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## API Documentation

The API follows RESTful conventions. Key endpoints:

- `POST /api/auth/login` - User authentication
- `GET /api/products` - Product catalog with filters
- `POST /api/cart/items` - Add items to cart
- `POST /api/orders` - Create order
- `GET /api/admin/metrics/stream` - Real-time metrics (SSE)

## Testing

```bash
cd backend
./mvnw test
```

## Deployment

See `deployment/` directory for production deployment guides.

## Architecture

- **Frontend**: Vanilla JS with component-based architecture
- **Backend**: Spring Boot with layered architecture
- **Database**: MySQL with proper indexing and relationships
- **Caching**: Redis for sessions, product data, and rate limiting
- **Real-time**: Server-Sent Events for live updates
- **Security**: JWT with refresh tokens, CORS, CSRF protection
