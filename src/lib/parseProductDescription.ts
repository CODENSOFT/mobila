export type DescriptionBlock =
  | { type: "paragraph"; content: string }
  | { type: "list"; items: string[] };

export function parseProductDescription(description: string): DescriptionBlock[] {
  const normalized = description
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const blocks: DescriptionBlock[] = [];
  let currentList: string[] = [];

  for (const line of normalized) {
    const bulletMatch = line.match(/^[-*•]\s+(.+)/);
    if (bulletMatch) {
      currentList.push(bulletMatch[1].trim());
      continue;
    }
    if (currentList.length > 0) {
      blocks.push({ type: "list", items: currentList });
      currentList = [];
    }
    blocks.push({ type: "paragraph", content: line });
  }

  if (currentList.length > 0) {
    blocks.push({ type: "list", items: currentList });
  }

  if (blocks.length === 0) {
    blocks.push({ type: "paragraph", content: description.trim() });
  }
  return blocks;
}
