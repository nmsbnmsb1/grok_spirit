let favoriteData = {};
(() => {
  let data = localStorage.getItem('grok_video_favourites');
  if (data) {
    try { favoriteData = JSON.parse(data); } catch (e) { }
  }
})();

function saveFavoriteData() {
  let dataStr = JSON.stringify(favoriteData);
  localStorage.setItem('grok_video_favourites', dataStr);
}


(function () {
  const FAVORITES_URL_PREFIX = 'https://grok.com/imagine/favorites';
  const INLINE_STYLE_ID = 'gs-favorites-inline-style';
  const RENDER_DEBOUNCE_MS = 150;
  const DEFAULT_CATEGORY = '未分类';
  const ALL_CATEGORY_VALUE = '__ALL__';
  const ALL_CATEGORY_TEXT = '全部显示';

  const state = {
    currentUrl: '',
    isActive: false,
    listContainer: null,
    observer: null,
    renderTimer: null,
    //ui对象实例
    items: new Map(),
    selectedItems: new Set(),
    toolbar: null,
    popup: null,
    currentFilterCategory: ALL_CATEGORY_VALUE,
  };

  // #region Helper
  function isFavoritesUrl(url) {
    return typeof url === 'string' && url.startsWith(FAVORITES_URL_PREFIX);
  }
  // #endregion

  // #region Entry
  function handleUrlChange(url) {
    state.currentUrl = url || '';
    if (isFavoritesUrl(state.currentUrl)) {
      activateFavoritesUi();
    } else {
      hideFavoritesUi();
    }
  }
  // #endregion

  // #region UI
  function activateFavoritesUi() {
    if (!state.isActive) {
      state.isActive = true;
      ensureInlineStyles();
      ensureCategoryPopup();
    }
    watchListContainer();
  }

  function ensureInlineStyles() {
    if (document.getElementById(INLINE_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = INLINE_STYLE_ID;
    style.textContent = `
      .gs-fav-toolbar {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        background: rgba(15, 23, 42, 0.88);
        border-radius: 28px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.35);
        font-family: inherit;
        z-index: 2147483000;
        backdrop-filter: blur(12px);
      }
      .gs-fav-toolbar-inline,
      .gs-fav-header-inline {
        all: unset;
      }
      .gs-fav-toolbar-block {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        background: rgba(15, 23, 42, 0.88);
        border-radius: 28px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.35);
        font-family: inherit;
        backdrop-filter: blur(12px);
      }
      .gs-fav-toolbar-label {
        font-weight: 600;
        color: #f8fafc;
        margin-right: 4px;
      }
      .gs-fav-category-select {
        min-width: 140px;
        padding: 6px 10px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        background: rgba(15, 23, 42, 0.7);
        color: #f8fafc;
        font-size: 0.9rem;
      }
      .gs-fav-toolbar-btn {
        padding: 6px 12px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        background: rgba(79, 70, 229, 0.25);
        color: #eef2ff;
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s ease, color 0.2s ease, opacity 0.2s ease;
      }
      .gs-fav-toolbar-btn:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
      .gs-fav-toolbar-btn:not(:disabled):hover {
        background: #4338ca;
        color: #fff;
      }
      .gs-fav-selection-count {
        margin-left: auto;
        color: #475569;
        font-size: 0.85rem;
        white-space: nowrap;
      }
      .gs-fav-toolbar-inline .gs-fav-selection-count {
        color: inherit;
        opacity: 0.9;
      }
      .gs-fav-item {
        position: relative;
      }
      .gs-fav-item.gs-fav-selected {
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.45);
      }
      .gs-fav-checkbox-wrapper {
        position: absolute;
        top: 0px;
        left: 0px;
        display: inline-flex;
        align-items: center;
        justify-content: start;
        width: 100%;
        height: 40px;
        background: rgba(15, 23, 42, 0);
        z-index: 5;
        padding: 6px;
        padding-left: 16px;
      }
      .gs-fav-checkbox-wrapper input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      .gs-fav-checkbox-mark {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.85);
        color: #372ea3;
        font-size: 1.3rem;
        font-weight: 1000;
      }
      .gs-fav-checkbox-wrapper input:checked + .gs-fav-checkbox-mark::after {
        content: '✓';
      }
      .gs-fav-category-badge {
        position: absolute;
        bottom: 10px;
        left: 10px;
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.6);
        color: #fff;
        font-size: 0.75rem;
        font-weight: 500;
        letter-spacing: 0.01em;
        display: none;
        z-index: 5;
      }
      .gs-fav-category-badge.gs-visible {
        display: inline-flex;
      }
      .gs-popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(15, 23, 42, 0.7);
        backdrop-filter: blur(8px);
        z-index: 2147483640;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .gs-popup-modal {
        background: rgba(30, 41, 59, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 16px;
        padding: 24px;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        color: #f8fafc;
      }
      .gs-popup-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 20px;
      }
      .gs-popup-form-group {
        margin-bottom: 16px;
      }
      .gs-popup-label {
        display: block;
        font-size: 0.9rem;
        font-weight: 500;
        margin-bottom: 8px;
        color: #cbd5e1;
      }
      .gs-popup-input {
        width: 100%;
        padding: 10px 12px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        background: rgba(15, 23, 42, 0.8);
        color: #f8fafc;
        font-size: 1rem;
        box-sizing: border-box;
      }
      .gs-popup-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 24px;
      }
      .gs-popup-btn {
        padding: 8px 16px;
        border-radius: 8px;
        border: none;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .gs-popup-btn-primary {
        background: #4f46e5;
        color: #fff;
      }
      .gs-popup-btn-primary:hover {
        background: #4338ca;
      }
      .gs-popup-btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: #e2e8f0;
      }
      .gs-popup-btn-secondary:hover {
        background: rgba(255, 255, 255, 0.15);
      }
      .gs-fav-dim-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
        z-index: 4; /* Below checkbox and badge */
        pointer-events: none; /* Allow clicks to pass through to the item */
        display: none; /* Hidden by default */
      }
      .gs-fav-dim-overlay.gs-active {
        display: block; /* Visible when active */
      }
    `;
    document.head.appendChild(style);
  }

  function watchListContainer(retry = 0) {
    if (!state.isActive) return;
    const container = document.querySelector("div[role='list']");
    if (!container) {
      if (retry > 10) return;
      setTimeout(() => watchListContainer(retry + 1), 400 * (retry + 1));
      return;
    }

    if (state.listContainer !== container) {
      if (state.observer) state.observer.disconnect();
      state.listContainer = container;
      ensureToolbar(container);
      state.observer = new MutationObserver(scheduleRender);
      state.observer.observe(container, {
        childList: true
      });
    }

    scheduleRender();
  }

  function scheduleRender() {
    if (!state.isActive) return;
    if (state.renderTimer) clearTimeout(state.renderTimer);
    state.renderTimer = setTimeout(renderWithLatestData, RENDER_DEBOUNCE_MS);
  }

  function hideFavoritesUi() {
    if (!state.isActive) return;
    state.isActive = false;
    if (state.renderTimer) {
      clearTimeout(state.renderTimer);
      state.renderTimer = null;
    }
    if (state.observer) {
      state.observer.disconnect();
      state.observer = null;
    }
    state.listContainer = null;

    cleanupAllItems();
    cleanupToolbar();
    hideCategoryPopup();
  }

  // #region 渲染函数
  function renderWithLatestData() {
    state.renderTimer = null;
    if (!state.isActive) return;

    let container = state.listContainer;
    if (!container || !container.isConnected) {
      container = document.querySelector("div[role='list']");
      if (!container) return;
      state.listContainer = container;
      ensureToolbar(container);
    }

    const seenIds = new Set();

    const nodes = collectCandidateNodes(container);
    nodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      const meta = extractNode(node);
      if (!meta.id) return;
      seenIds.add(meta.id);
      const item = ensureItemRecord(node, meta);
      decorateItem(item);
    });

    cleanupMissingItems(seenIds);

    ensureToolbar();
  }
  // #endregion 

  // #region 图片
  function collectCandidateNodes(container) {
    const ITEM_FALLBACK_SELECTOR = "[role='listitem']";
    const direct = Array.from(container.children).filter((node) => node.matches?.(ITEM_FALLBACK_SELECTOR));
    return direct.length ? direct : Array.from(container.querySelectorAll(ITEM_FALLBACK_SELECTOR));
  }

  function extractNode(root) {
    const img = root.querySelector('img');
    if (!img?.src) {
      return {};
    }

    const src = img.src;
    const uuidMatches = src.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi);
    let id = '';
    if (uuidMatches && uuidMatches.length) {
      id = uuidMatches[uuidMatches.length - 1];
    }
    // else {
    //   const cleanSrc = src.split(/[?#]/)[0];
    //   const parts = cleanSrc.split('/').filter(Boolean);
    //   id = parts.length ? parts[parts.length - 1].replace(/\.[^.]+$/, '') : cleanSrc;
    // }

    return { id, img: src, video: root.querySelector('video')?.src };
  }

  function ensureItemRecord(node, meta) {
    let record = state.items.get(meta.id);
    if (!record) {
      record = meta
      state.items.set(record.id, record);
    } else if (record.node !== node) {
      cleanupItemUi(record);
    }
    //
    record.node = node;
    record.checkbox = null;
    record.checkboxListener = null;
    record.categoryBadge = null;
    return record;
  }

  function decorateItem(item) {
    const node = item.node;
    if (!node || !node.isConnected) return;

    node.classList.add('gs-fav-item');
    node.dataset.gsFavId = item.id;

    ensureCheckbox(item);
    ensureCategoryBadge(item);
    syncItemSelectionState(item);
    syncItemCategoryBadge(item);
    syncItemCategoryApparance(item)
  }

  function ensureCheckbox(item) {
    if (item.checkbox && item.checkbox.isConnected) {
      item.checkbox.checked = state.selectedItems.has(item.id);
      return;
    }
    const wrapper = document.createElement('label');
    wrapper.className = 'gs-fav-checkbox-wrapper';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'gs-fav-checkbox';

    const mark = document.createElement('span');
    mark.className = 'gs-fav-checkbox-mark';

    wrapper.appendChild(checkbox);
    wrapper.appendChild(mark);

    const listener = (event) => handleCheckboxChange(item.id, event.target.checked);
    checkbox.addEventListener('change', listener);

    item.checkbox = checkbox;
    item.checkboxListener = listener;

    item.node.appendChild(wrapper);
    checkbox.checked = state.selectedItems.has(item.id);
  }

  function ensureCategoryBadge(item) {
    if (item.categoryBadge && item.categoryBadge.isConnected) return;
    const badge = document.createElement('span');
    badge.className = 'gs-fav-category-badge';
    item.node.appendChild(badge);
    item.categoryBadge = badge;
  }

  function syncItemSelectionState(item) {
    const selected = state.selectedItems.has(item.id);
    if (item.checkbox) {
      item.checkbox.checked = selected;
    }
    if (item.node) {
      item.node.classList.toggle('gs-fav-selected', selected);
    }
  }

  function syncItemCategoryBadge(item) {
    const badge = item.categoryBadge;
    if (!badge) return;
    const categoryName = getCategoryForItem(item.id);
    if (categoryName && categoryName !== DEFAULT_CATEGORY) {
      badge.textContent = categoryName;
      badge.classList.add('gs-visible');
    } else {
      badge.textContent = '';
      badge.classList.remove('gs-visible');
    }
  }

  function syncItemCategoryApparance(item) {
    // Overlay logic for non-matching categories
    const mediaCard = item.node.querySelector('.group\\/media-post-masonry-card');
    if (mediaCard) {
      const childrenDivs = Array.from(mediaCard.children).filter(child => child.tagName === 'DIV');
      if (childrenDivs.length >= 2) {
        const overlay = childrenDivs[1]; // This is the div with "bg-primary/10 rounded-2xl hidden"
        overlay.classList.add('gs-fav-dim-overlay'); // Add our class for styling

        const itemCategory = getCategoryForItem(item.id);
        const shouldDim = (state.currentFilterCategory !== ALL_CATEGORY_VALUE && state.currentFilterCategory !== itemCategory);
        overlay.classList.toggle('gs-active', shouldDim);
      }
    }
  }

  function getCategoryForItem(id) {
    const data = favoriteData[id];
    if (data && typeof data.category === 'string' && data.category.trim()) {
      return data.category.trim();
    }
    return DEFAULT_CATEGORY;
  }

  function handleCheckboxChange(id, checked) {
    if (checked) {
      state.selectedItems.add(id);
    } else {
      state.selectedItems.delete(id);
    }
    const item = state.items.get(id);
    if (item) {
      syncItemSelectionState(item);
    }
    updateToolbarState();
  }

  function cleanupMissingItems(seenIds) {
    const toRemove = [];
    state.items.forEach((item, id) => {
      if (!seenIds.has(id)) {
        toRemove.push({ id, item });
      }
    });
    toRemove.forEach(({ id, item }) => {
      cleanupItemUi(item);
      state.items.delete(id);
      //state.selectedItems.delete(id);
    });
  }

  function cleanupItemUi(item) {
    if (item.checkbox && item.checkboxListener) {
      item.checkbox.removeEventListener('change', item.checkboxListener);
    }
    const wrapper = item.checkbox?.closest('.gs-fav-checkbox-wrapper');
    if (wrapper && wrapper.isConnected) {
      wrapper.remove();
    }
    if (item.categoryBadge && item.categoryBadge.isConnected) {
      item.categoryBadge.remove();
    }
    if (item.node) {
      item.node.classList.remove('gs-fav-item', 'gs-fav-selected');
      item.node.removeAttribute('data-gs-fav-id');
    }
    item.checkbox = null;
    item.checkboxListener = null;
    item.categoryBadge = null;
  }

  function cleanupAllItems() {
    state.items.forEach((item) => cleanupItemUi(item));
    state.items.clear();
    state.selectedItems.clear();
  }
  // #endregion 

  // #region 工具栏
  function ensureToolbar() {
    const hostSelector = '.absolute.left-0.bottom-0.w-full.p-3';
    const host = document.querySelector(hostSelector);
    if (!host) return;

    if (!state.toolbar) {
      state.toolbar = createToolbar();
    }

    const formWrapper = host.querySelector('.flex.flex-row.items-center.gap-2.justify-center');
    if (!formWrapper) {
      if (state.toolbar.parentElement !== host) {
        host.appendChild(state.toolbar);
      }
      return;
    }

    const form = formWrapper.querySelector('form');
    if (!form) return;

    if (state.toolbar.parentElement !== formWrapper) {
      formWrapper.insertBefore(state.toolbar, form);
    }

    // Hide the gutters
    formWrapper.querySelectorAll('.w-gutter').forEach(el => el.style.display = 'none');

    // Style the container and its children
    formWrapper.style.gap = '1rem';
    state.toolbar.style.flex = '0 0 auto'; // Don't grow, don't shrink
    form.style.flex = '1 1 auto'; // Grow and shrink as needed;
    form.style.minWidth = '0'; // Prevent overflow issues with flex children

    syncCategoryOptions();
    updateToolbarState();
  }

  function createToolbar() {
    const toolbar = document.createElement('div');
    toolbar.className = 'gs-fav-toolbar gs-fav-toolbar-block';

    const select = document.createElement('select');
    select.id = 'gs-fav-toolbar-category-select';
    select.className = 'gs-fav-category-select';
    toolbar.appendChild(select);

    select.addEventListener('change', () => {
      state.currentFilterCategory = select.value;
      renderWithLatestData();
    });

    const applyBtn = document.createElement('button');
    applyBtn.type = 'button';
    applyBtn.id = 'gs-fav-toolbar-apply-btn';
    applyBtn.className = 'gs-fav-toolbar-btn gs-fav-toolbar-apply';
    applyBtn.textContent = '设置分类';
    applyBtn.disabled = true;
    toolbar.appendChild(applyBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.id = 'gs-fav-toolbar-cancel-btn';
    cancelBtn.className = 'gs-fav-toolbar-btn gs-fav-toolbar-cancel';
    cancelBtn.textContent = '清除选中';
    cancelBtn.disabled = true;
    toolbar.appendChild(cancelBtn);

    state.applyCategoryHandler = () => showCategoryPopup();
    applyBtn.addEventListener('click', state.applyCategoryHandler);

    state.cancelSelectionHandler = () => clearSelection();
    cancelBtn.addEventListener('click', state.cancelSelectionHandler);

    return toolbar;
  }

  function syncCategoryOptions() {
    let select = state.toolbar.querySelector("#gs-fav-toolbar-category-select")
    if (!select) return;

    const previousValue = state.currentFilterCategory;
    select.innerHTML = '';

    const showAllOption = document.createElement('option');
    showAllOption.value = ALL_CATEGORY_VALUE;
    showAllOption.textContent = ALL_CATEGORY_TEXT;
    select.appendChild(showAllOption);

    const categories = getKnownCategories();
    categories.forEach((name) => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });

    if (Array.from(select.options).some(opt => opt.value === previousValue)) {
      select.value = previousValue;
    } else {
      select.value = ALL_CATEGORY_VALUE;
    }
    state.currentFilterCategory = select.value;
  }

  function getKnownCategories() {
    const categories = new Set([DEFAULT_CATEGORY]);
    Object.values(favoriteData || {}).forEach((entry) => {
      const name = entry?.category;
      if (typeof name === 'string' && name.trim()) {
        categories.add(name.trim());
      }
    });
    state.items.forEach((item) => {
      const saved = favoriteData[item.id];
      if (saved && typeof saved.category === 'string' && saved.category.trim()) {
        categories.add(saved.category.trim());
      }
    });
    return Array.from(categories).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', { sensitivity: 'base' }));
  }

  function clearSelection() {
    state.selectedItems.forEach((id) => {
      const item = state.items.get(id);
      if (!item) return;
      if (item.checkbox) {
        item.checkbox.checked = false;
      }
      if (item.node) {
        item.node.classList.remove('gs-fav-selected');
      }
    });
    state.selectedItems.clear();
    updateToolbarState();
  }

  function updateToolbarState() {
    const count = state.selectedItems.size;

    let applyBtn = state.toolbar?.querySelector("#gs-fav-toolbar-apply-btn");
    if (applyBtn) {
      applyBtn.disabled = count === 0;
    }

    let cancelSelectionBtn = state.toolbar?.querySelector("#gs-fav-toolbar-cancel-btn");
    if (cancelSelectionBtn) {
      cancelSelectionBtn.disabled = count === 0;
      cancelSelectionBtn.textContent = count ? `清除选中 (${count})` : '清除选中';
    }
  }

  function cleanupToolbar() {
    if (state.toolbar && state.toolbar.isConnected) {
      state.toolbar.remove();
    }
  }
  // #endregion

  // #region Popup
  function ensureCategoryPopup() {
    if (state.popup) return;

    const overlay = document.createElement('div');
    overlay.className = 'gs-popup-overlay';
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) hideCategoryPopup();
    });

    const modal = document.createElement('div');
    modal.className = 'gs-popup-modal';
    modal.innerHTML = `
      <h3 class="gs-popup-title">设置分类</h3>
      <div class="gs-popup-form-group">
        <label for="gs-category-name" class="gs-popup-label">分类名</label>
        <input id="gs-popup-name-input" type="text" id="gs-category-name" class="gs-popup-input" placeholder="例如：风景、人物">
      </div>
      <div class="gs-popup-form-group">
        <label for="gs-folder-name" class="gs-popup-label">文件夹名 (可选)</label>
        <input id="gs-popup-folder-input" type="text" id="gs-folder-name" class="gs-popup-input" placeholder="例如：2024-Q4">
      </div>
      <div class="gs-popup-actions">
        <button id="gs-popup-cancel-btn" type="button" class="gs-popup-btn gs-popup-btn-secondary">取消</button>
        <button id="gs-popup-save-btn" type="button" class="gs-popup-btn gs-popup-btn-primary">保存</button>
      </div>
    `;

    overlay.appendChild(modal);

    state.popup = overlay;

    modal.querySelector('#gs-popup-save-btn').addEventListener('click', () => {
      const categoryName = modal.querySelector('#gs-popup-name-input').value;
      const folderName = modal.querySelector('#gs-popup-folder-input').value;
      applySelectedCategory(categoryName, folderName);
      hideCategoryPopup();
    });

    modal.querySelector('#gs-popup-cancel-btn').addEventListener('click', () => hideCategoryPopup());
  }

  function showCategoryPopup() {
    if (!state.popup) return;
    state.popup.querySelector('#gs-popup-name-input').value = '';
    state.popup.querySelector('#gs-popup-name-input').focus();
    state.popup.querySelector('#gs-popup-folder-input').value = '';
    document.body.appendChild(state.popup);
  }

  function applySelectedCategory(categoryName, folderName) {
    if (!state.selectedItems.size) return;

    const normalizedCat = (categoryName || '').trim() || DEFAULT_CATEGORY;
    const normalizedFolder = (folderName || '').trim();
    if (normalizedCat === DEFAULT_CATEGORY || !normalizedFolder) return;

    state.selectedItems.forEach((id) => {
      if (!favoriteData[id]) favoriteData[id] = {};
      favoriteData[id].category = normalizedCat;
      favoriteData[id].folderName = normalizedFolder;
    });

    syncCategoryOptions();
    clearSelection();
    saveFavoriteData();
  }

  function hideCategoryPopup() {
    if (state.popup && state.popup.isConnected) {
      state.popup.remove();
    }
  }
  // #endregion

  // #endregion

  window.GSFavoritesManager = {
    handleUrlChange
  };
})();
