// ============================================
//   ELEMENT REFERENCES
// ============================================
const billInput     = document.getElementById('bill');
const customTipInput = document.getElementById('custom-tip');
const peopleInput   = document.getElementById('people');
const segments      = document.querySelectorAll('.segment');
const resetBtn      = document.getElementById('reset');

const outTip        = document.getElementById('out-tip');
const outTotal      = document.getElementById('out-total');
const outPerPerson  = document.getElementById('out-per-person');

const errorBill     = document.getElementById('error-bill');
const errorTip      = document.getElementById('error-tip');
const errorPeople   = document.getElementById('error-people');

const billWrapper    = billInput.closest('.input-wrapper');
const tipWrapper     = customTipInput.closest('.input-wrapper');
const peopleWrapper  = peopleInput.closest('.input-wrapper');

// ============================================
//   STATE
// ============================================
let activeTipPercent = null; // number from segment, or null

// ============================================
//   SEGMENTED CONTROL
// ============================================
segments.forEach(segment => {
  segment.addEventListener('click', () => {
    const value = parseFloat(segment.dataset.value);

    // If clicking the already-active segment, deselect it
    if (activeTipPercent === value) {
      activeTipPercent = null;
      segment.classList.remove('is-active');
      segment.setAttribute('aria-pressed', 'false');
    } else {
      activeTipPercent = value;
      segments.forEach(s => {
        s.classList.remove('is-active');
        s.setAttribute('aria-pressed', 'false');
      });
      segment.classList.add('is-active');
      segment.setAttribute('aria-pressed', 'true');
      customTipInput.value = ''; // clear custom input
      clearError(errorTip, tipWrapper);
    }

    calculate();
  });
});

// Typing in custom tip clears segment selection
customTipInput.addEventListener('input', () => {
  activeTipPercent = null;
  segments.forEach(s => {
    s.classList.remove('is-active');
    s.setAttribute('aria-pressed', 'false');
  });
  calculate();
});

// ============================================
//   LIVE CALCULATION TRIGGER
// ============================================
billInput.addEventListener('input', calculate);
peopleInput.addEventListener('input', calculate);
customTipInput.addEventListener('input', calculate);

// ============================================
//   VALIDATION HELPERS
// ============================================
function showError(el, wrapper, msg) {
  el.textContent = msg;
  el.classList.add('is-visible');
  if (wrapper) wrapper.classList.add('has-error');
}

function clearError(el, wrapper) {
  el.textContent = '';
  el.classList.remove('is-visible');
  if (wrapper) wrapper.classList.remove('has-error');
}

function setOutput(tip, total, perPerson) {
  outTip.textContent       = `Rs ${tip}`;
  outTotal.textContent     = `Rs ${total}`;
  outPerPerson.textContent = `Rs ${perPerson}`;
}

function resetOutput() {
  outTip.textContent       = 'Rs —';
  outTotal.textContent     = 'Rs —';
  outPerPerson.textContent = 'Rs —';
}

// ============================================
//   ROUNDING POLICY
//   Round UP to nearest paisa (2 decimal places)
//   so the group never underpays.
// ============================================
function roundUp(value) {
  return Math.ceil(value * 100) / 100;
}

function fmt(value) {
  return value.toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// ============================================
//   CORE CALCULATE FUNCTION
// ============================================
function calculate() {
  let valid = true;

  // --- Bill validation ---
  const billRaw = billInput.value.trim();
  const bill    = parseFloat(billRaw);

  clearError(errorBill, billWrapper);

  if (billRaw === '') {
    // empty is fine — just show dashes
  } else if (isNaN(bill) || bill <= 0) {
    showError(errorBill, billWrapper, 'Enter a positive bill amount.');
    valid = false;
  } else if (bill > 10_000_000) {
    showError(errorBill, billWrapper, 'Amount too large (max Rs 10,000,000).');
    valid = false;
  }

  // --- Tip validation ---
  const customRaw = customTipInput.value.trim();
  let   tipPercent = activeTipPercent;

  clearError(errorTip, tipWrapper);

  if (activeTipPercent === null) {
    if (customRaw === '') {
      tipPercent = 0; // default to 0 if nothing selected
    } else {
      const parsed = parseFloat(customRaw);
      if (isNaN(parsed) || parsed < 0) {
        showError(errorTip, tipWrapper, 'Tip must be 0% or more.');
        valid = false;
      } else if (parsed > 60) {
        showError(errorTip, tipWrapper, 'Tip above 60% — are you sure? Enter a lower value.');
        valid = false;
      } else {
        tipPercent = parsed;
      }
    }
  }

  // --- People validation ---
  const peopleRaw = peopleInput.value.trim();
  const people    = parseInt(peopleRaw, 10);

  clearError(errorPeople, peopleWrapper);

  if (peopleRaw === '') {
    // empty is fine — just show dashes
  } else if (isNaN(people) || people < 1 || !Number.isInteger(people)) {
    showError(errorPeople, peopleWrapper, 'Enter a whole number (min 1).');
    valid = false;
  } else if (people > 100) {
    showError(errorPeople, peopleWrapper, 'Max 100 people supported.');
    valid = false;
  }

  // --- If any field is empty or invalid, show dashes ---
  if (
    billRaw === ''   ||
    peopleRaw === '' ||
    !valid           ||
    isNaN(bill)      ||
    isNaN(people)
  ) {
    resetOutput();
    return;
  }

  // --- Compute ---
  const tipAmount  = roundUp(bill * (tipPercent / 100));
  const grandTotal = roundUp(bill + tipAmount);
  const perPerson  = roundUp(grandTotal / people);

  setOutput(fmt(tipAmount), fmt(grandTotal), fmt(perPerson));
}

// ============================================
//   RESET
// ============================================
resetBtn.addEventListener('click', () => {
  // Clear inputs
  billInput.value       = '';
  customTipInput.value  = '';
  peopleInput.value     = '';

  // Clear segments
  activeTipPercent = null;
  segments.forEach(s => {
    s.classList.remove('is-active');
    s.setAttribute('aria-pressed', 'false');
  });

  // Clear errors
  clearError(errorBill, billWrapper);
  clearError(errorTip, tipWrapper);
  clearError(errorPeople, peopleWrapper);

  // Reset output
  resetOutput();

  // Return focus to first field
  billInput.focus();
});

// ============================================
//   ENTER KEY — move to next field naturally
// ============================================
[billInput, customTipInput, peopleInput].forEach((input, i, arr) => {
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const next = arr[i + 1];
      if (next) next.focus();
    }
  });
});