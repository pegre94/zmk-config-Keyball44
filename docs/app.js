// Keyball44 Typing Trainer - Main Application

let currentLayer = 0;

// Initialize the keyboard display
function init() {
    renderLayer(currentLayer);
    setupLayerButtons();
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
