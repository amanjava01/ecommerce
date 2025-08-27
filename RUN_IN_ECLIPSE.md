# Running E-Commerce Application in Eclipse

## Prerequisites
- Eclipse IDE with Spring Tools 4 (STS)
- Java 17 or higher
- Maven (included in Eclipse)

## Setup Steps

### 1. Import Project
1. Open Eclipse
2. File → Import → Existing Maven Projects
3. Browse to: `c:\Users\Lenovo\OneDrive\Desktop\ecommerce\backend`
4. Click Finish

### 2. Set Active Profile
1. Right-click project → Properties
2. Go to Run/Debug Settings
3. Create new Java Application configuration
4. Main class: `com.ecommerce.EcommerceApplication`
5. Arguments tab → VM arguments: `-Dspring.profiles.active=dev`

### 3. Run Application
1. Right-click `EcommerceApplication.java`
2. Run As → Java Application
3. Application starts on http://localhost:8080

### 4. Access Application
- **Backend API**: http://localhost:8080/api
- **H2 Database Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:ecommerce`
  - Username: `sa`
  - Password: (leave empty)
- **API Documentation**: http://localhost:8080/swagger-ui.html

### 5. Frontend (Optional)
1. Install Live Server extension in VS Code
2. Open `frontend/index.html`
3. Update API base URL in `js/api.js` to `http://localhost:8080`
4. Start Live Server

## Default Credentials
- **Admin Email**: admin@ecommerce.com
- **Admin Password**: Admin123!

## Development Features
- H2 in-memory database (no MySQL needed)
- Sample data auto-loaded
- Hot reload enabled
- Debug logging
- No Redis required (uses in-memory cache)

## Troubleshooting
- If port 8080 is busy, change in `application-dev.yml`
- Check console for any startup errors
- Ensure Java 17+ is configured in Eclipse