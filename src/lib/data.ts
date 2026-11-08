// כל הנתונים הלימודיים: דמויות, טריקים וסיפורי זיכרון

export type CharacterInfo = {
  n: number;
  name: string;
  /** למה הדמות קשורה למספר – העוגן לזיכרון */
  why: string;
  /** שם רבים של הדמות (לסיפורים) */
  plural: string;
  /** מה סופרים אצל הדמות (ברבים) */
  item: string;
  color: string;
  soft: string;
};

export const CHARACTERS: Record<number, CharacterInfo> = {
  1: { n: 1, name: "גילי הג׳ירפה", why: "גבוהה וישרה בדיוק כמו הספרה 1", plural: "ג׳ירפות", item: "צווארים ארוכים", color: "#f4a72b", soft: "#fff3d6" },
  2: { n: 2, name: "ברבורה הברבורה", why: "הצוואר שלה מתעקל כמו הספרה 2, ויש לה 2 כנפיים", plural: "ברבורים", item: "כנפיים", color: "#4aa8e0", soft: "#e2f3ff" },
  3: { n: 3, name: "תלתן", why: "לתלתן יש 3 עלים – תְּלָת זה שלוש!", plural: "תלתנים", item: "עלים", color: "#3cb371", soft: "#e0f7ea" },
  4: { n: 4, name: "בובי הכלב", why: "לבובי יש 4 רגליים שרצות מהר", plural: "כלבים", item: "רגליים", color: "#b9773d", soft: "#f8eadc" },
  5: { n: 5, name: "כוכבית", why: "לכוכב יש 5 קצוות – כמו 5 אצבעות ביד", plural: "כוכבים", item: "קצוות", color: "#f2c200", soft: "#fff8cc" },
  6: { n: 6, name: "מושית החיפושית", why: "לחיפושית יש 6 רגליים קטנות", plural: "חיפושיות", item: "רגליים", color: "#e5484d", soft: "#ffe3e3" },
  7: { n: 7, name: "קשתית", why: "בקשת יש 7 צבעים, ובשבוע יש 7 ימים", plural: "קשתות", item: "צבעים", color: "#8e5cd9", soft: "#efe5ff" },
  8: { n: 8, name: "תמנונה", why: "לתמנון יש 8 זרועות", plural: "תמנונים", item: "זרועות", color: "#d94f9c", soft: "#ffe2f2" },
  9: { n: 9, name: "מיצי החתולה", why: "אומרים שלחתול יש 9 נשמות", plural: "חתולים", item: "נשמות", color: "#ff8c42", soft: "#ffeadb" },
  10: { n: 10, name: "רובו הרובוט", why: "לרובו יש 10 אצבעות, והוא תמיד מוסיף 0 בסוף", plural: "רובוטים", item: "אצבעות", color: "#5b7083", soft: "#e6edf3" },
};

export const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export type Trick = { title: string; text: string; example: string };

/** טריק ייחודי לכל לוח – אסטרטגיה במקום שינון עיוור */
export const TRICKS: Record<number, Trick> = {
  1: { title: "קסם המראה", text: "כל מספר כפול 1 נשאר בדיוק אותו מספר. גילי רק מסתכלת במראה!", example: "1 × 7 = 7" },
  2: { title: "פעמיים אותו דבר", text: "כפול 2 זה פשוט לחבר את המספר לעצמו – כמו שתי כנפיים זהות.", example: "2 × 8 = 8 + 8 = 16" },
  3: { title: "כפול 2 ועוד אחד", text: "מכפילים ב-2 ומוסיפים עוד קבוצה אחת של המספר.", example: "3 × 7 = 14 + 7 = 21" },
  4: { title: "כפול-כפול", text: "מכפילים פעמיים: קודם כפול 2, ואז שוב כפול 2.", example: "4 × 6 → 12 → 24" },
  5: { title: "חצי מ-10", text: "מכפילים ב-10 ולוקחים חצי. והתשובה תמיד נגמרת ב-0 או ב-5!", example: "5 × 8 = 80 ÷ 2 = 40" },
  6: { title: "כפול 5 ועוד אחד", text: "מחשבים כפול 5 (קל!) ומוסיפים עוד קבוצה אחת.", example: "6 × 7 = 35 + 7 = 42" },
  7: { title: "ימי השבוע", text: "כל קפיצה של 7 היא עוד שבוע. 3 שבועות = 21 ימים, 4 שבועות = 28 ימים.", example: "7 × 4 = 28 (חודש!)" },
  8: { title: "כפול-כפול-כפול", text: "מכפילים ב-2 שלוש פעמים ברצף, כמו תמנונה שמנפנפת בזרועות.", example: "8 × 3 → 6 → 12 → 24" },
  9: { title: "טריק האצבעות", text: "פותחים 10 אצבעות ומקפלים את האצבע במקום של המספר. משמאל לאצבע = עשרות, מימין = אחדות. וגם: סכום הספרות בתשובה תמיד 9!", example: "9 × 4 = 36 (3+6=9)" },
  10: { title: "מוסיפים אפס", text: "רובו הרובוט פשוט מדביק 0 בסוף המספר.", example: "10 × 6 = 60" },
};

export const factKey = (a: number, b: number) => `${Math.min(a, b)}x${Math.max(a, b)}`;

/** חרוזים ומשפטי זיכרון לעובדות "הקשות" */
const SPECIAL_STORIES: Record<string, string> = {
  "3x4": "1-2-3-4! שלוש כפול ארבע זה שתים-עשרה: 12 = 3 × 4 – הספרות בסדר!",
  "7x8": "5-6-7-8! חמישים ושש = שבע כפול שמונה: 56 = 7 × 8",
  "6x8": "שש כפול שמונה – ארבעים ושמונה! (שמונה–שמונה, זה מתחרז)",
  "6x6": "שש כפול שש – שלושים ושש! (שש–שש, זה מתחרז)",
  "4x4": "ארבע כפול ארבע – שש-עשרה! בובי ו-3 חברים: 16 רגליים בפארק.",
  "4x7": "4 שבועות = 28 ימים – כמעט חודש שלם!",
  "3x7": "3 שבועות של חופש = 21 ימים של כיף!",
  "7x7": "קשתית ציירה 7 קשתות של 7 צבעים: 49 פסים – רק אחד פחות מ-50!",
  "8x8": "תמנונה פגשה 7 תמנונים, ונתנו כולם כיף: 8 × 8 = 64 זרועות! (64 – כמו ריבועי לוח השחמט)",
  "6x7": "מושית טיילה 7 ימים, וכל יום הלכה עם 6 רגליים: 42 צעדים קסומים. (35 + 7 = 42)",
  "6x9": "מיצי ומושית: 6 × 9 = 54. טריק ה-9: 5 + 4 = 9!",
  "7x9": "7 × 9 = 63. מקפלים את האצבע השביעית: 6 משמאל, 3 מימין!",
  "8x9": "8 × 9 = 72. 70 ועוד 2 – וגם 7 + 2 = 9!",
  "9x9": "9 × 9 = 81. מקפלים אצבע תשיעית: 8 ו-1. ו-8 + 1 = 9!",
  "6x4": "6 × 4 = 24 – כמו 24 שעות ביממה!",
  "3x8": "3 × 8 = 24 – גם זה 24 שעות ביממה! (כמו 4 × 6)",
  "4x8": "4 × 8 = 32: מכפילים 8 → 16 → 32.",
  "5x5": "חמש כפול חמש – עשרים וחמש! שתי ידיים של כוכבית... ועוד 3 חברים.",
  "3x3": "תלתן, תלתן, תלתן – 3 תלתנים עם 3 עלים: 9 עלים בגינה.",
  "2x2": "שתי ברבורות, לכל אחת 2 כנפיים: 4 כנפיים עפות.",
  "5x7": "5 × 7 = 35. כפול 5 תמיד נגמר ב-0 או ב-5!",
  "7x10": "רובו פוגש את קשתית: מדביקים 0 → 70!",
};

export function storyFor(a: number, b: number): string {
  const key = factKey(a, b);
  if (SPECIAL_STORIES[key]) return SPECIAL_STORIES[key];
  // סיפור כללי: הדמות של המספר הגדול × כמות של הקטן
  const big = Math.max(a, b);
  const small = Math.min(a, b);
  const c = CHARACTERS[big];
  if (small === 1) return `${c.name} לבד: ${big} ${c.item}. כפול 1 לא משנה כלום!`;
  return `${small} ${c.plural}, ולכל אחד ${big} ${c.item}. ביחד: ${a * b} ${c.item}!`;
}

/** הטריק המתאים ביותר לעובדה – לפי המספר ה"קל" יותר */
export function bestTrickFor(a: number, b: number): Trick {
  const ease = [10, 1, 2, 5, 9, 4, 3, 6, 8, 7];
  for (const n of ease) if (a === n || b === n) return TRICKS[n];
  return TRICKS[Math.min(a, b)];
}

export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "he-IL";
  u.rate = 0.9;
  const heVoice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("he"));
  if (heVoice) u.voice = heVoice;
  window.speechSynthesis.speak(u);
}

export const factSentence = (a: number, b: number) => `${a} כפול ${b} שווה ${a * b}`;
