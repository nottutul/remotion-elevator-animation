export interface ScriptCue {
  id: number;
  startSec: number;
  endSec: number;
  text: string;
}

export interface WordTiming {
  word: string;
  startSec: number;
  endSec: number;
  startFrame: number;
  endFrame: number;
}

export const SCRIPT_CUES: ScriptCue[] = [
  {
    id: 1,
    startSec: 0,
    endSec: 2.2,
    text: "কখনো লিফটে উঠতে গিয়ে খেয়াল করেছেন,",
  },
  {
    id: 2,
    startSec: 2.35,
    endSec: 6.05,
    text: "লিফট উপরের দিকে চলা শুরু করলে নিজেকে একটু ভারী মনে হয়।",
  },
  {
    id: 3,
    startSec: 6.2,
    endSec: 9.5,
    text: "আবার নিচের দিকে চলা শুরু করলে মনে হয় শরীরটা হালকা হয়ে গেছে!",
  },
  {
    id: 4,
    startSec: 9.75,
    endSec: 10.9,
    text: "কিন্তু কেন?",
  },
  {
    id: 5,
    startSec: 11.3,
    endSec: 17.3,
    text: "প্রথমে বুঝতে হবে, আমাদের প্রকৃত ওজন হলো পৃথিবী আমাদের যে মহাকর্ষীয় বল দিয়ে আকর্ষণ করে।",
  },
  {
    id: 6,
    startSec: 17.7,
    endSec: 19.8,
    text: "অর্থাৎ, W = mg",
  },
  {
    id: 7,
    startSec: 20.3,
    endSec: 22.3,
    text: "কিন্তু আমরা যে ওজন অনুভব করি,",
  },
  {
    id: 8,
    startSec: 22.4,
    endSec: 26.85,
    text: "সেটা আসলে লিফটের মেঝে আমাদের পায়ের ওপর যে অভিলম্ব প্রতিক্রিয়া বল প্রয়োগ করে, তার সমান।",
  },
  {
    id: 9,
    startSec: 27.05,
    endSec: 29.65,
    text: "অর্থাৎ, আপাত ওজন,",
  },
  {
    id: 10,
    startSec: 29.8,
    endSec: 31.6,
    text: "W' = N",
  },
  {
    id: 11,
    startSec: 32.3,
    endSec: 35.45,
    text: "এখন ধরুন, লিফট উপরের দিকে a ত্বরণে চলছে।",
  },
  {
    id: 12,
    startSec: 35.75,
    endSec: 37.5,
    text: "নিউটনের দ্বিতীয় সূত্র অনুযায়ী,",
  },
  {
    id: 13,
    startSec: 37.75,
    endSec: 39.8,
    text: "N - mg = ma",
  },
  {
    id: 14,
    startSec: 40.3,
    endSec: 43.3,
    text: "সুতরাং, N = m(g + a)",
  },
  {
    id: 15,
    startSec: 43.9,
    endSec: 46.55,
    text: "অর্থাৎ, অভিলম্ব প্রতিক্রিয়া বল বেড়ে যায়।",
  },
  {
    id: 16,
    startSec: 46.75,
    endSec: 49,
    text: "তাই আমরা নিজেদের বেশি ভারী অনুভব করি।",
  },
  {
    id: 17,
    startSec: 49.55,
    endSec: 52.4,
    text: "আবার লিফট যদি নিচের দিকে a ত্বরণে চলে, তাহলে,",
  },
  {
    id: 18,
    startSec: 52.85,
    endSec: 54.85,
    text: "mg - N = ma",
  },
  {
    id: 19,
    startSec: 55.1,
    endSec: 57.9,
    text: "সুতরাং, N = m(g - a)",
  },
  {
    id: 20,
    startSec: 58.4,
    endSec: 60.9,
    text: "এক্ষেত্রে অভিলম্ব প্রতিক্রিয়া বল কমে যায়।",
  },
  {
    id: 21,
    startSec: 61.15,
    endSec: 63.1,
    text: "তাই আমাদের ওজন কম মনে হয়।",
  },
  {
    id: 22,
    startSec: 63.35,
    endSec: 68,
    text: "তাহলে মনে রাখবেন, লিফটে ওঠানামার সময় আমাদের প্রকৃত ওজন পরিবর্তন হয় না।",
  },
  {
    id: 23,
    startSec: 68.25,
    endSec: 70.5,
    text: "পরিবর্তন হয় অভিলম্ব প্রতিক্রিয়া বল,",
  },
  {
    id: 24,
    startSec: 70.65,
    endSec: 72.6,
    text: "আর সেটাই আমাদের আপাত ওজন!",
  },
  {
    id: 25,
    startSec: 72.95,
    endSec: 74.1,
    text: "এবার ভাবুন তো,",
  },
  {
    id: 26,
    startSec: 74.2,
    endSec: 77.3,
    text: "যদি লিফট g ত্বরণে নিচের দিকে পড়তে থাকে,",
  },
  {
    id: 27,
    startSec: 77.45,
    endSec: 79.75,
    text: "তাহলে আমরা কতটুকু ওজন অনুভব করব?",
  },
];

export const SCENE_1_CUES = SCRIPT_CUES.filter((cue) => cue.id <= 4);

/**
 * Distributes cue duration across whole words proportionally by character length.
 * Preserves Bangla conjuncts and vowel signs by never splitting inside words.
 */
export function getCueWordTimings(cue: ScriptCue, fps = 30): WordTiming[] {
  const words = cue.text.trim().split(/\s+/).filter(Boolean);
  const totalChars = words.reduce((acc, w) => acc + w.length, 0);
  const duration = cue.endSec - cue.startSec;

  let currentSec = cue.startSec;
  return words.map((word) => {
    const fraction = totalChars > 0 ? word.length / totalChars : 1 / words.length;
    const wordDuration = duration * fraction;
    const startSec = currentSec;
    const endSec = currentSec + wordDuration;
    currentSec = endSec;

    return {
      word,
      startSec,
      endSec,
      startFrame: Math.round(startSec * fps),
      endFrame: Math.round(endSec * fps),
    };
  });
}
