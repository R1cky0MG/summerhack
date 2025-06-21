import fs from "fs";
import path from "path";
import Tesseract from "tesseract.js";
import OpenAI from "openai";
import * as XLSX from "xlsx";

const openai = new OpenAI({
  apiKey:
    "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",
});

async function processBon(imagePath) {
  console.log(`🔍 OCR în curs pentru ${imagePath}...`);

  const {
    data: { text },
  } = await Tesseract.recognize(imagePath, "ron", {
    logger: (m) => process.stdout.write("."),
  });

  console.log("\n🧠 Trimitem textul la AI pentru analiză...");

  const prompt = `
Text extras de pe un bon fiscal:

${text}

Extrage următoarele informații (dacă există):
- Denumirea magazinului
- Codul fiscal
- Data bonului
- Suma totală
- TVA
- Produse (nume produs, cantitate, preț unitar)

Răspunde doar cu JSON valid, fără alte simboluri sau blocuri de cod.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  let aiResponse = completion.choices[0].message.content;
  console.log("\n✅ Răspuns AI:\n", aiResponse);

  // 🔧 Curățare bloc ```json ... ```
  let cleanedJson = aiResponse.trim();
  if (cleanedJson.startsWith("```json")) {
    cleanedJson = cleanedJson
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();
  } else if (cleanedJson.startsWith("```")) {
    cleanedJson = cleanedJson.replace(/^```/, "").replace(/```$/, "").trim();
  }

  let parsed;
  try {
    parsed = JSON.parse(cleanedJson);
  } catch (err) {
    console.error("❌ AI nu a returnat un JSON valid:", err.message);
    console.error("🔎 Text primit:\n", cleanedJson);
    return;
  }

  saveToExcelAndCSV(parsed);
}

function saveToExcelAndCSV(data) {
  const sheetData = [];

  // Titluri
  sheetData.push(["Magazin", data.denumirea_magazinului || ""]);
  sheetData.push(["Cod Fiscal", data.codul_fiscal || ""]);
  sheetData.push(["Dată", data.data_bonului || ""]);
  sheetData.push(["Total", data.suma_totala || ""]);
  sheetData.push(["TVA", data.TVA || ""]);
  sheetData.push([]);
  sheetData.push(["Produs", "Cantitate", "Preț unitar"]);

  if (Array.isArray(data.produse)) {
    data.produse.forEach((p) => {
      sheetData.push([
        p.nume_produs || "",
        p.cantitate || "",
        p.pret_unitar || "",
      ]);
    });
  }

  // === Excel
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  XLSX.utils.book_append_sheet(wb, ws, "Bon Fiscal");
  XLSX.writeFile(wb, "bonuri.xlsx");
  console.log("📁 Fișier Excel salvat: bonuri.xlsx");

  // === CSV
  const csvRows = sheetData.map((row) => row.join(",")).join("\n");
  fs.writeFileSync("bonuri.csv", csvRows, "utf8");
  console.log("📁 Fișier CSV salvat: bonuri.csv");
}

// === Rulare
const imagineBon = process.argv[2];
if (!imagineBon) {
  console.log("❗ Te rog să oferi calea către o imagine:");
  console.log("Ex: node cont_ai.js ./bon.png");
  process.exit(1);
}

processBon(path.resolve(imagineBon));
