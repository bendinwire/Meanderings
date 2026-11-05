// Theme-chain prototype puzzles. Each chain: theme (8 letters = the gold link letters), bonus clue, 9 words as [WORD, clue, plain?].
// Difficulty is WORD difficulty (vocabulary + clue style), not link length: every chain uses 1-letter links.
module.exports = {
easy: [
 { theme: "BASEBALL", clue: "Game with bats, bases and a diamond", words: [
  ["CURVEBALL", "Pitch that bends in flight"], ["BLEACHERS", "Cheap stadium seats without backs"], ["STADIUM", "Big arena for games"],
  ["STRETCH", "Seventh-inning ritual; also, to elongate"], ["DOUBLE", "Two-base hit"], ["BATTERY", "Pitcher and catcher together"],
  ["CLEANUP", "Batting spot for the big slugger"], ["OUTFIELD", "Where center and right play"], ["PLATE", "Where runs score; also a dish"]] },
 { theme: "SEASHORE", clue: "Where the land meets the ocean", words: [
  ["FLIPPERS", "Swimmer's foot fins"], ["SEAL", "Barking marine mammal"], ["WAVE", "Ocean swell; a friendly greeting"],
  ["SURFBOARD", "Ride the waves on this"], ["SHRIMP", "Small pink seafood"], ["DOLPHIN", "Clever, clicking sea mammal"],
  ["OTTER", "Playful swimmer, floats on its back"], ["PIER", "Dock jutting into the water"], ["MUSSEL", "Dark-shelled shellfish"]] },
 { theme: "HOSPITAL", clue: "Place where patients are treated", words: [
  ["CRUTCH", "Walking aid for a broken leg"], ["SHOT", "Vaccine jab"], ["GLOVES", "Latex hand protection"],
  ["SPLINT", "Support for a broken finger"], ["DRIP", "IV fluid line"], ["RESIDENT", "Doctor in training"],
  ["CAST", "Plaster wrap on a broken arm"], ["VITALS", "Temperature and blood pressure readings"], ["PULSE", "Wrist beat the nurse counts"]] },
 { theme: "AIRPLANE", clue: "Flying machine with wings", words: [
  ["TAKEOFF", "Start of a flight, going up"], ["LANDING", "End of a flight, coming down"], ["AILERON", "Hinged wing flap for rolling"],
  ["HELICOPTER", "Whirlybird with spinning blades"], ["FLAP", "Wing section lowered for slow flight"], ["LAYOVER", "Wait between connecting flights"],
  ["RUNWAY", "Strip where jets speed up"], ["AIRLINE", "Delta or United, for example"], ["STEWARD", "Cabin attendant who serves drinks"]] },
 { theme: "SANDWICH", clue: "Lunch between two slices of bread", words: [
  ["SKEWER", "Stick for grilling kebabs"], ["SPREAD", "Smear on bread, like butter"], ["TUNA", "Canned fish for salad"],
  ["GRINDER", "Long sub in New England"], ["WEDGE", "Thick triangular chunk"], ["SWISS", "Cheese with big holes"],
  ["CIABATTA", "Italian bread, flat and crusty"], ["LUNCH", "Midday meal"], ["HERO", "Big sub in New York"]] },
],
medium: [
 { theme: "PAINTING", clue: "Art made with brush and pigment", words: [
  ["MASTERPIECE", "An artist's greatest work"], ["IMPASTO", "Thick, textured paint technique"], ["SIENNA", "Burnt earth tone"],
  ["GRADIENT", "Smooth blend between two colors"], ["TONE", "Color quality, light or dark"], ["STILL", "Motionless, like a bowl of fruit"],
  ["RENOIR", "Impressionist who painted dancers and boaters"], ["INDIGO", "Deep blue dye"], ["GOYA", "Spanish court painter of 'Black Paintings'"]] },
 { theme: "HARDWARE", clue: "Tools and fasteners, or computer parts", words: [
  ["SHIM", "Thin wedge used to fill gaps"], ["HAMMER", "Tool for driving nails"], ["SPANNER", "British wrench"],
  ["SANDER", "Power tool that smooths wood"], ["SCREWDRIVER", "Fastener turner; also a cocktail"], ["AWL", "Pointed tool for making holes"],
  ["RATCHET", "Socket handle that clicks"], ["LUMBER", "Cut wood for building"], ["DOWEL", "Wooden peg joining two pieces"]] },
 { theme: "RAILROAD", clue: "Network of steel tracks and depots", words: [
  ["FREIGHT", "Goods shipped by rail"], ["TANKER", "Car or ship carrying liquids"], ["TRAIN", "Choo-choo; also to practice"],
  ["RAILS", "Parallel steel bars wheels roll on"], ["TURNTABLE", "Rotating platform for turning locomotives"], ["CROSSING", "Where road meets tracks, with gates"],
  ["LOCAL", "Service that stops everywhere"], ["DISPATCH", "Send out; a controller's job"], ["DEPOT", "Small station"]] },
 { theme: "MUSICIAN", clue: "Plays an instrument for a living", words: [
  ["TEMPO", "Speed of a piece"], ["MOUTHPIECE", "Horn part your lips touch"], ["DRUMS", "Kit played with sticks"],
  ["LYRICS", "Words of a song"], ["PICK", "Plastic plectrum for guitar"], ["CHOIR", "Group of singers in church"],
  ["ACCORDION", "Squeezebox with keys and buttons"], ["SAXOPHONE", "Curved jazz horn with a reed"], ["TUNER", "Device that checks pitch"]] },
 { theme: "GARDENER", clue: "Person who tends flowers and veggies", words: [
  ["GRAVEL", "Small stones for a path"], ["WATERING", "Giving plants a drink"], ["RAKE", "Tool for gathering leaves"],
  ["ORCHID", "Showy tropical flower"], ["SPADE", "Digging tool; also a card suit"], ["MANURE", "Natural fertilizer from farm animals"],
  ["PLANTER", "Pot or box for flowers"], ["LOPPERS", "Long-handled branch cutters"], ["ROW", "Line of crops"]] },
],
hard: [
 { theme: "NAVIGATE", clue: "Find your way across sea or land", words: [
  ["HELMSMAN", "He holds the wheel while the captain barks orders", "Person steering a ship"],
  ["HEADWIND", "Gust that slows a plane without touching it", "Wind blowing against you"],
  ["VOYAGER", "Probe that left the solar system, or a seafarer", "Long-journey traveler"],
  ["ARRIVE", "Reach the end of a trip, or succeed", "Reach your destination"],
  ["TRIANGULATE", "Fix a position using two known points and angles", "Locate using three points"],
  ["HEADING", "Direction of travel, in degrees", "Direction you're pointed"],
  ["WAYPOINT", "Stop marked on a route, GPS style", "Marked stop along a route"],
  ["TILLER", "Lever swung to steer a small boat", "Boat's steering handle"],
  ["DIVIDERS", "Two-legged tool that steps off distances on charts", "Compass-like measuring tool"]] },
 { theme: "SCULPTOR", clue: "Artist who carves stone or shapes clay", words: [
  ["BUST", "Head-and-shoulders likeness, or a failure", "Statue of head and shoulders"],
  ["SCRAPE", "Remove surface with a blade, or a minor wound", "Rub off with a blade"],
  ["CONTOUR", "Outline that gives form to a figure", "Outline of a shape"],
  ["COLOSSUS", "Rhodes statue, or any giant of the type", "Giant statue"],
  ["PLINTH", "Squared base under a column or statue", "Block a statue stands on"],
  ["PEDESTAL", "Where a statue stands; don't put people on it", "Stand for a statue"],
  ["POINT", "Tip of a chisel, or the gist", "Sharp tip"],
  ["BRONZE", "Copper-tin alloy poured into molds, third on podium", "Metal for casting statues"],
  ["TEXTURE", "Surface quality the fingertips judge", "How a surface feels"]] },
 { theme: "VINEYARD", clue: "Where grapes for wine are grown", words: [
  ["VALLEY", "Napa or Sonoma, geographically", "Low land between hills"],
  ["VINTAGE", "Year of the harvest, or classic", "Wine's harvest year"],
  ["SEDIMENT", "What settles at the bottom of an old bottle", "Dregs in a bottle"],
  ["ENOLOGY", "Scientific study of winemaking", "Science of wine"],
  ["BERRY", "Fruit botanically including the grape", "Small round fruit"],
  ["YEAST", "Microbe that turns grape sugar into alcohol", "Fungus that ferments sugar"],
  ["RACK", "Frame holding bottles on their sides", "Bottle-holding frame"],
  ["BORDEAUX", "French region famed for its clarets", "Famous French wine region"],
  ["FORTIFIED", "Wine like port, strengthened with brandy", "Boosted with extra alcohol"]] },
 { theme: "TYPEFACE", clue: "Design of letters, like Times or Helvetica", words: [
  ["WEIGHT", "Thickness of the strokes: light, regular, bold", "Boldness of a font"],
  ["TYPO", "A slip of the finger, caught by proofreaders", "Keyboard spelling mistake"],
  ["TYPESET", "Arrange text for printing, once with metal blocks", "Arrange text for print"],
  ["ELLIPSIS", "Three dots that trail off", "Three-dot punctuation"],
  ["SERIFS", "Tiny feet on Times New Roman's letters", "Small strokes on letter ends"],
  ["FORMAT", "Layout of a page, or to wipe a drive", "Arrange a document's look"],
  ["CAPS", "Capitals, as in SHOUTING online", "Capital letters"],
  ["MONOSPACE", "Type where every letter takes equal width", "Equal-width font"],
  ["HEAVY", "Thick and dark, beyond bold", "Very bold"]] },
 { theme: "PHARMACY", clue: "Where prescriptions are filled", words: [
  ["PLACEBO", "Sugar pill that works through belief", "Fake pill in a trial"],
  ["PATCH", "Transdermal delivery, stuck on skin", "Medicated skin sticker"],
  ["SACHET", "Single-serve foil packet of powder", "Small packet of powder"],
  ["CORDIAL", "Friendly in manner, or a sweet syrup drink", "Warm and friendly"],
  ["REMEDY", "Cure for what ails you", "Cure for an illness"],
  ["VITAMIN", "Essential nutrient, lettered A through K", "Daily supplement like C"],
  ["SCALE", "Weighing device for measuring doses of powder", "Weighing device"],
  ["APOTHECARY", "Old-fashioned druggist, from Greek for storehouse", "Old-time druggist"],
  ["SYRUP", "Thick sweet liquid carrying cough medicine", "Thick liquid medicine"]] },
],
};
