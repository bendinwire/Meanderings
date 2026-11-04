// Each entry after the first has a `link`: a run of letters that also appears in the
// previous word. Those letters are pre-filled and aligned vertically with the word above.
const CHAIN = [
  { word: "APPLE",        clue: "Forbidden fruit" },
  { word: "DOPPELGANGER", clue: "Twin",                  link: "PP"   },
  { word: "ORANGE",       clue: "Citrus fruit",          link: "ANGE" },
  { word: "ORANGUTAN",    clue: "Ape of Borneo",         link: "RANG" },
  { word: "SULTAN",       clue: "Ottoman ruler",         link: "TAN"  },
  { word: "DELTA",        clue: "Fourth Greek letter",   link: "LTA"  },
  { word: "SELTZER",      clue: "Fizzy water",           link: "ELT"  },
  { word: "FREEZER",      clue: "Cold storage appliance", link: "ZER" },
  { word: "GREEN",        clue: "Color of \"go\"",       link: "REE"  },
];

if (typeof module !== "undefined") module.exports = CHAIN;
