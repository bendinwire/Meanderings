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

{ theme: "DESSERTS", clue: "Sweet courses served after dinner", words: [
  ["FUDGE", "Rich chocolate candy square"], ["STRUDEL", "Flaky apple pastry from Austria"], ["POPSICLE", "Frozen treat on a stick"],
  ["BISCOTTI", "Twice-baked Italian dunking cookie"], ["SUNDAE", "Ice cream with toppings and cherry"], ["TRUFFLE", "Chocolate bonbon, or a fungus"],
  ["PARFAIT", "Layered yogurt and fruit cup"], ["SWEET", "Sugary in taste"], ["CUSTARD", "Egg-and-milk pudding"]] },
 { theme: "CARTOONS", clue: "Animated shows for kids", words: [
  ["MASCOT", "Team's costumed cheering character"], ["CAPTION", "Text under a comic panel"], ["DRAWING", "Hand-sketched image, frame by frame"],
  ["SOUNDTRACK", "Music playing behind the show"], ["ANIMATION", "Bringing drawings to life"], ["DIALOGUE", "Characters' spoken lines"],
  ["SIMPSONS", "Yellow family of Springfield"], ["SCREEN", "TV display"], ["EPISODE", "One installment of a series"]] },
 { theme: "COSTUMES", clue: "Dress-up outfits for Halloween", words: [
  ["FACEPAINT", "Colorful makeup on cheeks"], ["CLOWN", "Big shoes and a red nose"], ["BUTTONS", "Round fasteners on a shirt"],
  ["STAGE", "Platform where actors perform"], ["TUXEDO", "Formal black-tie suit"], ["MASQUERADE", "Ball where guests hide faces"],
  ["MAKEUP", "Lipstick and eye shadow"], ["SEQUIN", "Shiny little disc sewn on"], ["WINGS", "Fairy's flying accessory"]] },
 { theme: "AIRPORTS", clue: "Places where planes take off and land", words: [
  ["LUGGAGE", "Suitcases and bags"], ["PAGING", "Calling a name over the speaker"], ["BOARDING", "Getting on the plane"],
  ["PASSENGER", "Traveler on a flight"], ["PILOT", "Person who flies the jet"], ["COUNTER", "Check-in desk"],
  ["PATROL", "Guard's regular rounds"], ["ESCORT", "Accompany for safety"], ["KIOSK", "Self-serve check-in stand"]] },
 { theme: "MONSTERS", clue: "Scary creatures under the bed", words: [
  ["MEDUSA", "Snake-haired Greek gorgon"], ["PHANTOM", "Ghostly spirit"], ["DEMON", "Evil spirit from below"],
  ["HORNS", "Pointed bumps on a bull's head"], ["FRANKENSTEIN", "Stitched-together creature of fiction"], ["YETI", "Abominable snowman"],
  ["OGRE", "Big, green fairy-tale brute"], ["SCARE", "Make someone jump"], ["SLIME", "Gooey green goo"]] },
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

{ theme: "REPTILES", clue: "Cold-blooded crawlers like snakes and lizards", words: [
  ["MONITOR", "Large lizard, or a computer screen"], ["VIPER", "Venomous snake with hinged fangs"], ["CARAPACE", "Hard upper shell of a turtle"],
  ["SERPENT", "Biblical snake"], ["HIBERNATE", "Sleep through the winter"], ["TAIL", "Lizard can drop this to escape"],
  ["SCALES", "Armor of overlapping plates"], ["EGGS", "Leathery clutch buried in sand"], ["CLAWS", "Sharp curved toe tips"]] },
{ theme: "SOLDIERS", clue: "Fighters who wear uniforms and march", words: [
  ["SERGEANT", "Rank above corporal"], ["CONSCRIPT", "Drafted, not volunteered"], ["CAMOUFLAGE", "Green-and-brown disguise pattern"],
  ["MEDAL", "Award pinned on a hero"], ["DISCHARGE", "Release from service, or to fire"], ["SHIELD", "Defensive plate carried on the arm"],
  ["TRENCH", "Muddy ditch of World War I"], ["TROOPS", "Armed forces on the ground"], ["SCOUT", "Sent ahead to spy out terrain"]] },
 { theme: "PASTRIES", clue: "Flaky baked goods from a bakery", words: [
  ["PHYLLO", "Paper-thin dough for baklava"], ["PRALINE", "Nut-and-caramel candy from New Orleans"], ["PASTY", "Cornish meat-and-potato hand pie"],
  ["STROMBOLI", "Rolled Italian bread filled with cheese"], ["PATISSERIE", "French pastry shop"], ["BRIOCHE", "Buttery, eggy French bun"],
  ["ECLAIR", "Cream-filled oblong with chocolate icing"], ["TURNOVERS", "Folded pies with fruit inside"], ["DANISH", "Breakfast pastry with a fruit center"]] },
 { theme: "ELEMENTS", clue: "Basic substances on the periodic table", words: [
  ["LEAD", "Heavy metal once used in pipes"], ["HELIUM", "Light gas that lifts balloons"], ["NOBLE", "Describes inert gases like argon"],
  ["MERCURY", "Liquid metal in old thermometers"], ["NONMETAL", "Element lacking luster, like carbon"], ["HALOGEN", "Group containing chlorine and fluorine"],
  ["TIN", "Metal used to plate food cans"], ["ISOTOPE", "Atom variant with extra neutrons"], ["SULFUR", "Yellow element with a rotten-egg smell"]] },
 { theme: "POLITICS", clue: "Government, parties and campaigns", words: [
  ["SPEECH", "Address given from a podium"], ["POLL", "Survey of voter opinion"], ["DIPLOMAT", "Embassy envoy"],
  ["LOBBYIST", "Paid advocate who courts lawmakers"], ["CABINET", "President's circle of advisers"], ["PARLIAMENT", "British legislature"],
  ["CONSTITUENT", "Voter in a lawmaker's district"], ["CONSERVATIVE", "Favoring tradition over change"], ["CAUCUS", "Party meeting to pick a candidate"]] },
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

{ theme: "MINERALS", clue: "Natural solids dug from the earth", words: [
  ["TOURMALINE", "Watermelon-colored gem with a black cousin", "Pink-green gemstone"],
  ["HEMATITE", "Iron oxide that streaks rusty red", "Red iron ore"],
  ["VEIN", "Ore-filled crack in rock, or blood vessel", "Mineral seam in rock"],
  ["GARNET", "January's red birthstone", "Deep red gemstone"],
  ["FLUORITE", "Glows under UV, giving fluorescence its name", "Purple glowing mineral"],
  ["FELDSPAR", "Most abundant mineral group in the crust", "Common crust mineral"],
  ["TALC", "Softest on Mohs scale, baby powder base", "Soft powder mineral"],
  ["SMELT", "Heat ore to extract metal, or a small fish", "Melt ore for metal"],
  ["IGNEOUS", "Rock born of cooled magma", "Volcanic-origin rock type"]] },
{ theme: "CERAMICS", clue: "Pots and tiles hardened in a kiln", words: [
  ["CLAY", "Moist earth a potter wedges", "Potter's raw material"],
  ["CELADON", "Pale jade-green glaze of Chinese ware", "Pale green glaze"],
  ["PORCELAIN", "Fine china fired at high heat", "Fine white china"],
  ["RAKU", "Japanese firing pulled red-hot from the kiln", "Japanese firing style"],
  ["CERAMIST", "One who throws pots for art", "Pottery artist"],
  ["MAJOLICA", "Tin-glazed Italian earthenware, brightly painted", "Colorful glazed pottery"],
  ["COIL", "Snake of clay stacked to build walls", "Rope of clay"],
  ["SCULPT", "Shape by carving or modeling", "Shape into art"],
  ["VASE", "Vessel for stems", "Flower holder"]] },
{ theme: "ASTEROID", clue: "Small rocky body orbiting the sun", words: [
  ["ACCRETION", "Slow clumping of dust into bodies", "Gradual buildup of material"],
  ["VESTA", "Bright rock visited by the Dawn probe", "Bright main-belt asteroid"],
  ["ASTRONOMER", "Sky watcher at the observatory", "Star scientist"],
  ["BELT", "Region between Mars and Jupiter", "Ring of space rocks"],
  ["DEBRIS", "Scattered fragments after a collision", "Scattered wreckage"],
  ["EROS", "Greek love god's rocky namesake", "Near-Earth rock, or Cupid"],
  ["REGOLITH", "Loose dusty blanket over solid rock", "Loose surface dust layer"],
  ["GOLDILOCKS", "Zone neither too hot nor too cold", "Just-right habitable zone"],
  ["STARDUST", "Cosmic particles; also a Hoagy Carmichael tune", "Cosmic particles"]] },
{ theme: "PORTRAIT", clue: "Picture of a person's face", words: [
  ["POSTURE", "How the sitter holds the spine", "How you sit or stand"],
  ["TRIPOD", "Three-legged camera support", "Camera stand"],
  ["CHARCOAL", "Burnt-willow sketching stick", "Black sketching stick"],
  ["SARGENT", "Madame X's painter, John Singer", "Famed American portraitist"],
  ["PAINTER", "One who wields the brush", "Brush artist"],
  ["MINIATURE", "Tiny, hand-sized likeness for a locket", "Very small painting"],
  ["HAIR", "Locks the artist must render", "Strands on your head"],
  ["GILT", "Gold-leaf trim on a frame", "Gold coating on frames"],
  ["REMBRANDT", "Dutch master of 'The Night Watch'", "Dutch master painter"]] },
 { theme: "ANCESTOR", clue: "Family member from long before you", words: [
  ["DYNASTY", "Ruling family across generations; Ming, for one", "Long-ruling family line"],
  ["LINEAGE", "Direct line of descent from forebears", "Family line of descent"],
  ["GENETIC", "Inherited through DNA", "Passed down in genes"],
  ["ARCHIVE", "Where old records are kept, or to store", "Store of old records"],
  ["CREST", "Heraldic emblem above the shield, or a wave's top", "Family emblem"],
  ["ROOTS", "Where your people come from; also plant anchors", "Where family comes from"],
  ["FOREFATHER", "Founding father, or male forebear", "Male forebear"],
  ["ORIGIN", "Where something began; start of the line", "Where it began"],
  ["PEDIGREE", "Documented ancestry of a show dog", "Dog's family record"]] },
],
};
