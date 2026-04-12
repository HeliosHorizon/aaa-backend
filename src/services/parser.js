// ==========================
// 🔧 NORMALIZE TEXT
// ==========================
function normalizeText(input) {
  let text = input.toLowerCase();

  const replacements = {
    "rupay": "rupees",
    "rs": "rupees",
    "₹": "rupees",
    "diya": "paid",
    "de diya": "paid",
    "mila": "received",
    "aaya": "received",
    "liye": "for",
    "liya": "bought",
    "kharcha": "expense"
  };

  Object.keys(replacements).forEach(key => {
    text = text.replace(new RegExp(key, "g"), replacements[key]);
  });

  return text;
}

// ==========================
// 🔢 EXTRACT NUMBERS (SMART)
// ==========================
function extractNumbers(text) {
  // ignore numbers inside words like D421
  const matches = text.match(/\b\d+\b/g);
  return matches ? matches.map(Number) : [];
}

// ==========================
// 🧠 MAIN PRODUCT PARSER
// ==========================
export function parseProduct(input) {
  const normalized = normalizeText(input);
  const text = normalized;

  const numbers = extractNumbers(text);

  let quantity = null;
  let rate = null;
  let amount = null;

  // ==========================
  // 🧠 SMART NUMBER LOGIC
  // ==========================
  if (numbers.length >= 2) {
    quantity = numbers[0];
    rate = numbers[numbers.length - 1];

    // 🔥 ALWAYS calculate amount
    amount = quantity * rate;
  }

  // ==========================
  // 🧾 CLEAN PARTICULAR
  // ==========================
  let particular = text;

  // remove standalone numbers
  particular = particular.replace(/\b\d+\b/g, "");

  // remove common noise words
  particular = particular
    .replace(/rupees|each|total|for/g, "")
    .trim();

  // clean spacing
  particular = particular.replace(/\s+/g, " ");

  // ==========================
  // 🧠 OPTIONAL: AMOUNT VALIDATION
  // ==========================
  let detectedAmount = null;

  if (numbers.length >= 3) {
    detectedAmount = numbers[numbers.length - 1];
  }

  let warning = null;

  if (detectedAmount && amount && detectedAmount !== amount) {
    warning = "Amount mismatch detected";
  }

  return {
    quantity,
    rate,
    amount,
    particular,

    // optional meta
    detectedAmount,
    warning,

    // user will fill
    name: null,
    address: null
  };
}