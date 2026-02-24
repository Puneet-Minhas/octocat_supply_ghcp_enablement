## Week 5: "Understanding and Refactoring existing Code using Copilot"

### **Scenario:** You've been assigned to maintain a 3-year-old module. The original developer left. The code works but is poorly documented and uses unfamiliar patterns.

**Your Challenge:** Understand the code, document it, and refactor safely without breaking functionality.

#### Step 1: Understand with Ask Mode

1. **Open a complex file** (e.g., `api/src/repositories/suppliersRepo.ts`)
2. **Select a confusing function**
3. **Open Quick Chat** (Cmd/Ctrl + Shift + Alt + L):
   ```
   Explain what this function does, including edge cases and error handling
   ```
4. **Close the quick chat**
5. **Move to the chat window**, clear your history, and provide broader context in Ask Mode:
   ```
   @workspace Explain the repository pattern used in this codebase. 
   How does it handle database connections and error mapping?
   ```

   > **Note:** Agent mode will automatically analyze the workspace. In Ask mode you must specify `@workspace` to get this behavior.

#### Step 2: Add Documentation

1. Switch to `Agent` mode. Use `Auto` for model and Copilot will pick the best one (and give a 10% discount on requests).
2. Prompt:
   ```
   Add comprehensive JSDoc comments to all functions in suppliersRepo.ts.
   Include parameter descriptions, return types, and example usage.
   ```
3. Agent will add structured documentation. Review changes and keep one by one in the editor or keep all at once in the chat window.

#### Step 3: Refactor with Test Guardrails 

Use Agent mode.

1. First, ensure tests exist:
   ```
   Review suppliersRepo.test.ts. Are there any missing test cases for edge conditions?
   ```
2. If coverage gaps exist:
   ```
   Add tests for error scenarios: database connection failures, 
   invalid IDs, constraint violations.
   ```
3. Now safely refactor:
   ```
   Refactor suppliersRepo.ts for better readability:
   - Extract complex conditionals into named functions
   - Reduce nested callbacks
   - Add type safety where any types are used

   Run tests after each change to ensure no breaking changes.
   ```

#### Step 4: Generate Architecture Documentation

Use Agent mode.

1. Prompt:
   ```
   Create a Mermaid diagram showing the data flow from 
   API route → repository → database for the suppliers module.
   Save it in docs/architecture-suppliers.md
   ```
2. Open and review the file that was created
3. Note that you may not be able to render the diagram if you don't have a Mermaid extension installed. You can still view the raw Mermaid code in the markdown file.

#### Step 5: Document Database Schema

Use Agent mode.

1. Prompt:
   ```
   Analyze the SQL migrations in api/sql/migrations/ and create 
   an ERD (Entity Relationship Diagram) in Mermaid format.
   Include all tables, relationships, and cardinality.

   Save to docs/database-schema.md
   ```

#### Step 6: Create Developer Onboarding Guide

Use Agent mode.

1. Prompt:
   ```
   Create docs/ONBOARDING.md with:
   - Prerequisites and setup
   - Architecture overview
   - How to run tests
   - How to add a new API endpoint (step-by-step)
   - Common troubleshooting issues
   - Link to all other documentation
   ```

   > **Note:** Copilot is great at reviewing code and generating documentation. Keep in mind you could always assign this type of task to Coding Agent if you wanted to delegate it.

### What You Learned

✅ **Ask Mode** - Understand complex code without reading line-by-line  
✅ **Quick Chat** - Quick explanations without leaving your file  
✅ **Agent Refactoring** - Safe improvements with test guardrails  
✅ **Documentation Generation** - Diagrams and docs from code  


---
