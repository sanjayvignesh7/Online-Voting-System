# Online Voting System — College Project Demo

An interactive, frontend-only college project prototype demonstrating a modern, accessible digital voting workflow. Built with **HTML5, CSS3, and Vanilla JavaScript (ES6+)** with **zero external dependencies** or backend requirements.

> **⚠️ IMPORTANT ACADEMIC NOTICE:**
> This project is strictly an educational college demonstration and proof-of-concept. It does **NOT** perform real voting, does **NOT** connect to any government election database, and requires **NO** real voter ID, API keys, or backend server.

---

## 🌟 Key Features

1. **Step-by-Step Interactive Workflow:**
   - **Step 1 — Welcome:** Civic-tech landing page with feature overview and quick-start actions.
   - **Step 2 — Voter Verification:** Mock voter ID entry with quick-fill presets and duplicate submission detection.
   - **Step 3 — Mode Selection:** Choose between **Normal Voting (Standard)** and **Voice Voting (Assistive)**.
   - **Step 4A — Normal Ballot:** Clean candidate grid with one-click selection, party platforms, and symbols.
   - **Step 4B — Voice-Assisted Ballot:** Simulated speech recognition with real-time audio waveform that **dynamically recognizes a randomized candidate** on each voice demo run, with manual fallback options.
   - **Step 5 — Confirmation:** Detailed ballot summary review with masked ID and security timestamp.
   - **Step 6 — Vote Recorded:** Celebratory animated checkmark, mock transaction ID receipt, and local audit hash.
   - **Step 7 — System Architecture & Flowchart:** Built-in modal dialog displaying the full presentation flowchart and future expansion roadmap.

2. **Indian National Flag Tricolor Civic-Tech Design & Voting Logo:**
   - Features an authentic **Indian Voting Logo** (ballot box with inked electoral vote mark and Ashoka Chakra wheel emblem).
   - Styled with patriotic **Saffron (`#FF9933`), White (`#FFFFFF`), and India Green (`#138808`)** top ribbons and badges.

3. **Intuitive Cursor & Touch Navigation:**
   - Clearly visible action buttons ("Start Demo", "Verify & Continue", "Continue", "Confirm Vote", "Start New Demo").
   - One-click preset voter IDs and single-click candidate selection cards.
   - Guarded against rapid double submissions and accidental skipping without required selection.

3. **Accessibility & Usability:**
   - High Contrast Mode toggle (<kbd>Contrast</kbd> icon in header).
   - Dynamic font size scaling (`A-` / `A+`).
   - 100% offline Web Audio API synthesized sound effects.
   - Screen-reader ARIA live regions.
   - Responsive design tailored for laptops, tablets, and smartphones.

4. **Live Demo Vote Tally & Session Memory:**
   - Includes a "Live Demo Tally" modal displaying real-time vote distribution across all demo runs in the session.

---

## 🚀 How to Run the Project

This project runs 100% locally on any modern web browser without needing `npm`, Python, Node.js, or any database setup.

### Option 1: Direct File Launch (Quickest)
1. Navigate to the project directory: `c:\Users\scsj2\OneDrive\Documents\OVS`
2. Double-click **`index.html`** or right-click and choose **"Open with Google Chrome / Microsoft Edge / Firefox"**.

### Option 2: Using a Simple Local Server (Optional)
If you prefer running via a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js npx
npx serve .
```
Then open `http://localhost:8000` in your browser.

---

## 🛠️ Technologies Used

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Structure** | HTML5 | Semantic markup, accessible forms, ARIA attributes |
| **Styling** | CSS3 | Custom Properties (Variables), Flexbox, CSS Grid, animations, High Contrast theme |
| **Interactivity** | Vanilla JavaScript (ES6+) | State machine router, keyboard events, simulated speech pipeline, Web Audio synthesizer |
| **Audio** | Web Audio API | Lightweight offline tone generation (no external mp3 files required) |

---

## 🔮 Concept Expansion Roadmap (For Project Presentation / Viva)

When presenting this college project, you can highlight how this prototype can be scaled to an enterprise production system:

- **Frontend Framework:** React.js / Next.js or Vue.js with Tailwind CSS.
- **Backend Architecture:** Node.js (Express), Python (FastAPI), or Go REST APIs.
- **Database & Auditing:** PostgreSQL / MongoDB with tamper-evident cryptographic hash chains.
- **Biometric & OCR Verification:** Government ID card OCR, face matching, and OTP 2-factor authentication.
- **Speech Engine:** Web Speech API or OpenAI Whisper for real-time multilingual voice command parsing.

---

## 📂 Project File Structure

```text
OVS/
├── index.html       # Main HTML markup and step containers
├── style.css        # Civic-tech dark UI, animations & responsive styling
├── script.js        # State manager, Enter key routing, audio & validation logic
└── README.md        # Project documentation and presentation guide
```

---

## 📋 Academic Limitations & Disclaimers

- **Mock Verification:** Any non-empty string is accepted as a valid demo ID.
- **Local Storage / Memory:** Vote tallies and simulated transaction receipts are stored in the current browser session.
- **No Real Voting:** This tool does not affect any real-world election.
