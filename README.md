# FocusFlow — Smart Student Productivity & Distraction Shield

A modern, responsive student productivity web application built for Classes 9–12 and competitive-exam aspirants (JEE, NEET, Board Exams). Built in accordance with the **YIIC Week 1 Validation & Product Specification**, this platform directly addresses student interview insights: defeating distraction, overcoming procrastination, maintaining feasible goal-oriented timetables, and enforcing structured break discipline.

---

## 🌟 Core Features & Implementation Highlights

### 1. Modern SaaS Visual Identity
- **Design Inspiration**: Linear, Notion, Todoist.
- **Sophisticated Theme System**: Dark Mode (default) and Light Mode with seamless CSS variable transitions.
- **Typography & Motion**: Sleek Plus Jakarta Sans and JetBrains Mono fonts, smooth animations, and zero broken or placeholder buttons.
- **Responsive Layout**: Fluid experience across mobile, tablet, and widescreen desktop monitors.

### 2. 8 Fully Implemented Application Pages
1. **Landing Page (`/landing`)**:
   - Modern hero section with value proposition tailored to competitive exam aspirants.
   - Feature pillars directly mapped to the 3 assignment must-have features.
   - 3-step "How It Works" walkthrough.
   - Interactive live preview of the command dashboard.
   - Clean, professional footer.
2. **Student Onboarding Wizard (`OnboardingModal`)**:
   - Step 1: Student preferred display name and target exam/grade.
   - Step 2: Subject selection and priority weighting.
   - Step 3: Available study hours slider and rhythm selection (45–10, 25–5, 50–10).
   - Step 4: Accountability companion setup (bot name, tone, check-in frequency).
   - Instant schedule generation on launch.
3. **Command Dashboard (`/dashboard`)**:
   - Greeting, live date, and daily study goal circular progress bar.
   - 4 Measured Statistics Cards: Productive Time, Time Wasted, Time Saved, Completed Sessions.
   - **Accountability Bot Companion ("StudyBot")**: Interactive avatar, "I am studying now" check-in, 5-Minute Rule kickstarter, and dynamic motivational dialogue.
   - Today's Timetable card with real-time status toggles, 1-click Focus launcher, and rescheduling.
   - Focus Mode Quick Launcher with 45–10, 5-Min Starter, and 25–5 Pomodoro presets.
   - Weekly productivity mini chart with tooltips.
4. **Smart Timetable Generator (`/timetable`)**:
   - Feasibility engine: Generates balanced study schedules respecting school hours and rest intervals.
   - Alternates heavy numerical problem-solving with lighter conceptual revisions.
   - Overload Guardrail: Warns if total study time exceeds 8 hours to prevent student burnout.
   - Task Management: Add, edit, delete, and toggle status.
   - 1-Click "Reschedule Incomplete Tasks to Next Slot".
   - Daily timeline view and Weekly calendar overview.
5. **Dedicated Distraction-Free Focus Mode (`/focus`)**:
   - Large circular SVG countdown timer with progress ring.
   - Presets: **45–10 Deep Work** (validated in interview), **5-Minute Procrastination Buster** (interview 5), and **25–5 Pomodoro**.
   - Fullscreen mode toggle for total immersion.
   - Session Micro-Goals checklist with interactive strikethrough.
   - **Client-Side Ambient Soundscapes**: Pure Brown/White noise, Heavy Rain simulator, Lo-Fi binaural hum, and Ocean Waves powered by the Web Audio API (zero external assets required).
   - **Tab-Away Interruption Detection**: Uses HTML5 Page Visibility API to detect when student switches away from the study tab and prompts an accountability check-in.
   - **Break-Ending Enforcer**: Celebratory fanfare on focus completion, transitions to restorative break, and triggers audio alert + desktop push notification when break hits 00:00!
6. **Distraction Shield & Management (`/distraction`)**:
   - Wasted Time vs Estimated Time Saved comparison.
   - Customizable monitored apps blocklist (Instagram, YouTube, Discord, WhatsApp, Reddit, Gaming).
   - Interactive Distraction Interceptor Simulator: Demonstrates what happens when student attempts to open distracting apps during study.
   - Timestamped distraction logging with triggers (e.g. notifications, boredom, difficult questions).
   - **Desktop Companion Architecture Specification**: Explains browser security boundaries and details the optional open-source Python daemon (`focus-shield.py`) for native process-level enforcement.
7. **Productivity & Focus Analytics (`/analytics`)**:
   - Clear distinction between Measured Focus Time, Logged Wasted Time, and Estimated Time Saved.
   - Interactive 7-Day Performance Bar Chart.
   - Subject-Wise Study Distribution Progress Bars.
   - Comprehensive Focus Session History Log table with subject filtering, star ratings, and reflections.
   - 1-Click "Export CSV Report" for students and mentors.
8. **Settings & Data Management (`/settings`)**:
   - Student profile and target exam editing.
   - Timetable and study preferences.
   - Accountability bot tone and frequency.
   - Sound and wake-up alarm toggles with live audio test buttons.
   - Dark and Light theme switcher.
   - **Data Management**: Export backup JSON, Import backup JSON, Load demo data, and Reset data.
   - **100% Student Privacy Guarantee**: Strict on-device HTML5 LocalStorage persistence.

---

## 🛠️ Technology Stack
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Custom Modern Theme Variables
- **Icons**: Lucide React
- **Audio Synthesizer**: Native Web Audio API (Chimes, Alarms, Brownian Rain, and White Noise)
- **Effects**: Canvas Confetti
- **Build Tool**: Vite 8

---

## 🚀 Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🔒 Privacy & Compliance
In strict adherence to the competition brief:
- Zero personal identifying details (real names, schools, emails, or usernames) are included or hardcoded.
- All study data is stored strictly in the user's browser local storage.
- No tracking pixels, cloud telemetry, or hidden analytics.
