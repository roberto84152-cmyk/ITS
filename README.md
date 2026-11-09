# Цифровая визитка

Backend для визитки: профиль, навыки, опыт и проекты. Данные отдаются по GraphQL, есть Apollo Sandbox и страница для просмотра.

## Демо

- <http://87.251.87.23:3000/> — визитка и GraphQL-консоль
- <http://87.251.87.23:3000/graphql> — Apollo Sandbox
- <http://87.251.87.23:3000/health> — health-check

Деплой на VPS через docker compose. HTTPS не настраивал: 443 занят другим сервисом.
Если Apollo Sandbox не открывается из-за проблем с CDN, используйте `/` или любой GraphQL-клиент.

## Стек

TypeScript, Node.js 22, NestJS 10, Prisma 6, PostgreSQL 16, MinIO (S3), Docker Compose,
Jest, ESLint, Prettier, GitHub Actions.

MinIO больше не публикует образы в Docker Hub, поэтому в compose используется
`bitnamilegacy/minio` с фиксированной версией.

## Запуск

```bash
docker compose up --build
```

При старте поднимаются PostgreSQL и MinIO, применяются миграции, сид заполняет базу
и загружает аватар в S3, затем запускается NestJS.

- <http://localhost:3000/> — страница
- <http://localhost:3000/graphql> — Apollo Sandbox
- <http://localhost:3000/health> — health-check
- <http://localhost:9001> — MinIO Console (`minioadmin` / `minioadmin`)

Остановить и удалить данные:

```bash
docker compose down -v
```

## Без Docker

```bash
cp .env.example .env
npm ci
npx prisma generate
npx prisma migrate deploy
npm run seed:dev
npm run start:dev
```

Нужны PostgreSQL и S3. Если S3 недоступен, сид продолжит работу, но аватар не загрузится.

## GraphQL

Запрос из задания:

```graphql
query {
  profile {
    name
    description
    skills {
      name
    }
    experience {
      company
      position
    }
    projects {
      name
    }
  }
}
```

Есть ещё `profiles`, ссылки, категории навыков, периоды работы, достижения,
стек проектов и `avatarUrl` (presigned-ссылка).

## Как устроено

```
src/
├── app.module.ts
├── main.ts
├── config/          # проверка env
├── health/          # GET /health
├── prisma/          # PrismaService
├── storage/         # S3: бакет, загрузка, presigned URL
├── profile/
│   ├── entities/    # GraphQL-типы
│   ├── loaders/     # DataLoader'ы
│   ├── profile.repository.ts
│   ├── profile.service.ts
│   ├── profile.resolver.ts
│   └── profile.module.ts
└── database/        # сид и данные
```

Резолверы отвечают за GraphQL, сервис — за сценарии, репозиторий — за запросы Prisma,
`StorageService` — за S3.

Схема описывается декораторами рядом с кодом (code-first), `schema.gql` генерируется
автоматически.

Связи профиля грузятся DataLoader'ами: они собирают `profileId` за один тик и делают
один запрос `WHERE profileId IN (...)`. Для списка профилей это 1 + 4 запроса вместо N+1,
и выбираются только те связи, которые запросил клиент.

Сид идемпотентен: `upsert` по стабильным ID и удаление записей, которых нет в seed-данных.
В Docker миграции и сид запускаются entrypoint'ом до старта приложения.

Аватар лежит в приватном бакете, API отдаёт presigned-ссылку на час. В compose два адреса:
`S3_ENDPOINT` для запросов внутри Docker и `S3_PUBLIC_ENDPOINT` для браузера.

## Переменные

| Переменная           | Обязательна | По умолчанию  | Что это                       |
| -------------------- | ----------- | ------------- | ----------------------------- |
| `DATABASE_URL`       | да          | —             | Строка подключения PostgreSQL |
| `PORT`               | нет         | `3000`        | HTTP-порт                     |
| `S3_ENDPOINT`        | да          | —             | Внутренний endpoint S3/MinIO  |
| `S3_PUBLIC_ENDPOINT` | нет         | `S3_ENDPOINT` | Endpoint для presigned URL    |
| `S3_REGION`          | нет         | `us-east-1`   | Регион S3                     |
| `S3_BUCKET`          | да          | —             | Имя бакета                    |
| `S3_ACCESS_KEY`      | да          | —             | Access key                    |
| `S3_SECRET_KEY`      | да          | —             | Secret key                    |

Обязательные переменные проверяются на старте.

## Проверки

```bash
npm run lint
npm test
npm run build
```

E2E:

```bash
npx prisma migrate deploy
node dist/database/seed.js
npm run test:e2e
```

CI поднимает PostgreSQL и прогоняет lint, unit-тесты, сборку, миграции, сид и e2e.

## Ограничения

- Только чтение, авторизации нет — визитка публичная.
- Один профиль в сиде; `profiles` оставил, чтобы показать батчинг.
- Ответы не кэшируются: presigned URL должен быть свежим.
- Логи стандартные NestJS.

## Данные

Всё в `src/database/seed-data.ts`. После изменений перезапустите сид
(`npm run seed:dev` или `docker compose up --build`).
