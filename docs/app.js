// Keyball44 Typing Trainer - Main Application

let currentLayer = 0;
let heldModifiers = new Set(); // Track held modifier keys
let pressedPositions = new Map(); // Map keyId -> position for proper release
let layerTimeout = null; // Timer to return to BASE after inactivity

// Map typed characters to key positions (using actual character output)
const CHAR_TO_POS = {
    // Top row
    'q': 1, 'w': 2, 'e': 3, 'r': 4, 't': 5,
    'y': 6, 'u': 7, 'i': 8, 'o': 9, 'p': 10,
    'Q': 1, 'W': 2, 'E': 3, 'R': 4, 'T': 5,
    'Y': 6, 'U': 7, 'I': 8, 'O': 9, 'P': 10,
    // Home row
    'a': 13, 's': 14, 'd': 15, 'f': 16, 'g': 17,
    'h': 18, 'j': 19, 'k': 20, 'l': 21, "'": 22,
    'A': 13, 'S': 14, 'D': 15, 'F': 16, 'G': 17,
    'H': 18, 'J': 19, 'K': 20, 'L': 21, '"': 22,
    // Bottom row
    'z': 25, 'x': 26, 'c': 27, 'v': 28, 'b': 29,
    'n': 30, 'm': 31, ',': 32, '.': 33, '/': 34,
    'Z': 25, 'X': 26, 'C': 27, 'V': 28, 'B': 29,
    'N': 30, 'M': 31, '<': 32, '>': 33, '?': 34
};

// Map keyboard event codes to key positions (for special keys)
const KEY_CODE_TO_POS = {
    // Thumb keys only (special keys that don't produce characters)
    'Escape': 38, 'Space': 39, 'Tab': 40,
    'Enter': 41, 'Backspace': 42, 'Delete': 43
};

// Map modifier keys to positions (for visual feedback)
const MODIFIER_TO_POS = {
    'MetaLeft': 13,   // GUI on A
    'AltLeft': 14,    // ALT on S
    'ControlLeft': 15, // CTRL on D
    'ShiftLeft': 16,  // SHIFT on F
    'ShiftRight': 19, // SHIFT on J
    'ControlRight': 20, // CTRL on K
    'AltRight': 21,   // ALT on L
    'MetaRight': 22   // GUI on '
};

// Layer activation keys (thumb cluster) - for tap detection
const LAYER_KEYS = {
    'Escape': { pos: 38, layer: 3 },   // MEDIA
    'Space': { pos: 39, layer: 1 },    // NAV
    'Tab': { pos: 40, layer: 2 },      // MOUSE
    'Enter': { pos: 41, layer: 5 },    // SYM
    'Backspace': { pos: 42, layer: 4 }, // NUM
    'Delete': { pos: 43, layer: 6 }    // FUN
};

// Layer signal keys (F13, F16-F20 sent by ZMK macros when layer is held)
// Avoiding F14/F15 (macOS brightness) and F21-F24 (not working)
const LAYER_SIGNAL_KEYS = {
    'F13': 1,  // NAV
    'F16': 3,  // MEDIA
    'F17': 2,  // MOUSE
    'F18': 5,  // SYM
    'F19': 4,  // NUM
    'F20': 6   // FUN
};

// Keys that indicate a specific layer is active (fallback detection)
// NAV layer keys
const NAV_LAYER_KEYS = ['ArrowLeft', 'ArrowDown', 'ArrowUp', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown', 'Insert', 'CapsLock'];
// NUM layer keys (when digits come with specific codes)
const NUM_LAYER_CODES = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0'];
// Function keys indicate FUN layer
const FUN_LAYER_KEYS = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
// Media keys indicate MEDIA layer
const MEDIA_LAYER_KEYS = ['MediaPlayPause', 'MediaTrackNext', 'MediaTrackPrevious', 'AudioVolumeUp', 'AudioVolumeDown', 'AudioVolumeMute'];

// Layer-specific key to position mapping (for highlighting keys on non-BASE layers)
const LAYER_KEY_TO_POS = {
    // NAV layer (positions from layers.js)
    'ArrowLeft': 19,   // ←
    'ArrowDown': 20,   // ↓
    'ArrowUp': 21,     // ↑
    'ArrowRight': 22,  // →
    'Home': 31,
    'End': 34,
    'PageDown': 32,
    'PageUp': 33,
    'Insert': 30,
    'CapsLock': 18
};

// Initialize the keyboard display
function init() {
    renderLayer(currentLayer);
    setupLayerButtons();
    setupKeyboardListeners();
}

// Render a specific layer
function renderLayer(layerIndex) {
    const layer = LAYERS[layerIndex];
    if (!layer) return;

    const keys = document.querySelectorAll('.key[data-pos]');
    
    keys.forEach(keyEl => {
        const pos = parseInt(keyEl.dataset.pos);
        const keyData = layer.keys[pos];
        
        if (keyData) {
            // Clear existing content
            keyEl.innerHTML = '';
            
            // Add tap label
            if (keyData.tap) {
                const tapSpan = document.createElement('span');
                tapSpan.className = 'tap';
                tapSpan.textContent = keyData.tap;
                keyEl.appendChild(tapSpan);
            }
            
            // Add hold label
            if (keyData.hold) {
                const holdSpan = document.createElement('span');
                holdSpan.className = 'hold';
                holdSpan.textContent = keyData.hold;
                keyEl.appendChild(holdSpan);
            }
            
            // Mark empty keys
            if (!keyData.tap && !keyData.hold) {
                keyEl.classList.add('none');
            } else {
                keyEl.classList.remove('none');
            }
            
            // Mark held keys (layer activators)
            if (keyData.tap === '▓') {
                keyEl.classList.add('held');
            } else {
                keyEl.classList.remove('held');
            }
        }
    });
}

// Setup layer button click handlers
function setupLayerButtons() {
    const buttons = document.querySelectorAll('.layer-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Switch layer
            currentLayer = parseInt(btn.dataset.layer);
            renderLayer(currentLayer);
        });
    });
}

// Highlight a specific key
function highlightKey(pos) {
    const keys = document.querySelectorAll('.key[data-pos]');
    keys.forEach(k => k.classList.remove('highlight'));
    
    const key = document.querySelector(`.key[data-pos="${pos}"]`);
    if (key) {
        key.classList.add('highlight');
    }
}

// Clear all highlights
function clearHighlights() {
    const keys = document.querySelectorAll('.key[data-pos]');
    keys.forEach(k => k.classList.remove('highlight', 'pressed'));
}

// Press animation for a key
function pressKey(pos) {
    const key = document.querySelector(`.key[data-pos="${pos}"]`);
    if (key) {
        key.classList.add('pressed');
        setTimeout(() => key.classList.remove('pressed'), 150);
    }
}

// Setup keyboard event listeners
function setupKeyboardListeners() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

// Raw keydown handler - log everything before any filtering
document.addEventListener('keydown', (e) => {
    console.log('RAW KEYDOWN:', e.code, e.key, 'repeat:', e.repeat);
}, true);

// Raw keyup handler
document.addEventListener('keyup', (e) => {
    console.log('RAW KEYUP:', e.code, e.key);
}, true);

// Handle key press
function handleKeyDown(e) {
    // Ignore key repeat events (crucial for Keyball44 performance)
    if (e.repeat) return;
    
    e.preventDefault(); // Prevent default browser behavior
    
    const code = e.code;
    const key = e.key;
    
    // Skip if this exact code is already pressed
    if (pressedPositions.has(code)) return;
    
    // Log full event details to find useful properties
    console.log('FULL EVENT:', {
        code: e.code,
        key: e.key,
        keyCode: e.keyCode,
        which: e.which,
        location: e.location,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
        repeat: e.repeat,
        isComposing: e.isComposing
    });
    
    let pos = null;
    let detectedLayer = null;
    
    // PRIORITY: Check for layer signal keys (F13-F18 from ZMK macros)
    let isLayerSignal = false;
    if (LAYER_SIGNAL_KEYS[key]) {
        detectedLayer = LAYER_SIGNAL_KEYS[key];
        isLayerSignal = true;
        console.log('>>> LAYER SIGNAL detected:', key, '-> layer', detectedLayer);
    }
    // Fallback: Detect layer based on key type (for when ZMK sends layer-specific keys)
    // Check for arrow keys (NAV layer) - multiple possible formats
    else if (NAV_LAYER_KEYS.includes(key) || NAV_LAYER_KEYS.includes(code) ||
        key === 'Left' || key === 'Right' || key === 'Up' || key === 'Down') {
        detectedLayer = 1; // NAV
        console.log('>>> Detected NAV layer from key:', key, code);
    } else if (FUN_LAYER_KEYS.includes(key) || FUN_LAYER_KEYS.includes(code)) {
        detectedLayer = 6; // FUN
        console.log('>>> Detected FUN layer from key:', key, code);
    } else if (MEDIA_LAYER_KEYS.includes(key) || MEDIA_LAYER_KEYS.includes(code)) {
        detectedLayer = 3; // MEDIA
        console.log('>>> Detected MEDIA layer from key:', key, code);
    }
    
    console.log('detectedLayer:', detectedLayer, 'currentLayer:', currentLayer);
    
    // Switch to detected layer if different from current
    if (detectedLayer !== null && detectedLayer !== currentLayer) {
        console.log('>>> SWITCHING to layer:', detectedLayer);
        cancelLayerTimeout();
        switchToLayer(detectedLayer);
        // Only start timeout for fallback detection (arrows, F-keys, etc.)
        // Layer signal keys (F13-F18) will use keyup to return to BASE
        if (!isLayerSignal) {
            startLayerTimeout();
        }
    } else if (detectedLayer !== null) {
        // Same layer - just cancel timeout, don't restart
        // F13 keyup will handle return to BASE
        cancelLayerTimeout();
    }
    
    // If we're on a non-BASE layer and receive a BASE layer key (letter/space/etc),
    // it means the user released the layer key on Keyball44 - return to BASE immediately
    if (currentLayer !== 0 && detectedLayer === null && (CHAR_TO_POS[key] || LAYER_KEYS[code])) {
        console.log('>>> BASE key detected while on layer, returning to BASE');
        cancelLayerTimeout();
        switchToLayer(0);
    }
    
    // Check layer-specific keys first (arrows, home/end, etc.) - highlight on current layer
    if (LAYER_KEY_TO_POS[key]) {
        pos = LAYER_KEY_TO_POS[key];
        console.log('Layer-specific key:', key, '-> pos', pos);
    }
    // Check layer activation keys (thumb cluster: Space, Tab, Enter, etc.)
    // Short tap = character output, stay on BASE
    // Long hold = layer activated (detected via layer-specific keys above)
    else if (LAYER_KEYS[code]) {
        pos = LAYER_KEYS[code].pos;
        console.log('LAYER key tap (short):', code, '- staying on BASE');
        // Don't switch layer on tap - that's the character output
        // Layer switch happens when we detect layer-specific keys (arrows, F-keys, etc.)
    }
    // Check character-based mapping (for letter keys including home row)
    else if (CHAR_TO_POS[key]) {
        pos = CHAR_TO_POS[key];
    }
    // Check if it's a modifier key
    else if (MODIFIER_TO_POS[code]) {
        pos = MODIFIER_TO_POS[code];
        heldModifiers.add(code);
    }
    // Fallback to code-based mapping for special keys
    else if (KEY_CODE_TO_POS[code]) {
        pos = KEY_CODE_TO_POS[code];
    }
    
    if (pos !== null) {
        pressedPositions.set(code, pos);
        showKeyPressed(pos);
    }
}

// Handle key release
function handleKeyUp(e) {
    const code = e.code;
    const key = e.key;
    
    console.log('UP:', code, key);
    
    // Get the position we highlighted for this key and release it
    if (pressedPositions.has(code)) {
        const pos = pressedPositions.get(code);
        showKeyReleased(pos);
        pressedPositions.delete(code);
    }
    
    // Clean up modifier tracking
    if (MODIFIER_TO_POS[code]) {
        heldModifiers.delete(code);
    }
    
    // Layer signal key released (F13-F18) - return to BASE
    if (LAYER_SIGNAL_KEYS[key]) {
        console.log('>>> LAYER SIGNAL released:', key, '- returning to BASE');
        switchToLayer(0);
    }
    
    // For layer keys released, no special action needed
    if (LAYER_KEYS[code]) {
        console.log('LAYER key released:', code);
    }
}

// Start timeout to return to BASE layer after inactivity
function startLayerTimeout() {
    // Clear any existing timeout
    if (layerTimeout) {
        clearTimeout(layerTimeout);
    }
    // Return to BASE after 500ms of no layer-specific keys
    layerTimeout = setTimeout(() => {
        if (currentLayer !== 0) {
            console.log('Timeout: returning to BASE');
            switchToLayer(0);
        }
    }, 500);
}

// Cancel the layer timeout (called when layer-specific key is pressed)
function cancelLayerTimeout() {
    if (layerTimeout) {
        clearTimeout(layerTimeout);
        layerTimeout = null;
    }
}

// Show key as pressed (visual feedback)
function showKeyPressed(pos) {
    const keyEl = document.querySelector(`.key[data-pos="${pos}"]`);
    if (keyEl) {
        keyEl.classList.add('active-press');
        // Store timestamp for minimum display time
        keyEl.dataset.pressTime = Date.now();
    }
}

// Show key as released (with minimum display time of 100ms)
function showKeyReleased(pos) {
    const keyEl = document.querySelector(`.key[data-pos="${pos}"]`);
    if (keyEl) {
        const pressTime = parseInt(keyEl.dataset.pressTime) || 0;
        const elapsed = Date.now() - pressTime;
        const minDisplayTime = 100; // milliseconds
        
        if (elapsed < minDisplayTime) {
            // Delay release to ensure visual feedback is visible
            setTimeout(() => {
                keyEl.classList.remove('active-press');
            }, minDisplayTime - elapsed);
        } else {
            keyEl.classList.remove('active-press');
        }
    }
}

// Switch to a layer and update UI
function switchToLayer(layerIndex) {
    currentLayer = layerIndex;
    renderLayer(layerIndex);
    
    // Update layer buttons - highlight the active one
    const buttons = document.querySelectorAll('.layer-btn');
    buttons.forEach(btn => {
        const isActive = parseInt(btn.dataset.layer) === layerIndex;
        btn.classList.toggle('active', isActive);
        btn.classList.toggle('layer-active-glow', isActive && layerIndex !== 0);
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
