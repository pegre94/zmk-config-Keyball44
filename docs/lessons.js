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
    
    // ==========================================
    // Stage 9: Numbers (NUM layer) - Progressive
    // ==========================================
    15: {
        name: "NUM Layer - Home Row (4, 5, 6)",
        description: "Learn the home row numbers on NUM layer",
        keys: ['4', '5', '6'],
        exercises: [
            "444 444 444",
            "555 555 555",
            "666 666 666",
            "456 456 456",
            "654 654 654",
            "445 556 664",
            "465 546 654"
        ],
        minWPM: 10,
        minAccuracy: 90,
        layer: 4
    },
    16: {
        name: "NUM Layer - Top Row (7, 8, 9)",
        description: "Learn the top row numbers on NUM layer",
        keys: ['7', '8', '9', '4', '5', '6'],
        exercises: [
            "777 777 777",
            "888 888 888",
            "999 999 999",
            "789 789 789",
            "987 987 987",
            "456 789 456",
            "741 852 963"
        ],
        minWPM: 10,
        minAccuracy: 90,
        layer: 4
    },
    17: {
        name: "NUM Layer - Bottom Row (1, 2, 3)",
        description: "Learn the bottom row numbers on NUM layer",
        keys: ['1', '2', '3', '4', '5', '6'],
        exercises: [
            "111 111 111",
            "222 222 222",
            "333 333 333",
            "123 123 123",
            "321 321 321",
            "456 123 456",
            "147 258 369"
        ],
        minWPM: 10,
        minAccuracy: 90,
        layer: 4
    },
    18: {
        name: "NUM Layer - Zero and All Digits",
        description: "Add zero and practice all digits",
        keys: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        exercises: [
            "000 000 000",
            "100 200 300",
            "10 20 30 40 50",
            "1234567890",
            "0987654321",
            "2024 2025 2026",
            "1000 2000 3000"
        ],
        minWPM: 12,
        minAccuracy: 90,
        layer: 4
    },
    19: {
        name: "NUM Layer - Brackets [ ]",
        description: "Learn square brackets on NUM layer",
        keys: ['[', ']', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        exercises: [
            "[ ] [ ] [ ]",
            "[1] [2] [3]",
            "[10] [20] [30]",
            "[] [] []",
            "[123] [456]",
            "[0] [1] [2]"
        ],
        minWPM: 10,
        minAccuracy: 85,
        layer: 4
    },
    20: {
        name: "NUM Layer - Math Operators",
        description: "Learn = - on NUM layer",
        keys: ['=', '-', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        exercises: [
            "= = = = =",
            "- - - - -",
            "1 = 1",
            "2 - 1 = 1",
            "5 - 3 = 2",
            "10 - 5 = 5",
            "100 = 100"
        ],
        minWPM: 10,
        minAccuracy: 85,
        layer: 4
    },
    21: {
        name: "NUM Layer - Full Practice",
        description: "Practice all NUM layer keys together",
        keys: ['[', ']', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '=', '-', ';'],
        exercises: [
            "123 = 123",
            "[1, 2, 3]",
            "456 - 123 = 333",
            "[0, 1, 2, 3]",
            "2024-12-25",
            "10 = 5 - -5",
            "[100, 200, 300]"
        ],
        minWPM: 12,
        minAccuracy: 85,
        layer: 4
    },
    
    // ==========================================
    // Stage 10: Symbols (SYM layer) - Progressive
    // ==========================================
    22: {
        name: "SYM Layer - Home Row ($, %, ^)",
        description: "Learn home row symbols on SYM layer",
        keys: ['$', '%', '^'],
        exercises: [
            "$$$ $$$ $$$",
            "%%% %%% %%%",
            "^^^ ^^^ ^^^",
            "$%^ $%^ $%^",
            "^%$ ^%$ ^%$",
            "$$ %% ^^"
        ],
        minWPM: 8,
        minAccuracy: 85,
        layer: 5
    },
    23: {
        name: "SYM Layer - Colon and Plus",
        description: "Learn : and + on SYM layer",
        keys: [':', '+', '$', '%', '^'],
        exercises: [
            "::: ::: :::",
            "+++ +++ +++",
            ": + : + :",
            "$: %: ^:",
            "$+ %+ ^+",
            ": : : + + +"
        ],
        minWPM: 8,
        minAccuracy: 85,
        layer: 5
    },
    24: {
        name: "SYM Layer - Top Row (&, *, curly braces)",
        description: "Learn &, *, { and } on SYM layer",
        keys: ['&', '*', '{', '}', '$', '%', '^', ':', '+'],
        exercises: [
            "&&& &&& &&&",
            "*** *** ***",
            "{ } { } { }",
            "{} {} {}",
            "& * & *",
            "{ & } { * }",
            "{$} {%} {^}"
        ],
        minWPM: 8,
        minAccuracy: 85,
        layer: 5
    },
    25: {
        name: "SYM Layer - Parentheses",
        description: "Learn ( and ) on SYM layer",
        keys: ['(', ')', '{', '}', '&', '*'],
        exercises: [
            "( ) ( ) ( )",
            "() () ()",
            "(()) (())",
            "({}) ({})",
            "(*) (&)",
            "(( )) {{ }}"
        ],
        minWPM: 8,
        minAccuracy: 85,
        layer: 5
    },
    26: {
        name: "SYM Layer - Bottom Row (!, @, #)",
        description: "Learn !, @ and # on SYM layer",
        keys: ['!', '@', '#', '$', '%', '^'],
        exercises: [
            "!!! !!! !!!",
            "@@@ @@@ @@@",
            "### ### ###",
            "!@# !@# !@#",
            "#@! #@! #@!",
            "!@#$%^"
        ],
        minWPM: 8,
        minAccuracy: 85,
        layer: 5
    },
    27: {
        name: "SYM Layer - Tilde and Pipe",
        description: "Learn ~ and | on SYM layer",
        keys: ['~', '|', '!', '@', '#'],
        exercises: [
            "~~~ ~~~ ~~~",
            "||| ||| |||",
            "~ | ~ | ~",
            "~! ~@ ~#",
            "| | | |",
            "~|~ ~|~"
        ],
        minWPM: 8,
        minAccuracy: 85,
        layer: 5
    },
    28: {
        name: "SYM Layer - Underscore",
        description: "Learn _ on SYM layer",
        keys: ['_', '(', ')', '{', '}'],
        exercises: [
            "___ ___ ___",
            "_ _ _ _ _",
            "(_) (_) (_)",
            "{_} {_} {_}",
            "__init__",
            "my_var my_func"
        ],
        minWPM: 8,
        minAccuracy: 85,
        layer: 5
    },
    29: {
        name: "SYM Layer - Full Practice",
        description: "Practice all SYM layer symbols",
        keys: ['{', '}', '&', '*', '(', ')', ':', '$', '%', '^', '+', '~', '!', '@', '#', '|', '_'],
        exercises: [
            "!@#$%^&*()",
            "{ } ( ) [ ]",
            "~!@#$%^&*",
            "::: +++ ___",
            "() {} ||",
            "^_^ :) :("
        ],
        minWPM: 10,
        minAccuracy: 85,
        layer: 5
    },
    
    // ==========================================
    // Stage 11: Programming with Symbols
    // ==========================================
    30: {
        name: "Programming - Variables",
        description: "Practice variable naming with symbols",
        keys: [],
        exercises: [
            "my_var = 10",
            "$price = 100",
            "@user_name",
            "#define MAX",
            "const_VALUE",
            "_private_var"
        ],
        minWPM: 12,
        minAccuracy: 85,
        layer: 5
    },
    31: {
        name: "Programming - Functions",
        description: "Practice function syntax with symbols",
        keys: [],
        exercises: [
            "func()",
            "test(1, 2, 3)",
            "add(a, b)",
            "() => {}",
            "function() {}",
            "def __init__():"
        ],
        minWPM: 12,
        minAccuracy: 85,
        layer: 5
    },
    32: {
        name: "Programming - Objects & Arrays",
        description: "Practice object and array syntax",
        keys: [],
        exercises: [
            "{ key: value }",
            "[1, 2, 3, 4, 5]",
            "{ a: 1, b: 2 }",
            "arr[0] = 10",
            "obj.prop = 5",
            "{ x: [1, 2] }"
        ],
        minWPM: 12,
        minAccuracy: 85,
        layer: 5
    },
    33: {
        name: "Programming - Operators",
        description: "Practice programming operators",
        keys: [],
        exercises: [
            "a == b",
            "x != y",
            "a && b",
            "x || y",
            "!flag",
            "a >= b",
            "x <= y",
            "i++ j--"
        ],
        minWPM: 12,
        minAccuracy: 85,
        layer: 5
    },
    34: {
        name: "Programming - Mixed",
        description: "Practice real code snippets",
        keys: [],
        exercises: [
            "if (x > 0) { }",
            "for (i = 0; i < 10; i++)",
            "arr.map((x) => x * 2)",
            "const { a, b } = obj",
            "import { x } from 'y'",
            "export default App"
        ],
        minWPM: 15,
        minAccuracy: 85,
        layer: 5
    },
    
    // Stage 12: Navigation (NAV layer)
    35: {
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
