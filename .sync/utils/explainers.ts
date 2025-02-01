// .sync/utils/explainers.ts
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const explainerFile = join(__dirname, "explainers.md");

function parseExplainers(content: string): Record<string, string> {
  const sections = content.split("\n## ");
  const explainers: Record<string, string> = {};

  // Process each section (skip the first empty one if it exists)
  sections.forEach((section) => {
    if (!section.trim()) return;

    // Split into key and content
    const [firstLine, ...contentLines] = section.split("\n");
    // Simply use the header text as the key, just trimmed
    const key = firstLine.replace("## ", "").trim();
    const content = contentLines.join("\n").trim();

    explainers[key] = content;
  });

  return explainers;
}

const fileContent = readFileSync(explainerFile, "utf-8");
export const explainers = parseExplainers(fileContent);

export type ExplainerKey = keyof typeof explainers;

export function getExplainer(key: ExplainerKey): string {
  return explainers[key];
}
