/**
 * ONLINE VOTING SYSTEM — FRONTEND DEMO
 * College Project Demonstration Script
 * Pure Vanilla JavaScript (ES6+)
 * 
 * Features:
 * - Step-by-step interactive navigation
 * - Global Enter key event router
 * - Form validation and duplicate ID check simulation
 * - Candidate selection & simulated voice voting recognition
 * - Web Audio API synthesized sound effects (100% offline)
 * - Session tally tracking & live results
 * - High contrast & font resizing accessibility tools
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. CANDIDATES DEFINITION & CONSTANTS
  // -------------------------------------------------------------------------
  const CANDIDATES = {
    A: {
      id: 'A',
      name: 'Candidate A',
      party: 'Tech & Innovation Alliance',
      motto: 'Advancing digital infrastructure and future opportunities.',
      symbol: '⚡'
    },
    B: {
      id: 'B',
      name: 'Candidate B',
      party: 'Campus Ecology & Green Initiative',
      motto: 'Sustainability, green campuses, and renewable development.',
      symbol: '🌿'
    },
    C: {
      id: 'C',
      name: 'Candidate C',
      party: 'Student Welfare & Education Reform',
      motto: 'Empowering learning, research grants, and student rights.',
      symbol: '📚'
    },
    D: {
      id: 'D',
      name: 'Candidate D',
      party: 'Civic Governance & Ethics Forum',
      motto: 'Transparent governance, ethics, and accessible services.',
      symbol: '🛡️'
    }
  };

  // -------------------------------------------------------------------------
  // 2. APPLICATION STATE
  // -------------------------------------------------------------------------
  const state = {
    currentStep: 1,           // 1 to 6
    voterId: '',              // e.g. "DEMO123"
    votingMode: 'normal',     // 'normal' or 'voice'
    selectedCandidate: null,  // 'A', 'B', 'C', 'D' or null
    isVoiceRunning: false,    // true during voice simulation
    isVoteSubmitted: false,   // prevents double vote
    soundEnabled: true,
    fontScale: 1.0,
    votedVoterIds: new Set(), // Session memory of IDs that already voted
    tally: {
      total: 0,
      normal: 0,
      voice: 0,
      candidates: { A: 0, B: 0, C: 0, D: 0 }
    }
  };

  // -------------------------------------------------------------------------
  // 3. DOM ELEMENT REFERENCES
  // -------------------------------------------------------------------------
  const elements = {
    // Stepper
    stepperItems: document.querySelectorAll('.step-item'),
    stepperConnectors: document.querySelectorAll('.step-connector'),
    
    // Step Sections
    steps: {
      1: document.getElementById('step1'),
      2: document.getElementById('step2'),
      3: document.getElementById('step3'),
      '4normal': document.getElementById('step4Normal'),
      '4voice': document.getElementById('step4Voice'),
      5: document.getElementById('step5'),
      6: document.getElementById('step6')
    },

    // Screen reader announcer
    srAnnouncer: document.getElementById('srAnnouncer'),

    // Step 1: Welcome
    btnStartDemo: document.getElementById('btnStartDemo'),
    btnViewFlowStep1: document.getElementById('btnViewFlowStep1'),
    brandLogo: document.getElementById('brandLogo'),

    // Step 2: Voter ID
    voterIdInput: document.getElementById('voterIdInput'),
    clearVoterIdBtn: document.getElementById('clearVoterIdBtn'),
    presetChips: document.querySelectorAll('.preset-chip'),
    voterIdFeedback: document.getElementById('voterIdFeedback'),
    btnVerifyVoterId: document.getElementById('btnVerifyVoterId'),
    btnBackToStep1: document.getElementById('btnBackToStep1'),

    // Step 3: Choose Mode
    modeCards: document.querySelectorAll('.mode-card'),
    modeFeedback: document.getElementById('modeFeedback'),
    btnContinueMode: document.getElementById('btnContinueMode'),
    btnBackToStep2: document.getElementById('btnBackToStep2'),

    // Step 4A: Normal Voting
    candidateCards: document.querySelectorAll('.candidate-card'),
    candidateFeedback: document.getElementById('candidateFeedback'),
    btnContinueCandidate: document.getElementById('btnContinueCandidate'),
    btnBackToStep3FromNormal: document.getElementById('btnBackToStep3FromNormal'),
    displayVoterIdNormal: document.getElementById('displayVoterIdNormal'),

    // Step 4B: Voice Voting
    micVisualizerBox: document.querySelector('.mic-visualizer-box'),
    voiceStatusBadge: document.getElementById('voiceStatusBadge'),
    voiceStatusText: document.getElementById('voiceStatusText'),
    voiceStepsLog: document.getElementById('voiceStepsLog'),
    btnStartVoiceDemo: document.getElementById('btnStartVoiceDemo'),
    voiceBtnText: document.getElementById('voiceBtnText'),
    voiceFeedback: document.getElementById('voiceFeedback'),
    fallbackBtns: document.querySelectorAll('.fallback-btn'),
    btnContinueVoice: document.getElementById('btnContinueVoice'),
    btnBackToStep3FromVoice: document.getElementById('btnBackToStep3FromVoice'),
    displayVoterIdVoice: document.getElementById('displayVoterIdVoice'),

    // Step 5: Confirm Vote
    confirmVoterId: document.getElementById('confirmVoterId'),
    confirmVotingMode: document.getElementById('confirmVotingMode'),
    confirmModeTag: document.getElementById('confirmModeTag'),
    confirmCandSymbol: document.getElementById('confirmCandSymbol'),
    confirmCandName: document.getElementById('confirmCandName'),
    confirmCandParty: document.getElementById('confirmCandParty'),
    confirmTimestamp: document.getElementById('confirmTimestamp'),
    btnConfirmVote: document.getElementById('btnConfirmVote'),
    btnBackFromConfirm: document.getElementById('btnBackFromConfirm'),

    // Step 6: Success / Receipt
    receiptTxId: document.getElementById('receiptTxId'),
    receiptMaskedId: document.getElementById('receiptMaskedId'),
    receiptMode: document.getElementById('receiptMode'),
    receiptCandidate: document.getElementById('receiptCandidate'),
    receiptTime: document.getElementById('receiptTime'),
    receiptHash: document.getElementById('receiptHash'),
    btnStartNewDemo: document.getElementById('btnStartNewDemo'),
    btnViewFlowFromSuccess: document.getElementById('btnViewFlowFromSuccess'),
    btnViewTallyFromSuccess: document.getElementById('btnViewTallyFromSuccess'),

    // Modals
    flowModal: document.getElementById('flowModal'),
    headerFlowBtn: document.getElementById('headerFlowBtn'),
    closeFlowModalBtn: document.getElementById('closeFlowModalBtn'),
    btnModalClose: document.getElementById('btnModalClose'),
    btnModalStartDemo: document.getElementById('btnModalStartDemo'),

    tallyModal: document.getElementById('tallyModal'),
    viewTallyBtn: document.getElementById('viewTallyBtn'),
    closeTallyModalBtn: document.getElementById('closeTallyModalBtn'),
    btnCloseTallyModal: document.getElementById('btnCloseTallyModal'),
    btnResetTally: document.getElementById('btnResetTally'),
    totalVotesCount: document.getElementById('totalVotesCount'),
    normalVotesCount: document.getElementById('normalVotesCount'),
    voiceVotesCount: document.getElementById('voiceVotesCount'),
    tallyChartList: document.getElementById('tallyChartList'),

    // Header Controls
    soundToggleBtn: document.getElementById('soundToggleBtn'),
    soundIconOn: document.getElementById('soundIconOn'),
    soundIconOff: document.getElementById('soundIconOff'),
    fontSizeDec: document.getElementById('fontSizeDec'),
    fontSizeInc: document.getElementById('fontSizeInc'),
    contrastToggleBtn: document.getElementById('contrastToggleBtn'),
    headerRestartBtn: document.getElementById('headerRestartBtn')
  };

  // -------------------------------------------------------------------------
  // 4. SYNTHESIZED WEB AUDIO API SOUND EFFECTS (100% Offline)
  // -------------------------------------------------------------------------
  const AudioEngine = {
    ctx: null,

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        try {
          this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
          console.warn('AudioContext not supported', e);
        }
      }
    },

    playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.15) {
      if (!state.soundEnabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio error silent fallback
      }
    },

    click() {
      this.playTone(600, 'sine', 0.06, 0.1);
    },

    select() {
      this.playTone(880, 'triangle', 0.1, 0.12);
    },

    success() {
      if (!state.soundEnabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
        freqs.forEach((f, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + idx * 0.08);
          gain.gain.setValueAtTime(0.12, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.3);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.3);
        });
      } catch (e) {}
    },

    voicePing() {
      this.playTone(1200, 'sine', 0.15, 0.15);
    },

    error() {
      this.playTone(220, 'sawtooth', 0.2, 0.12);
    }
  };

  // -------------------------------------------------------------------------
  // 5. HELPER UTILITIES
  // -------------------------------------------------------------------------
  function announce(text) {
    if (elements.srAnnouncer) {
      elements.srAnnouncer.textContent = text;
    }
  }

  function maskVoterId(id) {
    if (!id) return 'DEMO****';
    const trimmed = id.trim();
    if (trimmed.length <= 4) return trimmed.slice(0, 1) + '***' + trimmed.slice(-1);
    const first = trimmed.slice(0, 3);
    const last = trimmed.slice(-3);
    return `${first}****${last}`;
  }

  function getFormattedTimestamp() {
    const now = new Date();
    return now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function generateMockHash(seed) {
    let hash = 0;
    const str = seed + Date.now().toString();
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `SHA256-MOCK-${hex}${Math.random().toString(36).substring(2, 6)}`;
  }

  function generateTxId() {
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `DEMO-TX-${rand}`;
  }

  // -------------------------------------------------------------------------
  // 6. STEP NAVIGATION CONTROLLER
  // -------------------------------------------------------------------------
  function goToStep(stepNum) {
    // Hide all step sections
    Object.values(elements.steps).forEach(sec => {
      if (sec) sec.classList.remove('active');
    });

    state.currentStep = stepNum;

    // Show appropriate step section
    let activeSection = null;
    if (stepNum === 1) {
      activeSection = elements.steps[1];
    } else if (stepNum === 2) {
      activeSection = elements.steps[2];
      // Focus input field
      setTimeout(() => {
        if (elements.voterIdInput) {
          elements.voterIdInput.focus();
          elements.voterIdInput.select();
        }
      }, 100);
    } else if (stepNum === 3) {
      activeSection = elements.steps[3];
      updateModeCardsUI();
    } else if (stepNum === 4) {
      if (state.votingMode === 'voice') {
        activeSection = elements.steps['4voice'];
        if (elements.displayVoterIdVoice) {
          elements.displayVoterIdVoice.textContent = state.voterId;
        }
        setupVoiceScreen();
      } else {
        activeSection = elements.steps['4normal'];
        if (elements.displayVoterIdNormal) {
          elements.displayVoterIdNormal.textContent = state.voterId;
        }
        updateCandidateCardsUI();
      }
    } else if (stepNum === 5) {
      activeSection = elements.steps[5];
      populateConfirmationScreen();
    } else if (stepNum === 6) {
      activeSection = elements.steps[6];
      populateSuccessReceipt();
    }

    if (activeSection) {
      activeSection.classList.add('active');
    }

    // Update Progress Stepper
    updateStepperUI(stepNum);

    // Scroll to top of main content
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Screen reader announcement
    announce(`Step ${stepNum} active: ${getStepTitle(stepNum)}`);
  }

  function getStepTitle(stepNum) {
    switch (stepNum) {
      case 1: return 'Welcome to Online Voting System Demo';
      case 2: return 'Voter Identification Verification';
      case 3: return 'Choose Voting Mode: Normal or Voice';
      case 4: return state.votingMode === 'voice' ? 'Voice Voting Demonstration' : 'Select Candidate Ballot';
      case 5: return 'Review and Confirm Ballot';
      case 6: return 'Vote Recorded Successfully';
      default: return 'Online Voting System';
    }
  }

  function updateStepperUI(currentStep) {
    elements.stepperItems.forEach(item => {
      const step = parseInt(item.getAttribute('data-step'), 10);
      item.classList.remove('active', 'completed');
      if (step < currentStep) {
        item.classList.add('completed');
      } else if (step === currentStep) {
        item.classList.add('active');
      }
    });

    elements.stepperConnectors.forEach((conn, index) => {
      if (index + 1 < currentStep) {
        conn.classList.add('completed');
      } else {
        conn.classList.remove('completed');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 7. STEP 1: WELCOME SCREEN LOGIC
  // -------------------------------------------------------------------------
  function handleStartDemo() {
    AudioEngine.click();
    goToStep(2);
  }

  // -------------------------------------------------------------------------
  // 8. STEP 2: VOTER ID VALIDATION LOGIC
  // -------------------------------------------------------------------------
  function handleVerifyVoterId() {
    const inputVal = elements.voterIdInput.value.trim();
    const feedback = elements.voterIdFeedback;

    if (!inputVal) {
      AudioEngine.error();
      feedback.className = 'feedback-msg error';
      feedback.style.display = 'flex';
      feedback.textContent = '⚠️ Please enter a demo Voter ID (e.g. DEMO123 or VOTER-2026).';
      elements.voterIdInput.focus();
      return false;
    }

    // Check duplicate vote prevention demo simulation
    if (state.votedVoterIds.has(inputVal.toUpperCase())) {
      AudioEngine.error();
      feedback.className = 'feedback-msg warning';
      feedback.style.display = 'flex';
      feedback.innerHTML = `⚠️ <strong>Duplicate Voter ID detected:</strong> ID <code>${inputVal}</code> already voted in this demo session. You can enter a different ID or continue for presentation testing.`;
      // Allow user to proceed on second press or if they edit ID
    } else {
      feedback.className = 'feedback-msg success';
      feedback.style.display = 'flex';
      feedback.textContent = '✓ Voter ID verified successfully (Mock Authentication).';
    }

    state.voterId = inputVal;
    AudioEngine.select();

    // Smooth transition to Step 3
    setTimeout(() => {
      goToStep(3);
    }, 450);
    return true;
  }

  // -------------------------------------------------------------------------
  // 9. STEP 3: MODE SELECTION LOGIC
  // -------------------------------------------------------------------------
  function selectMode(mode) {
    state.votingMode = mode;
    updateModeCardsUI();
    AudioEngine.select();
    if (elements.modeFeedback) {
      elements.modeFeedback.style.display = 'none';
    }
  }

  function updateModeCardsUI() {
    elements.modeCards.forEach(card => {
      const mode = card.getAttribute('data-mode');
      const isSelected = mode === state.votingMode;
      card.classList.toggle('selected', isSelected);
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });
  }

  function handleContinueMode() {
    if (!state.votingMode) {
      state.votingMode = 'normal';
    }
    AudioEngine.click();
    goToStep(4);
  }

  // -------------------------------------------------------------------------
  // 10. STEP 4A: NORMAL VOTING (CANDIDATE SELECTION)
  // -------------------------------------------------------------------------
  function selectCandidate(candidateId) {
    state.selectedCandidate = candidateId;
    updateCandidateCardsUI();
    AudioEngine.select();
    if (elements.candidateFeedback) {
      elements.candidateFeedback.style.display = 'none';
    }
  }

  function updateCandidateCardsUI() {
    elements.candidateCards.forEach(card => {
      const cId = card.getAttribute('data-candidate-id');
      const isSelected = cId === state.selectedCandidate;
      card.classList.toggle('selected', isSelected);
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });
  }

  function handleContinueCandidate() {
    if (!state.selectedCandidate) {
      AudioEngine.error();
      if (elements.candidateFeedback) {
        elements.candidateFeedback.className = 'feedback-msg error';
        elements.candidateFeedback.style.display = 'flex';
        elements.candidateFeedback.textContent = '⚠️ Please select one candidate before continuing.';
      }
      return false;
    }
    AudioEngine.click();
    goToStep(5);
    return true;
  }

  // -------------------------------------------------------------------------
  // 11. STEP 4B: VOICE VOTING SIMULATION (RANDOMIZED DEMO)
  // -------------------------------------------------------------------------
  function setupVoiceScreen() {
    updateFallbackBtnsUI();
    resetVoiceSimulationUI();
  }

  function resetVoiceSimulationUI() {
    state.isVoiceRunning = false;
    if (elements.micVisualizerBox) {
      elements.micVisualizerBox.className = 'mic-visualizer-box';
    }
    if (elements.voiceStatusText) {
      elements.voiceStatusText.textContent = 'Ready to start voice demo';
    }
    if (elements.btnStartVoiceDemo) {
      elements.btnStartVoiceDemo.disabled = false;
      elements.voiceBtnText.textContent = 'Start Voice Demo';
    }

    // Reset log items
    const logItems = elements.voiceStepsLog.querySelectorAll('.log-item');
    logItems.forEach((li, idx) => {
      li.className = 'log-item' + (idx === 0 ? ' ready' : '');
    });

    const recLabel = document.getElementById('recognizedCandidateLabel');
    if (recLabel) {
      recLabel.textContent = '"Waiting for speech..."';
    }
  }

  function runVoiceDemoSimulation() {
    if (state.isVoiceRunning) return;
    state.isVoiceRunning = true;

    AudioEngine.voicePing();

    const micBox = elements.micVisualizerBox;
    const statusText = elements.voiceStatusText;
    const btn = elements.btnStartVoiceDemo;
    const logItems = elements.voiceStepsLog.querySelectorAll('.log-item');

    btn.disabled = true;
    elements.voiceBtnText.textContent = 'Listening...';

    // Step 1: Listening
    micBox.classList.add('listening');
    statusText.textContent = 'Listening... Speak candidate name';
    if (logItems[0]) logItems[0].className = 'log-item done';
    if (logItems[1]) logItems[1].className = 'log-item active';

    // Step 2: Processing (after 1000ms)
    setTimeout(() => {
      AudioEngine.voicePing();
      statusText.textContent = 'Processing speech recognition & natural language model...';
      if (logItems[1]) logItems[1].className = 'log-item done';
      if (logItems[2]) logItems[2].className = 'log-item active';
    }, 1000);

    // Step 3: Recognized a RANDOM Candidate (after 2200ms)
    setTimeout(() => {
      // Pick a random candidate from all candidates (A, B, C, D)
      const candKeys = Object.keys(CANDIDATES);
      // If a candidate was already selected previously, prioritize another random candidate for demonstration variety
      let candidatesPool = candKeys;
      if (state.selectedCandidate && candKeys.length > 1) {
        const filtered = candKeys.filter(k => k !== state.selectedCandidate);
        if (filtered.length > 0) candidatesPool = filtered;
      }
      const randomCandId = candidatesPool[Math.floor(Math.random() * candidatesPool.length)];
      const chosenCand = CANDIDATES[randomCandId];

      state.selectedCandidate = randomCandId;
      updateFallbackBtnsUI();

      // Update the log item label
      const recLabel = document.getElementById('recognizedCandidateLabel');
      if (recLabel) {
        recLabel.textContent = `"${chosenCand.name} - ${chosenCand.party}"`;
      }

      micBox.classList.remove('listening');
      micBox.classList.add('recognized');
      statusText.textContent = `Recognized: "${chosenCand.name} (${chosenCand.symbol} ${chosenCand.party})"`;
      
      if (logItems[2]) logItems[2].className = 'log-item done';
      if (logItems[3]) logItems[3].className = 'log-item done';
      if (logItems[4]) logItems[4].className = 'log-item done';

      AudioEngine.select();
      elements.voiceBtnText.textContent = 'Replay Voice Demo';
      btn.disabled = false;
      state.isVoiceRunning = false;

      if (elements.voiceFeedback) {
        elements.voiceFeedback.className = 'feedback-msg success';
        elements.voiceFeedback.style.display = 'flex';
        elements.voiceFeedback.textContent = `✓ Voice recognized candidate: "${chosenCand.name} (${chosenCand.symbol} ${chosenCand.party})" — Selected! Click "Continue to Confirmation" to proceed.`;
      }

      announce(`Voice recognized: ${chosenCand.name} selected. Click Continue to proceed to confirmation.`);
    }, 2200);
  }

  function selectVoiceFallbackCandidate(candidateId) {
    state.selectedCandidate = candidateId;
    updateFallbackBtnsUI();
    AudioEngine.select();

    const cand = CANDIDATES[candidateId];
    const recLabel = document.getElementById('recognizedCandidateLabel');
    if (recLabel) {
      recLabel.textContent = `"${cand.name} - ${cand.party}"`;
    }
    if (elements.voiceFeedback) {
      elements.voiceFeedback.className = 'feedback-msg success';
      elements.voiceFeedback.style.display = 'flex';
      elements.voiceFeedback.textContent = `✓ Selected: ${cand.name} (${cand.symbol} ${cand.party}). Click "Continue to Confirmation" to proceed.`;
    }
  }

  function updateFallbackBtnsUI() {
    elements.fallbackBtns.forEach(btn => {
      const cId = btn.getAttribute('data-candidate');
      btn.classList.toggle('selected', cId === state.selectedCandidate);
    });
  }

  function handleContinueVoice() {
    if (!state.selectedCandidate) {
      // Pick random if user clicks continue before clicking start voice demo
      const candKeys = Object.keys(CANDIDATES);
      state.selectedCandidate = candKeys[Math.floor(Math.random() * candKeys.length)];
    }
    AudioEngine.click();
    goToStep(5);
  }

  // -------------------------------------------------------------------------
  // 12. STEP 5: CONFIRMATION SCREEN
  // -------------------------------------------------------------------------
  function populateConfirmationScreen() {
    state.isVoteSubmitted = false;
    const cand = CANDIDATES[state.selectedCandidate] || CANDIDATES.A;

    elements.confirmVoterId.textContent = state.voterId || 'DEMO123';
    elements.confirmModeTag.textContent = state.votingMode === 'voice' ? 'Voice Voting (Assistive)' : 'Normal Voting (Standard)';
    elements.confirmCandSymbol.textContent = cand.symbol;
    elements.confirmCandName.textContent = cand.name;
    elements.confirmCandParty.textContent = cand.party;
    elements.confirmTimestamp.textContent = getFormattedTimestamp();

    if (elements.btnConfirmVote) {
      elements.btnConfirmVote.disabled = false;
    }
  }

  function handleConfirmVote() {
    if (state.isVoteSubmitted) return;
    state.isVoteSubmitted = true;

    if (elements.btnConfirmVote) {
      elements.btnConfirmVote.disabled = true;
    }

    // Record in local session tally
    const candId = state.selectedCandidate || 'A';
    state.tally.total++;
    state.tally.candidates[candId] = (state.tally.candidates[candId] || 0) + 1;
    if (state.votingMode === 'voice') {
      state.tally.voice++;
    } else {
      state.tally.normal++;
    }

    if (state.voterId) {
      state.votedVoterIds.add(state.voterId.toUpperCase());
    }

    AudioEngine.success();

    // Advance to Step 6
    goToStep(6);
  }

  // -------------------------------------------------------------------------
  // 13. STEP 6: SUCCESS RECEIPT
  // -------------------------------------------------------------------------
  function populateSuccessReceipt() {
    const cand = CANDIDATES[state.selectedCandidate] || CANDIDATES.A;
    const txId = generateTxId();
    const hash = generateMockHash(state.voterId + cand.name);
    const timeStr = getFormattedTimestamp();

    elements.receiptTxId.textContent = txId;
    elements.receiptMaskedId.textContent = maskVoterId(state.voterId);
    elements.receiptMode.textContent = state.votingMode === 'voice' ? 'Voice Voting' : 'Normal Voting';
    elements.receiptCandidate.textContent = `${cand.name} (${cand.symbol} ${cand.party})`;
    elements.receiptTime.textContent = timeStr;
    elements.receiptHash.textContent = hash;
  }

  function handleStartNewDemo() {
    AudioEngine.click();
    // Reset inputs for next run
    state.voterId = '';
    state.selectedCandidate = null;
    state.isVoteSubmitted = false;

    if (elements.voterIdInput) {
      elements.voterIdInput.value = '';
    }
    if (elements.voterIdFeedback) {
      elements.voterIdFeedback.style.display = 'none';
    }
    if (elements.candidateFeedback) {
      elements.candidateFeedback.style.display = 'none';
    }
    if (elements.voiceFeedback) {
      elements.voiceFeedback.style.display = 'none';
    }

    goToStep(1);
  }

  // -------------------------------------------------------------------------
  // 14. MODAL CONTROLS & LIVE TALLY
  // -------------------------------------------------------------------------
  function openFlowModal() {
    AudioEngine.click();
    elements.flowModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    announce('System Flow and Architecture Modal opened.');
  }

  function closeFlowModal() {
    AudioEngine.click();
    elements.flowModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  function openTallyModal() {
    AudioEngine.click();
    renderTallyChart();
    elements.tallyModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    announce('Live Demo Vote Tally Modal opened.');
  }

  function closeTallyModal() {
    AudioEngine.click();
    elements.tallyModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  function renderTallyChart() {
    elements.totalVotesCount.textContent = state.tally.total;
    elements.normalVotesCount.textContent = state.tally.normal;
    elements.voiceVotesCount.textContent = state.tally.voice;

    const list = elements.tallyChartList;
    list.innerHTML = '';

    const total = state.tally.total || 1;

    Object.values(CANDIDATES).forEach(c => {
      const count = state.tally.candidates[c.id] || 0;
      const pct = state.tally.total > 0 ? Math.round((count / state.tally.total) * 100) : 0;

      const row = document.createElement('div');
      row.className = 'tally-row';
      row.innerHTML = `
        <div class="tally-row-header">
          <span>${c.symbol} ${c.name} <small style="color:var(--text-muted);">(${c.party})</small></span>
          <span><strong>${count} vote${count === 1 ? '' : 's'}</strong> (${pct}%)</span>
        </div>
        <div class="tally-bar-bg">
          <div class="tally-bar-fill" style="width: ${pct}%;"></div>
        </div>
      `;
      list.appendChild(row);
    });
  }

  function resetTally() {
    AudioEngine.click();
    state.tally.total = 0;
    state.tally.normal = 0;
    state.tally.voice = 0;
    state.tally.candidates = { A: 0, B: 0, C: 0, D: 0 };
    state.votedVoterIds.clear();
    renderTallyChart();
    announce('Session demo vote tally reset.');
  }

  // -------------------------------------------------------------------------
  // 15. EVENT LISTENERS INITIALIZATION (CURSOR-DRIVEN CLICK INTERACTIONS)
  // -------------------------------------------------------------------------
  function initEventListeners() {
    // Header Logo Link to Step 1
    if (elements.brandLogo) {
      elements.brandLogo.addEventListener('click', () => {
        AudioEngine.click();
        goToStep(1);
      });
    }

    // Step 1: Welcome
    elements.btnStartDemo.addEventListener('click', handleStartDemo);
    elements.btnViewFlowStep1.addEventListener('click', openFlowModal);

    // Step 2: Voter ID
    elements.btnVerifyVoterId.addEventListener('click', handleVerifyVoterId);
    elements.btnBackToStep1.addEventListener('click', () => {
      AudioEngine.click();
      goToStep(1);
    });

    // Allow Enter key inside the text field when typing ID
    elements.voterIdInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleVerifyVoterId();
      }
    });

    elements.voterIdInput.addEventListener('input', (e) => {
      if (elements.clearVoterIdBtn) {
        elements.clearVoterIdBtn.style.display = e.target.value ? 'block' : 'none';
      }
      if (elements.voterIdFeedback) {
        elements.voterIdFeedback.style.display = 'none';
      }
    });

    if (elements.clearVoterIdBtn) {
      elements.clearVoterIdBtn.addEventListener('click', () => {
        elements.voterIdInput.value = '';
        elements.clearVoterIdBtn.style.display = 'none';
        elements.voterIdInput.focus();
      });
    }

    elements.presetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const id = chip.getAttribute('data-id');
        elements.voterIdInput.value = id;
        if (elements.clearVoterIdBtn) {
          elements.clearVoterIdBtn.style.display = 'block';
        }
        AudioEngine.select();
        elements.voterIdInput.focus();
      });
    });

    // Step 3: Choose Mode
    elements.modeCards.forEach(card => {
      card.addEventListener('click', () => {
        const mode = card.getAttribute('data-mode');
        selectMode(mode);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          const mode = card.getAttribute('data-mode');
          selectMode(mode);
        }
      });
    });

    elements.btnContinueMode.addEventListener('click', handleContinueMode);
    elements.btnBackToStep2.addEventListener('click', () => {
      AudioEngine.click();
      goToStep(2);
    });

    // Step 4A: Normal Voting
    elements.candidateCards.forEach(card => {
      card.addEventListener('click', () => {
        const cId = card.getAttribute('data-candidate-id');
        selectCandidate(cId);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          const cId = card.getAttribute('data-candidate-id');
          selectCandidate(cId);
        }
      });
    });

    elements.btnContinueCandidate.addEventListener('click', handleContinueCandidate);
    elements.btnBackToStep3FromNormal.addEventListener('click', () => {
      AudioEngine.click();
      goToStep(3);
    });

    // Step 4B: Voice Voting
    elements.btnStartVoiceDemo.addEventListener('click', runVoiceDemoSimulation);
    elements.fallbackBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cId = btn.getAttribute('data-candidate');
        selectVoiceFallbackCandidate(cId);
      });
    });

    elements.btnContinueVoice.addEventListener('click', handleContinueVoice);
    elements.btnBackToStep3FromVoice.addEventListener('click', () => {
      AudioEngine.click();
      goToStep(3);
    });

    // Step 5: Confirm
    elements.btnConfirmVote.addEventListener('click', handleConfirmVote);
    elements.btnBackFromConfirm.addEventListener('click', () => {
      AudioEngine.click();
      goToStep(4);
    });

    // Step 6: Success
    elements.btnStartNewDemo.addEventListener('click', handleStartNewDemo);
    elements.btnViewFlowFromSuccess.addEventListener('click', openFlowModal);
    elements.btnViewTallyFromSuccess.addEventListener('click', openTallyModal);

    // Stepper Item Click navigation for completed steps
    elements.stepperItems.forEach(item => {
      item.addEventListener('click', () => {
        const step = parseInt(item.getAttribute('data-step'), 10);
        // Only allow jumping back to completed steps or current step
        if (step <= state.currentStep) {
          AudioEngine.click();
          goToStep(step);
        }
      });
    });

    // Modals
    elements.headerFlowBtn.addEventListener('click', openFlowModal);
    elements.closeFlowModalBtn.addEventListener('click', closeFlowModal);
    elements.btnModalClose.addEventListener('click', closeFlowModal);
    elements.btnModalStartDemo.addEventListener('click', () => {
      closeFlowModal();
      goToStep(2);
    });

    elements.viewTallyBtn.addEventListener('click', openTallyModal);
    elements.closeTallyModalBtn.addEventListener('click', closeTallyModal);
    elements.btnCloseTallyModal.addEventListener('click', closeTallyModal);
    elements.btnResetTally.addEventListener('click', resetTally);

    // Accessibility Header Tools
    elements.soundToggleBtn.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      elements.soundToggleBtn.classList.toggle('active', state.soundEnabled);
      elements.soundIconOn.style.display = state.soundEnabled ? 'block' : 'none';
      elements.soundIconOff.style.display = state.soundEnabled ? 'none' : 'block';
      if (state.soundEnabled) AudioEngine.select();
      announce(`Sound effects ${state.soundEnabled ? 'enabled' : 'disabled'}`);
    });

    elements.contrastToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      const isHc = document.body.classList.contains('high-contrast');
      elements.contrastToggleBtn.classList.toggle('active', isHc);
      announce(`High contrast mode ${isHc ? 'enabled' : 'disabled'}`);
    });

    elements.fontSizeInc.addEventListener('click', () => {
      if (state.fontScale < 1.3) {
        state.fontScale += 0.1;
        document.documentElement.style.setProperty('--font-scale', `${state.fontScale}rem`);
        AudioEngine.click();
      }
    });

    elements.fontSizeDec.addEventListener('click', () => {
      if (state.fontScale > 0.85) {
        state.fontScale -= 0.1;
        document.documentElement.style.setProperty('--font-scale', `${state.fontScale}rem`);
        AudioEngine.click();
      }
    });

    elements.headerRestartBtn.addEventListener('click', () => {
      handleStartNewDemo();
    });
  }

  // -------------------------------------------------------------------------
  // 17. APPLICATION INITIALIZATION
  // -------------------------------------------------------------------------
  function initApp() {
    initEventListeners();
    goToStep(1);
    console.log('%cOnline Voting System %cCollege Project Demo Ready', 'background:#4F46E5;color:#FFF;padding:4px 8px;border-radius:4px;font-weight:bold;', 'color:#38BDF8;font-weight:bold;');
  }

  // Run when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
