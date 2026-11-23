export interface SubtitleCue {
  id: number;
  startMs: number;
  endMs: number;
  startFrame: number;
  endFrame: number;
  text: string;
}

export const SUBTITLES: SubtitleCue[] = [
  {
    "id": 1,
    "startMs": 0,
    "endMs": 2200,
    "startFrame": 0,
    "endFrame": 66,
    "text": "কখনো লিফটে উঠতে গিয়ে খেয়াল করেছেন,"
  },
  {
    "id": 2,
    "startMs": 2350,
    "endMs": 6050,
    "startFrame": 71,
    "endFrame": 182,
    "text": "লিফট উপরের দিকে চলা শুরু করলে নিজেকে একটু ভারী মনে হয়।"
  },
  {
    "id": 3,
    "startMs": 6200,
    "endMs": 9500,
    "startFrame": 186,
    "endFrame": 285,
    "text": "আবার নিচের দিকে চলা শুরু করলে মনে হয় শরীরটা হালকা হয়ে গেছে!"
  },
  {
    "id": 4,
    "startMs": 9750,
    "endMs": 10900,
    "startFrame": 293,
    "endFrame": 327,
    "text": "কিন্তু কেন?"
  },
  {
    "id": 5,
    "startMs": 11300,
    "endMs": 17300,
    "startFrame": 339,
    "endFrame": 519,
    "text": "প্রথমে বুঝতে হবে, আমাদের প্রকৃত ওজন হলো পৃথিবী আমাদের যে মহাকর্ষীয় বল দিয়ে আকর্ষণ করে।"
  },
  {
    "id": 6,
    "startMs": 17700,
    "endMs": 19800,
    "startFrame": 531,
    "endFrame": 594,
    "text": "অর্থাৎ, W = mg"
  },
  {
    "id": 7,
    "startMs": 20300,
    "endMs": 22300,
    "startFrame": 609,
    "endFrame": 669,
    "text": "কিন্তু আমরা যে ওজন অনুভব করি,"
  },
  {
    "id": 8,
    "startMs": 22400,
    "endMs": 26850,
    "startFrame": 672,
    "endFrame": 806,
    "text": "সেটা আসলে লিফটের মেঝে আমাদের পায়ের ওপর যে অভিলম্ব প্রতিক্রিয়া বল প্রয়োগ করে, তার সমান।"
  },
  {
    "id": 9,
    "startMs": 27050,
    "endMs": 29650,
    "startFrame": 812,
    "endFrame": 890,
    "text": "অর্থাৎ, আপাত ওজন,"
  },
  {
    "id": 10,
    "startMs": 29800,
    "endMs": 31600,
    "startFrame": 894,
    "endFrame": 948,
    "text": "W' = N"
  },
  {
    "id": 11,
    "startMs": 32300,
    "endMs": 35450,
    "startFrame": 969,
    "endFrame": 1064,
    "text": "এখন ধরুন, লিফট উপরের দিকে a ত্বরণে চলছে।"
  },
  {
    "id": 12,
    "startMs": 35750,
    "endMs": 37500,
    "startFrame": 1073,
    "endFrame": 1125,
    "text": "নিউটনের দ্বিতীয় সূত্র অনুযায়ী,"
  },
  {
    "id": 13,
    "startMs": 37750,
    "endMs": 39800,
    "startFrame": 1133,
    "endFrame": 1194,
    "text": "N - mg = ma"
  },
  {
    "id": 14,
    "startMs": 40300,
    "endMs": 43300,
    "startFrame": 1209,
    "endFrame": 1299,
    "text": "সুতরাং, N = m(g + a)"
  },
  {
    "id": 15,
    "startMs": 43900,
    "endMs": 46550,
    "startFrame": 1317,
    "endFrame": 1397,
    "text": "অর্থাৎ, অভিলম্ব প্রতিক্রিয়া বল বেড়ে যায়।"
  },
  {
    "id": 16,
    "startMs": 46750,
    "endMs": 49000,
    "startFrame": 1403,
    "endFrame": 1470,
    "text": "তাই আমরা নিজেদের বেশি ভারী অনুভব করি।"
  },
  {
    "id": 17,
    "startMs": 49550,
    "endMs": 52400,
    "startFrame": 1487,
    "endFrame": 1572,
    "text": "আবার লিফট যদি নিচের দিকে a ত্বরণে চলে, তাহলে,"
  },
  {
    "id": 18,
    "startMs": 52850,
    "endMs": 54850,
    "startFrame": 1586,
    "endFrame": 1646,
    "text": "mg - N = ma"
  },
  {
    "id": 19,
    "startMs": 55100,
    "endMs": 57900,
    "startFrame": 1653,
    "endFrame": 1737,
    "text": "সুতরাং, N = m(g - a)"
  },
  {
    "id": 20,
    "startMs": 58400,
    "endMs": 60900,
    "startFrame": 1752,
    "endFrame": 1827,
    "text": "এক্ষেত্রে অভিলম্ব প্রতিক্রিয়া বল কমে যায়।"
  },
  {
    "id": 21,
    "startMs": 61150,
    "endMs": 63100,
    "startFrame": 1835,
    "endFrame": 1893,
    "text": "তাই আমাদের ওজন কম মনে হয়।"
  },
  {
    "id": 22,
    "startMs": 63350,
    "endMs": 68000,
    "startFrame": 1901,
    "endFrame": 2040,
    "text": "তাহলে মনে রাখবেন, লিফটে ওঠানামার সময় আমাদের প্রকৃত ওজন পরিবর্তন হয় না।"
  },
  {
    "id": 23,
    "startMs": 68250,
    "endMs": 70500,
    "startFrame": 2048,
    "endFrame": 2115,
    "text": "পরিবর্তন হয় অভিলম্ব প্রতিক্রিয়া বল,"
  },
  {
    "id": 24,
    "startMs": 70650,
    "endMs": 72600,
    "startFrame": 2120,
    "endFrame": 2178,
    "text": "আর সেটাই আমাদের আপাত ওজন!"
  },
  {
    "id": 25,
    "startMs": 72950,
    "endMs": 74100,
    "startFrame": 2189,
    "endFrame": 2223,
    "text": "এবার ভাবুন তো,"
  },
  {
    "id": 26,
    "startMs": 74200,
    "endMs": 77300,
    "startFrame": 2226,
    "endFrame": 2319,
    "text": "যদি লিফট g ত্বরণে নিচের দিকে পড়তে থাকে,"
  },
  {
    "id": 27,
    "startMs": 77450,
    "endMs": 79750,
    "startFrame": 2324,
    "endFrame": 2393,
    "text": "তাহলে আমরা কতটুকু ওজন অনুভব করব?"
  }
];
