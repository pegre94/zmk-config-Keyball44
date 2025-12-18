// Keyball44 Typing Practice Mode
// Inspired by TypingClub - progressive learning with stats tracking

// Practice state
let practiceState = {
    active: false,
    currentLesson: null,
    currentExercise: 0,
    currentText: '',
    currentPosition: 0,
    startTime: null,
    errors: 0,
    totalChars: 0,
    correctChars: 0,
    history: [] // Track each keystroke
};

// Stats tracking (persisted to localStorage)
let userStats = {
    completedLessons: [],
    lessonStars: {}, // lessonId -> stars (1-5)
    totalWPM: 0,
    totalAccuracy: 0,
    sessionsCount: 0,
    bestWPM: 0
};

// Load stats from localStorage
function loadStats() {
    const saved = localStorage.getItem('keyball44_typing_stats');
    if (saved) {
        userStats = JSON.parse(saved);
    }
}

// Save stats to localStorage
function saveStats() {
    localStorage.setItem('keyball44_typing_stats', JSON.stringify(userStats));
}

// Current practice mode: 'lessons' or 'typing'
let practiceMode = 'lessons';
let selectedCategory = 'quotes';

// Initialize practice mode
function initPractice() {
    loadStats();
    renderPracticeHome();
}

// Render practice home with mode tabs
function renderPracticeHome() {
    const container = document.getElementById('practice-container');
    if (!container) return;
    
    const categories = typeof getCategories === 'function' ? getCategories() : [];
    
    let html = `
        <div class="practice-home">
            <!-- Mode Tabs -->
            <div class="practice-tabs">
                <button class="practice-tab ${practiceMode === 'lessons' ? 'active' : ''}" onclick="switchPracticeMode('lessons')">
                    📚 Lessons
                </button>
                <button class="practice-tab ${practiceMode === 'typing' ? 'active' : ''}" onclick="switchPracticeMode('typing')">
                    ⌨️ Typing Test
                </button>
            </div>
            
            ${practiceMode === 'lessons' ? renderLessonsContent() : renderTypingTestContent(categories)}
        </div>
    `;
    
    container.innerHTML = html;
}

// Switch between lessons and typing test mode
function switchPracticeMode(mode) {
    practiceMode = mode;
    renderPracticeHome();
}

// Render lessons content
function renderLessonsContent() {
    const lessonIds = getAllLessonIds();
    
    let html = `
        <div class="lesson-list">
            <h2>Typing Lessons</h2>
            <p class="stats-summary">
                Completed: ${userStats.completedLessons.length}/${lessonIds.length} | 
                Best WPM: ${userStats.bestWPM} | 
                Sessions: ${userStats.sessionsCount}
            </p>
            <div class="lessons">
    `;
    
    lessonIds.forEach(id => {
        const lesson = getLesson(id);
        const stars = userStats.lessonStars[id] || 0;
        const completed = userStats.completedLessons.includes(id);
        const starDisplay = '★'.repeat(stars) + '☆'.repeat(5 - stars);
        
        html += `
            <div class="lesson-card ${completed ? 'completed' : ''}" onclick="startLesson(${id})">
                <div class="lesson-number">${id}</div>
                <div class="lesson-info">
                    <div class="lesson-name">${lesson.name}</div>
                    <div class="lesson-desc">${lesson.description}</div>
                    <div class="lesson-stars">${starDisplay}</div>
                </div>
                ${lesson.layer ? `<div class="lesson-layer">Layer: ${LAYERS[lesson.layer]?.name || lesson.layer}</div>` : ''}
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

// Render typing test content (MonkeyType style)
function renderTypingTestContent(categories) {
    let html = `
        <div class="typing-test">
            <h2>Typing Test</h2>
            <p class="typing-test-desc">Select a category and start typing!</p>
            
            <!-- Category Selector -->
            <div class="category-selector">
                ${categories.map(cat => `
                    <button class="category-btn ${selectedCategory === cat ? 'active' : ''}" 
                            onclick="selectCategory('${cat}')">
                        ${getCategoryName(cat)}
                    </button>
                `).join('')}
            </div>
            
            <!-- Start Button -->
            <div class="typing-test-start">
                <button class="btn-start-test" onclick="startTypingTest()">
                    Start Typing Test
                </button>
            </div>
            
            <!-- Recent Stats -->
            <div class="recent-stats">
                <div class="stat">
                    <span class="stat-value">${userStats.bestWPM}</span>
                    <span class="stat-label">Best WPM</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${userStats.sessionsCount}</span>
                    <span class="stat-label">Tests Taken</span>
                </div>
            </div>
        </div>
    `;
    
    return html;
}

// Select category
function selectCategory(category) {
    selectedCategory = category;
    renderPracticeHome();
}

// Start typing test with selected category
function startTypingTest() {
    const quotes = getRandomQuotes(selectedCategory, 3);
    const text = quotes.join(' ');
    
    practiceState = {
        active: true,
        currentLesson: { name: getCategoryName(selectedCategory), minWPM: 0, minAccuracy: 0 },
        lessonId: null,
        isTypingTest: true,
        category: selectedCategory,
        currentExercise: 0,
        currentText: text,
        currentPosition: 0,
        startTime: null,
        errors: 0,
        totalChars: 0,
        correctChars: 0,
        history: []
    };
    
    renderTypingTestUI();
    setupPracticeListeners();
}

// Render typing test UI (similar to practice UI but for typing test)
function renderTypingTestUI() {
    const container = document.getElementById('practice-container');
    if (!container) return;
    
    const text = practiceState.currentText;
    const pos = practiceState.currentPosition;
    
    // Build the text display with highlighting
    let textHtml = '';
    for (let i = 0; i < text.length; i++) {
        let charClass = '';
        if (i < pos) {
            charClass = practiceState.history[i]?.correct ? 'correct' : 'incorrect';
        } else if (i === pos) {
            charClass = 'current';
        }
        
        let char = text[i];
        if (char === ' ') char = '␣';
        
        textHtml += `<span class="char ${charClass}">${char}</span>`;
    }
    
    // Calculate current stats
    const elapsed = practiceState.startTime ? (Date.now() - practiceState.startTime) / 1000 / 60 : 0;
    const words = practiceState.correctChars / 5;
    const wpm = elapsed > 0 ? Math.round(words / elapsed) : 0;
    const accuracy = practiceState.totalChars > 0 ? Math.round((practiceState.correctChars / practiceState.totalChars) * 100) : 100;
    const progress = Math.round((pos / text.length) * 100);
    
    const html = `
        <div class="typing-test-ui">
            <div class="practice-header">
                <h2>${getCategoryName(practiceState.category)}</h2>
                <div class="practice-progress">
                    ${progress}% complete
                </div>
                <button class="btn-quit" onclick="quitTypingTest()">✕</button>
            </div>
            
            <div class="practice-stats">
                <div class="stat">
                    <span class="stat-value">${wpm}</span>
                    <span class="stat-label">WPM</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${accuracy}%</span>
                    <span class="stat-label">Accuracy</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${practiceState.errors}</span>
                    <span class="stat-label">Errors</span>
                </div>
            </div>
            
            <div class="practice-text typing-test-text">
                ${textHtml}
            </div>
            
            <div class="keyboard-hint">
                Type the text above. Press any key to start.
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Highlight the next key on the keyboard
    highlightNextKey(text[pos]);
}

// Quit typing test
function quitTypingTest() {
    practiceState.active = false;
    removePracticeListeners();
    document.querySelectorAll('.key.hint').forEach(k => k.classList.remove('hint'));
    renderPracticeHome();
}

// Complete typing test
function completeTypingTest() {
    practiceState.active = false;
    removePracticeListeners();
    document.querySelectorAll('.key.hint').forEach(k => k.classList.remove('hint'));
    
    // Calculate final stats
    const elapsed = (Date.now() - practiceState.startTime) / 1000 / 60;
    const words = practiceState.correctChars / 5;
    const wpm = Math.round(words / elapsed);
    const accuracy = Math.round((practiceState.correctChars / practiceState.totalChars) * 100);
    
    // Update best WPM
    if (wpm > userStats.bestWPM) {
        userStats.bestWPM = wpm;
    }
    userStats.sessionsCount++;
    saveStats();
    
    // Show results
    showTypingTestResults(wpm, accuracy);
}

// Show typing test results
function showTypingTestResults(wpm, accuracy) {
    const container = document.getElementById('practice-container');
    
    const html = `
        <div class="completion-screen">
            <h2>Test Complete!</h2>
            <div class="completion-lesson">${getCategoryName(practiceState.category)}</div>
            
            <div class="completion-stats">
                <div class="stat-big">
                    <span class="stat-value">${wpm}</span>
                    <span class="stat-label">WPM</span>
                </div>
                <div class="stat-big">
                    <span class="stat-value">${accuracy}%</span>
                    <span class="stat-label">Accuracy</span>
                </div>
            </div>
            
            <div class="completion-message">
                ${wpm >= 60 ? '🚀 Excellent speed!' : wpm >= 40 ? '👍 Good job!' : '💪 Keep practicing!'}
            </div>
            
            <div class="completion-buttons">
                <button class="btn-retry" onclick="startTypingTest()">Try Again</button>
                <button class="btn-back" onclick="renderPracticeHome()">Back</button>
            </div>
            
            <div class="completion-hint">Press <strong>Enter</strong> to try again</div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Add Enter key listener
    document.addEventListener('keydown', handleTypingTestResultKeyDown);
}

// Handle keydown on typing test results
function handleTypingTestResultKeyDown(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.removeEventListener('keydown', handleTypingTestResultKeyDown);
        startTypingTest();
    } else if (e.key === 'Escape') {
        e.preventDefault();
        document.removeEventListener('keydown', handleTypingTestResultKeyDown);
        renderPracticeHome();
    }
}

// Render the lesson selection list (legacy, now uses renderPracticeHome)
function renderLessonList() {
    practiceMode = 'lessons';
    renderPracticeHome();
}

// Start a lesson
function startLesson(lessonId) {
    const lesson = getLesson(lessonId);
    if (!lesson) return;
    
    // If it's a theory lesson, just show info
    if (lesson.isTheory) {
        showTheoryLesson(lesson);
        return;
    }
    
    practiceState = {
        active: true,
        currentLesson: lesson,
        lessonId: lessonId,
        currentExercise: 0,
        currentText: lesson.exercises[0],
        currentPosition: 0,
        startTime: null,
        errors: 0,
        totalChars: 0,
        correctChars: 0,
        history: []
    };
    
    // Switch to the appropriate layer if specified
    if (lesson.layer !== undefined) {
        switchToLayer(lesson.layer);
    } else {
        switchToLayer(0);
    }
    
    renderPracticeUI();
    setupPracticeListeners();
}

// Show theory lesson (no typing required)
function showTheoryLesson(lesson) {
    const container = document.getElementById('practice-container');
    
    let html = `
        <div class="theory-lesson">
            <h2>${lesson.name}</h2>
            <p>${lesson.description}</p>
            <div class="theory-content">
                <ul>
                    ${lesson.exercises.map(ex => `<li>${ex}</li>`).join('')}
                </ul>
            </div>
            <button class="btn-back" onclick="renderLessonList()">Back to Lessons</button>
        </div>
    `;
    
    container.innerHTML = html;
}

// Render the practice UI
function renderPracticeUI() {
    const container = document.getElementById('practice-container');
    if (!container) return;
    
    const lesson = practiceState.currentLesson;
    const text = practiceState.currentText;
    const pos = practiceState.currentPosition;
    
    // Build the text display with highlighting
    let textHtml = '';
    for (let i = 0; i < text.length; i++) {
        let charClass = '';
        if (i < pos) {
            charClass = practiceState.history[i]?.correct ? 'correct' : 'incorrect';
        } else if (i === pos) {
            charClass = 'current';
        }
        
        let char = text[i];
        if (char === ' ') char = '␣';
        
        textHtml += `<span class="char ${charClass}">${char}</span>`;
    }
    
    // Calculate current stats
    const elapsed = practiceState.startTime ? (Date.now() - practiceState.startTime) / 1000 / 60 : 0;
    const words = practiceState.correctChars / 5;
    const wpm = elapsed > 0 ? Math.round(words / elapsed) : 0;
    const accuracy = practiceState.totalChars > 0 ? Math.round((practiceState.correctChars / practiceState.totalChars) * 100) : 100;
    
    const html = `
        <div class="practice-ui">
            <div class="practice-header">
                <h2>${lesson.name}</h2>
                <div class="practice-progress">
                    Exercise ${practiceState.currentExercise + 1} of ${lesson.exercises.length}
                </div>
                <button class="btn-quit" onclick="quitPractice()">✕</button>
            </div>
            
            <div class="practice-stats">
                <div class="stat">
                    <span class="stat-value">${wpm}</span>
                    <span class="stat-label">WPM</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${accuracy}%</span>
                    <span class="stat-label">Accuracy</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${practiceState.errors}</span>
                    <span class="stat-label">Errors</span>
                </div>
            </div>
            
            <div class="practice-text">
                ${textHtml}
            </div>
            
            <div class="practice-hint">
                ${pos < text.length ? `Next key: <strong>${text[pos] === ' ' ? 'Space' : text[pos]}</strong>` : 'Complete!'}
            </div>
            
            <div class="keyboard-hint">
                Type the text above. The keyboard below shows which key to press.
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Highlight the next key on the keyboard
    highlightNextKey(text[pos]);
}

// Highlight the next key to press on the keyboard display
function highlightNextKey(char) {
    // Remove previous hints
    document.querySelectorAll('.key.hint').forEach(k => k.classList.remove('hint'));
    
    if (!char) return;
    
    // Find the key position for this character
    const upperChar = char.toUpperCase();
    let pos = CHAR_TO_POS[upperChar];
    
    if (pos !== undefined) {
        const keyEl = document.querySelector(`.key[data-pos="${pos}"]`);
        if (keyEl) {
            keyEl.classList.add('hint');
        }
    }
}

// Setup practice-specific key listeners
function setupPracticeListeners() {
    document.addEventListener('keydown', handlePracticeKeyDown);
}

// Remove practice listeners
function removePracticeListeners() {
    document.removeEventListener('keydown', handlePracticeKeyDown);
}

// Handle keydown during practice
function handlePracticeKeyDown(e) {
    if (!practiceState.active) return;
    
    // Ignore modifier keys (home row mods send these)
    const ignoredKeys = ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape', 
                         'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20'];
    if (ignoredKeys.includes(e.key)) {
        return;
    }
    
    e.preventDefault();
    
    const text = practiceState.currentText;
    const pos = practiceState.currentPosition;
    
    // Ignore if already complete
    if (pos >= text.length) return;
    
    // Start timer on first keypress
    if (!practiceState.startTime) {
        practiceState.startTime = Date.now();
    }
    
    const expected = text[pos];
    const typed = e.key;
    
    // Handle the keystroke
    const correct = typed === expected;
    
    practiceState.history.push({
        expected,
        typed,
        correct,
        time: Date.now()
    });
    
    practiceState.totalChars++;
    
    if (correct) {
        practiceState.correctChars++;
        practiceState.currentPosition++;
        
        // Check if exercise is complete
        if (practiceState.currentPosition >= text.length) {
            if (practiceState.isTypingTest) {
                completeTypingTest();
            } else {
                completeExercise();
            }
        } else {
            if (practiceState.isTypingTest) {
                renderTypingTestUI();
            } else {
                renderPracticeUI();
            }
        }
    } else {
        practiceState.errors++;
        if (practiceState.isTypingTest) {
            renderTypingTestUI();
        } else {
            renderPracticeUI();
        }
        
        // Visual feedback for error
        const container = document.getElementById('practice-container');
        container.classList.add('error-shake');
        setTimeout(() => container.classList.remove('error-shake'), 200);
    }
}

// Complete current exercise
function completeExercise() {
    const lesson = practiceState.currentLesson;
    
    // Move to next exercise or complete lesson
    if (practiceState.currentExercise < lesson.exercises.length - 1) {
        practiceState.currentExercise++;
        practiceState.currentText = lesson.exercises[practiceState.currentExercise];
        practiceState.currentPosition = 0;
        renderPracticeUI();
    } else {
        completeLesson();
    }
}

// Complete the lesson
function completeLesson() {
    practiceState.active = false;
    removePracticeListeners();
    
    // Calculate final stats
    const elapsed = (Date.now() - practiceState.startTime) / 1000 / 60;
    const words = practiceState.correctChars / 5;
    const wpm = Math.round(words / elapsed);
    const accuracy = Math.round((practiceState.correctChars / practiceState.totalChars) * 100);
    
    // Calculate stars (1-5)
    let stars = 1;
    const lesson = practiceState.currentLesson;
    
    if (accuracy >= lesson.minAccuracy && wpm >= lesson.minWPM) stars = 2;
    if (accuracy >= lesson.minAccuracy + 5 && wpm >= lesson.minWPM + 5) stars = 3;
    if (accuracy >= 95 && wpm >= lesson.minWPM + 10) stars = 4;
    if (accuracy >= 98 && wpm >= lesson.minWPM + 15) stars = 5;
    
    // Update user stats
    const lessonId = practiceState.lessonId;
    if (!userStats.completedLessons.includes(lessonId)) {
        userStats.completedLessons.push(lessonId);
    }
    
    if (!userStats.lessonStars[lessonId] || stars > userStats.lessonStars[lessonId]) {
        userStats.lessonStars[lessonId] = stars;
    }
    
    if (wpm > userStats.bestWPM) {
        userStats.bestWPM = wpm;
    }
    
    userStats.sessionsCount++;
    saveStats();
    
    // Show completion screen
    showCompletionScreen(wpm, accuracy, stars);
}

// Show lesson completion screen
function showCompletionScreen(wpm, accuracy, stars) {
    const container = document.getElementById('practice-container');
    const lesson = practiceState.currentLesson;
    const starDisplay = '★'.repeat(stars) + '☆'.repeat(5 - stars);
    
    const html = `
        <div class="completion-screen">
            <h2>Lesson Complete!</h2>
            <div class="completion-lesson">${lesson.name}</div>
            
            <div class="completion-stars">${starDisplay}</div>
            
            <div class="completion-stats">
                <div class="stat-big">
                    <span class="stat-value">${wpm}</span>
                    <span class="stat-label">WPM</span>
                </div>
                <div class="stat-big">
                    <span class="stat-value">${accuracy}%</span>
                    <span class="stat-label">Accuracy</span>
                </div>
            </div>
            
            <div class="completion-message">
                ${stars >= 3 ? '🎉 Great job!' : stars >= 2 ? '👍 Good work! Keep practicing!' : '💪 Keep trying to improve!'}
            </div>
            
            <div class="completion-buttons">
                <button class="btn-retry" onclick="startLesson(${practiceState.lessonId})">Try Again</button>
                <button class="btn-next" onclick="startNextLesson()">Next Lesson</button>
                <button class="btn-back" onclick="renderLessonList()">Back to Lessons</button>
            </div>
            
            <div class="completion-hint">Press <strong>Enter</strong> for next lesson</div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Add Enter key listener for next lesson
    document.addEventListener('keydown', handleCompletionKeyDown);
}

// Handle keydown on completion screen
function handleCompletionKeyDown(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.removeEventListener('keydown', handleCompletionKeyDown);
        startNextLesson();
    } else if (e.key === 'Escape') {
        e.preventDefault();
        document.removeEventListener('keydown', handleCompletionKeyDown);
        renderLessonList();
    }
}

// Start the next lesson
function startNextLesson() {
    const nextId = practiceState.lessonId + 1;
    if (getLesson(nextId)) {
        startLesson(nextId);
    } else {
        renderLessonList();
    }
}

// Quit practice mode
function quitPractice() {
    practiceState.active = false;
    removePracticeListeners();
    switchToLayer(0);
    renderLessonList();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Only init if practice container exists
    if (document.getElementById('practice-container')) {
        initPractice();
    }
});
