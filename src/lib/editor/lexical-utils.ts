export interface NormalizedLexicalState {
  serialized: string | null;
  paragraphs: string[];
  plainText: string;
}

function gatherText(node: unknown): string {
  if (!node || typeof node !== "object") {
    return "";
  }

  if (typeof (node as { text?: unknown }).text === "string") {
    return (node as { text: string }).text;
  }

  if (Array.isArray((node as { children?: unknown }).children)) {
    return (node as { children: unknown[] }).children.map(gatherText).join("");
  }

  return "";
}

export function normalizeLexicalState(value: string | null | undefined): NormalizedLexicalState {
  const empty: NormalizedLexicalState = { serialized: null, paragraphs: [], plainText: "" };

  if (!value) {
    return empty;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return empty;
  }

  try {
    const parsed = JSON.parse(trimmed) as {
      root?: { children?: unknown[] };
    };

    if (!parsed?.root) {
      return { serialized: null, paragraphs: [trimmed], plainText: trimmed };
    }

    const children = Array.isArray(parsed.root.children) ? parsed.root.children : [];
    const paragraphs = children.map((child) => gatherText(child).trim()).filter(Boolean);
    const plainText = paragraphs.join("\n").trim();

    return {
      serialized: trimmed,
      paragraphs,
      plainText,
    };
  } catch (_error) {
    return { serialized: null, paragraphs: [trimmed], plainText: trimmed };
  }
}

export function estimateReadingTime(text: string | null | undefined): string {
  if (!text) {
    return "1 min read";
  }

  const cleaned = text.trim();

  if (!cleaned) {
    return "1 min read";
  }

  const words = cleaned.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));

  return `${minutes} min read`;
}
