import type { CaroResponse } from "./types";

const WIKI_SUMMARY_URL =
  "https://en.wikipedia.org/api/rest_v1/page/summary/";

// simple Wikipedia summary fallback
async function fetchFactFromWiki(topic: string): Promise<CaroResponse | null> {
  const url = WIKI_SUMMARY_URL + encodeURIComponent(topic);

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Caro/1.0 (https://example.com)",
    },
  });

  if (!res.ok) return null;

  const data = await res.json();
  const extract: string | undefined = data.extract;
  if (!extract) return null;

  const shortened =
    extract.length > 400
      ? extract
          .slice(0, 400)
          .split(".")
          .slice(0, 2)
          .join(".") + "."
      : extract;

  return {
    text: shortened,
    source: "wikipedia",
    intent: "fact",
  };
}

export async function answerFact(prompt: string): Promise<CaroResponse | null> {
  const query = prompt
    .replace(/^who is/i, "")
    .replace(/^what is/i, "")
    .replace(/^\s*the\s*/i, "")
    .trim();

  if (!query) return null;

  try {
    const searchUrl =
      `https://www.wikidata.org/w/api.php` +
      `?action=wbsearchentities&format=json&language=en&type=item&origin=*` +
      `&search=${encodeURIComponent(query)}`;

    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.search || searchData.search.length === 0) {
      return await fetchFactFromWiki(query);
    }

    const entityId = searchData.search[0].id;
    const detailUrl = `https://www.wikidata.org/wiki/Special:EntityData/${entityId}.json`;
    const detailRes = await fetch(detailUrl);
    const detailData = await detailRes.json();

    const entity = detailData.entities[entityId];
    const label = entity.labels?.en?.value ?? "Unknown";
    const desc = entity.descriptions?.en?.value ?? "";

    // Try to extract “position held” (P39)
    const claims = entity.claims || {};
    let position: string | null = null;

    if (claims.P39 && claims.P39[0]) {
      const held = claims.P39[0].mainsnak.datavalue?.value;
      if (held?.id) {
        const posUrl = `https://www.wikidata.org/wiki/Special:EntityData/${held.id}.json`;
        const posRes = await fetch(posUrl);
        const posData = await posRes.json();
        const posEntity = posData.entities[held.id];
        position = posEntity?.labels?.en?.value ?? null;
      }
    }

    let text = `${label}: ${desc}`;
    if (position) text = `${label} is the current ${position}.`;

    return {
      text,
      source: "wikidata",
      intent: "fact",
    };
  } catch (err) {
    console.error("Wikidata fact lookup failed:", err);
    return await fetchFactFromWiki(query);
  }
}