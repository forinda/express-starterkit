# DI-Decos - TypeScript Node.js API Template

A modern, type-safe, and scalable Node.js API template built with TypeScript, featuring dependency injection, Drizzle ORM, and best practices.

## Features

- 🚀 **TypeScript** - Full type safety and modern JavaScript features
- 🏗️ **Dependency Injection** - Clean architecture with Inversify
- 📦 **Drizzle ORM** - Type-safe database operations
- 🔒 **JWT Authentication** - Secure user authentication
- 📝 **OpenAPI Documentation** - Auto-generated API documentation
- 🧪 **Testing** - Vitest for unit and integration tests
- 🐳 **Docker Support** - Containerized development and production
- 📊 **Logging** - Structured logging with Winston
- 🔄 **Migrations** - Database schema management with Drizzle Kit

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Docker and Docker Compose (optional)

## Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/di-decos.git
   cd di-decos
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Docker Development

1. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

2. Run migrations:
   ```bash
   docker-compose exec app npm run db:generate
   docker-compose exec app npm run db:migrate
   ```

## Database Management

- Generate migrations: `npm run db:generate`
- Apply migrations: `npm run db:migrate`
- Push schema changes: `npm run db:push`
- Pull schema from DB: `npm run db:pull`
- Check migrations: `npm run db:check`
- Upgrade snapshots: `npm run db:up`
- Open Drizzle Studio: `npm run db:studio`

## Testing

- Run tests: `npm test`
- Run tests with coverage: `npm run test:coverage`
- Run tests in UI mode: `npm run test:ui`

## Project Structure

```
src/
├── api/              # API endpoints and business logic
├── common/           # Shared utilities and helpers
├── core/            # Core application setup
│   ├── config/      # Configuration management
│   ├── context/     # Request context and middleware
│   ├── db/          # Database setup and migrations
│   ├── di/          # Dependency injection container
│   └── server/      # Server setup and routing
└── types/           # TypeScript type definitions
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## API Endpoints

### Health Check
- `GET /health` - Check service health status
  ```json
  {
    "message": "Service is healthy",
    "data": {
      "status": "ok",
      "timestamp": "2024-03-21T12:34:56.789Z",
      "uptime": 123.45
    }
  }
  ```

### Authentication
// ... existing code ... 
