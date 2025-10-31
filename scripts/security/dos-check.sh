#!/bin/bash

# DoS Protection Check Script
# Checks for potential Denial of Service vulnerabilities

set -e

echo "🛡️  DoS Protection Check"
echo "======================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check for unbounded loops
check_unbounded_loops() {
  echo -e "\n${YELLOW}Checking for unbounded loops...${NC}"

  # Look for while(true) patterns
  if grep -r "while\s*(true)" . \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --exclude-dir=dist \
    --include="*.ts" \
    --include="*.tsx" \
    --include="*.sol"; then
    echo -e "${YELLOW}⚠️  Found while(true) loops - ensure proper exit conditions${NC}"
  else
    echo -e "${GREEN}✅ No unbounded loops detected${NC}"
  fi
}

# Check for large array operations
check_array_operations() {
  echo -e "\n${YELLOW}Checking for potentially expensive array operations...${NC}"

  # Check for array operations without limits
  if grep -r "\.map\|\.filter\|\.reduce" packages/fhevm-sdk/src examples/nextjs-demo/src \
    --exclude-dir=node_modules \
    --include="*.ts" \
    --include="*.tsx" | head -10; then
    echo -e "${YELLOW}⚠️  Found array operations - ensure input size limits${NC}"
  fi
}

# Check for recursive functions
check_recursion() {
  echo -e "\n${YELLOW}Checking for recursive functions...${NC}"

  # This is a simple check - would need more sophisticated analysis for production
  if grep -r "function.*{[\s\S]*\1\(" . \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --include="*.ts" \
    --include="*.tsx"; then
    echo -e "${YELLOW}⚠️  Recursive functions found - ensure stack depth limits${NC}"
  else
    echo -e "${GREEN}✅ No obvious recursion issues${NC}"
  fi
}

# Check for rate limiting
check_rate_limiting() {
  echo -e "\n${YELLOW}Checking for rate limiting implementation...${NC}"

  if grep -r "rateLimit\|throttle\|debounce" . \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --include="*.ts" \
    --include="*.tsx"; then
    echo -e "${GREEN}✅ Rate limiting mechanisms found${NC}"
  else
    echo -e "${YELLOW}⚠️  Consider implementing rate limiting for API endpoints${NC}"
  fi
}

# Check for timeout configurations
check_timeouts() {
  echo -e "\n${YELLOW}Checking for timeout configurations...${NC}"

  if grep -r "timeout\|setTimeout" . \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --include="*.ts" \
    --include="*.tsx" | head -10; then
    echo -e "${GREEN}✅ Timeout configurations found${NC}"
  else
    echo -e "${YELLOW}⚠️  Consider adding timeouts for async operations${NC}"
  fi
}

# Check Solidity gas limits
check_gas_limits() {
  if [ -d "contracts" ] && [ "$(ls -A contracts 2>/dev/null)" ]; then
    echo -e "\n${YELLOW}Checking Solidity gas limits...${NC}"

    # Check for unbounded loops in Solidity
    if grep -r "for\s*(" contracts --include="*.sol" | grep -v "i <"; then
      echo -e "${YELLOW}⚠️  Potential unbounded loops in Solidity${NC}"
    fi

    # Check for dynamic arrays
    if grep -r "push\|pop" contracts --include="*.sol"; then
      echo -e "${YELLOW}⚠️  Dynamic array operations found - monitor gas usage${NC}"
    fi
  fi
}

main() {
  check_unbounded_loops
  check_array_operations
  check_recursion
  check_rate_limiting
  check_timeouts
  check_gas_limits

  echo -e "\n${GREEN}=======================${NC}"
  echo -e "${GREEN}🛡️  DoS Check Complete${NC}"
  echo -e "${GREEN}=======================${NC}"
}

main "$@"
