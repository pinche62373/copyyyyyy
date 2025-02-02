// .sync/utils/explainers.ts
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import terminalLink from "terminal-link";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const explainerFile = join(__dirname, "explainers.md");

/**
 * Converts markdown links to terminal-friendly hyperlinks
 * Handles both [text](url) and <url> formats
 */
function processMarkdownLinks(content: string): string {
  // First, handle standard markdown links: [text](url)
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let processed = content.replace(markdownLinkRegex, (_match, text, url) => {
    if (!text || !url) return _match;
    return terminalLink(text.trim(), url.trim(), {
      fallback: (text, url) => `${text} (${url})`,
    });
  });

  // Then handle plain URLs in angle brackets: <url>
  const urlRegex = /<(https?:\/\/[^>]+)>/g;
  processed = processed.replace(urlRegex, (_match, url) => {
    if (!url) return _match;
    return terminalLink(url.trim(), url.trim(), {
      fallback: (text) => text,
    });
  });

  return processed;
}

function parseExplainers(content: string): Record<string, string> {
  const sections = content.split("\n## ");
  const explainers: Record<string, string> = {};

  // Process each section (skip the first empty one if it exists)
  sections.forEach((section) => {
    if (!section.trim()) return;

    // Split into key and content
    const [firstLine, ...contentLines] = section.split("\n");
    const key = firstLine.replace("## ", "").trim();

    // Process the content to handle markdown links
    const rawContent = contentLines.join("\n").trim();
    const processedContent = processMarkdownLinks(rawContent);

    explainers[key] = processedContent;
  });

  return explainers;
}

const fileContent = readFileSync(explainerFile, "utf-8");
export const explainers = parseExplainers(fileContent);

export type ExplainerKey = keyof typeof explainers;

export function getExplainer(key: ExplainerKey): string {
  return explainers[key];
}
