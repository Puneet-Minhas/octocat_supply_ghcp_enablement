## Week 4: "Speed up code reviews and fix code quality issues using Copilot"

### **Scenario 1:** Your team has a backlog of 15 PRs. Reviews are shallow because reviewers are overwhelmed.

**Your Challenge:** Use agentic AI-assisted code review to catch issues faster and more consistently.

#### Step 1: Create a Branch with Code Changes for Review

We'll create a new branch, make a few realistic changes across the API, and open a PR so Copilot can review it.

1. **Create and switch to a new feature branch:**
   ```bash
   git checkout -b feature-add-tos-download
   ```

2. **Add a new API route** — create the file `api/src/routes/tos.ts` with the following content:

   ```typescript
   import express from 'express';
   import fs from 'fs';
   import path from 'path';

   const router = express.Router();

   // Download Terms of Service as a text file
   router.get('/download', (req, res) => {
     const filePath = req.query.file as string;
     const fullPath = path.join(__dirname, '..', '..', 'data', filePath);

     if (!fs.existsSync(fullPath)) {
       res.status(404).send('File not found');
       return;
     }

     const content = fs.readFileSync(fullPath, 'utf-8');
     res.setHeader('Content-Type', 'text/plain');
     res.send(content);
   });

   // Get current ToS version
   router.get('/version', (req, res) => {
     const version = {
       version: '2.1.0',
       effectiveDate: '2025-01-15',
       lastUpdated: '2025-01-10',
     };
     res.json(version);
   });

   export default router;
   ```

   > **Note:** This route intentionally has a **path traversal vulnerability** (`req.query.file` used directly in file path) and is **missing Swagger documentation** — perfect for Copilot to catch!

3. **Register the new route** in `api/src/index.ts` by adding the import and route registration alongside the existing ones:

   ```typescript
   import tosRoutes from './routes/tos';

   // Add after the other route registrations
   app.use('/api/tos', tosRoutes);
   ```

4. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "feat: Add Terms of Service download endpoint"
   git push -u origin feature-add-tos-download
   ```

5. **Open a Pull Request on GitHub:**
   - Navigate to your repository on GitHub
   - You should see a banner suggesting to create a PR for your recently pushed branch — click **Compare & pull request**
   - For the title, use `Feature: Add ToS Download`
   - For the description, click the **Copilot icon** and select **`Summary`** to have Copilot auto-generate the description for you!
   - Click **Create pull request**

#### Step 2: Assign Copilot as a Reviewer

1. On the pull request page, assign **Copilot** as a reviewer (upper right side menu under "Reviewers")
2. Scroll down to the bottom of the pull request and you should see a message that you requested a review from Copilot

#### Step 3: Review Runs in GitHub Actions

1. Navigate to the **Actions** tab and click on the **Copilot Code Review** workflow run
2. Notice it runs:
   - **CodeQL** security analysis
   - **ESLint** code quality checks (in Agent)

4. The review runs independently — it is not blocking your workflow

#### Step 4: Review Enhanced Feedback

Once the Actions run has completed, go back to the pull request. You should see Copilot's review (typically starting with a **Pull Request Overview** section). The review includes:

- **Security findings** from CodeQL scan
- **Code quality issues** from ESLint
- **Best practices** violations such as missing Swagger docs and not using React Query as per team standards
- **Additional context** from Code Graph (not just PR changes)
- **Instructions-based feedback** (checks against your `.github/instructions/`)

#### Step 5: Implement Suggestions Automatically

Don't like manual fixes? Click **"Implement Suggestions"** to hand feedback back to Coding Agent for automatic fixes. This will open a new pull request that merges into your existing PR with all suggested fixes applied.

Alternatively you can open a new comment:
```text
@Copilot implement all your review suggestions
```

### What You Learned

✅ **Enhanced Code Review** - Security scanning built-in  
✅ **Pull Request Summaries** - Auto-generated from diffs  
✅ **Actions Integration** - Reviews run independently and are auditable  
✅ **Automatic Implementation** - Hand fixes back to agent  

----
### **Scenario 2:** Your security team reports: *"We found 12 CodeQL alerts, 3 leaked secrets, and 47 code quality issues."*

**Your Challenge:** Triage and fix systematically using AI assistance.

#### Step 1: Enable Code Quality

1. In your GitHub repo, go to **Settings → Code Quality**
2. Click **Enable Code Quality**
3. Wait for initial scan (this takes a few minutes)

Code Quality is a new preview feature. It uses CodeQL and AI to identify maintainability issues in your codebase. Similar to other agents, it will also use GitHub Actions to run scans. You can see the initial run under **Actions → CodeQL** with the initial job being `Code Quality: CodeQL Setup`.

#### Step 2: Review and Fix Code Quality Issues

1. Navigate to **Security → Code Quality → Standard findings**
2. Select the `Inconsistent direction of for loop`
3. Click **Show more** just above the 2 findings to get more details
4. Click **Generate fix** on both findings. Copilot will take around 30 seconds to provide a fix
5. Review the AI-generated fix (in the diff view)
6. Click **Open pull request** and commit the change to apply


### What You Learned

✅ **Code Quality** - AI-powered maintainability scanning  


---
