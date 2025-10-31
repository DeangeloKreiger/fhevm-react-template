#!/bin/bash

# Performance Analysis Script
# Analyzes bundle size, load time, and optimization opportunities

set -e

echo "⚡ Performance Analysis"
echo "======================"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Analyze bundle size
analyze_bundle_size() {
  echo -e "\n${YELLOW}Analyzing bundle sizes...${NC}"

  if [ -d "packages/fhevm-sdk/dist" ]; then
    echo -e "${BLUE}SDK Package Size:${NC}"
    du -sh packages/fhevm-sdk/dist
    find packages/fhevm-sdk/dist -name "*.js" -exec ls -lh {} \; | awk '{print $5 "\t" $9}'
  fi

  if [ -d "examples/nextjs-demo/.next" ]; then
    echo -e "\n${BLUE}Next.js Build Size:${NC}"
    du -sh examples/nextjs-demo/.next
  fi
}

# Check for code splitting
check_code_splitting() {
  echo -e "\n${YELLOW}Checking code splitting...${NC}"

  if [ -d "examples/nextjs-demo/.next" ]; then
    chunk_count=$(find examples/nextjs-demo/.next -name "*.js" | wc -l)
    echo -e "${BLUE}Number of JS chunks: ${chunk_count}${NC}"

    if [ $chunk_count -gt 10 ]; then
      echo -e "${GREEN}✅ Good code splitting detected${NC}"
    else
      echo -e "${YELLOW}⚠️  Consider more aggressive code splitting${NC}"
    fi
  fi
}

# Analyze dependencies
analyze_dependencies() {
  echo -e "\n${YELLOW}Analyzing dependencies...${NC}"

  echo -e "${BLUE}Checking for duplicate dependencies...${NC}"
  pnpm list --depth=0 | grep -E "├──|└──" | sort | uniq -d || echo "No duplicates found"

  echo -e "\n${BLUE}Large dependencies:${NC}"
  pnpm list --depth=0 | grep -E "├──|└──" | head -20
}

# Check tree shaking
check_tree_shaking() {
  echo -e "\n${YELLOW}Checking tree-shaking effectiveness...${NC}"

  if [ -d "packages/fhevm-sdk/dist" ]; then
    # Check for unused exports (simplified check)
    echo -e "${BLUE}Exported modules:${NC}"
    grep -r "export" packages/fhevm-sdk/src --include="*.ts" | wc -l
  fi
}

# Performance metrics
show_metrics() {
  echo -e "\n${YELLOW}Performance Metrics:${NC}"

  if [ -f "gas-report.txt" ]; then
    echo -e "\n${BLUE}Gas Usage Report:${NC}"
    head -50 gas-report.txt
  fi

  echo -e "\n${BLUE}TypeScript Compilation Time:${NC}"
  time pnpm --filter fhevm-sdk tsc --noEmit 2>&1 | tail -1
}

# Optimization suggestions
suggest_optimizations() {
  echo -e "\n${YELLOW}Optimization Suggestions:${NC}"

  echo -e "${BLUE}1. Bundle Size Optimization:${NC}"
  echo "   - Use dynamic imports for large components"
  echo "   - Enable compression (gzip/brotli)"
  echo "   - Remove unused dependencies"

  echo -e "\n${BLUE}2. Code Splitting:${NC}"
  echo "   - Split by route in Next.js"
  echo "   - Lazy load heavy components"
  echo "   - Use React.lazy() for code splitting"

  echo -e "\n${BLUE}3. Runtime Performance:${NC}"
  echo "   - Memoize expensive computations"
  echo "   - Use Web Workers for heavy tasks"
  echo "   - Implement request caching"

  echo -e "\n${BLUE}4. Gas Optimization (Smart Contracts):${NC}"
  echo "   - Use events instead of storage when possible"
  echo "   - Batch operations to reduce transactions"
  echo "   - Optimize data structures"
}

main() {
  analyze_bundle_size
  check_code_splitting
  analyze_dependencies
  check_tree_shaking
  show_metrics
  suggest_optimizations

  echo -e "\n${GREEN}======================${NC}"
  echo -e "${GREEN}⚡ Analysis Complete${NC}"
  echo -e "${GREEN}======================${NC}"
}

main "$@"
