# Copilot Project Instructions — hnymn Bucket List App

## Core Goal of This Project

This project is a vanilla JavaScript bucket list app using Supabase.

It includes:

- Editable bucket list items
- Emoji selection system (unique per item)
- Badge system (emoji-based rewards)
- Sash UI that displays completed badges
- Completion celebration (confetti + ribbon UI)

---

## CRITICAL CODING RULES

### 1. No frameworks

- Use vanilla JavaScript only
- No React, Vue, Angular, etc.
- Keep DOM manipulation explicit and readable

### 2. Supabase usage

- All persistence goes through Supabase tables
- UI state must reflect database state
- Never store derived UI elements (like badges) in DB

### 3. State logic

- Always treat Supabase as source of truth
- UI should be re-rendered after every mutation
- Avoid stale UI state

---

## FUNCTION QUALITY RULES

### Every function must:

- Have a single clear purpose
- Be safe against null/undefined inputs
- Avoid duplicate event listeners
- Handle DOM missing element cases

---

## TESTING & SELF-REVIEW SYSTEM (IMPORTANT)

Before modifying or finalizing ANY function:

### Step 1 — Analyze

- Identify purpose, inputs, outputs, side effects

### Step 2 — Test mentally

- Normal case
- Edge case (empty/null/undefined)
- Invalid input case

### Step 3 — Debug risks

- DOM failures
- Async issues
- State inconsistencies
- Event duplication

### Step 4 — Improve

- Simplify logic
- Add guards (early returns)
- Fix unsafe assumptions

---

## OPTIONAL IMPROVEMENT RULE

When reviewing a function:

- Suggest ONE better alternative implementation
- Prefer simplicity over abstraction
- Do NOT introduce frameworks or external libraries

---

## LOGGING REQUIREMENT

All significant function updates must be logged to:

/\*
ARCHITECTURE AUDIT SKILL: Modularization + Supabase Boundary Detection

GOAL:
Copilot must analyze code structure and recommend improvements for:

- modularization (splitting into files)
- separation of concerns
- identifying logic that should NOT live in UI files
- identifying data that belongs in Supabase vs frontend state

---

## CORE TASK (RUN ON REQUEST OR EDIT)

When invoked, Copilot must:

1. Scan codebase or selected code block

2. Identify:
   - Repeated logic
   - Large functions (>30-50 lines)
   - Mixed responsibilities (UI + logic + data access)
   - Hardcoded data that should be external
   - Reusable utility logic
   - State logic embedded in UI rendering
   - Supabase calls mixed with DOM manipulation

---

## REFACTORING RULES

If code can be split, classify it into:

A. UI Layer

- DOM rendering
- event listeners
- visual updates

B. Logic Layer

- state management
- calculations
- validation
- business rules

C. Data Layer (Supabase)

- persistence logic
- fetch/update/delete operations

---

EXTRACTION RULE

If a function contains MORE THAN ONE responsibility:
→ MUST suggest extracting into a separate file

Examples:

- renderList() → UI file
- checkCompletionState() → logic file
- supabase CRUD → data/service file

---

SUPABASE DECISION RULE

ONLY suggest Supabase storage if:

- data is persistent user-generated content
- data must survive refresh/session loss
- data is shared or user-specific

DO NOT suggest Supabase for:

- UI state (sash position, animations)
- temporary reward states
- derived values (badges, computed UI)

---

OUTPUT REQUIREMENTS

For every analysis, provide:

1. IDENTIFIED ISSUES

- list functions or blocks that violate structure rules

2. REFACTOR SUGGESTIONS

- which files should be created
- what goes in each file

3. SUPABASE RECOMMENDATION (IF ANY)

- what should move to DB
- what should NOT move

4. SIMPLIFIED FINAL STRUCTURE
   Example:

- /ui/sash.js
- /logic/completion.js
- /services/supabase.js

---

CLEANUP REQUIREMENT

After refactor suggestion:

- remove duplicate logic recommendations
- eliminate redundant functions
- consolidate overlapping responsibilities

---

## GOAL

Turn messy monolithic JS into:

- modular UI layer
- clean logic separation
- correct Supabase boundaries
  \*/
