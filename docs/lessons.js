// Keyball44 Miryoku Typing Lessons
// Progressive lessons designed for learning the Miryoku layout

const LESSONS = {
    // Stage 1: Home Row Basics
    1: {
        name: "Home Row - Left Hand",
        description: "Learn the left home row keys: A, S, D, F",
        keys: ['a', 's', 'd', 'f'],
        exercises: [
            "fff fff fff",
            "ddd ddd ddd",
            "sss sss sss",
            "aaa aaa aaa",
            "fd fd fd fd",
            "sa sa sa sa",
            "asdf asdf asdf",
            "fdsa fdsa fdsa",
            "fads fads fads",
            "sadf sadf sadf"
        ],
        minWPM: 10,
        minAccuracy: 90
    },
    2: {
        name: "Home Row - Right Hand",
        description: "Learn the right home row keys: J, K, L, '",
        keys: ['j', 'k', 'l', "'"],
        exercises: [
            "jjj jjj jjj",
            "kkk kkk kkk",
            "lll lll lll",
            "jk jk jk jk",
            "kl kl kl kl",
            "jkl jkl jkl",
            "lkj lkj lkj",
            "jlk jlk jlk",
            "kjl kjl kjl"
        ],
        minWPM: 10,
        minAccuracy: 90
    },
    3: {
        name: "Home Row - Both Hands",
        description: "Combine left and right home row",
        keys: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
        exercises: [
            "fj fj fj fj",
            "dk dk dk dk",
            "sl sl sl sl",
            "asdf jkl",
            "fjdk slak",
            "all all all",
            "fall fall fall",
            "ask ask ask",
            "sad sad sad",
            "lad lad lad",
            "flask flask",
            "salad salad"
        ],
        minWPM: 15,
        minAccuracy: 90
    },
    
    // Stage 2: Extend to G and H
    4: {
        name: "Index Fingers - G and H",
        description: "Add G (left index) and H (right index)",
        keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        exercises: [
            "fg fg fg fg",
            "hj hj hj hj",
            "gh gh gh gh",
            "gash gash",
            "hash hash",
            "half half",
            "glad glad",
            "flash flash",
            "shall shall",
            "glass glass"
        ],
        minWPM: 15,
        minAccuracy: 90
    },
    
    // Stage 3: Top Row
    5: {
        name: "Top Row - Left Hand",
        description: "Learn Q, W, E, R, T",
        keys: ['q', 'w', 'e', 'r', 't', 'a', 's', 'd', 'f', 'g'],
        exercises: [
            "fff rrr fff",
            "ddd eee ddd",
            "sss www sss",
            "aaa qqq aaa",
            "ttt ggg ttt",
            "red red red",
            "wet wet wet",
            "set set set",
            "rest rest",
            "test test",
            "west west",
            "quest quest",
            "great great"
        ],
        minWPM: 15,
        minAccuracy: 85
    },
    6: {
        name: "Top Row - Right Hand",
        description: "Learn Y, U, I, O, P",
        keys: ['y', 'u', 'i', 'o', 'p', 'h', 'j', 'k', 'l'],
        exercises: [
            "jjj uuu jjj",
            "kkk iii kkk",
            "lll ooo lll",
            "yyy hhh yyy",
            "ppp ppp ppp",
            "you you you",
            "oil oil oil",
            "joy joy joy",
            "hilly hilly",
            "puppy puppy",
            "jolly jolly"
        ],
        minWPM: 15,
        minAccuracy: 85
    },
    7: {
        name: "Top Row - Full",
        description: "Combine all top row keys",
        keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        exercises: [
            "the the the",
            "that that",
            "with with",
            "they they",
            "this this",
            "your your",
            "what what",
            "their their",
            "quite quite",
            "write write",
            "people people",
            "through through"
        ],
        minWPM: 20,
        minAccuracy: 85
    },
    
    // Stage 4: Bottom Row
    8: {
        name: "Bottom Row - Left Hand",
        description: "Learn Z, X, C, V, B",
        keys: ['z', 'x', 'c', 'v', 'b', 'a', 's', 'd', 'f', 'g'],
        exercises: [
            "aaa zzz aaa",
            "sss xxx sss",
            "ddd ccc ddd",
            "fff vvv fff",
            "ggg bbb ggg",
            "cab cab cab",
            "vex vex vex",
            "box box box",
            "cave cave",
            "brave brave",
            "exact exact"
        ],
        minWPM: 15,
        minAccuracy: 85
    },
    9: {
        name: "Bottom Row - Right Hand",
        description: "Learn N, M, comma, period, slash",
        keys: ['n', 'm', ',', '.', '/', 'h', 'j', 'k', 'l'],
        exercises: [
            "jjj mmm jjj",
            "hhh nnn hhh",
            "kkk ,,, kkk",
            "lll ... lll",
            "man man man",
            "him him him",
            "name name",
            "moon moon",
            "noun noun",
            "human human"
        ],
        minWPM: 15,
        minAccuracy: 85
    },
    10: {
        name: "Full Keyboard",
        description: "All letter keys combined",
        keys: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        exercises: [
            "the quick brown fox",
            "jumps over the lazy dog",
            "pack my box with five",
            "dozen liquor jugs",
            "how vexingly quick",
            "daft zebras jump",
            "the five boxing wizards",
            "jump quickly"
        ],
        minWPM: 20,
        minAccuracy: 85
    },
    
    // Stage 5: Home Row Modifiers (Miryoku specific)
    11: {
        name: "Home Row Mods - Introduction",
        description: "Practice holding home row keys for modifiers",
        keys: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
        exercises: [
            "Hold A for GUI/Cmd",
            "Hold S for Alt/Option",
            "Hold D for Ctrl",
            "Hold F for Shift",
            "Hold J for Shift",
            "Hold K for Ctrl",
            "Hold L for Alt/Option"
        ],
        minWPM: 0,
        minAccuracy: 0,
        isTheory: true
    },
    
    // Stage 6: Common Words
    12: {
        name: "100 Most Common Words",
        description: "Practice the most frequently used English words",
        keys: [],
        exercises: [
            "the be to of and",
            "a in that have I",
            "it for not on with",
            "he as you do at",
            "this but his by from",
            "they we say her she",
            "or an will my one",
            "all would there their what",
            "so up out if about",
            "who get which go me"
        ],
        minWPM: 25,
        minAccuracy: 90
    },
    
    // Stage 7: Sentences
    13: {
        name: "Simple Sentences",
        description: "Type complete sentences",
        keys: [],
        exercises: [
            "The cat sat on the mat.",
            "She sells seashells by the seashore.",
            "How much wood would a woodchuck chuck?",
            "Peter Piper picked a peck of pickled peppers.",
            "The quick brown fox jumps over the lazy dog."
        ],
        minWPM: 25,
        minAccuracy: 90
    },
    
    // Stage 8: Programming (for developers)
    14: {
        name: "Programming Basics",
        description: "Common programming syntax",
        keys: [],
        exercises: [
            "const x = 10;",
            "function test() {}",
            "if (true) { return; }",
            "for (let i = 0; i < 10; i++)",
            "console.log('hello');",
            "import { useState } from 'react';",
            "export default App;"
        ],
        minWPM: 20,
        minAccuracy: 85
    },
    
    // Stage 9: Numbers (NUM layer)
    15: {
        name: "Numbers - NUM Layer",
        description: "Practice using the NUM layer (hold Backspace)",
        keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        exercises: [
            "123 456 789",
            "111 222 333",
            "444 555 666",
            "777 888 999",
            "2024 2025 2026",
            "100 200 300",
            "1234567890"
        ],
        minWPM: 15,
        minAccuracy: 90,
        layer: 4
    },
    
    // Stage 10: Symbols (SYM layer)
    16: {
        name: "Symbols - SYM Layer",
        description: "Practice using the SYM layer (hold Enter)",
        keys: ['{', '}', '(', ')', '[', ']', '!', '@', '#', '$', '%', '^', '&', '*'],
        exercises: [
            "{ } ( ) [ ]",
            "! @ # $ %",
            "^ & * ( )",
            "() {} []",
            "!= == ===",
            "&& || !",
            "{ key: value }"
        ],
        minWPM: 10,
        minAccuracy: 85,
        layer: 5
    },
    
    // Stage 11: Navigation (NAV layer)
    17: {
        name: "Navigation - NAV Layer",
        description: "Practice using the NAV layer (hold Space)",
        keys: [],
        exercises: [
            "Use arrows to navigate",
            "Home and End for line start/end",
            "Page Up and Page Down for scrolling",
            "Ctrl+C to copy, Ctrl+V to paste"
        ],
        minWPM: 0,
        minAccuracy: 0,
        isTheory: true,
        layer: 1
    }
};

// Get lesson by ID
function getLesson(id) {
    return LESSONS[id] || null;
}

// Get all lesson IDs
function getAllLessonIds() {
    return Object.keys(LESSONS).map(Number);
}

// Get total number of lessons
function getTotalLessons() {
    return Object.keys(LESSONS).length;
}
