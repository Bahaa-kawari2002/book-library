.PHONY: build run stop clean logs shell

# Build the Docker image
build:
	docker-compose build

# Run the application (detached mode)
run:
	docker-compose up -d

# Stop and remove containers
stop:
	docker-compose down

# Stop and remove containers, networks, and volumes
clean:
	docker-compose down -v

# View logs
logs:
	docker-compose logs -f

# Access the container shell
shell:
	docker-compose exec book-library sh

# Run all (build and run)
all: build run
