# CEREBRO-GEST Docker Compose Setup

## Important Security Notice

⚠️ **NEVER run docker-compose without setting environment variables first!**

This docker-compose.yml file requires the following environment variables to be set. There are NO default values for security reasons.

## Required Environment Variables

Create a `.env` file in the same directory as `docker-compose.yml` with the following variables:

```env
# Database Passwords - Use strong, unique passwords
POSTGRES_PASSWORD=your_secure_postgres_password_here
MONGO_PASSWORD=your_secure_mongo_password_here

# JWT Secret - Generate with: openssl rand -base64 32
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long

# OpenAI API Key (optional - for GPT-4 features)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Node Environment
NODE_ENV=production
```

## Quick Start

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set all required values with secure credentials

3. Start the services:
   ```bash
   docker-compose up -d
   ```

## Security Best Practices

- Never commit `.env` files to version control
- Use strong, randomly generated passwords (minimum 20 characters)
- Rotate credentials regularly
- Use different passwords for each service
- Keep your `.env` file permissions restrictive: `chmod 600 .env`
