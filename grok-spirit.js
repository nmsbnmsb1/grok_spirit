(function () {

    const CSS = `
        .gs-status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            margin-right: 8px;
            flex-shrink: 0;
        }

        .gs-status-processing {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }

        .gs-status-failed {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .gs-status-completed {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .gs-status-generating-hd {
            background-color: #007bff;
            color: #fff;
            border: 1px solid #0056b3;
            animation: gs-pulse-animation 1.5s infinite;
        }

        @keyframes gs-pulse-animation {
            0% {
                box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.4);
            }

            70% {
                box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
            }

            100% {
                box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
            }
        }

        .gs-btn {
            padding: 4px 8px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
        }

        .gs-btn:hover {
            opacity: 0.8;
            border-color: #007bff;
        }

        .gs-btn-clipboard {
            background: #007bff;
            color: #fff;
            border-color: #007bff;
        }

        .gs-btn-clipboard:hover {
            background: #0069d9;
            border-color: #0056b3;
        }

        .gs-btn-spicy {
            background: #f8a488;
            color: #fff;
            border-color: #e76f51;
        }

        .gs-btn-spicy:hover {
            background: #f4a261;
            border-color: #f4a261;
        }

        .gs-btn-spicy.gs-active {
            background: #d04a27;
            border-color: #d04a27;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .gs-btn-download {
            background: #6f42c1;
            color: #fff;
            border-color: #6f42c1;
        }

        .gs-btn-download:hover {
            background: #5a32a3;
            border-color: #4c2d85;
        }

        @media (prefers-color-scheme: dark) {
            #gs-result-panel {
                background: #2d2d2d !important;
                border-color: #444 !important;
                color: #f1f1f1 !important;
            }

            .gs-btn {
                background: #3c3c3c;
                color: #f1f1f1;
                border-color: #555;
            }

            .gs-btn:hover {
                background: #555;
                border-color: #777;
            }
        }

        #gs-result-panel[data-theme="light"] {
            color-scheme: light;
        }

        #gs-result-panel[data-theme="dark"] {
            color-scheme: dark;
        }

    `;
    document.head.insertAdjacentHTML('beforeend', '<style id="gs-inline-style">' + CSS + '</style>');

    const statusText = {
        'processing': 'Processing new video...',
        'failed': 'Processing failed',
        'completed': 'Processing completed',
        'generating_hd': 'HD video generating...'
    };
    const statusClass = {
        'processing': 'gs-status-processing',
        'failed': 'gs-status-failed',
        'completed': 'gs-status-completed',
        'generating_hd': 'gs-status-generating-hd'
    };

    let state = {
        active: false,
        currentUrl: window.location.href,
        currentDataKey: '',
        currentData: null,
        resultPanel: null
    }

    // #region 初始化全局侦听和处理
    window.addEventListener('message', async (event) => {
        if (event.source !== window || event.data?.source !== 'grok-spirit-fetch') return;
        //
        //根据refer来获取要保存到哪个数据
        const msg = event.data;
        let { key, data } = await getKeyAndDataByReferer(msg.referer);
        if (!data) return;

        try {
            if (msg.type === 'status' && msg.status === 'processing') {
                console.log(`[GrokSpirit] processing start`);
                data.hookSessionActive = true;
                await handleVideoProcessing('processing', key, data, msg.referer);
                return;
            }

            const payload = msg.data && msg.data.result && msg.data.result.response && msg.data.result.response.streamingVideoGenerationResponse;
            if (!payload) return;

            if (!data.hookSessionActive) {
                data.hookSessionActive = true;
                await handleVideoProcessing('processing', key, data, msg.referer);
            }

            if (typeof payload.videoPrompt === 'string' && payload.progress !== undefined && payload.progress < 5) {
                data.hookOriginalPrompt = payload.videoPrompt;
            }

            if (payload.progress === 100) {
                if (!payload.videoUrl) {
                    data.hookSessionActive = false;
                    data.hookOriginalPrompt = null;
                    await handleVideoProcessing('failed', key, data, msg.referer);
                } else {
                    const enhanced = { ...payload, generated_prompt: payload.videoPrompt, originalPrompt: data.hookOriginalPrompt };
                    data.hookSessionActive = false;
                    data.hookOriginalPrompt = null;
                    await handleVideoDetected(enhanced, key, data, msg.referer);
                }
            }
        } catch (e) {
            // ignore
            console.log(e);
        }
    });
    chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
        if (request.source === 'grok-spirit-generate-hd') {
            let referer = request.referer;
            let { key, data } = await getKeyAndDataByReferer(referer);
            if (data) {
                if (!request.status) handleVideoProcessing('generating_hd', key, data, referer);
                else handleVideoProcessing('completed', key, data, referer);
            }
        }
    });
    // Handle video processing status
    async function getKeyAndDataByReferer(referer) {
        let key;
        let data;
        if (currentUrl === referer) {
            key = state.currentDataKey;
            data = state.currentData;
        } else {
            key = `grok_video_${window.GrokSpiritUtils.getNormalizedUrl(referer)}`
            data = await window.GrokSpiritUtils.readStorage(key);
        }
        return { key, data };
    }
    async function handleVideoProcessing(status, key, data, referer) {
        console.log(`[GrokSpirit] handleVideoProcessing called with status:`, status, 'key:', key);

        data.processingStatus = status;

        if (status === 'failed') {
            // Failed status doesn't set isProcessing to true, doesn't record time
        } else {
            data.isProcessing = true;

            // If starting processing, record start time and use referer for caching
            if (status === 'processing') {
                await saveData(key, data);
            }
        }

        //判断是否刷新ui
        if (data === state.currentData) {
            updateProcessingLayer();
        }
    }
    async function handleVideoDetected(videoInfo, key, data, referer) {
        console.log(`[GrokSpirit] handleVideoDetected called with videoInfo:`, videoInfo, 'key:', key);

        // Extract original prompt from the response
        const originalPrompt = extractOriginalPrompt(videoInfo);
        videoInfo.originalPrompt = originalPrompt;

        //console.log(`[${formatTime()}] Caching video data with key:`, urlKey, 'from URL:', cacheUrl);
        //console.log(`[${formatTime()}] Current URL at detection time:`, currentUrl);
        //console.log(`[${formatTime()}] ProcessingVideoData:`, processingVideoData);

        // Ensure originalPrompt is a string before stringifying
        const videoInfoForStorage = { ...videoInfo };
        if (videoInfoForStorage.originalPrompt && typeof videoInfoForStorage.originalPrompt === 'object') {
            videoInfoForStorage.originalPrompt = JSON.stringify(videoInfoForStorage.originalPrompt);
            console.log(`[GrokSpirit] Converted originalPrompt object to string for storage`);
        }

        data.cachedVideoData = videoInfo;

        // Update processing status
        data.processingStatus = 'completed';
        data.isProcessing = false; // Processing completed, reset state

        await saveData(key, data);

        // 判断是否更新UI
        if (data === state.currentData) {
            updateResultPanel();
        }
    }
    function extractOriginalPrompt(videoInfo) {
        // Original prompt is now directly passed from background script
        if (videoInfo.hasOwnProperty('originalPrompt')) {
            const originalPromptRaw = videoInfo.originalPrompt;

            // Parse original (may be JSON string or plain text)
            const parsedOriginal = typeof originalPromptRaw === 'object' && originalPromptRaw !== null
                ? originalPromptRaw
                : window.GrokSpiritUtils.safeParseJsonString(originalPromptRaw);

            // Parse generated prompt from progress 100 response
            // Prefer new field generated_prompt; fallback to legacy videoPrompt
            const parsedGenerated = window.GrokSpiritUtils.safeParseJsonString(videoInfo.generated_prompt || videoInfo.videoPrompt);

            const hasStructuredData = !!(parsedOriginal && typeof parsedOriginal === 'object' &&
                (parsedOriginal.shot || parsedOriginal.scene || parsedOriginal.cinematography || parsedOriginal.visual_details));

            if (hasStructuredData) {
                // Case 1 & 2: Structured prompt injection
                try {
                    const finalPrompt = parsedGenerated;
                    if (!finalPrompt || typeof finalPrompt !== 'object') {
                        return parsedOriginal;
                    }

                    // Deep comparison of objects (ignoring formatting differences)
                    const isConsistent = deepEqual(parsedOriginal, finalPrompt);

                    if (isConsistent) {
                        console.log(`[GrokSpirit] cachedVideoData.videoPrompt: Injection completely consistent`);
                        return "Injection completely consistent";
                    } else {
                        // Case 2: Partial injection - show original prompt
                        return parsedOriginal;
                    }
                } catch (e) {
                    // If parsing fails, fall back to showing original prompt
                    return parsedOriginal || originalPromptRaw;
                }
            } else {
                // Case 3: Plain text prompt - show extracted original prompt
                return originalPromptRaw;
            }
        }

        return null;
    }
    // Deep equality comparison for objects
    function deepEqual(obj1, obj2) {
        if (obj1 === obj2) return true;

        if (obj1 == null || obj2 == null) return obj1 === obj2;

        if (typeof obj1 !== typeof obj2) return false;

        if (typeof obj1 !== 'object') return obj1 === obj2;

        if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

        if (Array.isArray(obj1)) {
            if (obj1.length !== obj2.length) return false;
            for (let i = 0; i < obj1.length; i++) {
                if (!deepEqual(obj1[i], obj2[i])) return false;
            }
            return true;
        }

        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) return false;

        for (let key of keys1) {
            if (!keys2.includes(key)) return false;
            if (!deepEqual(obj1[key], obj2[key])) return false;
        }

        return true;
    }
    //
    chrome.runtime.sendMessage({ action: 'grok-spirit-fetch' });
    // #endregion 

    function canRun(url) {
        return url.includes('/imagine/post/')
    }
    async function start(url) {
        if (state.active) return;
        state.active = true;
        console.log('[GrokSpirit] start on', url);

        state.currentUrl = url;
        initResultPanel();
        await mountResultPanel();
        await setData();

        return () => stop();
    }
    async function stop() {
        if (!state.active) return;
        state.active = false;
        console.log('[GrokSpirit] stop');

        state.resultPanel.remove();

        if (state.currentDataKey) {
            if (state.currentData?.cachedVideoData?.videoUrl) await saveData();
            state.currentDataKey = state.currentData = null;
        }
    }

    window.GrokSpirit = { canRun, start, stop }

    // Find UI
    function findOperationContainer() {
        return document.querySelector('.flex.justify-between.gap-5');
    }
    function findPromptLayer() {
        return findOperationContainer()?.querySelector('.flex.justify-end.relative.w-full')
    }
    function findPromptInput() {
        return findPromptLayer()?.querySelector('textarea[aria-required="true"]')
    }
    function findVideo() {
        return document.querySelector('video[id="sd-video"]')
    }

    // Data
    async function setData() {
        const urlKey = `grok_video_${window.GrokSpiritUtils.getNormalizedUrl(state.currentUrl)}`;
        //如果要切换key
        if (state.currentDataKey && state.currentDataKey !== urlKey) {
            if (state.currentData?.cachedVideoData?.videoUrl) await window.GrokSpiritUtils.writeStorage(state.currentDataKey, state.currentData);
            state.currentDataKey = state.currentData = null;
        }

        state.currentDataKey = urlKey;

        let cached = await window.GrokSpiritUtils.readStorage(urlKey);
        if (cached) {
            // Ensure originalPrompt is properly handled when loading from cache
            if (cached.cachedVideoData?.originalPrompt && typeof cached.cachedVideoData?.originalPrompt === 'string') {
                try {
                    // Try to parse as JSON, if it fails, keep as string
                    const parsed = JSON.parse(cached.cachedVideoData.originalPrompt);
                    if (typeof parsed === 'object' && parsed !== null) {
                        cached.cachedVideoData.originalPrompt = parsed;
                        // console.log(`[GrokSpirit] Converted originalPrompt string back to object when loading from cache`);
                    }
                } catch (e) {
                    // Keep as string if parsing fails
                    // console.log(`[GrokSpirit] originalPrompt is plain text, keeping as string`);
                }
            }

            state.currentData = cached;
            console.log(`[GrokSpirit] Loaded cached data for URL:`, state.currentUrl, state.currentData);
        }
        if (!state.currentData) {
            state.currentData = generateEmptyVideoData(state.currentDataKey);
            console.log(`[GrokSpirit] Create a default data for URL:`, state.currentUrl, state.currentData);
        }
        //当每次进入时，都填充一次最新的数据
        {
            let input = findPromptInput();
            if (input) state.currentData.cachedVideoData.videoPrompt = input.value || input.textContent || '';
            //设置默认的视频地址
            let video = findVideo();//sd-video
            if (video) {
                state.currentData.cachedVideoData.videoUrl = video.getAttribute('src') || ''
                if (state.currentData.cachedVideoData.videoUrl) {
                    //"https://assets.grok.com/users/[uuid]/generated/[uuid]/generated_video.mp4?cache=1"
                    state.currentData.cachedVideoData.videoId = window.GrokSpiritUtils.extractLastUUId(state.currentData.cachedVideoData.videoUrl);
                }
            }
        }
        //设置文件夹
        {
            let folderName = window.FavoritesManager?.queryByUrlId?.(state.currentData.id)?.folderName;
            if (folderName) {
                if (!state.currentData.folderName) state.currentData.folderName = `${folderName}/${state.currentData.id}`;
                else if (!state.currentData.folderName.startsWith(folderName)) {
                    let arr = state.currentData.folderName.split('/');
                    if (arr.length <= 1) {
                        arr.unshift(folderName);
                    } else if (arr.length === 2) {
                        if (arr[arr.length - 1] === '000') {
                            arr.unshift(folderName);
                        } else {
                            arr[0] = folderName;
                        }
                    } else if (arr.length >= 3) {
                        arr[0] = folderName;
                    }
                    state.currentData.folderName = arr.join('/');
                }
            }
        }
        //
        updateResultPanel();
    }
    function generateEmptyVideoData(urlKey) {
        let urlId = window.GrokSpiritUtils.extractLastUUId(urlKey);
        let data = {
            id: urlId,
            cachedVideoData: {},
            locales: null,
            isProcessing: false,
            processingStatus: null,
            folderName: urlId,
            sequence: 1,
            spicy: false
        }
        return data;
    }
    async function saveData(key, data) {
        if (!key) key = state.currentDataKey;
        if (!data) data = state.currentData;
        if (key && data) await window.GrokSpiritUtils.writeStorage(key, data);
    }

    // UI
    function initResultPanel() {
        if (state.resultPanel) return;

        console.log(`[GrokSpirit] Init Result Panel`);

        state.resultPanel = document.createElement('div');
        state.resultPanel.id = 'gs-result-panel';
        state.resultPanel.style.cssText = `
                display: block;
                width: 100%;
                margin-top: 4px;
                margin-bottom: 20px;
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 12px;
                padding: 16px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                clear: both;
                position: relative;
                z-index: 1;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        `;
        state.resultPanel.innerHTML = `
                <div class="gs-json-controls" style="display:flex; flex-direction:column; gap:8px; margin-bottom:8px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; flex-wrap:wrap;">
                    <!-- 左侧按钮组 -->
                    <div style="display:flex; gap:6px;">
                        <button class="gs-btn gs-btn-clipboard" title="Copy from clipboard">📥 Clipboard</button>
                        <button class="gs-btn gs-btn-spicy" title="Enable spicy mode">🌶️ Spicy Mode</button>
                    </div>
                    <!-- 右侧状态 + 按钮 -->
                    <div style="display:flex; align-items:center; gap:6px;">
                        <span class="gs-status"></span>
                        <button class="gs-btn gs-btn-download" title="Download">💾 Download</button>
                    </div>
                    </div>
                    <!-- 第二行输入组 -->
                    <div class="gs-input-group" style="display:flex; align-items:center; gap:6px; width:100%;">
                        <input id="gs-folder-input" type="text" placeholder="文件夹名" style="flex:1; min-width:120px; padding:4px 8px; border:1px solid #ced4da; border-radius:6px; font-size:12px;" />
                        <input id="gs-sequence-input" type="text" placeholder="序号" style="width:80px; padding:4px 8px; border:1px solid #ced4da; border-radius:6px; font-size:12px; text-align:center;" />
                    </div>
                </div>
        `;

        // JSON editor buttons
        const clipboardBtn = state.resultPanel.querySelector('.gs-btn-clipboard');
        if (clipboardBtn) {
            clipboardBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                handleClipboardCopy();
            });
        }

        const spicyBtn = state.resultPanel.querySelector('.gs-btn-spicy');
        if (spicyBtn) {
            spicyBtn.addEventListener('click', async (event) => {
                event.stopPropagation();
                //
                state.currentData.spicy = !state.currentData.spicy;
                updateSpicyStatus();
                await saveData();
            });
        }

        const downloadBtn = state.resultPanel.querySelector('.gs-btn-download');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                handleDownloadAll();
            });
        }

        const folderInput = state.resultPanel.querySelector('#gs-folder-input');
        if (folderInput) {
            folderInput.addEventListener('blur', async (event) => {
                state.currentData.folderName = event.target.value;
                await saveData();
            });
        }

        const sequenceInput = state.resultPanel.querySelector('#gs-sequence-input');
        if (sequenceInput) {
            sequenceInput.addEventListener('blur', async (event) => {
                let sequence = parseInt(event.target.value, 10);
                if (!isNaN(sequence)) {
                    state.currentData.sequence = sequence;
                    await saveData();
                }
            });
        }
    }
    async function handleClipboardCopy() {
        if (!navigator.clipboard || typeof navigator.clipboard.readText !== 'function') {
            console.warn('[GrokSpirit] Clipboard API is not available in this context.');
            return null;
        }

        try {
            const clipboardText = await navigator.clipboard.readText();
            const trimmedText = clipboardText.trim();
            if (!trimmedText) {
                console.warn('[GrokSpirit] Clipboard is empty or contains only whitespace.');
                return null;
            }

            //重置
            state.currentData.cachedVideoData.videoPrompt = '';
            delete state.currentData.locales;

            //处理粘贴的数据
            let clipboardData;
            try {
                clipboardData = JSON.parse(trimmedText);
            } catch (e) {
                console.warn('[GrokSpirit] Clipboard is not a valid JSON:', e);
            }

            //粘贴的是文本
            if (!clipboardData) {
                clipboardData = state.currentData.cachedVideoData.videoPrompt = trimmedText;
                console.log(`[GrokSpirit] Paste plain Text:`, trimmedText);
            } else if (clipboardData.en) {
                //如果是多语言
                state.currentData.cachedVideoData.videoPrompt = JSON.stringify(clipboardData.en);
                delete clipboardData.en;
                state.currentData.locales = clipboardData
                console.log(`[GrokSpirit] Paste multi locale JSON:`, state.currentData.cachedVideoData.videoPrompt);
                console.log(`[GrokSpirit] Locales:`, Object.keys(state.currentData.locales));
            } else {
                state.currentData.cachedVideoData.videoPrompt = JSON.stringify(clipboardData);
                console.log(`[GrokSpirit] Paste JSON:`, state.currentData.cachedVideoData.videoPrompt);
            }

            updateResultPanel();
            //
            const promptInput = findPromptInput();
            if (promptInput) {
                promptInput.value = promptInput.textContent = state.currentData.cachedVideoData.videoPrompt || '';
                promptInput.dispatchEvent(new Event('input', { bubbles: true }));
            }

            console.log('[GrokSpirit] Clipboard JSON merged successfully.');
        } catch (error) {
            console.error('[GrokSpirit] Failed to read clipboard content:', error);
        }
    }
    function handleDownloadAll() {
        if (!state.currentData.cachedVideoData?.videoUrl) {
            console.error('[GrokSpirit] No video URL available for download');
            return;
        }

        let structuredData;
        try { structuredData = JSON.parse(state.currentData.cachedVideoData.videoPrompt); } catch (e) { }
        if (!structuredData) {
            structuredData = state.currentData.cachedVideoData.videoPrompt;
        } else if (currentData.locales) {
            structuredData = { en: { ...structuredData }, ...state.currentData.locales }
        }

        const payload = {
            action: 'grok-spirit-download',
            referer: state.currentUrl,
            videoInfo: {
                videoId: state.currentData.cachedVideoData.videoId,
                videoUrl: state.currentData.cachedVideoData.videoUrl,
                videoPrompt: state.currentData.cachedVideoData.videoPrompt,
                originalPrompt: state.currentData.cachedVideoData.originalPrompt || null,
                progress: state.currentData.cachedVideoData.progress,
                pageUrl: state.currentUrl,
                structuredData: structuredData,
                folderName: state.currentData.folderName,
                sequence: `${state.currentData.sequence}`.padStart(3, '0'),
                originImgUrl: findVideo()?.parentNode.querySelector('img')?.src,
            }
        };
        chrome.runtime.sendMessage(payload, async (response) => {
            if (chrome.runtime.lastError) {
                console.error('[GrokSpirit] Background message failed:', chrome.runtime.lastError);
                return;
            }
            if (!response || !response.success) {
                console.error('[GrokSpirit] Background download failed:', response && response.error);
                return;
            }
            //保存状态
            state.currentData.sequence += 1;
            await saveData();
            updateSequenceInput();
        });
    }
    async function mountResultPanel() {
        let container = await window.GrokSpiritUtils.waitForSelector(() => findOperationContainer());
        container.parentNode.insertBefore(state.resultPanel, container.nextSibling);
    }
    function updateResultPanel() {
        updateSpicyStatus();
        updateProcessingLayer();
        updateFolderInput();
        updateSequenceInput();
    }
    function updateSpicyStatus() {
        const spicyBtn = state.resultPanel.querySelector('.gs-btn-spicy');
        if (!spicyBtn) return;
        spicyBtn.classList.remove('gs-active');
        if (state.currentData.spicy === true) {
            spicyBtn.classList.add('gs-active');
        }
    }
    function updateProcessingLayer() {
        const statusContainer = state.resultPanel.querySelector('.gs-status');
        statusContainer.className = `gs-status ${statusClass[state.currentData.processingStatus]}`;
        statusContainer.textContent = `${statusText[state.currentData.processingStatus] || ''}`;
        if (state.currentData.processingStatus === 'completed') {
            if (state.resultPanel.querySelector('.gs-btn-reset-sequence'))
                state.resultPanel.querySelector('.gs-btn-reset-sequence').style.display = 'inline';
        }
    }
    function updateFolderInput() {
        const folderInput = state.resultPanel.querySelector('#gs-folder-input');
        if (folderInput) {
            folderInput.value = folderInput.textContent = state.currentData.folderName;
        }
    }
    function updateSequenceInput() {
        const sequenceInput = state.resultPanel.querySelector('#gs-sequence-input');
        if (sequenceInput) {
            sequenceInput.value = sequenceInput.textContent = `${state.currentData.sequence}`;
        }
    }
})()