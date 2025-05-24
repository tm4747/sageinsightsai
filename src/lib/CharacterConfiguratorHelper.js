export const getCharacterTypes = (b_getEdgy = false) => {
    const list = ["man", "woman", "child", "princess", "king", "queen", "knight", "clown",
        "dog", "cat", "alien", "robot", 
        "gremlin", "leprechaun", "dragon", "elf", "dwarf", 
        "goblin", "fairy", "centaur", "unicorn", "giant", "skeleton", "ghost", 
        "outlaw", "sailor", "merchant", "warrior", "aristocrat", "inventor", "spy", "scholar", "comedian"
    ];
    const edgyList = ["orc", "werewolf", "phoenix", "hamburglar"];
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
        "the vision of an eagle", 
        "a limp when they walk", 
        "glowing red eyes", 
        "very poor vision",
        "an extra thumb", 
        "an unusually long neck", 
        "one arm much longer than the other", 
        "wings too small for flight",
        "freckles on their face", 
        "a prominent scar on their cheek", 
        "a slight stutter when speaking", 
        "unevenly shaped ears", 
        "a birthmark shaped like texas", 
        "thin, wiry hair", 
        "a short, stocky build", 
        "a tall and slender build", 
        "muscular arms", 
        "overly large hands", 
        "a furrowed brow", 
        "bent posture",
        "unusually pale skin", 
        "scar on their cheek", 
        "a hunched back", 
        "small, delicate hands",
        "a deep voice", 
        "a crooked smile", 
        "bright red hair", 
        "an unusual birthmark", 
        "unusually sharp features", 
        "slight tremors in their hands"
    ];
    const edgyList = ["a missing ear", "a constantly bleeding nose","a metallic jaw", "a beard made of moss", "a wooden leg",
        "a translucent skull","a single enormous eyebrow", "crystals growing from their back", "an eye in the palm of their hand", 
    "horns that curve into a spiral","a cabin out in Utah","a big thoughtful brain", "a spine that crackles loudly", "a tail that won't stop twitching", 
    "scales instead of skin", "feathers where hair should be", "claws instead of fingers", "webbed hands and feet",
         ];
    const finalList = b_getEdgy ? [...list, ...edgyList] : list;
    finalList.sort();
    return finalList;
}


export const getLikes = (b_getEdgy = false) => {
    const list = [
        "to agree with everything",
        "to compose operas in secret", 
        "to pet dangerous animals", 
        "to chase mailmen and delivery people",
        "to dig deep holes in the backyard",
        "to prank powerful beings", 
        "to steal socks from strangers", 
        "to rearrange furniture when no one’s looking", 
        "to mimic voices perfectly", 
        "to sneak into libraries after hours", 
        "to tell the same story over and over", 
        "to study ancient languages", 
        "to practice martial arts in private", 
        "to write in a journal daily", 
        "to climb mountains in solitude", 
        "to explore abandoned buildings", 
        "to play chess with strangers", 
        "to brew their own beer", 
        "to develop new technologies in secret", 
        "to run a small, hidden business", 
        "to create elaborate puzzles and pranks for fun", 
        "to travel the world"

    ];
    const edgyList = ["to trap others in their hidden dimension", "to swim in lava streams", "to howl at math equations",
        "to eat things that are still moving","to make friends with shadows","to sharpen sticks for fun",
        "to sleep in other people’s beds", "to drive fast late at night","to hoard cursed relics", "to build statues of themselves", 
        "to whisper into jars and seal them", "to practice disappearing mid-sentence", "to time-travel without permission", 
        "to paint murals on ceilings", 
    ];
    const finalList = b_getEdgy ? [...list, ...edgyList] : list;
    finalList.sort();
    return finalList;
}

export const getDislikes = (b_getEdgy = false) => {
    const list = [
        "waiting for elevators", 
        "being asked to explain themselves", 
        "hearing clocks tick", 
        "standing in straight lines", 
        "folding laundry", 
        "making eye contact with strangers", 
        "opening gifts in front of others", 
        "watching fireworks alone", 
        "crossing bridges during fog", 
        "listening to acoustic guitar covers", 
        "wearing hats that fit perfectly", 
        "watching people eat", 
        "passing by mannequins", 
        "drinking from glass cups", 
        "being in photos with smiling people", 
        "being interrupted while speaking", 
        "watching people tie their shoes incorrectly", 
        "the sound of paper being torn", 
        "people who don’t clean up after themselves", 
        "bright fluorescent lights", 
        "being late to an event", 
        "smells of any kind", 
        "the sound of chewing gum", 
        "people who can't make decisions", 
        "watching someone using social media", 
        "being in crowded spaces", 
        "soggy bread", 
        "having their personal space invaded", 
        "people who are early or late", 
        "people who don’t respect quiet spaces"
];
const edgyList = ["touching anything slimy", ];
const finalList = b_getEdgy ? [...list, ...edgyList] : list;
finalList.sort();
return finalList;
}

export const getRandomSituation = (b_getEdgy = false) => {
    const list = [
        "On a quest to find the king's stolen jewels", 
        "Stuck in an elevator that has broken down", 
        "Digging in a field for buried treasure", 
        "Searching for a child that has wandered from the village", 
        "Searching an ancient forest for a Sasquatch", 
        "Tracking a runaway horse across the plains", 
        "Escaping a collapsing cave after an earthquake", 
        "Trying to decode an ancient map leading to a hidden city", 
        "Caught in a storm while stranded on a small boat", 
        "Investigating a mysterious disappearance in a quiet town", 
        "Defending a fortress under siege", 
        "Trying to win a game of wits against a cunning supernatural opponent who has arrived", 
        "Discovering a hidden underground world beneath the city", 
        "Leading a group of explorers through dangerous terrain", 
    ]
    const edgyList = ["solving a murder mystery at a remote estate", "Eating hamburgers at McDonalds", ];
    const finalList = b_getEdgy ? [...list, ...edgyList] : list;
    const randomIndex = Math.floor(Math.random() * finalList.length);
    return finalList[randomIndex] + '.';
}