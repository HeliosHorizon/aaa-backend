export function parseText(input) {
  const text = input.toLowerCase();

  // Extract amount
  const amountMatch = text.match(/\d+/);
  const amount = amountMatch ? Number(amountMatch[0]) : 0;

  // Detect type
  let type = "expense";
  if (text.includes("received") || text.includes("mila") || text.includes("aaya")) {
    type = "income";
  }

  // Detect category
  let category = "other";

  if (text.includes("petrol") || text.includes("fuel")) category = "fuel";
  if (text.includes("rent") || text.includes("kiraya")) category = "rent";
  if (text.includes("food") || text.includes("khana")) category = "food";

  return {
    amount,
    type,
    category,
    description: input
  };
}