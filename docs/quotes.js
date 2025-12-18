// Real writing examples for typing practice
// Categories: quotes, code, english, programming terms

const QUOTES = {
    quotes: [
        "The only way to do great work is to love what you do.",
        "Innovation distinguishes between a leader and a follower.",
        "Stay hungry, stay foolish.",
        "Your time is limited, don't waste it living someone else's life.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "It does not matter how slowly you go as long as you do not stop.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "The only thing we have to fear is fear itself.",
        "In the middle of difficulty lies opportunity.",
        "Life is what happens when you're busy making other plans.",
        "The greatest glory in living lies not in never falling, but in rising every time we fall.",
        "The way to get started is to quit talking and begin doing.",
        "If life were predictable it would cease to be life, and be without flavor.",
        "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
        "The purpose of our lives is to be happy.",
        "Get busy living or get busy dying.",
        "You only live once, but if you do it right, once is enough.",
        "Many of life's failures are people who did not realize how close they were to success when they gave up.",
        "If you want to live a happy life, tie it to a goal, not to people or things.",
        "Never let the fear of striking out keep you from playing the game."
    ],
    
    code: [
        "const greeting = 'Hello, World!';",
        "function add(a, b) { return a + b; }",
        "const numbers = [1, 2, 3, 4, 5];",
        "if (condition) { doSomething(); }",
        "for (let i = 0; i < 10; i++) { console.log(i); }",
        "const user = { name: 'John', age: 30 };",
        "array.map(item => item * 2);",
        "async function fetchData() { const response = await fetch(url); }",
        "import React, { useState, useEffect } from 'react';",
        "export default function App() { return <div>Hello</div>; }",
        "const [count, setCount] = useState(0);",
        "useEffect(() => { document.title = 'New Title'; }, []);",
        "const handleClick = (event) => { event.preventDefault(); };",
        "try { await saveData(); } catch (error) { console.error(error); }",
        "const result = items.filter(item => item.active).map(item => item.name);",
        "class Component extends React.Component { render() { return null; } }",
        "const { name, age, ...rest } = person;",
        "const merged = { ...obj1, ...obj2 };",
        "const promise = new Promise((resolve, reject) => { resolve('done'); });",
        "document.querySelector('.button').addEventListener('click', handler);"
    ],
    
    english: [
        "the quick brown fox jumps over the lazy dog",
        "pack my box with five dozen liquor jugs",
        "how vexingly quick daft zebras jump",
        "the five boxing wizards jump quickly",
        "sphinx of black quartz judge my vow",
        "two driven jocks help fax my big quiz",
        "the job requires extra pluck and zeal from every young wage earner",
        "a mad boxer shot a quick gloved jab to the jaw of his dizzy opponent",
        "jackdaws love my big sphinx of quartz",
        "we promptly judged antique ivory buckles for the next prize"
    ],
    
    programming: [
        "variables constants functions methods classes objects arrays",
        "if else switch case break continue return throw try catch finally",
        "public private protected static final abstract interface implements extends",
        "async await promise callback event listener handler middleware",
        "component state props render lifecycle mount unmount update",
        "database query insert update delete select join where order group",
        "api endpoint request response header body status authentication",
        "git commit push pull merge branch checkout rebase stash",
        "npm install package dependencies devDependencies scripts build",
        "docker container image volume network compose kubernetes pod"
    ],
    
    linux: [
        "ls -la cd mkdir rm -rf cp mv chmod chown grep find",
        "sudo apt update && sudo apt upgrade -y",
        "cat file.txt | grep pattern | sort | uniq",
        "ps aux | grep process && kill -9 pid",
        "tar -xzvf archive.tar.gz -C /destination",
        "ssh user@host -p 22 -i ~/.ssh/id_rsa",
        "curl -X POST -H 'Content-Type: application/json' -d '{}'",
        "systemctl start service && systemctl enable service",
        "journalctl -u service -f --since today",
        "df -h && du -sh * && free -m"
    ],
    
    vim: [
        "i insert a append o open line below O open line above",
        "w word b back e end 0 start $ end gg top G bottom",
        "dd delete line yy yank line p paste P paste before",
        "u undo ctrl+r redo . repeat last command",
        ":w save :q quit :wq save and quit :q! force quit",
        "/search n next N previous * search word under cursor",
        "v visual V line visual ctrl+v block visual",
        "ci( change inside parentheses di{ delete inside braces",
        ":s/old/new/g substitute :% all lines",
        "zz center screen zt top zb bottom ctrl+d down ctrl+u up"
    ],
    
    typescript: [
        "interface User { id: number; name: string; email?: string; }",
        "type Status = 'pending' | 'active' | 'completed';",
        "function greet(name: string): string { return `Hello, ${name}`; }",
        "const numbers: number[] = [1, 2, 3, 4, 5];",
        "const user: User = { id: 1, name: 'John' };",
        "type Props = { children: React.ReactNode; onClick?: () => void; };",
        "const [state, setState] = useState<string>('');",
        "async function fetchUser(id: number): Promise<User> { }",
        "const result = data as unknown as TargetType;",
        "type Partial<T> = { [P in keyof T]?: T[P]; };"
    ],
    
    python: [
        "def hello_world(): print('Hello, World!')",
        "for i in range(10): print(i)",
        "if condition: do_something() else: do_other()",
        "with open('file.txt', 'r') as f: content = f.read()",
        "class MyClass: def __init__(self): self.value = 0",
        "import numpy as np import pandas as pd",
        "list_comp = [x * 2 for x in range(10) if x % 2 == 0]",
        "dict_comp = {k: v for k, v in items.items()}",
        "lambda x: x * 2",
        "try: risky_operation() except Exception as e: handle_error(e)"
    ]
};

// Get random text from category
function getRandomQuote(category) {
    const quotes = QUOTES[category];
    if (!quotes || quotes.length === 0) return null;
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// Get multiple random quotes for longer tests
function getRandomQuotes(category, count) {
    const quotes = QUOTES[category];
    if (!quotes || quotes.length === 0) return [];
    
    const shuffled = [...quotes].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Get all categories
function getCategories() {
    return Object.keys(QUOTES);
}

// Get category display name
function getCategoryName(category) {
    const names = {
        quotes: 'Quotes',
        code: 'JavaScript',
        english: 'English',
        programming: 'Programming Terms',
        linux: 'Linux Commands',
        vim: 'Vim Commands',
        typescript: 'TypeScript',
        python: 'Python'
    };
    return names[category] || category;
}
