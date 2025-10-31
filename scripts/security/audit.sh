#!/bin/bash

# Security Audit Script
# Comprehensive security checks for the FHEVM SDK project

set -e

echo "🔒 Starting Security Audit..."
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check for dependencies
check_dependencies() {
  echo -e "\n${YELLOW}Checking dependencies...${NC}"
  pnpm audit --audit-level=moderate || {
    echo -e "${RED}❌ Dependency vulnerabilities found${NC}"
    exit 1
  }
  echo -e "${GREEN}✅ Dependencies are secure${NC}"
}

# Check for secrets in code
check_secrets() {
  echo -e "\n${YELLOW}Checking for exposed secrets...${NC}"

  # Check for common secret patterns
  if grep -r -E "(PRIVATE_KEY|SECRET|PASSWORD|API_KEY|TOKEN).*=.*['\"][a-zA-Z0-9]{20,}" . \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --exclude-dir=dist \
    --exclude-dir=build \
    --exclude="*.md" \
    --exclude="*.example" \
    --exclude="audit.sh"; then
    echo -e "${RED}❌ Potential secrets found in code${NC}"
    exit 1
  fi

  echo -e "${GREEN}✅ No secrets exposed${NC}"
}

# Check for insecure patterns
check_insecure_patterns() {
  echo -e "\n${YELLOW}Checking for insecure coding patterns...${NC}"

  # Check for eval usage
  if grep -r "eval(" . \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --exclude-dir=dist \
    --include="*.ts" \
    --include="*.tsx" \
    --include="*.js"; then
    echo -e "${YELLOW}⚠️  eval() usage found - please review${NC}"
  fi

  # Check for dangerouslySetInnerHTML
  if grep -r "dangerouslySetInnerHTML" . \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --include="*.tsx" \
    --include="*.jsx"; then
    echo -e "${YELLOW}⚠️  dangerouslySetInnerHTML found - ensure proper sanitization${NC}"
  fi

  echo -e "${GREEN}✅ Insecure pattern check complete${NC}"
}

# Check DoS protection
check_dos_protection() {
  echo -e "\n${YELLOW}Checking DoS protection measures...${NC}"

  # Check for rate limiting in API routes
  if [ -d "examples/nextjs-demo/src/app/api" ]; then
    if ! grep -r "rateLimit\|throttle" examples/nextjs-demo/src/app/api; then
      echo -e "${YELLOW}⚠️  No rate limiting found in API routes${NC}"
    else
      echo -e "${GREEN}✅ Rate limiting implemented${NC}"
    fi
  fi

  # Check for input validation
  if grep -r "validateInput\|validation" packages/fhevm-sdk/src examples/nextjs-demo/src/lib; then
    echo -e "${GREEN}✅ Input validation found${NC}"
  else
    echo -e "${YELLOW}⚠️  Limited input validation detected${NC}"
  fi
}

# Check Solidity contracts (if any)
check_solidity() {
  if [ -d "contracts" ] && [ "$(ls -A contracts 2>/dev/null)" ]; then
    echo -e "\n${YELLOW}Checking Solidity contracts...${NC}"

    # Run solhint
    pnpm solhint 'contracts/**/*.sol' || {
      echo -e "${RED}❌ Solhint found issues${NC}"
      exit 1
    }

    echo -e "${GREEN}✅ Solidity checks passed${NC}"
  fi
}

# Check environment variables
check_env_vars() {
  echo -e "\n${YELLOW}Checking environment configuration...${NC}"

  if [ ! -f ".env.example" ]; then
    echo -e "${YELLOW}⚠️  .env.example not found${NC}"
  else
    echo -e "${GREEN}✅ .env.example exists${NC}"
  fi

  # Check if .env is in gitignore
  if grep -q "^\.env$" .gitignore 2>/dev/null; then
    echo -e "${GREEN}✅ .env is gitignored${NC}"
  else
    echo -e "${RED}❌ .env should be in .gitignore${NC}"
  fi
}

# Check TypeScript strict mode
check_typescript() {
  echo -e "\n${YELLOW}Checking TypeScript configuration...${NC}"

  if grep -q '"strict": true' tsconfig.json packages/fhevm-sdk/tsconfig.json 2>/dev/null; then
    echo -e "${GREEN}✅ TypeScript strict mode enabled${NC}"
  else
    echo -e "${YELLOW}⚠️  TypeScript strict mode should be enabled${NC}"
  fi
}

# Main execution
main() {
  check_dependencies
  check_secrets
  check_insecure_patterns
  check_dos_protection
  check_solidity
  check_env_vars
  check_typescript

  echo -e "\n${GREEN}================================${NC}"
  echo -e "${GREEN}🔒 Security Audit Complete!${NC}"
  echo -e "${GREEN}================================${NC}"
}

main "$@"
