// Grok Spirit - Popup Script
console.log('Grok Spirit popup script loaded');

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
    initializePopup();
});

function initializePopup() {
    // Get version from manifest
    const manifestData = chrome.runtime.getManifest();
    const version = manifestData.version || '1.0.4';

    // Update version display
    document.getElementById('version-number').textContent = version;

    // Initialize defense mode toggle
    // initializeDefenseModeToggle();

    // Initialize announcement visibility (always show)
    // initializeSmartContentDisplay(); // retired

    // Initialize overwrite toggle
    initializeForceOverwriteToggle();
}

function initializeSmartContentDisplay() {
    // no-op
}

function initializeDefenseModeToggle() {
    const defenseToggle = document.getElementById('defense-mode-toggle');

    // Load current state from storage
    chrome.storage.local.get('isFilenameDefenseEnabled', (data) => {
        defenseToggle.checked = !!data.isFilenameDefenseEnabled;
    });

    // Handle toggle changes
    defenseToggle.addEventListener('change', async () => {
        const isEnabled = defenseToggle.checked;

        try {
            // Save to storage
            await chrome.storage.local.set({ isFilenameDefenseEnabled: isEnabled });

            // Notify background script
            await chrome.runtime.sendMessage({
                action: 'setFilenameDefense',
                enabled: isEnabled
            });
        } catch (error) {
            console.error('[Popup] Failed to update defense mode:', error);
            // Revert checkbox state on error
            defenseToggle.checked = !isEnabled;
        }
    });
}

function initializeForceOverwriteToggle() {
    const toggle = document.getElementById('force-overwrite-toggle');
    if (!toggle) return;

    chrome.storage.local.get('forceOverwriteRecords', (data) => {
        toggle.checked = !!data.forceOverwriteRecords;
    });

    toggle.addEventListener('change', async () => {
        const enabled = toggle.checked;
        try {
            await chrome.storage.local.set({ forceOverwriteRecords: enabled });
        } catch (e) {
            console.error('[Popup] Failed to update forceOverwrite:', e);
            toggle.checked = !enabled;
        }
    });
}

// Listen for messages from content script (if needed in future)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Future message handling can be added here
});

// Error handling
window.addEventListener('error', (event) => {
    console.error('Popup script error:', event.error);
});
