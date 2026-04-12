import Tesseract from "tesseract.js";

export async function extractTextFromImage(buffer) {
  try {
    const result = await Tesseract.recognize(
      buffer,
      "eng", // later can add "eng+hin"
      {
        logger: m => console.log(m) // optional
      }
    );

    return result.data.text;

  } catch (error) {
    console.error("OCR Error:", error);
    return null;
  }
}