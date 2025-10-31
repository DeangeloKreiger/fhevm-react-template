# FHEVM SDK Toolchain Documentation

## Overview

This document describes the complete toolchain integrated into the FHEVM SDK project for security, performance, and code quality.

---

## 🔧 Tool Stack

### Code Quality Tools

#### 1. ESLint
**Purpose:** JavaScript/TypeScript linting and security checks

**Configuration:** `.eslintrc.json`

**Features:**
- TypeScript support
- Security plugin (detect XSS, injection vulnerabilities)
- Import ordering and organization
- Prettier integration

**Usage:**
```bash
# Lint all files
pnpm lint

# Auto-fix issues
pnpm lint:fix

# Lint specific files
pnpm eslint "packages/**/*.ts"
```

**Rules Highlights:**
- `security/detect-object-injection`: Warns about potential injection
- `security/detect-unsafe-regex`: Prevents ReDoS attacks
- `@typescript-eslint/no-floating-promises`: Catches unhandled promises
- Import order enforcement for consistency

#### 2. Prettier
**Purpose:** Code formatting

**Configuration:** `.prettierrc.json`

**Features:**
- Consistent code style across all files
- Supports TypeScript, JavaScript, JSON, Markdown, Solidity
- Different rules for Solidity files

**Usage:**
```bash
# Format all files
pnpm format

# Check formatting
pnpm format:check
```

**Solidity-specific settings:**
- 120 character line width
- 4-space indentation
- No single quotes
- No bracket spacing

---

### Solidity Tools

#### 3. Solhint
**Purpose:** Solidity linting and best practices

**Configuration:** `.solhint.json`

**Features:**
- Gas optimization rules
- Security best practices
- Coding conventions
- Complexity analysis

**Usage:**
```bash
# Lint Solidity files
pnpm solhint

# Auto-fix issues
pnpm solhint:fix
```

**Key Rules:**
- `gas-custom-errors`: Enforce custom errors over strings
- `gas-indexed-events`: Optimize event indexing
- `code-complexity`: Limit function complexity to 8
- `function-max-lines`: Max 50 lines per function

#### 4. Hardhat
**Purpose:** Smart contract development environment

**Configuration:** `hardhat.config.ts`

**Features:**
- Solidity compilation with optimization
- Gas reporting
- Contract size analysis
- Network management

**Optimization Settings:**
```typescript
{
  optimizer: {
    enabled: true,
    runs: 200, // Balance deployment vs runtime
  },
  viaIR: true, // IR-based optimization
}
```

**Usage:**
```bash
# Compile contracts
pnpm hardhat compile

# Run tests with gas reporting
pnpm gas:report

# Check contract sizes
pnpm hardhat size-contracts
```

---

### Security Tools

#### 5. Pre-commit Hooks (Husky)
**Purpose:** Automated code quality checks before commits

**Configuration:** `.husky/`

**Hooks:**

**pre-commit:**
- Prettier formatting check
- ESLint validation
- Solhint (if Solidity files changed)
- TypeScript type checking
- Security audit

**pre-push:**
- Run tests
- Build check
- Security scan

**commit-msg:**
- Conventional commits format validation

**Usage:**
```bash
# Hooks run automatically
git commit -m "feat: add new feature"
git push
```

**Bypass (use sparingly):**
```bash
git commit --no-verify
```

#### 6. Security Audit Scripts
**Purpose:** Comprehensive security analysis

**Scripts:** `scripts/security/`

**Features:**
- Dependency vulnerability scanning
- Secret detection
- Insecure pattern detection
- DoS protection checks
- Environment variable validation

**Usage:**
```bash
# Full security audit
pnpm security:audit

# DoS vulnerability check
pnpm security:dos-check

# NPM audit
pnpm security:scan
```

**Checks Performed:**
- ✓ Dependency vulnerabilities
- ✓ Exposed secrets in code
- ✓ `eval()` usage
- ✓ `dangerouslySetInnerHTML` without sanitization
- ✓ Rate limiting implementation
- ✓ Input validation
- ✓ Environment configuration

#### 7. DoS Protection
**Purpose:** Prevent Denial of Service attacks

**Checks:**
- Unbounded loops
- Large array operations without limits
- Recursive functions without depth limits
- Missing rate limiting
- Missing timeouts
- Gas limit issues in Solidity

**Mitigation Strategies:**
- Implement rate limiting on API routes
- Add request timeouts
- Validate input sizes
- Use pagination for large datasets
- Set gas limits on Solidity loops

---

### Performance Tools

#### 8. Performance Analysis
**Purpose:** Bundle size and optimization analysis

**Script:** `scripts/performance/analyze.sh`

**Features:**
- Bundle size analysis
- Code splitting effectiveness
- Dependency analysis
- Tree-shaking verification
- Performance metrics

**Usage:**
```bash
# Run performance analysis
pnpm perf:analyze

# Check bundle sizes
pnpm size
```

**Metrics Tracked:**
- Package sizes
- Number of JS chunks
- Duplicate dependencies
- Gas usage (contracts)
- Compilation time

#### 9. Gas Reporter
**Purpose:** Smart contract gas optimization

**Configuration:** `hardhat.config.ts`

**Features:**
- Method-level gas usage
- Deployment costs
- USD cost estimation
- Comparison across networks

**Usage:**
```bash
# Generate gas report
REPORT_GAS=true pnpm hardhat test

# View report
cat gas-report.txt
```

**Output includes:**
- Gas per method call
- Average, min, max costs
- Number of calls
- USD equivalent (with API key)

---

### CI/CD Tools

#### 10. GitHub Actions
**Purpose:** Automated testing and deployment

**Workflows:** `.github/workflows/`

**ci.yml Pipeline:**
1. **Security Audit**
   - NPM audit
   - Vulnerability scanning
   - Security scan

2. **Code Quality**
   - ESLint
   - Prettier
   - TypeScript checking
   - Solhint

3. **Tests**
   - Unit tests
   - Coverage report
   - Codecov integration

4. **Build**
   - SDK build
   - Example builds
   - Bundle size check

5. **Performance**
   - Performance tests
   - Gas reporting

**security.yml Pipeline:**
1. **Dependency Review**
2. **CodeQL Analysis**
3. **Secret Scanning** (Gitleaks)
4. **DoS Protection Check**
5. **Solidity Security** (Slither, Mythril)

**Triggers:**
- Push to main/develop
- Pull requests
- Scheduled (weekly for security)
- Manual workflow dispatch

---

## 📋 Complete Command Reference

### Development
```bash
pnpm dev              # Start development mode
pnpm build            # Build SDK
pnpm build:all        # Build all packages
pnpm clean            # Clean all build artifacts
```

### Testing
```bash
pnpm test             # Run tests
pnpm test:coverage    # Run tests with coverage
pnpm perf:test        # Run performance tests
```

### Code Quality
```bash
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting
pnpm typecheck        # TypeScript type checking
pnpm validate         # Run all checks
```

### Solidity
```bash
pnpm solhint          # Lint Solidity files
pnpm solhint:fix      # Fix Solidity issues
pnpm hardhat compile  # Compile contracts
pnpm gas:report       # Generate gas report
```

### Security
```bash
pnpm security:audit      # Full security audit
pnpm security:scan       # NPM vulnerability scan
pnpm security:dos-check  # DoS protection check
```

### Performance
```bash
pnpm perf:analyze     # Analyze performance
pnpm size             # Check bundle sizes
```

### Git Hooks
```bash
pnpm prepare          # Install Husky hooks
pnpm pre-commit       # Manual pre-commit check
pnpm pre-push         # Manual pre-push check
```

---

## 🎯 Optimization Strategies

### Code Splitting
```typescript
// Dynamic imports for route-level splitting
const HeavyComponent = dynamic(() => import('./HeavyComponent'));

// React.lazy for component splitting
const LazyComponent = React.lazy(() => import('./Component'));
```

### Gas Optimization
See: `scripts/performance/gas-optimization.md`

**Key strategies:**
- Use custom errors instead of string messages
- Cache array lengths in loops
- Use events instead of storage when possible
- Batch operations
- Optimize data structures

### Bundle Size
- Tree-shaking enabled
- Code splitting by route
- Lazy loading for heavy components
- Compression (gzip/brotli)
- Remove unused dependencies

---

## 🔒 Security Best Practices

### 1. Input Validation
```typescript
import { validateNumericInput } from './lib/utils/validation';

if (!validateNumericInput(value, 'uint32')) {
  throw new Error('Invalid input');
}
```

### 2. Rate Limiting
```typescript
// API route with rate limiting
const limiter = new RateLimit({
  interval: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
});
```

### 3. Environment Variables
- Never commit `.env` file
- Use `.env.example` as template
- Rotate keys regularly
- Use strong, unique keys for production
- Store sensitive keys in secure key management

### 4. DoS Protection
- Implement request timeouts
- Validate input sizes
- Use pagination for large datasets
- Add rate limiting to all API endpoints
- Set max request body size

---

## 📊 Monitoring & Metrics

### Performance Metrics
- Bundle sizes
- Load times
- Gas usage
- API response times
- Error rates

### Security Metrics
- Vulnerability count
- Dependency age
- Failed audit checks
- Secret exposure incidents

### Code Quality Metrics
- ESLint warnings/errors
- TypeScript errors
- Test coverage
- Code complexity

---

## 🚀 Continuous Improvement

### Weekly Tasks
- Run security audit
- Review dependency updates
- Check gas optimization opportunities
- Analyze performance metrics

### Monthly Tasks
- Full security review
- Performance optimization
- Dependency updates
- Documentation updates

### Release Checklist
- [ ] All tests pass
- [ ] Security audit clean
- [ ] Gas optimization reviewed
- [ ] Bundle sizes acceptable
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped

---

## 📚 Additional Resources

### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)

### Gas Optimization
- [Solidity Gas Optimization](https://github.com/iskdrews/awesome-solidity-gas-optimization)
- [Gas Optimization Guide](./scripts/performance/gas-optimization.md)

### Tools Documentation
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Hardhat](https://hardhat.org/)
- [Husky](https://typicode.github.io/husky/)

---

## 🤝 Contributing

When contributing, ensure:
1. All pre-commit checks pass
2. Tests are added for new features
3. Documentation is updated
4. Security implications are considered
5. Gas optimization is considered (for contracts)

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.
