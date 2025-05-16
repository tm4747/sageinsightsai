export const getCharacterTypes = (b_getEdgy = false) => {
    const list = ["man", "woman", "child", "princess", "king", "queen", "knight", "clown",
        "dog", "cat", "alien", "robot", 
        "orc", "gremlin", "leprechaun", 
        "dragon", "elf", "dwarf", 
        "goblin", "fairy", "centaur", "werewolf", "unicorn", 
        "phoenix", "giant", "skeleton", "ghost", 
    ];
    const edgyList = [];
    const finalList = b_getEdgy ? [...list, ...edgyList] : list;
    finalList.sort();
    return finalList;
}


export const getCharacterTraits = (b_getEdgy = false) => {
    const list = [
        "angry", "carefree", "belligerent", "deceitful", "apathetic",
        "stoic", "impulsive", "melancholy", "arrogant", "compassionate", "nervous", 
        "boastful", "naive", "witty", "pessimistic", "scheming", "sarcastic", 
        "inquisitive", "timid", "grumpy", "charming", "reckless", "dutiful", 
        "aloof", "optimistic", "manipulative", "earnest", "fearful", "obsessive",  
    ];
    const edgyList = [];
    const finalList = b_getEdgy ? [...list, ...edgyList] : list;
    finalList.sort();
    return finalList;
}

export const getCharacterHasItems = (b_getEdgy = false) => {
    const list = [
        "a powerful set of eyes", 
        "a limp when they walk", 
        "glowing red eyes", 
        "a tail that won't stop twitching", 
        "scales instead of skin", 
        "an extra thumb", 
        "feathers where hair should be", 
        "an unusually long neck", 
        "one arm much longer than the other", "claws instead of fingers", 
        "webbed hands and feet",
        "wings too small for flight",
    ];
    const edgyList = ["a missing ear", "a constantly bleeding nose","a metallic jaw", "a beard made of moss", "a wooden leg",
        "a translucent skull","a single enormous eyebrow", "crystals growing from their back", "an eye in the palm of their hand", 
    "horns that curve into a spiral","a cabin out in Utah","a big thoughtful brain", "a spine that crackles loudly", "very poor vision" ];
    const finalList = b_getEdgy ? [...list, ...edgyList] : list;
    finalList.sort();
    return finalList;
}


export const getLikes = (b_getEdgy = false) => {
    const list = [
        "to agree with everything",
        "to chase mailmen and delivery people",
        "to dig deep holes in the backyard",
        "to hoard cursed relics", 
        "to whisper into jars and seal them", 
        "to prank powerful beings", 
        "to compose operas in secret", 
        "to steal socks from strangers", 
        "to rearrange furniture when no one’s looking", 
        "to practice disappearing mid-sentence", 
        "to pet dangerous animals", 
        "to paint murals on ceilings", 
        "to mimic voices perfectly", 
        "to build statues of themselves", 
        "to sneak into libraries after hours", 
        "to time-travel without permission", 
        "to tell the same story over and over", 
    ];
    const edgyList = ["to trap others in their hidden dimension", "to swim in lava streams", "to howl at math equations",
        "to eat things that are still moving","to make friends with shadows","to sharpen sticks for fun",
        "to sleep in other people’s beds", "to drive fast late at night",
    ];
    const finalList = b_getEdgy ? [...list, ...edgyList] : list;
    finalList.sort();
    return finalList;
}

export const getDislikes = (b_getEdgy = false) => {
    const list = [
        "waiting for elevators", 
        "being asked to explain themselves", 
        "walking near reflective surfaces", 
        "hearing clocks tick", 
        "standing in straight lines", 
        "seeing people blink too much", 
        "folding laundry with corners", 
        "making eye contact with statues", 
        "opening gifts in front of others", 
        "watching fireworks alone", 
        "crossing bridges during fog", 
        "listening to acoustic guitar covers", 
        "wearing hats that fit perfectly", 
        "watching people eat spaghetti", 
        "passing by mannequins", 
        "hearing windchimes at night", 
        "drinking from glass cups", 
        "being in photos with smiling people", 
        "smelling anything labeled 'citrus fresh'"
];
const edgyList = ["touching anything slimy", ];
const finalList = b_getEdgy ? [...list, ...edgyList] : list;
finalList.sort();
return finalList;
}

export const getRandomItem = () => {
    const randomItems = [
        "egg roll",
        "shoe",
        "jar of mayonnaise",
        "holy grail",
        "fountain of youth",
        "toothbrush",
        "pillow",
        "coffee mug",
        "spoon",
        "laundry detergent",
        "notebook",
        "socks",
        "bike tire",
        "canned beans",
        "plunger",
        "water bottle",
        "flip-flop",
        "sunglasses",
        "paper clip",
        "garbage can",
        "dish towel",
        "tape measure",
        "light bulb",
        "backpack",
        "calculator",
        "golden compass",
        "phoenix feather",
        "map to the lost city",
        "crystal shard",
        "ancient scroll",
        "enchanted mirror",
        "unicorn horn",
        "silver key",
        "magic carpet",
        "cursed ruby",
        "moonstone pendant",
        "dragon's tooth",
        "vampire's cloak",
        "wishing well coin",
        "secret recipe book"
    ]
    const randomIndex = Math.floor(Math.random() * randomItems.length);
    return randomItems[randomIndex];
}