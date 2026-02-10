# Take-Home Test: Vehicle Inspection System

A full-stack vehicle inspection management system using React + TypeScript (frontend) and Express + TypeScript (backend).

**Recommended Time: around 1 - 2 hours** — You may take as long as you need, but please don't overthink it.

---

## Backend Tasks (`/backend`)

### Task 1: Implement `createCheck` Controller

**File:** `src/controllers/checkController.ts`

The `POST /checks` endpoint controller is not implemented. You need to:

1. Validate request body using `validateCheckRequest(req.body)`
2. Return 400 with `ErrorResponse` format if validation fails
3. Call `checkService.createCheck()` if validation passes
4. Return 201 with the created check

**Verify:** Remove `.skip` from the test `"should create check and return 201"` in `api.test.ts`

### Task 2: Fix the bug in service function `createCheck`

**File:** `src/services/checkService.ts`

The `hasIssue` flag is not correctly identifying if one inspection record has issue. Find and fix the bug.

**Verify:** Remove `.skip` from the test `"should set hasIssue to true when any item fails"` in `api.test.ts`

Run `npm test` — all tests should pass.

---

## Frontend Tasks (`/frontend`)

### Task 1: Fix Form Input

**File:** `src/CheckForm.tsx`

Check the form to make sure the fields are accepting valid input. You may change the input type where you find it appropriate.

### Task 2: Add Notes Field

**File:** `src/CheckForm.tsx`

Add a textarea for optional notes:

- Maximum 300 characters
- (Optional) Display character counter (e.g., "45/300")
- Include in API request and reset after submission

### Task 3: Implement Toast Notifications

**File:** `src/CheckForm.tsx`

Show visual feedback using the provided `Toast.tsx` and `useToast.ts`:

- Success toast on successful submission
- Error toast on failure
- (Optional) Show good error message in toast on failure

---

## Questions

Please answer these briefly:

1. **Authentication:** If we need to add authentication to this system, how would you approach it?
For authentication, I would use JWT with refresh tokens: the frontend receives a short-lived access token, and the backend validates it on each request. For authorization, I’d add basic RBAC (role-based access control), e.g., normal users can only submit/view checks for vehicles they are assigned to, while admins can access all records.
In production, I’d store tokens more securely (e.g., httpOnly cookies + CSRF protection) and add rate limiting and account lockout for repeated failures.

2. **Improvements:** What other improvements would you implement if this were going to production or if you have more time?
If this were production or I had more time, I’d improve:
1.Persistence: replace JSON storage with a real DB (Postgres/MySQL), add migrations, indexes, audit fields.
2.API quality: consistent error codes/format, more test coverage (edge cases, error paths, concurrency).
3.Security: stricter validation, log redaction, rate limiting, clearer CORS policy.
4.UX: better inline validation feedback, cleaner loading states, clearer error toasts (surface backend validation details).
5.Engineering: CI via GitHub Actions (lint/test/build), PR templates, basic code standards.

3. **Tech Stack Experience:** Do you have experience with PHP, Vue.js, or mobile app development (React Native/Flutter)?
My main background is cybersecurity, so I’m not a pure developer, but I can build and ship small-to-medium features:
PHP: some exposure (reading code, small fixes, security testing related), not my primary stack.
Vue.js: comfortable with basics (components, state, API calls), but more hands-on with React.
Mobile: no full production app experience yet, but I understand the basics of React Native/Flutter and can ramp up.

4. **AI / Tools:** What tools/assistants did you use while working on this assignment (e.g., GitHub Copilot, ChatGPT, etc.)? We appreciate AI usage, we're interested in _how_ you use these tools.
Tools used: VS Code, Chrome DevTools, Jest.
For AI, I used ChatGPT mainly to:
*break tasks into smaller steps and confirm how to verify with tests;
*quickly narrow down likely bug locations;

5. **Visa Status:** What visa are you currently on?
I’m currently on a Temporary Graduate visa (subclass 485), valid until 2029, with full work rights.

6. **Languages:** We have users from different backgrounds and industries. What language(s) do you know and what's your proficiency level?
Mandarin Chinese: native
English: professional working proficiency (emails, meetings, explaining technical issues)

> **Tip:** You can write your answers directly in this README.md file below each question.

---

## Submission (How to Submit)

1. Create a **public GitHub repository** for this assignment.
2. Push your code with all changes.
3. **Create at least two pull requests (PRs):** one for backend and one for frontend. You may create more (e.g., each task can be an independent PR). You may merge them into the main branch. We can review and may leave comments on your PRs for feedback.
4. Answer questions above.
5. **Please complete and submit within 3 days** unless otherwise discussed.
6. Send the repository link to **admin@enroute-tech.com**.

---

Good luck!
