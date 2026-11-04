// TEST puzzles for /meanderings/test/ only (7 chains per difficulty). They share no word, bonus answer or clue with
// words.js, so testing never spoils a real day. Built by content/build-test.js from content/test-*.json; check with
//   node validate.js test-words.js   and   node content/check-test.js <diff> content/test-<diff>.json
const POOLS = {
 "easy": [
  {
   "bonus": {
    "answer": "ALLIANCE",
    "clue": "Partnership between groups or nations"
   },
   "words": [
    {
     "word": "BACKSEAT",
     "clue": "Rear seat of a car"
    },
    {
     "word": "LINEBACKER",
     "clue": "Defense player who tackles",
     "link": "ACK"
    },
    {
     "word": "BLINDFOLD",
     "clue": "Cloth worn over the eyes",
     "link": "LIN"
    },
    {
     "word": "LINE",
     "clue": "Queue of waiting people",
     "link": "LIN"
    },
    {
     "word": "PINEAPPLE",
     "clue": "Tropical fruit with spiky skin",
     "link": "INE"
    },
    {
     "word": "APPLIANCE",
     "clue": "Kitchen machine like a toaster",
     "link": "APP"
    },
    {
     "word": "SCIENCE",
     "clue": "Study of nature and experiments",
     "link": "NCE"
    },
    {
     "word": "CONCIERGE",
     "clue": "Hotel staff who helps guests",
     "link": "CIE"
    },
    {
     "word": "EMERGE",
     "clue": "Come out into view",
     "link": "ERG"
    }
   ]
  },
  {
   "bonus": {
    "answer": "PARTNERS",
    "clue": "Teammates working together"
   },
   "words": [
    {
     "word": "STEPLADDER",
     "clue": "Tall folding stairs for painting"
    },
    {
     "word": "MARKETPLACE",
     "clue": "Outdoor place for buying and selling",
     "link": "PLA"
    },
    {
     "word": "GRACE",
     "clue": "Reward for a job well done",
     "link": "ACE"
    },
    {
     "word": "TERRACE",
     "clue": "Large building along a street",
     "link": "RAC"
    },
    {
     "word": "PRINTER",
     "clue": "Office machine that makes copies",
     "link": "TER"
    },
    {
     "word": "INTEND",
     "clue": "Plan to stop by on purpose",
     "link": "NTE"
    },
    {
     "word": "TRENDY",
     "clue": "Fashionable and current",
     "link": "END"
    },
    {
     "word": "SURRENDER",
     "clue": "Give up and hand over",
     "link": "REN"
    },
    {
     "word": "MEASURE",
     "clue": "Find the size of something",
     "link": "SUR"
    }
   ]
  },
  {
   "bonus": {
    "answer": "FOOTBALL",
    "clue": "Game played with a pigskin"
   },
   "words": [
    {
     "word": "FIERCE",
     "clue": "Wild and aggressive"
    },
    {
     "word": "OUTFIELD",
     "clue": "Grassy area beyond the infield",
     "link": "FIE"
    },
    {
     "word": "DUGOUT",
     "clue": "Shelter where baseball players sit",
     "link": "OUT"
    },
    {
     "word": "OUTBOARD",
     "clue": "Boat motor mounted on the stern",
     "link": "OUT"
    },
    {
     "word": "TEXTBOOK",
     "clue": "Book used in a class",
     "link": "TBO"
    },
    {
     "word": "CABOOSE",
     "clue": "Last car on a freight train",
     "link": "BOO"
    },
    {
     "word": "LABOR",
     "clue": "Hard work or toil",
     "link": "ABO"
    },
    {
     "word": "AVAILABLE",
     "clue": "Open for use; obtainable",
     "link": "LAB"
    },
    {
     "word": "LABEL",
     "clue": "Tag on clothing or a jar",
     "link": "LAB"
    }
   ]
  },
  {
   "bonus": {
    "answer": "MARCHING",
    "clue": "Walking in step like soldiers"
   },
   "words": [
    {
     "word": "MAROON",
     "clue": "Dark reddish-brown color"
    },
    {
     "word": "MARCH",
     "clue": "Third month of the year",
     "link": "MAR"
    },
    {
     "word": "RESEARCH",
     "clue": "Investigate in depth",
     "link": "ARC"
    },
    {
     "word": "ORCHID",
     "clue": "Purple or orange flower",
     "link": "RCH"
    },
    {
     "word": "CHILD",
     "clue": "Young boy or girl",
     "link": "CHI"
    },
    {
     "word": "CHINCHILLA",
     "clue": "Fluffy gray pet rodent",
     "link": "HIL"
    },
    {
     "word": "WINDMILL",
     "clue": "Spinning wind turbine",
     "link": "ILL"
    },
    {
     "word": "GRANDMOTHER",
     "clue": "Mom's mother",
     "link": "NDM"
    },
    {
     "word": "DIAGRAM",
     "clue": "Chart or sketch explaining something",
     "link": "GRA"
    }
   ]
  },
  {
   "bonus": {
    "answer": "FOOTSTEP",
    "clue": "Sound made when walking"
   },
   "words": [
    {
     "word": "FAITHFUL",
     "clue": "Loyal and true to a friend"
    },
    {
     "word": "BOUNTIFUL",
     "clue": "Plentiful and generous",
     "link": "FUL"
    },
    {
     "word": "COUNTDOWN",
     "clue": "Counting backward to liftoff",
     "link": "OUN"
    },
    {
     "word": "TOWN",
     "clue": "Small community, bigger than a village",
     "link": "OWN"
    },
    {
     "word": "STOWAWAY",
     "clue": "Hidden traveler on a ship",
     "link": "TOW"
    },
    {
     "word": "COBBLESTONE",
     "clue": "Rough road paved with rounded rocks",
     "link": "STO"
    },
    {
     "word": "GRAVESTONE",
     "clue": "Marker over a grave",
     "link": "TON"
    },
    {
     "word": "PRIEST",
     "clue": "Religious leader in a church",
     "link": "EST"
    },
    {
     "word": "SPRINT",
     "clue": "Run quickly for a short distance",
     "link": "PRI"
    }
   ]
  },
  {
   "bonus": {
    "answer": "CONCERNS",
    "clue": "Things that make you worry"
   },
   "words": [
    {
     "word": "NACHOS",
     "clue": "Crunchy chips with melted cheese"
    },
    {
     "word": "PONCHO",
     "clue": "Rain cape pulled over head",
     "link": "CHO"
    },
    {
     "word": "ONCE",
     "clue": "A single time",
     "link": "ONC"
    },
    {
     "word": "COMMENCE",
     "clue": "Begin or start",
     "link": "NCE"
    },
    {
     "word": "INTERCOM",
     "clue": "Two-way speaker at a front door",
     "link": "COM"
    },
    {
     "word": "WATERCRESS",
     "clue": "Leafy green for salad or soup",
     "link": "ERC"
    },
    {
     "word": "PRESENCE",
     "clue": "Being here right now",
     "link": "RES"
    },
    {
     "word": "SILENCE",
     "clue": "Total quiet",
     "link": "NCE"
    },
    {
     "word": "UTENSIL",
     "clue": "Fork, spoon or knife",
     "link": "SIL"
    }
   ]
  },
  {
   "bonus": {
    "answer": "SUPERIOR",
    "clue": "Better than the others"
   },
   "words": [
    {
     "word": "BASEBOARD",
     "clue": "Trim along the wall bottom"
    },
    {
     "word": "GOOSEBUMP",
     "clue": "Skin prickle from the cold",
     "link": "SEB"
    },
    {
     "word": "BUMPER",
     "clue": "Car guard against collisions",
     "link": "UMP"
    },
    {
     "word": "PERMIT",
     "clue": "Allow or give permission",
     "link": "PER"
    },
    {
     "word": "PEPPERMINT",
     "clue": "Spicy candy cane flavor",
     "link": "ERM"
    },
    {
     "word": "TERMITE",
     "clue": "Wood-eating insect",
     "link": "RMI"
    },
    {
     "word": "FAVORITE",
     "clue": "Most liked; preferred",
     "link": "ITE"
    },
    {
     "word": "AUDITORIUM",
     "clue": "Big hall for concerts or lectures",
     "link": "ORI"
    },
    {
     "word": "AQUARIUM",
     "clue": "Glass tank for fish",
     "link": "RIU"
    }
   ]
  }
 ],
 "medium": [
  {
   "bonus": {
    "answer": "HOSPITAL",
    "clue": "Where the sick get treated"
   },
   "words": [
    {
     "word": "SHANTY",
     "clue": "Ramshackle little hut"
    },
    {
     "word": "HARMONY",
     "clue": "Pleasing blend of musical notes",
     "link": "HA"
    },
    {
     "word": "STALLION",
     "clue": "Uncastrated male horse",
     "link": "ON"
    },
    {
     "word": "STEEPLE",
     "clue": "Pointed tower atop a building",
     "link": "ST"
    },
    {
     "word": "PLAID",
     "clue": "Tartan-style crisscross pattern",
     "link": "PL"
    },
    {
     "word": "WIDTH",
     "clue": "Measurement across, side to side",
     "link": "ID"
    },
    {
     "word": "BREATH",
     "clue": "Air taken in and out",
     "link": "TH"
    },
    {
     "word": "LATHE",
     "clue": "Machine for turning wood",
     "link": "AT"
    },
    {
     "word": "ESCALATOR",
     "clue": "Moving staircase at the mall",
     "link": "LA"
    }
   ]
  },
  {
   "bonus": {
    "answer": "FREEZING",
    "clue": "Below thirty-two degrees, on a thermometer"
   },
   "words": [
    {
     "word": "GOLDFISH",
     "clue": "Pet bowl swimmer"
    },
    {
     "word": "FIREMAN",
     "clue": "Hose-wielding emergency responder",
     "link": "FI"
    },
    {
     "word": "REPEL",
     "clue": "Drive back; ward off",
     "link": "RE"
    },
    {
     "word": "SNORKEL",
     "clue": "Breathing tube for swimmers",
     "link": "EL"
    },
    {
     "word": "GAZELLE",
     "clue": "Graceful African grazer",
     "link": "EL"
    },
    {
     "word": "EMPHASIZE",
     "clue": "Stress; give special weight",
     "link": "ZE"
    },
    {
     "word": "ORGANIZE",
     "clue": "Arrange in neat order",
     "link": "IZ"
    },
    {
     "word": "TONIGHT",
     "clue": "This evening",
     "link": "NI"
    },
    {
     "word": "THOROUGH",
     "clue": "Complete and careful",
     "link": "GH"
    }
   ]
  },
  {
   "bonus": {
    "answer": "AUDIENCE",
    "clue": "Crowd watching a show"
   },
   "words": [
    {
     "word": "GARLIC",
     "clue": "Pungent bulb in Italian cooking"
    },
    {
     "word": "QUARTET",
     "clue": "Four-piece musical group",
     "link": "AR"
    },
    {
     "word": "PERSUADE",
     "clue": "Win over with argument",
     "link": "UA"
    },
    {
     "word": "DECLINE",
     "clue": "Fall in value; say no politely",
     "link": "DE"
    },
    {
     "word": "LEGGINGS",
     "clue": "Stretchy pants worn with tunics",
     "link": "IN"
    },
    {
     "word": "WINEGLASS",
     "clue": "Stemmed glass for a drink",
     "link": "EG"
    },
    {
     "word": "RECLINE",
     "clue": "Lean back in a chair",
     "link": "NE"
    },
    {
     "word": "CLEVER",
     "clue": "Quick-witted; smart",
     "link": "CL"
    },
    {
     "word": "FERRET",
     "clue": "Weasel relative kept as pet",
     "link": "ER"
    }
   ]
  },
  {
   "bonus": {
    "answer": "ABSOLUTE",
    "clue": "Total; without any exception"
   },
   "words": [
    {
     "word": "FOREMAN",
     "clue": "Crew chief on a worksite"
    },
    {
     "word": "HANDLEBAR",
     "clue": "Cyclist's steering grip",
     "link": "AN"
    },
    {
     "word": "FASTBALL",
     "clue": "Pitcher's quick heater",
     "link": "BA"
    },
    {
     "word": "COSTUME",
     "clue": "Halloween outfit",
     "link": "ST"
    },
    {
     "word": "LACROSSE",
     "clue": "Sport played with netted sticks",
     "link": "OS"
    },
    {
     "word": "FLASHBULB",
     "clue": "Old camera light",
     "link": "LA"
    },
    {
     "word": "CULTURE",
     "clue": "Customs and arts of a society",
     "link": "UL"
    },
    {
     "word": "RETURN",
     "clue": "Come back; give back",
     "link": "TU"
    },
    {
     "word": "SEETHE",
     "clue": "Boil with anger",
     "link": "ET"
    }
   ]
  },
  {
   "bonus": {
    "answer": "FRACTION",
    "clue": "A small part of the whole"
   },
   "words": [
    {
     "word": "FISHNET",
     "clue": "Mesh stocking pattern"
    },
    {
     "word": "FIREBALL",
     "clue": "Blazing sphere of flame",
     "link": "FI"
    },
    {
     "word": "REALIZE",
     "clue": "Come to understand fully",
     "link": "RE"
    },
    {
     "word": "CATALOG",
     "clue": "Product listing sent to shoppers",
     "link": "AL"
    },
    {
     "word": "IDENTICAL",
     "clue": "Exactly alike, as twins",
     "link": "CA"
    },
    {
     "word": "RETIRE",
     "clue": "Leave work for good",
     "link": "TI"
    },
    {
     "word": "IRONING",
     "clue": "Pressing clothes chore",
     "link": "IR"
    },
    {
     "word": "OPINION",
     "clue": "Personal view on a matter",
     "link": "ON"
    },
    {
     "word": "JACKKNIFE",
     "clue": "Pocket blade that folds",
     "link": "NI"
    }
   ]
  },
  {
   "bonus": {
    "answer": "GIGANTIC",
    "clue": "Truly enormous in size"
   },
   "words": [
    {
     "word": "ANGER",
     "clue": "Fury; rage"
    },
    {
     "word": "DRAWBRIDGE",
     "clue": "Castle entrance that lifts up",
     "link": "GE"
    },
    {
     "word": "GUIDE",
     "clue": "Lead the way; show around",
     "link": "ID"
    },
    {
     "word": "IGUANA",
     "clue": "Green reptile kept as a pet",
     "link": "GU"
    },
    {
     "word": "INSTANCE",
     "clue": "Single example; occurrence",
     "link": "AN"
    },
    {
     "word": "DISTANCE",
     "clue": "How far apart two points are",
     "link": "NC"
    },
    {
     "word": "STARLIGHT",
     "clue": "Soft glow from the night sky",
     "link": "TA"
    },
    {
     "word": "CARDIGAN",
     "clue": "Buttoned wool sweater",
     "link": "IG"
    },
    {
     "word": "BIRDCAGE",
     "clue": "Home for a parakeet",
     "link": "CA"
    }
   ]
  },
  {
   "bonus": {
    "answer": "BACKPACK",
    "clue": "Student's bag on the shoulders"
   },
   "words": [
    {
     "word": "SOAPBOX",
     "clue": "Stump speaker's makeshift stage"
    },
    {
     "word": "GAZEBO",
     "clue": "Garden pavilion with open sides",
     "link": "BO"
    },
    {
     "word": "CRAZY",
     "clue": "Loony; out of one's mind",
     "link": "AZ"
    },
    {
     "word": "NUTCRACKER",
     "clue": "Holiday ballet's walnut breaker",
     "link": "CR"
    },
    {
     "word": "INNKEEPER",
     "clue": "Hotel proprietor of old",
     "link": "KE"
    },
    {
     "word": "CARPET",
     "clue": "Floor covering, wall to wall",
     "link": "PE"
    },
    {
     "word": "SCARF",
     "clue": "Winter neck wrap",
     "link": "AR"
    },
    {
     "word": "SHORTCAKE",
     "clue": "Strawberry dessert on biscuit",
     "link": "CA"
    },
    {
     "word": "CRICKET",
     "clue": "Chirping bug or bat-and-ball sport",
     "link": "KE"
    }
   ]
  }
 ],
 "hard": [
  {
   "bonus": {
    "answer": "PARADISE",
    "clue": "Heavenly place; bird-of-___ flower"
   },
   "words": [
    {
     "word": "DEPARTMENT",
     "clue": "Store section, like shoes or toys"
    },
    {
     "word": "APRIL",
     "clue": "Month after March",
     "link": "P"
    },
    {
     "word": "CHAIR",
     "clue": "Seat with four legs",
     "link": "A"
    },
    {
     "word": "STAR",
     "clue": "Twinkler in the night sky",
     "link": "R"
    },
    {
     "word": "LAVENDER",
     "clue": "Purple flower with a calming scent",
     "link": "A"
    },
    {
     "word": "MARIGOLD",
     "clue": "Orange or yellow garden flower",
     "link": "D"
    },
    {
     "word": "SKILL",
     "clue": "Ability honed through practice",
     "link": "I"
    },
    {
     "word": "SOLDIER",
     "clue": "Army enlisted fighter",
     "link": "S"
    },
    {
     "word": "SHINGLE",
     "clue": "Overlapping roof tile",
     "link": "E"
    }
   ]
  },
  {
   "bonus": {
    "answer": "EXPLORER",
    "clue": "Magellan, for one"
   },
   "words": [
    {
     "word": "APPLE",
     "clue": "Granny Smith, or the Big one in New York",
     "plain": "Red fruit that keeps doctors away"
    },
    {
     "word": "EXPAND",
     "clue": "Swell up, or grow beyond bounds",
     "link": "E",
     "plain": "Get larger"
    },
    {
     "word": "EXPERIENCE",
     "clue": "What a job candidate needs but cannot fake",
     "link": "X",
     "plain": "Time on the job"
    },
    {
     "word": "PIXEL",
     "clue": "Tiny screen dot in a digital photo",
     "link": "P",
     "plain": "Smallest picture element on a screen"
    },
    {
     "word": "MAGNOLIA",
     "clue": "Southern tree with big, fragrant white blooms",
     "link": "L",
     "plain": "Southern tree with large white flowers"
    },
    {
     "word": "ORPHAN",
     "clue": "Oliver Twist, before the workhouse found him",
     "link": "O",
     "plain": "Child without parents"
    },
    {
     "word": "INSURANCE",
     "clue": "Payout after a fender bender",
     "link": "R",
     "plain": "Coverage against loss or damage"
    },
    {
     "word": "CAPTURE",
     "clue": "Seize the moment, or snap a photo",
     "link": "E",
     "plain": "Take prisoner, or record"
    },
    {
     "word": "WEATHER",
     "clue": "Forecaster's topic, sunny or stormy",
     "link": "R",
     "plain": "Sunny, rainy, or snowy conditions"
    }
   ]
  },
  {
   "bonus": {
    "answer": "BIRTHDAY",
    "clue": "Candles on a cake mark this"
   },
   "words": [
    {
     "word": "BIKE",
     "clue": "Two-wheeler with pedals and a bell",
     "plain": "Pedal vehicle with two wheels"
    },
    {
     "word": "TAXICAB",
     "clue": "Yellow ride hailed in Manhattan",
     "link": "B",
     "plain": "Cab you hail on the street"
    },
    {
     "word": "SQUIRT",
     "clue": "Water pistol's burst, or a child's wriggle",
     "link": "I",
     "plain": "Spray a small stream"
    },
    {
     "word": "METRONOME",
     "clue": "Piano teacher's ticking timekeeper",
     "link": "R",
     "plain": "Musician's ticking timekeeper"
    },
    {
     "word": "DROUGHT",
     "clue": "Long dry spell that withers crops",
     "link": "T",
     "plain": "Lack of rain for months"
    },
    {
     "word": "SCHEDULE",
     "clue": "Planner's grid of times and events",
     "link": "H",
     "plain": "Timetable of events"
    },
    {
     "word": "ROADRUNNER",
     "clue": "Bird that beep-beeped past a coyote",
     "link": "D",
     "plain": "Cartoon bird that outruns a coyote"
    },
    {
     "word": "DOORWAY",
     "clue": "Entrance whose swinging panel meets the frame",
     "link": "A",
     "plain": "Entry into a room"
    },
    {
     "word": "HUMIDITY",
     "clue": "Muggy air's measurement on a weather report",
     "link": "Y",
     "plain": "Moisture in the air"
    }
   ]
  },
  {
   "bonus": {
    "answer": "SEASHELL",
    "clue": "Hold it to your ear for waves"
   },
   "words": [
    {
     "word": "WINDSHIELD",
     "clue": "Front glass that wipers clear",
     "plain": "Front glass of a car"
    },
    {
     "word": "THERMOS",
     "clue": "Where soup stays hot till lunch",
     "link": "S",
     "plain": "Insulated flask for hot drinks"
    },
    {
     "word": "NORTHEAST",
     "clue": "Direction between north and east",
     "link": "E",
     "plain": "Compass point between north and east"
    },
    {
     "word": "ADVERTISE",
     "clue": "Promote a product on billboards",
     "link": "A",
     "plain": "Promote through commercials"
    },
    {
     "word": "WAREHOUSE",
     "clue": "Big building where goods wait to ship",
     "link": "S",
     "plain": "Big storage building for goods"
    },
    {
     "word": "PHRASE",
     "clue": "Words grouped without a full sentence",
     "link": "H",
     "plain": "Group of words, not a sentence"
    },
    {
     "word": "BUGLE",
     "clue": "Brass horn that wakes soldiers at dawn",
     "link": "E",
     "plain": "Military wake-up horn"
    },
    {
     "word": "GRANOLA",
     "clue": "Crunchy oat breakfast with nuts and honey",
     "link": "L",
     "plain": "Crunchy oat cereal with nuts"
    },
    {
     "word": "NOBLE",
     "clue": "Of high birth, or a gas that won't react",
     "link": "L",
     "plain": "Aristocratic, or a type of gas"
    }
   ]
  },
  {
   "bonus": {
    "answer": "PLEASURE",
    "clue": "Opposite of pain"
   },
   "words": [
    {
     "word": "SPARROW",
     "clue": "Small brown songbird at the feeder",
     "plain": "Small brown bird"
    },
    {
     "word": "DOLPHIN",
     "clue": "Clicking, squeaking sea swimmer",
     "link": "P",
     "plain": "Friendly sea mammal"
    },
    {
     "word": "CORNMEAL",
     "clue": "Ground maize, mixed for muffins or mush",
     "link": "L",
     "plain": "Ground corn for baking"
    },
    {
     "word": "GEAR",
     "clue": "Cleats and pads, or a car's shifter",
     "link": "E",
     "plain": "Equipment, or a car's transmission part"
    },
    {
     "word": "CASE",
     "clue": "Detective's puzzle, or a glasses holder",
     "link": "A",
     "plain": "Detective's puzzle to solve"
    },
    {
     "word": "OUTSIDE",
     "clue": "Where recess happens, away from walls",
     "link": "S",
     "plain": "Not indoors"
    },
    {
     "word": "NUCLEAR",
     "clue": "Kind of power or family, like a reactor",
     "link": "U",
     "plain": "Of the atom"
    },
    {
     "word": "BUTTERMILK",
     "clue": "Tangy drink left over from churning",
     "link": "R",
     "plain": "Tangy drink after churning cream"
    },
    {
     "word": "ZERO",
     "clue": "Nothing at all, on a scoreboard",
     "link": "E",
     "plain": "Nothing, as a number"
    }
   ]
  },
  {
   "bonus": {
    "answer": "TERRIBLE",
    "clue": "Awful, dreadful, just plain bad"
   },
   "words": [
    {
     "word": "TOUR",
     "clue": "Round trip for a sightseer",
     "plain": "Sightseeing journey"
    },
    {
     "word": "CORRECT",
     "clue": "Right on the test, not wrong",
     "link": "T",
     "plain": "Free of mistakes"
    },
    {
     "word": "MICROWAVE",
     "clue": "Kitchen oven that heats leftovers in seconds",
     "link": "E",
     "plain": "Fast kitchen oven for popcorn"
    },
    {
     "word": "SORE",
     "clue": "Tender, as a bruise or throat",
     "link": "R",
     "plain": "Painful to the touch"
    },
    {
     "word": "TRIP",
     "clue": "Short journey, or a stumble over a curb",
     "link": "R",
     "plain": "Short journey, or to stumble"
    },
    {
     "word": "BRIEF",
     "clue": "Short and to the point, like a legal summary",
     "link": "I",
     "plain": "Short, or a lawyer's summary"
    },
    {
     "word": "GERBIL",
     "clue": "Small pet that runs on a wheel",
     "link": "B",
     "plain": "Small rodent pet, like a hamster"
    },
    {
     "word": "TODDLER",
     "clue": "Child learning to walk, unsteadily",
     "link": "L",
     "plain": "Small child just learning to walk"
    },
    {
     "word": "STYLE",
     "clue": "Fashion sense, or how an author writes",
     "link": "E",
     "plain": "Fashionable look, or writing manner"
    }
   ]
  },
  {
   "bonus": {
    "answer": "CONCRETE",
    "clue": "Sidewalk material, or not abstract"
   },
   "words": [
    {
     "word": "CUDDLE",
     "clue": "Snuggle up close, as with a teddy bear",
     "plain": "Snuggle"
    },
    {
     "word": "CLOWN",
     "clue": "Circus performer in a red nose",
     "link": "C",
     "plain": "Bozo, for one"
    },
    {
     "word": "THRONE",
     "clue": "Seat of power, literally",
     "link": "O",
     "plain": "A king's chair"
    },
    {
     "word": "BACKBONE",
     "clue": "Spine that holds you upright, or toughness",
     "link": "N",
     "plain": "Spine, or main support"
    },
    {
     "word": "SCORE",
     "clue": "Result of a game, or a film's music",
     "link": "C",
     "plain": "Game tally, or a film's music"
    },
    {
     "word": "PARSLEY",
     "clue": "Herb served with fish, curly or flat",
     "link": "R",
     "plain": "Green herb, curly or flat"
    },
    {
     "word": "DIRTBIKE",
     "clue": "Trail bike with knobby tires, off-road",
     "link": "E",
     "plain": "Off-road cycle"
    },
    {
     "word": "CUTE",
     "clue": "Adorable, in a puppy sort of way",
     "link": "T",
     "plain": "Adorable"
    },
    {
     "word": "STAKE",
     "clue": "Wooden pointed post, or a wager in poker",
     "link": "E",
     "plain": "Wager, or pointed wooden pole"
    }
   ]
  }
 ]
};

if (typeof module !== "undefined") module.exports = POOLS;
