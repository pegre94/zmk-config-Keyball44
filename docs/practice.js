// Keyball44 Typing Practice Mode
// Inspired by TypingClub - progressive learning with stats tracking

// Finger-to-key mapping for Keyball44 layout
// Fingers: 0=left pinky, 1=left ring, 2=left middle, 3=left index, 4=left thumb
//          5=right thumb, 6=right index, 7=right middle, 8=right ring, 9=right pinky
const FINGER_MAP = {
    // Left hand - top row
    'q': 0, 'w': 1, 'e': 2, 'r': 3, 't': 3,
    // Left hand - home row
    'a': 0, 's': 1, 'd': 2, 'f': 3, 'g': 3,
    // Left hand - bottom row
    'z': 0, 'x': 1, 'c': 2, 'v': 3, 'b': 3,
    // Right hand - top row
    'y': 6, 'u': 6, 'i': 7, 'o': 8, 'p': 9,
    // Right hand - home row
    'h': 6, 'j': 6, 'k': 7, 'l': 8, ';': 9, "'": 9,
    // Right hand - bottom row
    'n': 6, 'm': 6, ',': 7, '.': 8, '/': 9,
    // Space - thumbs
    ' ': 4
};

// Finger colors for visualization
const FINGER_COLORS = {
    0: '#ef4444', // Left pinky - red
    1: '#f97316', // Left ring - orange
    2: '#eab308', // Left middle - yellow
    3: '#22c55e', // Left index - green
    4: '#3b82f6', // Left thumb - blue
    5: '#3b82f6', // Right thumb - blue
    6: '#22c55e', // Right index - green
    7: '#eab308', // Right middle - yellow
    8: '#f97316', // Right ring - orange
    9: '#ef4444'  // Right pinky - red
};

// Finger names for tooltips
const FINGER_NAMES = {
    0: 'Left Pinky',
    1: 'Left Ring',
    2: 'Left Middle',
    3: 'Left Index',
    4: 'Left Thumb',
    5: 'Right Thumb',
    6: 'Right Index',
    7: 'Right Middle',
    8: 'Right Ring',
    9: 'Right Pinky'
};

// Generate CSS-based 3D hand HTML
function generateHandHTML(isLeft = true, highlightedFinger = null) {
    const handClass = isLeft ? 'hand-left' : 'hand-right';
    
    // Map finger IDs: for left hand 0-4 (pinky to thumb), for right hand 9-5 (pinky to thumb)
    // Finger classes: finger-5=pinky, finger-4=ring, finger-3=middle, finger-2=index, finger-1=thumb
    const fingerMapping = isLeft 
        ? { 0: 5, 1: 4, 2: 3, 3: 2, 4: 1 }  // Left: pinky=5, ring=4, middle=3, index=2, thumb=1
        : { 9: 5, 8: 4, 7: 3, 6: 2, 5: 1 }; // Right: pinky=5, ring=4, middle=3, index=2, thumb=1
    
    // Get which CSS finger class should be highlighted
    let highlightClass = '';
    let highlightColor = '';
    if (highlightedFinger !== null && fingerMapping[highlightedFinger] !== undefined) {
        highlightClass = `finger-${fingerMapping[highlightedFinger]}`;
        highlightColor = FINGER_COLORS[highlightedFinger];
    }
    
    return `
        <div class="css-hand-wrapper ${handClass}">
            <div class="css-hand" style="${highlightColor ? `--highlight-color: ${highlightColor}` : ''}">
                <div class="finger finger-1 ${highlightClass === 'finger-1' ? 'highlighted' : ''}">
                    <div class="proximal"><div class="phalanx-1"><div class="middle"><div class="phalanx-2"><div class="distal"></div></div></div></div></div>
                </div>
                <div class="finger finger-2 ${highlightClass === 'finger-2' ? 'highlighted' : ''}">
                    <div class="proximal"><div class="phalanx-1"><div class="middle"><div class="phalanx-2"><div class="distal"></div></div></div></div></div>
                </div>
                <div class="finger finger-3 ${highlightClass === 'finger-3' ? 'highlighted' : ''}">
                    <div class="proximal"><div class="phalanx-1"><div class="middle"><div class="phalanx-2"><div class="distal"></div></div></div></div></div>
                </div>
                <div class="finger finger-4 ${highlightClass === 'finger-4' ? 'highlighted' : ''}">
                    <div class="proximal"><div class="phalanx-1"><div class="middle"><div class="phalanx-2"><div class="distal"></div></div></div></div></div>
                </div>
                <div class="finger finger-5 ${highlightClass === 'finger-5' ? 'highlighted' : ''}">
                    <div class="proximal"><div class="phalanx-1"><div class="middle"><div class="phalanx-2"><div class="distal"></div></div></div></div></div>
                </div>
            </div>
        </div>
    `;
}

// Get finger for a character
function getFingerForChar(char) {
    const lowerChar = char.toLowerCase();
    return FINGER_MAP[lowerChar] !== undefined ? FINGER_MAP[lowerChar] : null;
}

// Check if character uses left hand
function isLeftHand(finger) {
    return finger !== null && finger >= 0 && finger <= 4;
}

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
    bestWPM: 0,
    // New: session history for charts
    sessionHistory: [], // [{date, wpm, accuracy, category, duration}]
    totalPracticeTime: 0, // in seconds
    averageWPM: 0,
    averageAccuracy: 0,
    // Error heatmap: track errors per expected character
    errorCounts: {}, // { 'a': 5, 'b': 2, ... }
    totalKeyPresses: {} // { 'a': 100, 'b': 50, ... } for calculating error rate
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

// Current practice mode: 'lessons', 'typing', or 'stats'
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
                <button class="practice-tab ${practiceMode === 'stats' ? 'active' : ''}" onclick="switchPracticeMode('stats')">
                    📊 Statistics
                </button>
            </div>
            
            ${practiceMode === 'lessons' ? renderLessonsContent() : practiceMode === 'typing' ? renderTypingTestContent(categories) : renderStatsContent()}
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

// Render statistics dashboard content
function renderStatsContent() {
    const history = userStats.sessionHistory || [];
    const totalTime = userStats.totalPracticeTime || 0;
    const avgWPM = userStats.averageWPM || 0;
    const avgAcc = userStats.averageAccuracy || 0;
    
    // Format total time
    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);
    const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    
    // Get recent sessions (last 10)
    const recentSessions = history.slice(-10).reverse();
    
    // Calculate improvement (compare last 5 to previous 5)
    let improvement = 0;
    if (history.length >= 10) {
        const recent5 = history.slice(-5);
        const prev5 = history.slice(-10, -5);
        const recentAvg = recent5.reduce((s, x) => s + x.wpm, 0) / 5;
        const prevAvg = prev5.reduce((s, x) => s + x.wpm, 0) / 5;
        improvement = Math.round(recentAvg - prevAvg);
    }
    
    // Build mini chart (last 15 sessions)
    const chartData = history.slice(-15);
    const maxWPM = Math.max(...chartData.map(s => s.wpm), 1);
    
    let html = `
        <div class="stats-dashboard">
            <h2>📊 Statistics Dashboard</h2>
            
            <!-- Overview Cards -->
            <div class="stats-overview">
                <div class="stats-card">
                    <div class="stats-card-value">${userStats.bestWPM || 0}</div>
                    <div class="stats-card-label">Best WPM</div>
                </div>
                <div class="stats-card">
                    <div class="stats-card-value">${avgWPM}</div>
                    <div class="stats-card-label">Average WPM</div>
                </div>
                <div class="stats-card">
                    <div class="stats-card-value">${avgAcc}%</div>
                    <div class="stats-card-label">Average Accuracy</div>
                </div>
                <div class="stats-card">
                    <div class="stats-card-value">${userStats.sessionsCount || 0}</div>
                    <div class="stats-card-label">Total Sessions</div>
                </div>
                <div class="stats-card">
                    <div class="stats-card-value">${timeStr}</div>
                    <div class="stats-card-label">Practice Time</div>
                </div>
                <div class="stats-card ${improvement >= 0 ? 'positive' : 'negative'}">
                    <div class="stats-card-value">${improvement >= 0 ? '+' : ''}${improvement}</div>
                    <div class="stats-card-label">WPM Trend</div>
                </div>
            </div>
            
            <!-- WPM Chart -->
            <div class="stats-chart-section">
                <h3>WPM Progress (Last 15 Sessions)</h3>
                <div class="stats-chart">
                    ${chartData.length > 0 ? `
                        <div class="chart-bars">
                            ${chartData.map((s, i) => `
                                <div class="chart-bar-container">
                                    <div class="chart-bar" style="height: ${(s.wpm / maxWPM) * 100}%" title="${s.wpm} WPM">
                                        <span class="chart-bar-value">${s.wpm}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="chart-baseline"></div>
                    ` : '<p class="no-data">No sessions yet. Start practicing!</p>'}
                </div>
            </div>
            
            <!-- Recent Sessions -->
            <div class="stats-history-section">
                <h3>Recent Sessions</h3>
                ${recentSessions.length > 0 ? `
                    <div class="stats-history">
                        <div class="history-header">
                            <span>Date</span>
                            <span>Category</span>
                            <span>WPM</span>
                            <span>Accuracy</span>
                            <span>Duration</span>
                        </div>
                        ${recentSessions.map(s => {
                            const date = new Date(s.date);
                            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                            const catName = typeof getCategoryName === 'function' ? getCategoryName(s.category) : s.category;
                            const durStr = s.duration >= 60 ? `${Math.floor(s.duration/60)}m ${s.duration%60}s` : `${s.duration}s`;
                            return `
                                <div class="history-row">
                                    <span>${dateStr} ${timeStr}</span>
                                    <span>${catName}</span>
                                    <span class="wpm-value">${s.wpm}</span>
                                    <span>${s.accuracy}%</span>
                                    <span>${durStr}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : '<p class="no-data">No sessions yet. Start practicing!</p>'}
            </div>
            
            <!-- Lessons Progress -->
            <div class="stats-lessons-section">
                <h3>Lessons Progress</h3>
                <div class="lessons-progress-bar">
                    <div class="progress-fill" style="width: ${(userStats.completedLessons?.length || 0) / (typeof getAllLessonIds === 'function' ? getAllLessonIds().length : 1) * 100}%"></div>
                </div>
                <p class="lessons-progress-text">
                    ${userStats.completedLessons?.length || 0} / ${typeof getAllLessonIds === 'function' ? getAllLessonIds().length : '?'} lessons completed
                </p>
            </div>
            
            <!-- Error Heatmap -->
            <div class="stats-heatmap-section">
                <h3>🔥 Error Heatmap</h3>
                <p class="heatmap-desc">Keys you make the most mistakes on. Red = more errors.</p>
                ${renderErrorHeatmap()}
                ${renderTopProblemKeys()}
            </div>
            
            <!-- Reset Button -->
            <div class="stats-actions">
                <button class="btn-reset-stats" onclick="confirmResetStats()">Reset All Statistics</button>
            </div>
        </div>
    `;
    
    return html;
}

// Render error heatmap on keyboard visualization
function renderErrorHeatmap() {
    const errorCounts = userStats.errorCounts || {};
    const totalPresses = userStats.totalKeyPresses || {};
    
    // Calculate max error rate for scaling
    let maxErrors = 0;
    Object.values(errorCounts).forEach(count => {
        if (count > maxErrors) maxErrors = count;
    });
    
    if (maxErrors === 0) {
        return '<p class="no-data">No error data yet. Start practicing to see your weak spots!</p>';
    }
    
    // QWERTY layout for heatmap
    const rows = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', "'"],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
        [' '] // Space bar
    ];
    
    let html = '<div class="heatmap-keyboard">';
    
    rows.forEach((row, rowIndex) => {
        html += `<div class="heatmap-row ${rowIndex === 3 ? 'space-row' : ''}">`;
        row.forEach(key => {
            const errors = errorCounts[key] || 0;
            const total = totalPresses[key] || 0;
            const intensity = maxErrors > 0 ? errors / maxErrors : 0;
            const errorRate = total > 0 ? Math.round((errors / total) * 100) : 0;
            
            // Color from green (0 errors) to red (max errors)
            const hue = 120 - (intensity * 120); // 120 = green, 0 = red
            const saturation = intensity > 0 ? 70 : 20;
            const lightness = intensity > 0 ? 45 : 25;
            
            const displayKey = key === ' ' ? 'SPACE' : key === "'" ? "'" : key.toUpperCase();
            const tooltip = `${displayKey}: ${errors} errors / ${total} presses (${errorRate}% error rate)`;
            
            html += `
                <div class="heatmap-key ${key === ' ' ? 'space-key' : ''}" 
                     style="background: hsl(${hue}, ${saturation}%, ${lightness}%)"
                     title="${tooltip}">
                    <span class="heatmap-key-label">${displayKey}</span>
                    ${errors > 0 ? `<span class="heatmap-key-errors">${errors}</span>` : ''}
                </div>
            `;
        });
        html += '</div>';
    });
    
    html += '</div>';
    return html;
}

// Render top problem keys list
function renderTopProblemKeys() {
    const problemKeys = getTopProblemKeys(5);
    
    if (problemKeys.length === 0) {
        return '';
    }
    
    let html = `
        <div class="problem-keys">
            <h4>Top Problem Keys</h4>
            <div class="problem-keys-list">
    `;
    
    problemKeys.forEach((keyData, index) => {
        const displayKey = keyData.key === ' ' ? 'SPACE' : keyData.key.toUpperCase();
        const errorRate = Math.round(keyData.rate * 100);
        
        html += `
            <div class="problem-key-item">
                <span class="problem-key-rank">#${index + 1}</span>
                <span class="problem-key-char">${displayKey}</span>
                <span class="problem-key-stats">${keyData.errors} errors (${errorRate}%)</span>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

// Confirm and reset stats
function confirmResetStats() {
    if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
        userStats = {
            completedLessons: [],
            lessonStars: {},
            totalWPM: 0,
            totalAccuracy: 0,
            sessionsCount: 0,
            bestWPM: 0,
            sessionHistory: [],
            totalPracticeTime: 0,
            averageWPM: 0,
            averageAccuracy: 0,
            errorCounts: {},
            totalKeyPresses: {}
        };
        saveStats();
        renderPracticeHome();
    }
}

// Track error for a specific key (for heatmap)
function trackKeyError(char) {
    userStats.errorCounts = userStats.errorCounts || {};
    const key = char.toLowerCase();
    userStats.errorCounts[key] = (userStats.errorCounts[key] || 0) + 1;
}

// Track key press for a specific key (for calculating error rate)
function trackKeyPress(char) {
    userStats.totalKeyPresses = userStats.totalKeyPresses || {};
    const key = char.toLowerCase();
    userStats.totalKeyPresses[key] = (userStats.totalKeyPresses[key] || 0) + 1;
    saveStats();
}

// Get error rate for a key (errors / total presses)
function getKeyErrorRate(char) {
    const key = char.toLowerCase();
    const errors = (userStats.errorCounts || {})[key] || 0;
    const total = (userStats.totalKeyPresses || {})[key] || 0;
    if (total === 0) return 0;
    return errors / total;
}

// Get top problem keys sorted by error rate
function getTopProblemKeys(limit = 10) {
    const errorCounts = userStats.errorCounts || {};
    const totalPresses = userStats.totalKeyPresses || {};
    
    const keys = Object.keys(errorCounts);
    const keyStats = keys.map(key => ({
        key,
        errors: errorCounts[key],
        total: totalPresses[key] || 0,
        rate: totalPresses[key] ? errorCounts[key] / totalPresses[key] : 0
    }));
    
    // Sort by error count (most errors first)
    keyStats.sort((a, b) => b.errors - a.errors);
    
    return keyStats.slice(0, limit);
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
    
    // Get next character for hand visualization
    const nextChar = pos < text.length ? text[pos] : null;
    
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
                Type the text above. The hands show which finger to use.
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Highlight the next key on the keyboard
    highlightNextKey(text[pos]);
    
    // Update hands beside keyboard
    updateHandsOnKeyboard(nextChar);
}

// Quit typing test
function quitTypingTest() {
    practiceState.active = false;
    removePracticeListeners();
    document.querySelectorAll('.key.hint').forEach(k => k.classList.remove('hint'));
    cleanupHandPanels();
    renderPracticeHome();
}

// Clean up hand panels and restore keyboard
function cleanupHandPanels() {
    document.querySelectorAll('.hand-panel').forEach(el => el.remove());
    const wrapper = document.querySelector('.keyboard-with-hands');
    if (wrapper) {
        const keyboard = wrapper.querySelector('.keyboard');
        if (keyboard) {
            wrapper.parentNode.insertBefore(keyboard, wrapper);
        }
        wrapper.remove();
    }
}

// Complete typing test
function completeTypingTest() {
    practiceState.active = false;
    removePracticeListeners();
    document.querySelectorAll('.key.hint').forEach(k => k.classList.remove('hint'));
    cleanupHandPanels();
    
    // Calculate final stats
    const elapsedMs = Date.now() - practiceState.startTime;
    const elapsedMin = elapsedMs / 1000 / 60;
    const elapsedSec = elapsedMs / 1000;
    const words = practiceState.correctChars / 5;
    const wpm = Math.round(words / elapsedMin);
    const accuracy = Math.round((practiceState.correctChars / practiceState.totalChars) * 100);
    
    // Update best WPM
    if (wpm > userStats.bestWPM) {
        userStats.bestWPM = wpm;
    }
    userStats.sessionsCount++;
    
    // Track session history
    userStats.sessionHistory = userStats.sessionHistory || [];
    userStats.sessionHistory.push({
        date: new Date().toISOString(),
        wpm: wpm,
        accuracy: accuracy,
        category: practiceState.category || 'typing',
        duration: Math.round(elapsedSec),
        type: 'typing'
    });
    
    // Keep only last 50 sessions
    if (userStats.sessionHistory.length > 50) {
        userStats.sessionHistory = userStats.sessionHistory.slice(-50);
    }
    
    // Update totals
    userStats.totalPracticeTime = (userStats.totalPracticeTime || 0) + Math.round(elapsedSec);
    updateAverages();
    
    saveStats();
    
    // Show results
    showTypingTestResults(wpm, accuracy);
}

// Update average WPM and accuracy from session history
function updateAverages() {
    if (!userStats.sessionHistory || userStats.sessionHistory.length === 0) {
        userStats.averageWPM = 0;
        userStats.averageAccuracy = 0;
        return;
    }
    
    const totalWPM = userStats.sessionHistory.reduce((sum, s) => sum + s.wpm, 0);
    const totalAcc = userStats.sessionHistory.reduce((sum, s) => sum + s.accuracy, 0);
    userStats.averageWPM = Math.round(totalWPM / userStats.sessionHistory.length);
    userStats.averageAccuracy = Math.round(totalAcc / userStats.sessionHistory.length);
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

// Generate hand visualization HTML for left hand (positioned beside keyboard)
function generateLeftHandHTML(nextChar) {
    const finger = getFingerForChar(nextChar);
    const leftHighlight = isLeftHand(finger) ? finger : null;
    const fingerName = leftHighlight !== null ? FINGER_NAMES[leftHighlight] : '';
    const fingerColor = leftHighlight !== null ? FINGER_COLORS[leftHighlight] : '#64748b';
    const isActive = leftHighlight !== null;
    
    return `
        <div class="hand-panel hand-panel-left">
            ${generateHandHTML(true, leftHighlight)}
            <div class="finger-indicator-small ${isActive ? 'active' : ''}" style="--finger-color: ${fingerColor}">
                <span class="finger-name">${isActive ? fingerName : '-'}</span>
            </div>
        </div>
    `;
}

// Generate hand visualization HTML for right hand (positioned beside keyboard)
function generateRightHandHTML(nextChar) {
    const finger = getFingerForChar(nextChar);
    const rightHighlight = !isLeftHand(finger) && finger !== null ? finger : null;
    const fingerName = rightHighlight !== null ? FINGER_NAMES[rightHighlight] : '';
    const fingerColor = rightHighlight !== null ? FINGER_COLORS[rightHighlight] : '#64748b';
    const isActive = rightHighlight !== null;
    
    return `
        <div class="hand-panel hand-panel-right">
            ${generateHandHTML(false, rightHighlight)}
            <div class="finger-indicator-small ${isActive ? 'active' : ''}" style="--finger-color: ${fingerColor}">
                <span class="finger-name">${isActive ? fingerName : '-'}</span>
            </div>
        </div>
    `;
}

// Update keyboard area with hands on sides
function updateHandsOnKeyboard(nextChar) {
    // Remove existing hand panels
    document.querySelectorAll('.hand-panel').forEach(el => el.remove());
    
    if (!nextChar) return;
    
    const keyboard = document.querySelector('.keyboard');
    if (!keyboard) return;
    
    // Create wrapper if it doesn't exist
    let wrapper = document.querySelector('.keyboard-with-hands');
    if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'keyboard-with-hands';
        keyboard.parentNode.insertBefore(wrapper, keyboard);
        wrapper.appendChild(keyboard);
    }
    
    // Add left hand
    const leftHandDiv = document.createElement('div');
    leftHandDiv.innerHTML = generateLeftHandHTML(nextChar);
    wrapper.insertBefore(leftHandDiv.firstElementChild, keyboard);
    
    // Add right hand
    const rightHandDiv = document.createElement('div');
    rightHandDiv.innerHTML = generateRightHandHTML(nextChar);
    wrapper.appendChild(rightHandDiv.firstElementChild);
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
    
    // Get next character for hand visualization
    const nextChar = pos < text.length ? text[pos] : null;
    
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
                Type the text above. The keyboard and hands show which key/finger to use.
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Highlight the next key on the keyboard
    highlightNextKey(text[pos]);
    
    // Update hands beside keyboard
    updateHandsOnKeyboard(nextChar);
}

// Highlight the next key to press on the keyboard display
function highlightNextKey(char) {
    // Remove previous hints and color coding
    document.querySelectorAll('.key.hint').forEach(k => {
        k.classList.remove('hint');
        k.style.removeProperty('--hint-color');
    });
    
    if (!char) return;
    
    // Find the key position for this character
    const upperChar = char.toUpperCase();
    let pos = CHAR_TO_POS[upperChar];
    
    if (pos !== undefined) {
        const keyEl = document.querySelector(`.key[data-pos="${pos}"]`);
        if (keyEl) {
            keyEl.classList.add('hint');
            
            // Apply finger color to the key
            const finger = getFingerForChar(char);
            if (finger !== null && FINGER_COLORS[finger]) {
                keyEl.style.setProperty('--hint-color', FINGER_COLORS[finger]);
            }
        }
    }
}

// Apply finger colors to all keyboard keys
function applyFingerColorsToKeyboard() {
    // Map of key positions to their finger (direct mapping for thumb keys)
    const posToFinger = {
        // Top row
        1: 0, 2: 1, 3: 2, 4: 3, 5: 3,      // Q W E R T (left hand)
        6: 6, 7: 6, 8: 7, 9: 8, 10: 9,     // Y U I O P (right hand)
        // Home row
        13: 0, 14: 1, 15: 2, 16: 3, 17: 3, // A S D F G (left hand)
        18: 6, 19: 6, 20: 7, 21: 8, 22: 9, // H J K L ' (right hand)
        // Bottom row
        25: 0, 26: 1, 27: 2, 28: 3, 29: 3, // Z X C V B (left hand)
        30: 6, 31: 6, 32: 7, 33: 8, 34: 9, // N M , . / (right hand)
        // Left thumb keys
        38: 4, 39: 4, 40: 4,
        // Right thumb keys
        41: 5, 42: 5, 43: 5
    };
    
    // First remove layout viewer colors
    document.querySelectorAll('.key.finger-colored').forEach(keyEl => {
        keyEl.classList.remove('finger-colored');
    });
    
    // Apply practice mode tinted colors
    document.querySelectorAll('.key[data-pos]').forEach(keyEl => {
        const pos = parseInt(keyEl.getAttribute('data-pos'));
        const finger = posToFinger[pos];
        if (finger !== undefined && FINGER_COLORS[finger]) {
            keyEl.style.setProperty('--finger-bg-color', FINGER_COLORS[finger]);
            keyEl.classList.add('finger-colored-practice');
        }
    });
}

// Remove finger colors from keyboard and restore layout viewer colors
function removeFingerColorsFromKeyboard() {
    document.querySelectorAll('.key.finger-colored-practice').forEach(keyEl => {
        keyEl.classList.remove('finger-colored-practice');
        // Restore full color for layout viewer
        keyEl.classList.add('finger-colored');
    });
}

// Setup practice-specific key listeners
function setupPracticeListeners() {
    document.addEventListener('keydown', handlePracticeKeyDown);
    applyFingerColorsToKeyboard();
}

// Remove practice listeners
function removePracticeListeners() {
    document.removeEventListener('keydown', handlePracticeKeyDown);
    removeFingerColorsFromKeyboard();
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
    
    // DEBUG: Log keystroke details
    console.log(`[DEBUG] pos=${pos}, expected="${expected}" (code ${expected.charCodeAt(0)}), typed="${typed}" (code ${typed.charCodeAt(0)}), key=${e.key}, code=${e.code}, shiftKey=${e.shiftKey}, ctrlKey=${e.ctrlKey}, altKey=${e.altKey}, metaKey=${e.metaKey}`);
    
    // Handle the keystroke
    const correct = typed === expected;
    
    if (!correct) {
        console.log(`[ERROR] Mismatch! Expected "${expected}" but got "${typed}"`);
    }
    
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
        
        // Track error for heatmap
        trackKeyError(expected);
        
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
    
    // Track total key presses for the expected character
    trackKeyPress(expected);
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
    cleanupHandPanels();
    
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
    cleanupHandPanels();
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
