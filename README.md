# Tip Calculator

A clean, single-screen tip calculator and bill splitter built for the Dev Weekends Fellowship 2026 assessment.

Enter a bill amount, select a tip percentage, and split across any number of people — the results update instantly as you type. No calculate button, no page reloads.

---

## What It Does

- Enter a bill amount in Pakistani Rupees (Rs)
- Choose a tip from the segmented control (10% / 15% / 20%) or type a custom percentage
- Enter the number of people splitting the bill
- Instantly see: tip amount, grand total, and per-person share
- All amounts rounded up to the nearest paisa so the group never underpays
- Inline validation catches bad inputs without alerts or popups
- Reset button returns everything to a clean state

---

## Tech Stack

**Vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, no dependencies.**

The task is a focused single-screen utility. Adding React or a bundler would mean a build step, a node_modules folder, and code that needs framework knowledge to read. Vanilla JS means the app opens by dragging `index.html` into a browser, every line is readable without prior context, and there is nothing to install or configure. The right tool for the job.

---

## How to Run Locally

**Option 1 — Open directly (simplest):**

Download or clone the repo, then drag `index.html` into any browser. Done.

**Option 2 — Serve locally (recommended, avoids font loading issues):**

Requires Node.js installed on your machine.

```bash
npx serve .
```

Then open `http://localhost:3000` in your browser.

No npm install. No config files. One command.

---

## Live Demo

[https://ahmeraza.github.io/tip-calculator](https://ahmeraza.github.io/tip-calculator)

---

## Project Structure

```
tip-calculator/
├── index.html      # markup and structure
├── style.css       # all styles and design tokens
├── app.js          # all calculation and interaction logic
├── README.md       # this file
└── ANSWERS.md      # assessment questions answered
```