# Master Orchestrator - Docker Guide

## 🐳 Quick Start

### 1. Setup Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit with your values
nano .env
```

### 2. Build and Run

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 3. Access Services

- **Dashboard:** http://localhost
- **Master Orchestrator:** http://localhost:3000
- **Central Auth:** http://localhost:3001
- **AI Consultant:** http://localhost:3002
- **PostgreSQL:** localhost:5432
- **MongoDB:** localhost:27017

---

## 🧪 Running Tests in Docker

### AI Consultant Tests

```bash
# Build test image
docker build -f apps/ai-consultant/Dockerfile.test -t ai-consultant-test apps/ai-consultant

# Run tests
docker run --rm ai-consultant-test

# Run with coverage
docker run --rm ai-consultant-test npm run test:coverage
```

---

## 📊 Docker Commands

### Service Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart a service
docker-compose restart master-orchestrator

# View logs
docker-compose logs -f ai-consultant

# Execute command in container
docker-compose exec master-orchestrator sh
```

### Database Access

```bash
# PostgreSQL
docker-compose exec postgres psql -U admin -d master_orchestrator

# MongoDB
docker-compose exec mongodb mongosh -u admin -p secret123
```

### Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Full cleanup
docker system prune -a --volumes
```

---

## 🔧 Development vs Production

### Development Mode

```bash
# Use docker-compose.dev.yml (if created)
docker-compose -f docker-compose.dev.yml up

# Or run services locally
cd apps/master-orchestrator && npm run dev
cd apps/central-auth && npm run dev
cd apps/ai-consultant && npm run dev
cd apps/admin-dashboard && npm run dev
```

### Production Mode

```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d

# Or use regular docker-compose.yml
docker-compose up -d
```

---

## 📈 Monitoring

### Health Checks

```bash
# Check health status
docker-compose ps

# Inspect health
docker inspect --format='{{.State.Health.Status}}' master-orchestrator
```

### Resource Usage

```bash
# View resource usage
docker stats

# View specific service
docker stats master-orchestrator
```

---

## 🚀 Deployment

### Build for Production

```bash
# Build with no cache
docker-compose build --no-cache

# Push to registry (if using Docker Hub)
docker tag master-orchestrator:latest yourusername/master-orchestrator:latest
docker push yourusername/master-orchestrator:latest
```

### Deploy to Server

```bash
# SSH to server
ssh user@your-server.com

# Clone repo
git clone https://github.com/yourusername/master-orchestrator.git
cd master-orchestrator

# Setup environment
cp .env.example .env
nano .env

# Start services
docker-compose up -d
```

---

## 🔐 Security Best Practices

1. **Change default passwords** in `.env`
2. **Use strong JWT secret** (min 32 characters)
3. **Don't commit `.env`** to git
4. **Use secrets management** in production
5. **Enable HTTPS** with reverse proxy (nginx/traefik)
6. **Limit exposed ports** in production
7. **Regular updates** of base images

---

## 🐛 Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs service-name

# Check if port is in use
lsof -i :3000

# Rebuild
docker-compose build --no-cache service-name
```

### Database connection issues

```bash
# Check database is healthy
docker-compose ps

# Test connection
docker-compose exec postgres pg_isready

# Check network
docker network inspect master-orchestrator_master-network
```

### Permission issues

```bash
# Fix volume permissions
docker-compose down
sudo chown -R $(whoami) ./volumes
docker-compose up -d
```

---

## 📝 Next Steps

1. ✅ Build all Docker images
2. ✅ Start services with docker-compose
3. ✅ Run tests in containers
4. ⏸️ Setup CI/CD pipeline
5. ⏸️ Deploy to production server
