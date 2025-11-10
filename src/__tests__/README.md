# Frontend Test Documentation

## Cấu trúc Test

```
src/__tests__/
├── unit/              # Unit Tests
│   ├── components/   # Component tests
│   ├── services/     # Service tests
│   └── hooks/        # Hook tests
└── integration/      # Integration Tests
    └── pages/        # Page tests
```

## Chạy Tests

```bash
# Chạy tất cả tests
npm test

# Chạy tests với watch mode
npm run test:watch

# Chạy tests với coverage
npm run test:coverage

# Chạy chỉ unit tests
npm run test:unit

# Chạy chỉ integration tests
npm run test:integration
```

## Test Coverage

- **Unit Tests**: Test các component, service, hook riêng lẻ
- **Integration Tests**: Test các page và user flows

## Yêu cầu

- jsdom environment (đã cấu hình trong vitest.config.js)
- Mock các dependencies (API calls, hooks, etc.)

