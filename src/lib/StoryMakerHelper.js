export const getCharacterTypes = () => {
    const list = ["man", "woman", "child", "princess", "king", "queen", "knight", "clown",
        "dog", "cat", "alien", "robot", 
        "orc", "gremlin", "leprechaun", 
        "dragon", "elf", "dwarf", 
        "goblin", "fairy", "centaur", "werewolf", "unicorn", 
        "phoenix", "giant", "skeleton", "ghost", 
    ];
    list.sort();
    return list;
}


export const getCharacterTraits = () => {
    const list = [
        "angry", "carefree", "belligerent", "deceitful", "apathetic",
        "stoic", "impulsive", "melancholy", "arrogant", "compassionate", "nervous", 
        "boastful", "naive", "witty", "pessimistic", "scheming", "sarcastic", 
        "inquisitive", "timid", "grumpy", "charming", "reckless", "dutiful", 
        "aloof", "optimistic", "manipulative", "earnest", "fearful", "obsessive",  
    ];
    list.sort();
    return list;
}

export const getHasAThings = () => {
    const list = [
        "a wooden leg", "a great set of eyeballs", "a very big and thoughtful brain", "a cabin in Utah",
        "a limp when they walk", "a missing ear", "glowing red eyes", 
        "a tail that won't stop twitching", "scales instead of skin", 
        "a constantly bleeding nose", "an extra thumb", "feathers where hair should be", 
        "a spine that crackles loudly", "an unusually long neck", 
        "one arm much longer than the other", "a metallic jaw", "claws instead of fingers", 
        "a beard made of moss", "a translucent skull", "horns that curve into a spiral", 
        "webbed hands and feet", "a single enormous eyebrow", 
        "crystals growing from their back", "an eye in the palm of their hand", 
        "wings too small for flight"
    ];
    list.sort();
    return list;
}


export const getLikesOrDislikes = () => {
    const list = [
        "to agree with what others have to say",
        "to chase mailmen and delivery people",
        "to dig deep holes in the backyard",
        "to trap others in their hidden dimension",
        "to drive fast late at night",
        "to hoard cursed relics", 
        "to whisper into jars and seal them", 
        "to prank powerful beings", 
        "to swim in lava streams", 
        "to compose operas in secret", 
        "to steal socks from strangers", 
        "to rearrange furniture when no one’s looking", 
        "to howl at math equations", 
        "to practice disappearing mid-sentence", 
        "to pet dangerous animals", 
        "to paint murals on ceilings", 
        "to mimic voices perfectly", 
        "to eat things that are still moving", 
        "to build statues of themselves", 
        "to sneak into libraries after hours", 
        "to make friends with shadows", 
        "to sharpen sticks for fun", 
        "to time-travel without permission", 
        "to tell the same story over and over", 
        "to sleep in other people’s beds"
    ];
    list.sort();
    return list;
}
