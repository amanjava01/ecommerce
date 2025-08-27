# E-Commerce Application Makefile

.PHONY: help build start stop clean logs test

# Default target
help:
	@echo "Available commands:"
	@echo "  make start    - Start the application with Docker Compose"
	@echo "  make stop     - Stop the application"
	@echo "  make build    - Build the application"
	@echo "  make clean    - Clean up containers and volumes"
	@echo "  make logs     - Show application logs"
	@echo "  make test     - Run tests"
	@echo "  make dev      - Start in development mode"

# Start the application
start:
	@echo "Starting E-Commerce application..."
	docker-compose up -d
	@echo "Application started! Access at https://localhost"
	@echo "Admin panel: https://localhost/admin"

# Stop the application
stop:
	@echo "Stopping E-Commerce application..."
	docker-compose down

# Build the application
build:
	@echo "Building E-Commerce application..."
	docker-compose build

# Clean up
clean:
	@echo "Cleaning up..."
	docker-compose down -v
	docker system prune -f

# Show logs
logs:
	docker-compose logs -f

# Run tests
test:
	@echo "Running backend tests..."
	cd backend && ./mvnw test

# Development mode
dev:
	@echo "Starting in development mode..."
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Setup development environment
setup:
	@echo "Setting up development environment..."
	@if not exist .env copy .env.example .env
	@echo "Please configure .env file with your settings"
	@echo "Run 'make start' to start the application"