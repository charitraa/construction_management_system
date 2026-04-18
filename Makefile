# BuildCMS Docker Development Makefile

.PHONY: help build run dev prod clean logs restart

# Default target
help: ## Show this help message
	@echo "BuildCMS Docker Commands:"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Docker commands
build: ## Build production Docker image
	docker build -t buildcms .

run: ## Run production container on port 80
	docker run -d -p 80:80 --name buildcms-app buildcms

dev: ## Start development environment with hot reload
	docker-compose --profile dev up -d

prod: ## Start production environment
	docker-compose up -d

full: ## Start full stack (frontend + backend + database)
	docker-compose --profile full up -d

stop: ## Stop all running containers
	docker-compose down

clean: ## Remove all containers and images
	docker-compose down --rmi all --volumes --remove-orphans
	docker system prune -f

logs: ## Show container logs
	docker-compose logs -f

restart: ## Restart all services
	docker-compose restart

shell: ## Open shell in running container
	docker exec -it $$(docker ps -q -f name=buildcms) sh

# Development helpers
install: ## Install dependencies
	pnpm install

test: ## Run tests
	pnpm test

lint: ## Run linting
	pnpm format.fix

typecheck: ## Run TypeScript type checking
	pnpm typecheck

# Deployment helpers
deploy-prod: ## Deploy to production
	docker-compose -f docker-compose.prod.yml up -d --build

deploy-dev: ## Deploy development version
	docker-compose -f docker-compose.dev.yml up -d --build