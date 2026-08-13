/* ================================================================
   VEN-TEC PIP-READER  -  bundled survival databank
   Each entry: { id, title, meta, tag, body }
   In body text, a line beginning with "## " renders as a heading.
   Content is general field-reference material. In any real
   emergency, seek professional help where it is available.
   ================================================================ */
var VENTEC_BOOKS = [
  {
    id: "b_water",
    title: "PROTOCOL 01 :: WATER",
    meta: "Sourcing / purifying / rationing",
    tag: "PRIORITY-HIGH",
    body:
"## THE RULE OF THREES\n" +
"You can last roughly three minutes without air, three days without water, three weeks without food. Water sits at the center of survival. Secure it before it becomes desperate.\n\n" +
"## FINDING WATER\n" +
"Move downhill; water collects in low ground. Follow animal tracks, insect swarms, and green vegetation. Rainwater caught on a clean tarp is among the safest sources. Morning dew wiped from grass with a cloth and wrung into a container adds up. Avoid stagnant pools with no plant or animal life around them.\n\n" +
"## MAKING IT SAFE\n" +
"Assume all wild water carries pathogens. A rolling boil for one full minute kills most organisms (three minutes above high altitude). If you cannot boil, a tight cloth filter removes sediment but NOT microbes. Chemical treatment and commercial filters are backups, not magic.\n\n" +
"## RATIONING\n" +
"Do not ration water into dehydration to 'save it.' Drink what your body needs and spend energy finding more. Sip steadily rather than gulping. Reduce sweat: work in the cool hours, rest in shade during peak heat.\n\n" +
"## WARNING\n" +
"Never drink seawater, urine, or blood; they accelerate dehydration. Cloudy or foul water should be filtered AND disinfected."
  },
  {
    id: "b_fire",
    title: "PROTOCOL 02 :: FIRE",
    meta: "Ignition / fuel / heat discipline",
    tag: "PRIORITY-HIGH",
    body:
"## WHY FIRE\n" +
"Fire purifies water, cooks food, wards off cold and predators, dries gear, and signals rescue. It is a morale engine as much as a tool.\n\n" +
"## THE THREE FUELS\n" +
"TINDER catches a spark: dry grass, birch bark, char cloth, cotton, fine shavings. KINDLING grows the flame: pencil-thin dry twigs. FUEL sustains it: wrist-thick and larger deadwood. Gather all three BEFORE you strike, and gather more than you think you need.\n\n" +
"## BUILDING THE LAY\n" +
"Clear a bare patch down to soil. Build a small teepee of tinder ringed by kindling, leaving a gap to feed air. Light from the upwind side. Feed slowly; smother nothing. A fire needs heat, fuel, and oxygen in balance.\n\n" +
"## KEEPING IT\n" +
"Bank coals under ash to carry an ember through the night. Never leave a fire unattended, and drown-stir-drown the coals before you break camp. In dry country a stray spark can end you as surely as the cold.\n\n" +
"## WET CONDITIONS\n" +
"Split wet wood to reach the dry core. Feather-stick shavings light easier than whole sticks. Keep a stash of tinder dry against your body."
  },
  {
    id: "b_shelter",
    title: "PROTOCOL 03 :: SHELTER",
    meta: "Exposure defense / site selection",
    tag: "PRIORITY-HIGH",
    body:
"## EXPOSURE KILLS FASTEST\n" +
"In cold or wet conditions, shelter often outranks water and fire. Hypothermia can drop you in hours. Build before dark and before you are exhausted.\n\n" +
"## CHOOSING GROUND\n" +
"Stay OFF ridgelines (wind) and OUT of valleys and dry washes (cold air pools, flash floods). Seek flat, dry ground with natural windbreaks. Check overhead for dead branches ('widowmakers'). Face the opening away from prevailing wind.\n\n" +
"## FAST BUILDS\n" +
"DEBRIS HUT: a ridgepole propped on a stump, ribbed with branches, piled deep with leaves and duff for insulation. Crawl in; your body heat does the rest. LEAN-TO: a single angled wall against wind and rain, best paired with a fire out front. In snow, a simple trench roofed with branches beats sleeping exposed.\n\n" +
"## INSULATION\n" +
"The cold ground steals more heat than the air. Always put a thick layer BENEATH you: boughs, leaves, a pack. Trap dead air; that is what keeps you warm.\n\n" +
"## STAY DRY\n" +
"Wet clothing loses most of its insulating value. Shed sweat-soaked layers, rig a rain shed first, and keep one dry layer in reserve for sleeping."
  },
  {
    id: "b_firstaid",
    title: "PROTOCOL 04 :: FIRST AID",
    meta: "Bleeding / shock / basic wound care",
    tag: "MEDICAL",
    body:
"## PRIORITIES: THE ABCs\n" +
"Airway, Breathing, Circulation. Make sure the airway is open and the person is breathing before treating anything else. Life-threatening bleeding is treated immediately, even before a full assessment.\n\n" +
"## SEVERE BLEEDING\n" +
"Apply firm DIRECT PRESSURE with a clean cloth and hold it, minutes not seconds. Do not keep lifting to peek. If blood soaks through, add layers on top; do not remove the first. For a limb that will not stop, a tourniquet placed high and tight above the wound is a last resort to save a life; note the time.\n\n" +
"## SHOCK\n" +
"Pale, cold, clammy, rapid weak pulse, confusion. Lay the person down, keep them warm, reassure them, and elevate the legs if no spinal or leg injury is suspected. Do not give food or drink to someone drifting in and out of consciousness.\n\n" +
"## WOUNDS AND BURNS\n" +
"Clean wounds with the safest water you have and cover them. Cool burns with cool (not ice-cold) water for several minutes; never break blisters. Watch for infection: spreading redness, heat, pus, fever.\n\n" +
"## DISCLAIMER\n" +
"This is general reference only, not a substitute for trained medical care. Get professional help whenever it is available."
  },
  {
    id: "b_food",
    title: "PROTOCOL 05 :: FOOD & FORAGING",
    meta: "Calories / trapping / plant caution",
    tag: "PRIORITY-MED",
    body:
"## DON'T PANIC ABOUT FOOD\n" +
"A healthy body endures weeks without food. Water, warmth, and shelter come first. But calories fuel the work of survival, so a plan matters.\n\n" +
"## EASIEST CALORIES\n" +
"Protein on the move costs energy to catch. Often the best returns are the humble ones: fish, shellfish, insects (avoid brightly colored, hairy, or foul-smelling bugs), eggs, and easily gathered plants you can positively identify.\n\n" +
"## TRAPPING BEATS HUNTING\n" +
"Traps and snares work while you sleep and rest. Set many along game trails and near water. Numbers win: ten simple snares out beat one perfect one.\n\n" +
"## PLANT CAUTION\n" +
"NEVER eat a wild plant you cannot identify with certainty. 'Edible look-alikes' with deadly twins are common. Avoid plants with milky sap, umbrella-shaped flower clusters, three-leaf patterns, or a bitter almond smell unless you are absolutely sure. When unsure, go without.\n\n" +
"## COOK IT\n" +
"Cooking kills parasites and makes calories safer to eat. When in doubt, apply heat."
  },
  {
    id: "b_nav",
    title: "PROTOCOL 06 :: NAVIGATION & SIGNAL",
    meta: "Direction / self-rescue / rescue",
    tag: "PRIORITY-MED",
    body:
"## STOP FIRST\n" +
"When lost, STOP: Stop, Think, Observe, Plan. Panic burns energy and daylight. Sit, drink, and assess before moving.\n\n" +
"## FINDING DIRECTION\n" +
"The sun rises in the east and sets in the west. At midday it sits due south in the northern hemisphere (due north in the southern). A shadow-stick method: mark the tip of a stick's shadow, wait fifteen minutes, mark again; the line from first mark to second points roughly east. At night, locate the North Star off the Big Dipper's pointer stars.\n\n" +
"## STAY OR GO\n" +
"If someone knows your route and timeline, staying put is usually safest; you are easier to find than a moving target. If you must move, mark your trail so searchers can track you and so you never circle back blind.\n\n" +
"## SIGNALING\n" +
"Three of anything means distress: three fires in a triangle, three whistle blasts, three flashes. A signal mirror flash carries for miles. Bright color and geometric shapes against a plain background read as 'human' from the air. Ground-to-air: a large 'V' means need assistance, an 'X' means need medical help.\n\n" +
"## CONSERVE\n" +
"Travel in the cool hours, rest in the heat, and never move at night in rough country without light. A twisted ankle in the dark can end the walk out."
  }
];
