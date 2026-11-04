// Puzzle pools by difficulty. One chain is chosen per day per difficulty (day number % pool size).
// Each entry after the first has a `link`: a run of letters that appears exactly once in both the
// previous word and this one. Those letters are pre-filled and aligned vertically with the word above.
//
// To make the chain meander: a link taken from the START of the previous word and found late in the
// new word pushes the new word LEFT; a link from the END of the previous word found early in the new
// word pushes it RIGHT. Alternate them. (Run validate.js to check uniqueness, direction mix and width.)
// Easy = 2-3 letter links, plain clues. Medium = 2-3 letters. Hard = 2 letters, trickier clues + stricter rules.
const POOLS = {
  easy: [
    [
      { word: "APPLE",        clue: "Forbidden fruit" },
      { word: "DOPPELGANGER", clue: "Twin",                          link: "PP"  },
      { word: "DESKTOP",      clue: "Computer that stays put",       link: "OP"  },
      { word: "TOPAZ",        clue: "Yellow-brown gem",              link: "TOP" },
      { word: "LAPTOP",       clue: "Computer for your knees",       link: "TOP" },
      { word: "OPERA",        clue: "It's over when the fat lady sings", link: "OP" },
      { word: "ELOPE",        clue: "Run off to get married",        link: "OPE" },
      { word: "PEACH",        clue: "Georgia's famous fruit",        link: "PE"  },
      { word: "RECIPE",       clue: "Cook's instructions",           link: "PE"  },
    ],
    [
      { word: "PUMPKIN", clue: "Halloween gourd" },
      { word: "OCTOPUS", clue: "Eight-armed sea creature",   link: "PU"  },
      { word: "USHER",   clue: "Theater seat guide",         link: "US"  },
      { word: "BRUSH",   clue: "Painter's tool",             link: "USH" },
      { word: "SHARK",   clue: "Jaws",                       link: "SH"  },
      { word: "FINISH",  clue: "Cross the line, first",      link: "SH"  },
      { word: "ISLAND",  clue: "Land surrounded by water",   link: "IS"  },
      { word: "ARTIST",  clue: "Painter or sculptor",        link: "IS"  },
      { word: "STAMP",   clue: "Postage",                    link: "ST"  },
    ],
  ],
  medium: [
    [
      { word: "PIRATE",  clue: "Rum-loving seafarer" },
      { word: "EMPIRE",  clue: "Roman realm",                    link: "IR"  },
      { word: "REPTILE", clue: "Snake or lizard",                link: "RE"  },
      { word: "CONCEPT", clue: "Notion or idea",                 link: "EP"  },
      { word: "EPIC",    clue: "Sweeping saga",                  link: "EP"  },
      { word: "TROPIC",  clue: "Hot zone near the equator",      link: "PIC" },
      { word: "ICEBERG", clue: "Titanic's downfall",             link: "IC"  },
      { word: "JUSTICE", clue: "Lady with scales",               link: "ICE" },
      { word: "CEMENT",  clue: "Wet sidewalk stuff",             link: "CE"  },
    ],
    [
      { word: "GUITAR",    clue: "Six-string instrument" },
      { word: "BISCUIT",   clue: "Cookie, to a Brit",            link: "UI"  },
      { word: "ITALY",     clue: "Boot-shaped country",          link: "IT"  },
      { word: "SONATA",    clue: "Piece for a solo piano",       link: "TA"  },
      { word: "TANGERINE", clue: "Mandarin's cousin",            link: "TA"  },
      { word: "ELEPHANT",  clue: "Tusked giant",                 link: "AN"  },
      { word: "ANCHOR",    clue: "Ship's heavy hook",            link: "AN"  },
      { word: "CARAVAN",   clue: "Desert camel train",           link: "AN"  },
      { word: "VANILLA",   clue: "Plain ice cream flavor",       link: "VAN" },
    ],
  ],
  hard: [
    [
      { word: "QUARTZ",    clue: "Digital watch's heartbeat" },
      { word: "TORQUE",    clue: "Twisting force",                     link: "QU" },
      { word: "QUARTET",   clue: "Four-person ensemble",               link: "QU" },
      { word: "JANUARY",   clue: "Month named for Janus",              link: "AR" },
      { word: "ARMADILLO", clue: "\"Little armored one\" in Spanish",  link: "AR" },
      { word: "RADAR",     clue: "Palindromic detector",               link: "AR" },
      { word: "DAGGER",    clue: "Macbeth's air-drawn blade",          link: "DA" },
      { word: "CABBAGE",   clue: "Coleslaw's backbone",                link: "AG" },
      { word: "GENIUS",    clue: "Einstein, popularly",                link: "GE" },
    ],
    [
      { word: "ZEPHYR",   clue: "Soft westerly" },
      { word: "FREEZE",   clue: "Ice up, or halt!",             link: "ZE" },
      { word: "ZENITH",   clue: "Highest point in the sky",     link: "ZE" },
      { word: "GARDEN",   clue: "Plot with petunias",           link: "EN" },
      { word: "ENVELOPE", clue: "Letter holder",                link: "EN" },
      { word: "ARCHIVE",  clue: "Where old records rest",       link: "VE" },
      { word: "VENOM",    clue: "Snake's weapon",               link: "VE" },
      { word: "ABOVE",    clue: "Over",                         link: "VE" },
      { word: "OVERCOAT", clue: "Winter outerwear",             link: "OV" },
    ],
  ],
};

if (typeof module !== "undefined") module.exports = POOLS;
