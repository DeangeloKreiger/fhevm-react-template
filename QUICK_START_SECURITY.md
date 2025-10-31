# Quick Start: Security & Performance Tools

## 🚀 Initial Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Setup Git Hooks
```bash
pnpm prepare
```

### 3. Copy Environment Template
```bash
cp .env.example .env
```

Edit `.env` with your configuration.

---

## 🔒 Security Commands

### Run Full Security Audit
```bash
pnpm security:audit
```

### Check for DoS Vulnerabilities
```bash
pnpm security:dos-check
```

### Scan Dependencies
```bash
pnpm security:scan
```

---

## ⚡ Performance Commands

### Analyze Performance
```bash
pnpm perf:analyze
```

### Generate Gas Report (Contracts)
```bash
pnpm gas:report
```

### Check Bundle Sizes
```bash
pnpm size
```

---

## 🔧 Code Quality Commands

### Format Code
```bash
pnpm format
```

### Lint Code
```bash
pnpm lint
pnpm lint:fix
```

### Type Check
```bash
pnpm typecheck
```

### Run All Checks
```bash
pnpm validate
```

---

## 🧪 Testing Commands

### Run Tests
```bash
pnpm test
```

### Run with Coverage
```bash
pnpm test:coverage
```

### Performance Tests
```bash
pnpm perf:test
```

---

## 📦 Build Commands

### Build SDK
```bash
pnpm build
```

### Build All Packages
```bash
pnpm build:all
```

### Clean Build Artifacts
```bash
pnpm clean
```

---

## 🔍 What Each Tool Does

### ESLint
- **What:** Finds code quality and security issues
- **When:** Pre-commit, CI/CD
- **Fix:** `pnpm lint:fix`

### Prettier
- **What:** Formats code consistently
- **When:** Pre-commit, manual
- **Fix:** `pnpm format`

### Solhint
- **What:** Lints Solidity for security and gas
- **When:** Pre-commit (if .sol changed), CI/CD
- **Fix:** `pnpm solhint:fix`

### Security Audit
- **What:** Scans for vulnerabilities
- **When:** Pre-commit, weekly, manual
- **Fix:** Review and update dependencies

### DoS Check
- **What:** Finds DoS vulnerabilities
- **When:** Manual, CI/CD
- **Fix:** Add rate limiting, timeouts, validation

### Gas Reporter
- **What:** Tracks smart contract gas usage
- **When:** Testing
- **Fix:** Optimize based on report

---

## 🚨 Pre-commit Checks

When you run `git commit`, these checks run automatically:

1. ✓ Prettier formatting
2. ✓ ESLint validation
3. ✓ Solhint (if .sol files)
4. ✓ TypeScript type check
5. ✓ Security audit

**If any fail, commit is rejected.**

### Bypass (Emergency Only)
```bash
git commit --no-verify
```

---

## 🔐 Security Best Practices

### 1. Environment Variables
- ✅ Use `.env.example` as template
- ✅ Never commit `.env`
- ✅ Rotate keys regularly
- ✅ Use strong passwords

### 2. Input Validation
```typescript
import { validateNumericInput } from './lib/utils/validation';

if (!validateNumericInput(value, 'uint32')) {
  throw new Error('Invalid input');
}
```

### 3. Rate Limiting
```typescript
// Add to API routes
const limiter = new RateLimit({
  interval: 60 * 1000, // 1 minute
  max: 100, // 100 requests
});
```

### 4. Timeouts
```typescript
const timeout = 30000; // 30 seconds
await Promise.race([
  operation(),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), timeout)
  ),
]);
```

---

## ⚡ Performance Best Practices

### 1. Code Splitting
```typescript
// Dynamic imports
const Component = dynamic(() => import('./Component'));

// React.lazy
const Lazy = React.lazy(() => import('./Lazy'));
```

### 2. Gas Optimization
```solidity
// Use custom errors
error InsufficientBalance(uint256 available, uint256 required);

// Instead of
require(balance >= amount, "Insufficient balance");
```

### 3. Bundle Optimization
- Remove unused dependencies
- Use tree-shaking
- Enable compression
- Lazy load heavy components

---

## 📊 CI/CD Pipeline

### Triggers
- Push to main/develop
- Pull requests
- Weekly (security scan)
- Manual dispatch

### Stages
1. **Security Audit** - Vulnerability scanning
2. **Code Quality** - Linting, formatting, types
3. **Tests** - Unit tests, coverage
4. **Build** - Compile and verify
5. **Performance** - Gas reports, bundle analysis

---

## 🆘 Troubleshooting

### Pre-commit Hook Fails
```bash
# Check what failed
pnpm pre-commit

# Fix formatting
pnpm format

# Fix linting
pnpm lint:fix

# Check types
pnpm typecheck
```

### Security Audit Fails
```bash
# See details
pnpm security:audit

# Update dependencies
pnpm update

# Check for secrets
grep -r "PRIVATE_KEY.*=" . --exclude-dir=node_modules
```

### Build Fails
```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build
```

---

## 📚 Learn More

- [Complete Toolchain Guide](./TOOLCHAIN.md)
- [Security & Performance Report](./SECURITY_PERFORMANCE_REPORT.md)
- [Gas Optimization Guide](./scripts/performance/gas-optimization.md)
- [Environment Template](./.env.example)

---

## ✅ Daily Workflow

### Before Coding
```bash
git pull
pnpm install
```

### While Coding
```bash
# Format and lint
pnpm format && pnpm lint
```

### Before Committing
```bash
# Validate everything
pnpm validate
```

### After Committing
```bash
# Push (runs pre-push checks)
git push
```

### Weekly
```bash
# Run security audit
pnpm security:audit

# Update dependencies
pnpm update
```

---

## 🎯 Quick Commands

```bash
# Full validation
pnpm validate

# Quick format + lint
pnpm format && pnpm lint:fix

# Security check
pnpm security:audit

# Performance check
pnpm perf:analyze

# Gas check (contracts)
pnpm gas:report

# Everything
pnpm validate && pnpm security:audit && pnpm build
```

---

**Happy coding with security and performance! 🚀🔒⚡**
