// inclusive
export const getCharacterTypes = (levelOfRealism = 1, getEdgy = false) => {
    const list1 = [
        "man", 
        "woman", 
        "child", 
        "princess", 
        "king", 
        "queen", 
        "knight", 
        "clown",
        "sailor", 
        "merchant", 
        "warrior", 
        "aristocrat", 
        "inventor", 
        "spy", 
        "scholar", 
        "comedian",
    ]
    const list2 = [
        "dog", 
        "cat", 
        "robot", 
        "chicken",
        "pig",
        "supercomputer",
    ]
    const list3 = [
        "phoenix", 
        "alien", 
        "gremlin", 
        "leprechaun", 
        "dragon", 
        "elf", 
        "dwarf", 
        "goblin", 
        "fairy", 
        "centaur", 
        "unicorn", 
        "giant", 
        "skeleton", 
        "ghost", 
    ]
    const edgyList = [
        "orc", 
        "werewolf", 
        "hamburgler",
        "outlaw", 
        "pirate", 
    ];
    const primaryList = levelOfRealism === 1 ? list1 : (levelOfRealism === 2 ? [...list1, ...list2] : [...list1, ...list2, ...list3])
    const finalList = getEdgy ? [...primaryList, ...edgyList] : primaryList;
    finalList.sort();
    return finalList;
}

// all
export const getCharacterTraits = (levelOfRealism = 1, getEdgy = false) => {
    const list = [
        "angry", "carefree", "belligerent", "deceitful", "apathetic",
        "stoic", "impulsive", "melancholy", "arrogant", "compassionate", "nervous", 
        "boastful", "naive", "witty", "pessimistic", "scheming", "sarcastic", 
        "inquisitive", "timid", "grumpy", "charming", "reckless", "dutiful", 
        "aloof", "optimistic", "manipulative", "earnest", "fearful", "obsessive",  
    ];
    const edgyList = [];
    const finalList = getEdgy ? [...list, ...edgyList] : list;
    finalList.sort();
    return finalList;
}

// inclusive
export const getCharacterHasItems = (levelOfRealism = 1, getEdgy = false) => {
    const list1 = [
        "the vision of an eagle", 
        "a limp when they walk", 
        "very poor vision",
        "an unusually long neck", 
        "freckles on their face", 
        "a prominent scar on their cheek", 
        "a slight stutter when speaking", 
        "thin, wiry hair", 
        "a short, stocky build", 
        "a tall and slender build", 
        "muscular arms", 
        "overly large hands", 
        "a furrowed brow", 
        "bent posture",
        "scar on their cheek", 
        "small, delicate hands",
        "a deep voice", 
        "a crooked smile", 
        "bright red hair", 
        "an unusual birthmark", 
        "unusually sharp features", 
        "slight tremors in their hands"
    ]
    const list2 = [
        "an extra thumb", 
        "one arm much longer than the other", 
        "unevenly shaped ears", 
        "unusually pale skin", 
        "a hunched back", 
        "a big thoughtful brain", 
        "horns that curve into a spiral", 
        "a spine that crackles loudly", 
        "a tail that won't stop twitching",
        "scales instead of skin", 
        "claws instead of fingers", 
        "webbed hands and feet",
    ]
    const list3 = [
        "wings too small for flight",
        "glowing red eyes", 
        "a metallic jaw", 
        "a translucent skull", 
        "crystals growing from their back", 
        "an eye in the palm of their hand",
    ]
    const edgyList = [
        "a missing ear", 
        "a constantly bleeding nose", 
        "a beard made of moss", 
        "a wooden leg",
        "a single enormous eyebrow", 
    ];
    const primaryList = levelOfRealism === 1 ? list1 : (levelOfRealism === 2 ? [...list1, ...list2] : [...list1, ...list2, ...list3])
    const finalList = getEdgy ? [...primaryList, ...edgyList] : primaryList;
    finalList.sort();
    return finalList;
}

//inclusive
export const getLikes = (levelOfRealism = 1, getEdgy = false) => {
    const list1 = [
        "to agree with everything",
        "to travel the world",
        "to mimic voices perfectly", 
        "to tell the same story over and over", 
        "to study ancient languages", 
        "to practice martial arts in private", 
        "to write in a journal daily", 
        "to climb mountains in solitude", 
        "to explore abandoned buildings", 
        "to play chess with strangers", 
        "to brew their own beer", 
    ]
    const list2 = [
        "to compose operas in secret", 
        "to pet dangerous animals", 
        "to chase mailmen and delivery people",
        "to dig deep holes in the backyard",
        "to steal socks from strangers", 
        "to rearrange furniture when no one’s looking", 
        "to sneak into libraries after hours", 
        "to develop new technologies in secret", 
        "to create elaborate puzzles and pranks for fun", 
    ]
    const list3 = [
        "to prank powerful beings", 
        "to howl at the moon",
        "to build statues of themselves", 
        "to make friends with shadows",
        "to whisper into jars and seal them", 
        "to practice disappearing mid-sentence", 
        "to time-travel without permission", 
    ]
    const edgyList = [
        "to trap others in their hidden dimension", 
        "to eat things that are still moving", 
        "to sharpen sticks for fun",
        "to sleep in other people’s garages", 
        "to drive fast late at night",
        "to hoard cursed relics", 
        "to conduct secret experiments late at night", 
    ];
    const primaryList = levelOfRealism === 1 ? list1 : (levelOfRealism === 2 ? [...list1, ...list2] : [...list1, ...list2, ...list3])
    const finalList = getEdgy ? [...primaryList, ...edgyList] : primaryList;
    finalList.sort();
    return finalList;
}

//inclusive
export const getDislikes = (levelOfRealism = 1, getEdgy = false) => {
    const list1 = [
        "being asked to explain themselves", 
        "making eye contact with strangers", 
        "watching people eat", 
        "people who can't make decisions", 
        "being interrupted while speaking", 
        "people who don’t clean up after themselves", 
        "being late to events", 
        "being in crowded spaces", 
        "having their personal space invaded", 
    ]
    const list2 = [
        "passing by mannequins", 
        "crossing bridges during fog", 
        "smells of any kind", 
        "the sound of chewing gum", 
        "people who don’t respect quiet spaces",
        "people who are early or late", 
        "standing in straight lines", 
        "opening gifts in front of others", 
        "watching fireworks alone", 
        "watching someone using social media", 
    ]
    const list3 = [
        "soggy bread", 
        "touching anything slimy", 
        "waiting for elevators", 
        "hearing clocks tick", 
        "folding laundry", 
        "listening to acoustic guitar covers", 
        "wearing hats that fit perfectly", 
        "bright fluorescent lights", 
        "being in photos with smiling people", 
        "watching people tie their shoes incorrectly", 
        "the sound of paper being torn", 
    ]
    const edgyList = [
        "animals of any kind",
        "people in general",
    ];
    const primaryList = levelOfRealism === 1 ? list1 : (levelOfRealism === 2 ? [...list1, ...list2] : [...list1, ...list2, ...list3])
    const finalList = getEdgy ? [...primaryList, ...edgyList] : primaryList;
    finalList.sort();
    return finalList;
}

//inclusive
export const getRandomSituation = (levelOfRealism = 1, getEdgy = false) => {
    const list1 = [
        "On a quest to find the king's stolen jewels", 
        "Stuck in an elevator that has broken down", 
        "Digging in a field for buried treasure", 
        "Searching for a child that has wandered from the village", 
        "Tracking a runaway horse across the plains", 
        "Escaping a collapsing cave after an earthquake", 
        "Caught in a storm while stranded on a small boat", 
        "Investigating a mysterious disappearance in a quiet town", 
        "Leading a group of explorers through dangerous terrain", 
        "A hamburger eating contest at McDonalds", 
    ]
    const list2 = [
        "Trying to decode an ancient map leading to a hidden city", 
        "Discovering a hidden underground world beneath the city", 
        "Bearing a terrible ring of power into a dangerous and burning land to throw into a volcano, breaking the spell of evil over all the land",
        "Navigating a dangerous jungle to find a lost treasure",
        "Trying to find a hidden letter from the past in a dusty old library",
        "Solving a mysterious riddle that leads to a forgotten treasure chest in the attic",
        "Racing to stop a massive flood from reaching the village by blocking the river",
        "Building a treehouse in the tallest tree of the forest to keep an eye out for fires",
        "Exploring an abandoned amusement park where strange things keep happening",
        "Following a trail of clues to find an lost artifact in an ancient cave",
        "Tracking a mysterious footprint in the snow that leads to a secret hideout",

    ]
    const list3 = [
        "Searching an ancient forest for a Sasquatch", 
        "Trying to win a game of wits against a cunning supernatural opponent",
        "Following a glowing unicorn through a dense, foggy forest",
        "Flying to a floating city on dragonback as it floats towards a great portal",
        "Negotiating with an alien species who communicate in holograms they generate from their foreheads",
        "Trying to survive a night in a haunted mansion where the furniture comes to life",
        "Attempting to retrieve a mystical artifact guarded by a thousand-year-old dragon",
        "Entering a mysterious portal to a parallel world of sentient shadows",
        "Battling through a time-warped labyrinth where the laws of physics constantly change",
        "Escaping a giant floating jellyfish that controls the tides of a rising ocean",
    ]
    const edgyList = [
        "Solving a murder mystery at a remote estate", 
        "Driving a nuclear submarine into enemy territory",
        "Exterminating the last of the armadillos",
        "Escaping a collapsing building after a massive earthquake",
        "Racing on horses to stop a runaway train before it plunges off a collapsed bridge",
        "Defending a fortress under siege", 
        "Searching for a jar of special serum which is the only hope to end a great plague",
    ];
    const primaryList = levelOfRealism === 1 ? list1 : (levelOfRealism === 2 ? [...list1, ...list2] : [...list1, ...list2, ...list3])
    const finalList = getEdgy ? [...primaryList, ...edgyList] : primaryList;
    const randomIndex = Math.floor(Math.random() * finalList.length);
    return finalList[randomIndex] + '.';
}