# E-Commerce Application Deployment Guide

## Quick Start (Development)

### Prerequisites
- Docker Desktop installed and running
- Git (optional, for cloning)

### 1. Clone or Download
```bash
git clone <repository-url>
cd ecommerce
```

### 2. Start the Application
**Windows:**
```cmd
start.bat
```

**Linux/Mac:**
```bash
make start
```

### 3. Access the Application
- **Frontend**: https://localhost
- **Admin Panel**: https://localhost/admin
- **API Docs**: https://localhost/api/swagger-ui.html

### Default Admin Credentials
- **Email**: admin@ecommerce.com
- **Password**: Admin123!

## Production Deployment

### Docker Compose (Recommended)

1. **Prepare Environment**
```bash
cp .env.example .env
# Edit .env with production values
```

2. **Generate SSL Certificates**
```bash
# For Let's Encrypt (recommended)
certbot certonly --standalone -d yourdomain.com

# Or use existing certificates
cp your-cert.pem ssl/cert.pem
cp your-key.pem ssl/key.pem
```

3. **Deploy**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### VPS Deployment

#### 1. Server Setup (Ubuntu 20.04+)
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2. Application Deployment
```bash
# Clone repository
git clone <your-repo> /opt/ecommerce
cd /opt/ecommerce

# Configure environment
cp .env.example .env
nano .env  # Edit with your settings

# Start application
docker-compose up -d
```

#### 3. Nginx Reverse Proxy (Optional)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass https://localhost:443;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Kubernetes Deployment

#### 1. Create Namespace
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ecommerce
```

#### 2. Deploy MySQL
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
  namespace: ecommerce
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: "rootpassword"
        - name: MYSQL_DATABASE
          value: "ecommerce"
        - name: MYSQL_USER
          value: "ecommerce"
        - name: MYSQL_PASSWORD
          value: "password"
        ports:
        - containerPort: 3306
        volumeMounts:
        - name: mysql-storage
          mountPath: /var/lib/mysql
      volumes:
      - name: mysql-storage
        persistentVolumeClaim:
          claimName: mysql-pvc
```

#### 3. Deploy Application
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ecommerce-backend
  namespace: ecommerce
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ecommerce-backend
  template:
    metadata:
      labels:
        app: ecommerce-backend
    spec:
      containers:
      - name: backend
        image: your-registry/ecommerce-backend:latest
        env:
        - name: DB_HOST
          value: "mysql"
        - name: REDIS_HOST
          value: "redis"
        ports:
        - containerPort: 8080
```

## Environment Variables

### Required Variables
```env
# Database
DB_HOST=mysql
DB_PORT=3306
DB_NAME=ecommerce
DB_USER=ecommerce
DB_PASS=your-secure-password

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET=your-very-long-secret-key-here
JWT_EXPIRATION=86400

# Admin
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-admin-password

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Monitoring and Maintenance

### Health Checks
- **Application**: https://yourdomain.com/actuator/health
- **Database**: Check MySQL container logs
- **Redis**: Check Redis container logs

### Backup Strategy
```bash
# Database backup
docker exec mysql mysqldump -u root -p ecommerce > backup_$(date +%Y%m%d).sql

# File uploads backup
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
```

### Log Management
```bash
# View application logs
docker-compose logs -f backend

# View all logs
docker-compose logs -f

# Rotate logs (add to crontab)
docker system prune -f
```

### Performance Tuning

#### Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_product_search ON products(name, description);
CREATE INDEX idx_order_date_status ON orders(created_at, status);
```

#### Redis Configuration
```redis
# redis.conf
maxmemory 256mb
maxmemory-policy allkeys-lru
```

#### Application Scaling
```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

## Security Considerations

### SSL/TLS
- Use Let's Encrypt for free SSL certificates
- Configure strong cipher suites
- Enable HSTS headers

### Database Security
- Use strong passwords
- Enable SSL connections
- Regular security updates

### Application Security
- Keep dependencies updated
- Use environment variables for secrets
- Enable CSRF protection
- Implement rate limiting

### Firewall Configuration
```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Troubleshooting

### Common Issues

#### Application Won't Start
1. Check Docker is running
2. Verify .env configuration
3. Check port availability
4. Review container logs

#### Database Connection Issues
1. Verify MySQL container is running
2. Check database credentials
3. Ensure network connectivity
4. Review MySQL logs

#### Performance Issues
1. Monitor resource usage
2. Check database query performance
3. Review Redis cache hit rates
4. Analyze application logs

### Support
For issues and support:
1. Check application logs
2. Review this deployment guide
3. Check Docker container status
4. Verify environment configuration