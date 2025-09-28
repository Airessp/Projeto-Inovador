import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

// Caminho para os ficheiros CSV e JSON dentro da pasta /public/data
const csvPath = path.join(process.cwd(), "public", "data", "products.csv");
const jsonPath = path.join(process.cwd(), "public", "data", "products.json");

// Lê o CSV
const csvData = fs.readFileSync(csvPath, "utf8");
const records = parse(csvData, {
  columns: true,
  skip_empty_lines: true,
});

// Converte cada linha do CSV para o formato que o site já usa
const products = records.map((row, index) => ({
  id: row.id ? parseInt(row.id) : index + 1, // garante sempre um ID
  name: row.name || "Produto sem nome",
  category: row.category || "Outros",
  brand: row.brand || "Marca Genérica",
  price: row.price ? parseFloat(row.price) : 0,
  originalPrice: row.originalPrice ? parseFloat(row.originalPrice) : null,
  image: row.image || "/placeholder.svg",
  description: row.description || "Sem descrição disponível.",
  inStock: row.inStock === "true" || row.inStock === "1",
  rating: row.rating ? parseFloat(row.rating) : 0,
  reviews: row.reviews ? parseInt(row.reviews) : 0,
  isPromo: row.isPromo === "true" || row.isPromo === "1",
}));

// Salva no products.json
fs.writeFileSync(jsonPath, JSON.stringify({ products }, null, 2));

console.log("✅ products.json atualizado com sucesso em:", jsonPath);
