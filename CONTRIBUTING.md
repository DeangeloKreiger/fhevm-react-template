# Contributing to FHEVM SDK

Thank you for your interest in contributing to the FHEVM SDK! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Community](#community)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We pledge to:

- Be respectful and considerate
- Welcome diverse perspectives
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards others

### Our Standards

**Positive behaviors include:**
- Using welcoming and inclusive language
- Respecting differing viewpoints
- Accepting constructive feedback
- Focusing on collaboration
- Showing empathy and kindness

**Unacceptable behaviors include:**
- Harassment or discriminatory language
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information
- Other conduct that would be inappropriate in a professional setting

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** 18+ installed
- **pnpm** package manager (`npm install -g pnpm`)
- **Git** for version control
- A **code editor** (VSCode recommended)
- Basic understanding of:
  - TypeScript
  - React (for hook contributions)
  - Fully Homomorphic Encryption concepts

### Setting Up Development Environment

1. **Fork the Repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/fhevm-react-template.git
   cd fhevm-react-template
   ```

2. **Install Dependencies**
   ```bash
   # Install all dependencies
   pnpm install
   ```

3. **Build the SDK**
   ```bash
   # Build the core SDK
   cd packages/fhevm-sdk
   pnpm build
   ```

4. **Run Examples**
   ```bash
   # Next.js demo
   cd examples/nextjs-demo
   pnpm install
   pnpm dev

   # Property trading example
   cd examples/property-trading
   pnpm install
   pnpm dev
   ```

5. **Create a Branch**
   ```bash
   # Create a feature branch
   git checkout -b feature/your-feature-name
   ```

---

## Development Workflow

### Project Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/           # Core SDK package
│       ├── src/
│       │   ├── client.ts    # Client initialization
│       │   ├── encrypt.ts   # Encryption utilities
│       │   ├── decrypt.ts   # Decryption utilities
│       │   ├── types.ts     # TypeScript types
│       │   └── react/       # React hooks
│       ├── package.json
│       └── tsconfig.json
├── examples/
│   ├── nextjs-demo/         # Next.js example
│   └── property-trading/    # Vanilla TS example
├── docs/                    # Documentation
└── README.md
```

### Making Changes

1. **Work on Your Feature**
   ```bash
   # Make your changes
   # Test thoroughly
   # Commit often with clear messages
   ```

2. **Follow Coding Standards**
   - Use TypeScript
   - Follow existing code style
   - Add JSDoc comments
   - Write tests for new features

3. **Test Your Changes**
   ```bash
   # Build SDK
   cd packages/fhevm-sdk
   pnpm build

   # Test in examples
   cd examples/nextjs-demo
   pnpm dev
   ```

4. **Update Documentation**
   - Update README if needed
   - Add JSDoc comments
   - Update relevant docs in `docs/`

---

## Pull Request Process

### Before Submitting

1. **Ensure All Tests Pass**
   ```bash
   # Run tests (when available)
   pnpm test
   ```

2. **Build Successfully**
   ```bash
   # Build SDK
   cd packages/fhevm-sdk
   pnpm build
   ```

3. **Check Code Quality**
   ```bash
   # Format code
   pnpm format

   # Lint code
   pnpm lint
   ```

4. **Update Documentation**
   - Update CHANGELOG.md
   - Update relevant documentation
   - Add examples if needed

### Submitting a Pull Request

1. **Push Your Branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request on GitHub**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your feature branch
   - Fill out the PR template

3. **PR Title Format**
   ```
   type(scope): description

   Examples:
   - feat(sdk): add support for Vue composables
   - fix(react): resolve client initialization race condition
   - docs(examples): add Angular integration example
   - chore(deps): update fhevmjs to v0.7.0
   ```

   **Types:**
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation only
   - `style`: Code style changes
   - `refactor`: Code refactoring
   - `test`: Adding tests
   - `chore`: Maintenance tasks

4. **PR Description Should Include:**
   - **What**: What changes were made
   - **Why**: Why these changes are needed
   - **How**: How the changes work
   - **Testing**: How you tested the changes
   - **Screenshots**: If UI changes (for examples)

### PR Template

```markdown
## Description
Brief description of changes

## Motivation
Why are these changes needed?

## Changes Made
- List of specific changes
- Another change
- And another

## Testing
How did you test these changes?

## Checklist
- [ ] Code builds successfully
- [ ] Tests pass (if applicable)
- [ ] Documentation updated
- [ ] Examples updated (if needed)
- [ ] CHANGELOG.md updated
```

### Review Process

1. **Automated Checks**
   - CI/CD pipeline runs automatically
   - Checks must pass before merge

2. **Code Review**
   - Maintainers will review your code
   - May request changes
   - Be responsive to feedback

3. **Approval & Merge**
   - Once approved, maintainers will merge
   - Your PR will be included in the next release

---

## Coding Standards

### TypeScript Style

```typescript
// ✅ Good: Clear type annotations
export async function encryptInput(
  client: FhevmClient,
  value: number | bigint,
  contractAddress?: string
): Promise<EncryptedValue> {
  // Implementation
}

// ❌ Bad: Missing types
export async function encryptInput(client, value, contractAddress) {
  // Implementation
}
```

### Function Documentation

```typescript
/**
 * Encrypts a numeric value using the FHEVM client
 *
 * @param client - The initialized FHEVM client
 * @param value - The numeric value to encrypt (number or bigint)
 * @param contractAddress - Optional contract address (uses client's default if not provided)
 * @returns Encrypted value with data and handles
 *
 * @throws {Error} If client is not initialized
 * @throws {Error} If encryption fails
 *
 * @example
 * ```typescript
 * const client = await createFhevmClient({ network: 'sepolia' });
 * const encrypted = await encryptInput(client, 1000);
 * console.log(encrypted.data); // Uint8Array
 * ```
 */
export async function encryptInput(
  client: FhevmClient,
  value: number | bigint,
  contractAddress?: string
): Promise<EncryptedValue> {
  // Implementation
}
```

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Always use semicolons
- **Line Length**: Max 100 characters
- **Naming Conventions**:
  - `camelCase` for variables and functions
  - `PascalCase` for types and interfaces
  - `UPPER_CASE` for constants

### Error Handling

```typescript
// ✅ Good: Descriptive error messages
if (!client.isReady) {
  throw new Error('FHEVM client is not initialized. Call createFhevmClient() first.');
}

// ❌ Bad: Vague errors
if (!client.isReady) {
  throw new Error('Not ready');
}
```

### React Hooks

```typescript
// ✅ Good: Follow React hooks conventions
export function useFhevmClient(config: FhevmClientConfig) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initialize
  }, [config.network, config.contractAddress]);

  return { client, isReady, error };
}

// ❌ Bad: Breaking hooks rules
export function useFhevmClient(config: FhevmClientConfig) {
  if (!config) return null; // Don't conditionally call hooks!
  const [client] = useState(null);
  return client;
}
```

---

## Testing Guidelines

### Writing Tests

```typescript
import { expect, describe, it } from 'vitest';
import { createFhevmClient, encryptInput } from '../src';

describe('FHEVM SDK', () => {
  describe('createFhevmClient', () => {
    it('should initialize client successfully', async () => {
      const client = await createFhevmClient({
        network: 'sepolia',
        contractAddress: '0x...',
      });

      expect(client).toBeDefined();
      expect(client.isReady).toBe(true);
    });

    it('should throw error with invalid config', async () => {
      await expect(
        createFhevmClient({ network: 'invalid' })
      ).rejects.toThrow();
    });
  });

  describe('encryptInput', () => {
    it('should encrypt numeric value', async () => {
      const client = await createFhevmClient({
        network: 'sepolia',
      });

      const encrypted = await encryptInput(client, 1000);

      expect(encrypted.data).toBeInstanceOf(Uint8Array);
      expect(encrypted.handles).toBeInstanceOf(Array);
    });
  });
});
```

### Test Coverage

- Aim for >80% code coverage
- Test happy paths
- Test error cases
- Test edge cases

---

## Documentation

### What to Document

1. **Public APIs**
   - All exported functions
   - All exported types
   - All React hooks

2. **Examples**
   - Common use cases
   - Integration patterns
   - Best practices

3. **Guides**
   - Getting started
   - Migration guides
   - Advanced usage

### Documentation Style

```typescript
/**
 * Brief one-line description
 *
 * Longer description explaining:
 * - What this does
 * - When to use it
 * - Important notes
 *
 * @param paramName - Description of parameter
 * @returns Description of return value
 *
 * @throws {ErrorType} When this error occurs
 *
 * @example
 * ```typescript
 * const result = await functionName(param);
 * ```
 *
 * @see relatedFunction
 */
```

---

## Community

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and ideas
- **Documentation**: Check docs first

### Reporting Bugs

**Before reporting:**
1. Check existing issues
2. Try latest version
3. Gather information

**Bug Report Template:**
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- SDK Version: 1.0.0
- Framework: React 18
- Browser: Chrome 120
- OS: macOS 14

## Additional Context
Any other relevant information
```

### Suggesting Features

**Feature Request Template:**
```markdown
## Feature Description
Clear description of the feature

## Motivation
Why is this needed?

## Proposed Solution
How should it work?

## Alternatives Considered
What other options did you consider?

## Additional Context
Examples, mockups, etc.
```

---

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Changelog

Update `CHANGELOG.md` with your changes:

```markdown
## [Unreleased]

### Added
- New feature description

### Changed
- Changed feature description

### Fixed
- Bug fix description
```

---

## Recognition

Contributors will be:
- Listed in CHANGELOG.md
- Mentioned in release notes
- Added to contributors list (if significant contribution)

---

## Questions?

- Open a [GitHub Discussion](https://github.com/zama-ai/fhevm-react-template/discussions)
- Check [Documentation](./docs/)
- Contact maintainers

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to FHEVM SDK!** 🎉

Your contributions help make confidential smart contracts accessible to all developers.
