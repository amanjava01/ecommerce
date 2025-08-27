@echo off

echo Building Spring Boot application...
cd backend
call mvnw.cmd clean package -DskipTests
cd ..

echo Building Docker images...
docker-compose build

echo Build complete! Run 'docker-compose up' to start the application.