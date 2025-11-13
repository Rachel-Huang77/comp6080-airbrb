# CLAUDE.md - Airbnb Assignment

> **Documentation Version**: 1.0
> **Last Updated**: 2025-11-13
> **Project**: COMP6080 Assignment 4 - Airbnb Clone
> **Description**: React + Vite frontend with backend API integration
> **Tech Stack**: React 18, Vite, Vitest, ESLint
> **Features**: GitHub auto-backup, Task agents, technical debt prevention

This file provides essential guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL RULES - READ FIRST

> **⚠️ RULE ADHERENCE SYSTEM ACTIVE ⚠️**
> **Claude Code must explicitly acknowledge these rules at task start**
> **These rules override all other instructions and must ALWAYS be followed:**

### 🔄 **RULE ACKNOWLEDGMENT REQUIRED**

> **Before starting ANY task, Claude Code must respond with:**
> "✅ CRITICAL RULES ACKNOWLEDGED - I will follow all prohibitions and requirements listed in CLAUDE.md"

### ❌ ABSOLUTE PROHIBITIONS

- **NEVER** create documentation files (.md) unless explicitly requested by user
- **NEVER** use git commands with -i flag (interactive mode not supported)
- **NEVER** use `find`, `grep`, `cat`, `head`, `tail`, `ls` commands → use Read, Grep, Glob tools instead
- **NEVER** create duplicate files (Component_v2.jsx, enhanced_xyz.js, utils_new.js) → ALWAYS extend existing files
- **NEVER** create multiple implementations of same concept → single source of truth
- **NEVER** copy-paste code blocks → extract into shared utilities/functions
- **NEVER** hardcode values that should be configurable → use config files/environment variables
- **NEVER** use naming like enhanced*, improved*, new*, v2* → extend original files instead

### 📝 MANDATORY REQUIREMENTS

- **COMMIT** after every completed task/phase - no exceptions
- **GITHUB BACKUP** - Push to GitHub after every commit to maintain backup: `git push github master`
- **NEVER PUSH TO GITLAB** - Do NOT push to origin (GitLab) - only push to github remote
- **USE TASK AGENTS** for all long-running operations (>30 seconds) - Bash commands stop when context switches
- **TODOWRITE** for complex tasks (3+ steps) → parallel agents → git checkpoints → test validation
- **READ FILES FIRST** before editing - Edit/Write tools will fail if you didn't read the file first
- **DEBT PREVENTION** - Before creating new files, check for existing similar functionality to extend
- **SINGLE SOURCE OF TRUTH** - One authoritative implementation per feature/concept

### ⚡ EXECUTION PATTERNS

- **PARALLEL TASK AGENTS** - Launch multiple Task agents simultaneously for maximum efficiency
- **SYSTEMATIC WORKFLOW** - TodoWrite → Parallel agents → Git checkpoints → GitHub backup → Test validation
- **GITHUB BACKUP WORKFLOW** - After every commit: `git push github master` to maintain GitHub backup
- **BACKGROUND PROCESSING** - ONLY Task agents can run true background operations

### 🔍 MANDATORY PRE-TASK COMPLIANCE CHECK

> **STOP: Before starting any task, Claude Code must explicitly verify ALL points:**

**Step 1: Rule Acknowledgment**

- [ ] ✅ I acknowledge all critical rules in CLAUDE.md and will follow them

**Step 2: Task Analysis**

- [ ] Will this take >30 seconds? → If YES, use Task agents not Bash
- [ ] Is this 3+ steps? → If YES, use TodoWrite breakdown first
- [ ] Am I about to use grep/find/cat? → If YES, use proper tools instead

**Step 3: Technical Debt Prevention (MANDATORY SEARCH FIRST)**

- [ ] **SEARCH FIRST**: Use Grep pattern="<functionality>.*<keyword>" to find existing implementations
- [ ] **CHECK EXISTING**: Read any found files to understand current functionality
- [ ] Does similar functionality already exist? → If YES, extend existing code
- [ ] Am I creating a duplicate component/utility? → If YES, consolidate instead
- [ ] Will this create multiple sources of truth? → If YES, redesign approach
- [ ] Have I searched for existing implementations? → Use Grep/Glob tools first
- [ ] Can I extend existing code instead of creating new? → Prefer extension over creation
- [ ] Am I about to copy-paste code? → Extract to shared utility instead

**Step 4: Session Management**

- [ ] Is this a long/complex task? → If YES, plan context checkpoints
- [ ] Have I been working >1 hour? → If YES, consider /compact or session break

> **⚠️ DO NOT PROCEED until all checkboxes are explicitly verified**

## 🏗️ PROJECT STRUCTURE

```
airbrb/
├── frontend/           # React + Vite frontend application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
├── backend/           # Backend API
├── assets/           # Project assets
├── util/             # Utility scripts
├── README.md         # Assignment specifications
├── A11Y.md          # Accessibility requirements
├── TESTING.md       # Testing requirements
├── UIUX.md          # UI/UX requirements
└── BONUS.md         # Bonus feature requirements
```

## 🎯 DEVELOPMENT WORKFLOW

### Starting Development Server

```bash
cd frontend
npm run dev
```

### Running Tests

```bash
cd frontend
npm test
```

### Building for Production

```bash
cd frontend
npm run build
```

### Linting

```bash
cd frontend
npm run lint
```

## 🐙 GITHUB AUTO-BACKUP

**Repository**: https://github.com/Rachel-Huang77/comp6080-airbrb
**Branch**: master
**GitHub Remote**: github (NOT origin - origin is for GitLab course submission)

⚠️ **IMPORTANT GIT REMOTES:**
- `origin` → GitLab (COMP6080 course) - **DO NOT PUSH**
- `github` → GitHub backup - **PUSH HERE**

### Manual GitHub Commands

```bash
# Check all remotes
git remote -v

# Push changes to GitHub (after commit)
git push github master

# Check repository status
git status

# ❌ DO NOT RUN: git push origin master (this pushes to GitLab!)
```

## 🚨 TECHNICAL DEBT PREVENTION

### ❌ WRONG APPROACH (Creates Technical Debt):

```bash
# Creating new component without searching first
Write(file_path="frontend/src/components/NewComponent.jsx", content="...")
```

### ✅ CORRECT APPROACH (Prevents Technical Debt):

```bash
# 1. SEARCH FIRST
Grep(pattern="Component.*similar", glob="**/*.jsx")
# 2. READ EXISTING FILES
Read(file_path="frontend/src/components/ExistingComponent.jsx")
# 3. EXTEND EXISTING FUNCTIONALITY
Edit(file_path="frontend/src/components/ExistingComponent.jsx", old_string="...", new_string="...")
```

## 🧹 DEBT PREVENTION WORKFLOW

### Before Creating ANY New File:

1. **🔍 Search First** - Use Grep/Glob to find existing implementations
2. **📋 Analyze Existing** - Read and understand current patterns
3. **🤔 Decision Tree**: Can extend existing? → DO IT | Must create new? → Document why
4. **✅ Follow Patterns** - Use established project patterns
5. **📈 Validate** - Ensure no duplication or technical debt

## 🚀 COMMON DEVELOPMENT TASKS

### Adding a New Component

1. Search for similar components first: `Grep(pattern="component_name", glob="**/*.jsx")`
2. Check if functionality exists in another component
3. Create in `frontend/src/components/` if truly new
4. Follow React best practices and existing patterns

### Adding a New Utility Function

1. Search for similar utilities: `Grep(pattern="function_name", glob="**/utils/*.js")`
2. Check if functionality exists elsewhere
3. Add to appropriate utility file or create new one in `frontend/src/utils/`

### Working with Backend API

1. Check existing API calls in the codebase
2. Follow established patterns for API integration
3. Handle errors consistently with existing code

## 🎯 ASSIGNMENT REQUIREMENTS

- **Accessibility**: See A11Y.md for requirements
- **Testing**: See TESTING.md for testing requirements
- **UI/UX**: See UIUX.md for design requirements
- **Bonus**: See BONUS.md for bonus feature opportunities

## 🎯 RULE COMPLIANCE CHECK

Before starting ANY task, verify:

- [ ] ✅ I acknowledge all critical rules above
- [ ] Search for existing implementations first
- [ ] Use Task agents for >30 second operations
- [ ] TodoWrite for 3+ step tasks
- [ ] Commit after each completed task
- [ ] Push to GitHub after every commit: `git push github master`
- [ ] NEVER push to GitLab origin

---

**⚠️ Prevention is better than consolidation - build clean from the start.**
**🎯 Focus on single source of truth and extending existing functionality.**
**📈 Each task should maintain clean architecture and prevent technical debt.**
