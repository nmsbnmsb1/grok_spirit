(function () {
    if (window.GrokSpiritUtils) {
        return;
    }

    const GrokSpiritUtils = {
        // 统一时间格式化函数
        formatTime(date = new Date()) {
            return date.toLocaleTimeString(undefined, { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        },
        // 本地完整时间（不依赖语言环境），用于下载与持久化显示
        formatFullDateTime(date = new Date()) {
            const pad = (n) => String(n).padStart(2, '0');
            const y = date.getFullYear();
            const m = pad(date.getMonth() + 1);
            const d = pad(date.getDate());
            const hh = pad(date.getHours());
            const mm = pad(date.getMinutes());
            const ss = pad(date.getSeconds());
            return `${y}/${m}/${d} ${hh}:${mm}:${ss}`;
        },
        // JSON helpers (safe on plaintext prompts)
        isJsonLikeString(s) {
            if (!s || typeof s !== 'string') return false;
            const t = s.trim();
            return t.startsWith('{') || t.startsWith('[');
        },
        safeParseJsonString(s, fallback) {
            if (!GrokSpiritUtils.isJsonLikeString(s)) return fallback;
            try { return JSON.parse(s); } catch { return fallback; }
        },
        getNormalizedUrl(url) {
            try {
                const urlObj = new URL(url);
                return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
            } catch (e) {
                console.error('Failed to normalize URL:', e);
                return url;
            }
        },
        extractLastUUId(str) {
            const uuidMatches = str.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi);
            const urlId = uuidMatches && uuidMatches.length ? uuidMatches[uuidMatches.length - 1] : '';
            return urlId;
        },
        waitDelay(ms = 0) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        async waitForSelector(selectorFn, { retries = 12, interval = 250, message } = {}) {
            if (typeof selectorFn !== 'function') {
                throw new TypeError('waitForSelector requires a selector function');
            }
            for (let attempt = 0; attempt < retries; attempt++) {
                let node = selectorFn();
                if (node?.then) node = await node;
                if (Array.isArray(node) || node instanceof NodeList) {
                    if (node.length > 0) return node;
                } else if (node) {
                    return node;
                }
                await GrokSpiritUtils.waitDelay(interval > 0 ? interval : 500 * (attempt + 1));
            }
            throw new Error(message || 'waitForSelector: selector not found');
        },
        createDeferer() {
            const deferer = {};
            const promise = new Promise((resolve, reject) => {
                deferer.resolve = resolve;
                deferer.reject = reject;
            });
            deferer.promise = promise;
            deferer.p = promise;
            return deferer;
        },
        async readStorage(key, fallback) {
            if (!chrome?.storage?.local) return fallback;
            const data = await chrome.storage.local.get(key);
            return data?.[key] !== undefined ? data[key] : fallback;
        },
        async writeStorage(key, value) {
            if (!chrome?.storage?.local) return;
            await chrome.storage.local.set({ [key]: value });
        }
    };

    window.GrokSpiritUtils = GrokSpiritUtils;
})();