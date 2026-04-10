// export function parseText(input) {
//   const text = input.toLowerCase();

//   // Extract amount
//   const amountMatch = text.match(/\d+/);
//   const amount = amountMatch ? Number(amountMatch[0]) : 0;

//   // Detect type
//   let type = "expense";
//   if (text.includes("received") || text.includes("mila") || text.includes("aaya")) {
//     type = "income";
//   }

//   // Detect category
//   let category = "other";

//   if (text.includes("petrol") || text.includes("fuel")) category = "fuel";
//   if (text.includes("rent") || text.includes("kiraya")) category = "rent";
//   if (text.includes("food") || text.includes("khana")) category = "food";

//   return {
//     amount,
//     type,
//     category,
//     description: input
//   };
// }

// function normalizeText(input) {
//   let text = input.toLowerCase();

//   const replacements = {
//     "rupay": "rupees",
//     "rs": "rupees",
//     "₹": "rupees",
//     "diya": "paid",
//     "de diya": "paid",
//     "mila": "received",
//     "aaya": "received",
//     "liye": "for",
//     "liya": "bought",
//     "kharcha": "expense"
//   };

//   Object.keys(replacements).forEach(key => {
//     text = text.replace(new RegExp(key, "g"), replacements[key]);
//   });

//   return text;
// }

// function detectType(text) {
//   const incomeKeywords = ["received", "got", "earned"];
//   const expenseKeywords = ["paid", "spent", "bought", "expense"];

//   if (incomeKeywords.some(k => text.includes(k))) return "income";
//   if (expenseKeywords.some(k => text.includes(k))) return "expense";

//   // 🔥 Heuristic fallback
//   if (text.includes("from")) return "income";
//   if (text.includes("to")) return "expense";

//   return "expense"; // default
// }

// function detectCategory(text) {
//   if (text.includes("petrol") || text.includes("fuel")) return "fuel";
//   if (text.includes("rent") || text.includes("kiraya")) return "rent";
//   if (text.includes("food") || text.includes("khana")) return "food";
//   if (text.includes("salary")) return "salary";

//   return "other";
// }

// export function parseText(input) {
//   const normalized = normalizeText(input);

//   const amountMatch = normalized.match(/\d+/);
//   const amount = amountMatch ? Number(amountMatch[0]) : 0;

//   const type = detectType(normalized);
//   const category = detectCategory(normalized);

//   return {
//     amount,
//     type,
//     category,
//     description: input
//   };
// }
export function parseProduct(input) {
  const text = input.toLowerCase();

  const numbers = text.match(/\d+/g)?.map(Number) || [];

  let quantity = null;
  let rate = null;
  let amount = null;

  if (numbers.length >= 3) {
    // 🔥 take first as qty, last as amount, second last as rate
    quantity = numbers[0];
    rate = numbers[numbers.length - 2];
    amount = numbers[numbers.length - 1];
  } else if (numbers.length === 2) {
    quantity = numbers[0];
    rate = numbers[1];
    amount = quantity * rate;
  } else if (numbers.length === 1) {
    amount = numbers[0];
  }

  // remove numbers to get particulars
  let particular = text.replace(/\d+/g, "").trim();

  // clean extra spaces
  particular = particular.replace(/\s+/g, " ");

  return {
    quantity,
    rate,
    amount,
    particular
  };
}