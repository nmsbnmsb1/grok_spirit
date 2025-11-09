(function () {
  const FAVORITES_URL_PREFIX = 'https://grok.com/imagine/favorites';
  const CSS = `
      /* Base Styles */
      .gs-fav-toolbar {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        border-radius: 28px;
        font-family: inherit;
        z-index: 2147483000;
        backdrop-filter: blur(12px);
      }
      .gs-fav-toolbar-block {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        border-radius: 28px;
        font-family: inherit;
        backdrop-filter: blur(12px);
      }
      .gs-fav-category-select {
        min-width: 140px;
        padding: 6px 10px;
        border-radius: 8px;
        font-size: 0.9rem;
      }
      .gs-fav-toolbar-btn {
        padding: 6px 12px;
        border-radius: 999px;
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s ease, color 0.2s ease, opacity 0.2s ease;
      }
      .gs-fav-toolbar-btn:disabled {
        cursor: not-allowed;
        opacity: 0.5;
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
        font-size: 1.3rem;
        font-weight: 1000;
        background: rgba(255, 255, 255, 0.85);
        color: #372ea3;
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
        font-size: 0.75rem;
        font-weight: 500;
        letter-spacing: 0.01em;
        display: none;
        z-index: 5;
      }
      .gs-fav-category-badge.gs-fav-visible {
        display: inline-flex;
      }
      .gs-fav-popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(8px);
        z-index: 2147483640;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .gs-fav-popup-modal {
        border-radius: 16px;
        padding: 24px;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.1);
      }
      .gs-fav-popup-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 20px;
      }
      .gs-fav-popup-form-group {
        margin-bottom: 16px;
      }
      .gs-fav-popup-label {
        display: block;
        font-size: 0.9rem;
        font-weight: 500;
        margin-bottom: 8px;
      }
      .gs-fav-popup-input {
        width: 100%;
        padding: 10px 12px;
        border-radius: 8px;
        font-size: 1rem;
        box-sizing: border-box;
      }
      .gs-fav-popup-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 24px;
      }
      .gs-fav-popup-btn {
        padding: 8px 16px;
        border-radius: 8px;
        border: none;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .gs-fav-popup-btn-primary {
        background: #4f46e5;
        color: #fff;
      }
      .gs-fav-popup-btn-primary:hover {
        background: #4338ca;
      }
      .gs-fav-popup-textarea {
        min-height: 400px;
        font-family: monospace;
        font-size: 0.9rem;
        resize: vertical;
      }
      .gs-fav-edit-popup-modal {
        max-width: 80vw;
      }
      .gs-fav-dim-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 4; /* Below checkbox and badge */
        pointer-events: none; /* Allow clicks to pass through to the item */
        display: none; /* Hidden by default */
      }
      .gs-fav-dim-overlay.gs-fav-active {
        display: block; /* Visible when active */
      }

      /* Light Mode (Default) */
      .gs-fav-toolbar, .gs-fav-toolbar-block {
        background: rgba(255, 255, 255, 0.88);
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      }
      .gs-fav-category-select {
        border: 1px solid rgba(0, 0, 0, 0.1);
        background: rgba(255, 255, 255, 0.7);
        color: #1e293b;
      }
      .gs-fav-toolbar-btn {
        border: 1px solid transparent;
        background: rgba(79, 70, 229, 0.1);
        color: #3730a3;
      }
      .gs-fav-toolbar-btn:not(:disabled):hover {
        background: #4f46e5;
        color: #fff;
      }
      .gs-fav-category-badge {
        background: rgba(255, 255, 255, 0.85);
        color: #1e293b;
        border: 1px solid rgba(0,0,0,0.05);
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      }
      .gs-fav-popup-overlay {
        background: rgba(248, 250, 252, 0.7);
      }
      .gs-fav-popup-modal {
        background: #fff;
        border: 1px solid #e2e8f0;
        color: #0f172a;
      }
      .gs-fav-popup-label {
        color: #475569;
      }
      .gs-fav-popup-input {
        border: 1px solid #cbd5e1;
        background: #f8fafc;
        color: #0f172a;
      }
      .gs-fav-popup-btn-secondary {
        background: #f1f5f9;
        color: #334155;
      }
      .gs-fav-popup-btn-secondary:hover {
        background: #e2e8f0;
      }
      .gs-fav-dim-overlay {
        background: rgba(255, 255, 255, 0.6);
      }

      /* Dark Mode */
      @media (prefers-color-scheme: dark) {
        .gs-fav-toolbar, .gs-fav-toolbar-block {
          background: rgba(15, 23, 42, 0.88);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.35);
        }
        .gs-fav-category-select {
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(15, 23, 42, 0.7);
          color: #f8fafc;
        }
        .gs-fav-toolbar-btn {
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(79, 70, 229, 0.25);
          color: #eef2ff;
        }
        .gs-fav-toolbar-btn:not(:disabled):hover {
          background: #4338ca;
          color: #fff;
        }
        .gs-fav-category-badge {
          background: rgba(15, 23, 42, 0.6);
          color: #fff;
          border: none;
          box-shadow: none;
        }
        .gs-fav-popup-overlay {
          background: rgba(15, 23, 42, 0.7);
        }
        .gs-fav-popup-modal {
          background: rgba(30, 41, 59, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          color: #f8fafc;
        }
        .gs-fav-popup-label {
          color: #cbd5e1;
        }
        .gs-fav-popup-input {
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(15, 23, 42, 0.8);
          color: #f8fafc;
        }
        .gs-fav-popup-btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #e2e8f0;
        }
        .gs-fav-popup-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        .gs-fav-dim-overlay {
          background: rgba(0, 0, 0, 0.5);
        }
      }
  `;
  document.head.insertAdjacentHTML('beforeend', '<style id="gs-fav-inline-style">' + CSS + '</style>');

  const LIST_KEY = 'favorites';
  const RENDER_DEBOUNCE_MS = 150;
  const DEFAULT_CATEGORY = 'Uncategorized';
  const ALL_CATEGORY_VALUE = '__ALL__';
  const ALL_CATEGORY_TEXT = 'Show All';

  const state = {
    active: false,
    currentUrl: '',
    favorites: null,

    observer: null,
    renderTimer: null,

    //ui对象实例
    listContainer: null,
    seenIds: new Set(),
    items: new Map(),
    shiftAnchorId: null,
    selectedItems: new Set(),
    //
    toolbar: null,
    currentFilterCategory: ALL_CATEGORY_VALUE,
    //
    popup: null,
    editPopup: null,
  };

  (async () => {
    if (!state.favorites) state.favorites = await window.GrokSpiritUtils.readStorage(LIST_KEY, {});
  })()

  function canRun(url) {
    return url.startsWith(FAVORITES_URL_PREFIX);
  }
  async function start(url) {
    if (state.active) return;
    state.active = true;
    console.log('[GrokSpirit] favorites-manager start on', url);

    state.currentUrl = url;
    if (!state.favorites) state.favorites = await window.GrokSpiritUtils.readStorage(LIST_KEY, {});

    ensureToolbar();
    ensureCategoryPopup();
    ensureEditPopup();

    await watchListContainer();

    return () => stop()
  }
  async function saveData() {
    await window.GrokSpiritUtils.writeStorage(LIST_KEY, state.favorites)
  }
  async function stop() {
    if (!state.active) return;
    state.active = false;
    console.log('[GrokSpirit] favorites-manager stop');

    await saveData();

    state.observer?.disconnect();
    state.observer = null;
    if (state.renderTimer) clearTimeout(state.renderTimer);
    state.renderTimer = null;

    cleanupAllItems();
    state.listContainer = null;

    hideToolbar();
    hideCategoryPopup();
    hideEditPopup();
  }

  window.FavoritesManager = {
    canRun, start, stop, queryByUrlId: (urlId) => state.favorites[urlId]
  }

  // #region 渲染函数
  async function watchListContainer(retry = 0) {
    const container = await window.GrokSpiritUtils.waitForSelector(() => document.querySelector("div[role='list']"))
    state.listContainer = container;
    state.observer?.disconnect();
    state.observer = new MutationObserver(scheduleRender);
    state.observer.observe(container, { childList: true });
    scheduleRender();
  }
  function scheduleRender() {
    if (!state.active) return;
    if (state.renderTimer) clearTimeout(state.renderTimer);
    state.renderTimer = setTimeout(() => {
      if (!state.active) return;
      state.renderTimer = null;
      renderWithLatestData()
    }, RENDER_DEBOUNCE_MS);
  }
  function renderWithLatestData() {
    const seenIds = new Set();
    const nodes = collectCandidateNodes(state.listContainer);
    nodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      const meta = extractNode(node);
      if (!meta.id) return;
      seenIds.add(meta.id);
      state.seenIds.add(meta.id);
      decorateItem(ensureItem(node, meta));
    });
    cleanupMissingItems(seenIds);

    //更新工具条
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
    return img?.src ? { id: window.GrokSpiritUtils.extractLastUUId(img.src), img: img.src, video: root.querySelector('video')?.src } : {};
  }
  function ensureItem(node, meta) {
    let item = state.items.get(meta.id);
    if (meta.id === 'f022370c-a13f-4ea7-875c-d1cc705897c5' && item) {
      console.log(item === node)
    }
    if (!item) {
      item = meta
      item.node = node;
      state.items.set(item.id, item);
    } else if (item.node !== node) {
      cleanupItemUi(item);
      item.node = node;
      item.checkbox = null;
      item.checkboxListener = null;
      item.categoryBadge = null;
    }
    return item;
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

    const listener = (event) => handleCheckboxChange(item.id, event.target.checked, event.altKey, event);
    checkbox.addEventListener('click', listener);

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
      badge.classList.add('gs-fav-visible');
    } else {
      badge.textContent = '';
      badge.classList.remove('gs-fav-visible');
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
        overlay.classList.toggle('gs-fav-active', shouldDim);
      }
    }
  }
  function getCategoryForItem(id) {
    const data = state.favorites[id];
    if (data && typeof data.category === 'string' && data.category.trim()) {
      return data.category.trim();
    }
    return DEFAULT_CATEGORY;
  }
  function handleCheckboxChange(id, checked, isAltKey, event) {
    //如果没有按着shift，正常点击
    let mode = 'single';
    if (!state.shiftAnchorId) {
      if (checked) {
        state.shiftAnchorId = id;
        console.log('shiftAnchorId', id)
      }
    } else {
      //开启多选模式
      if (!isAltKey) {
        if (checked) {
          state.shiftAnchorId = id;
        }
      } else if (state.shiftAnchorId === id) {
        if (checked) {
          state.shiftAnchorId = id;
        } else {
          state.shiftAnchorId = null;
        }
      } else {
        // --- RANGE SELECTION ---
        const nodes = collectCandidateNodes(state.listContainer);
        // == 排序 start
        nodes.sort((a, b) => {
          const topA = parseInt(a.style.top, 10) || 0;
          const leftA = parseInt(a.style.left, 10) || 0;
          const topB = parseInt(b.style.top, 10) || 0;
          const leftB = parseInt(b.style.left, 10) || 0;

          if (topA !== topB) {
            return topA - topB;
          }
          return leftA - leftB;
        });
        // nodes.forEach((node, index) => {
        //   console.log(node.dataset.gsFavId)
        // });
        // == 排序 end
        //确定开始index和结束index
        let startIndex = null;
        let endIndex = null;
        nodes.forEach((node, index) => {
          if (!(node instanceof HTMLElement)) return;
          let item = state.items.get(node.dataset.gsFavId);
          if (!item) return;
          if (item.id === state.shiftAnchorId || item.id === id) {
            if (startIndex === null) startIndex = index;
            else if (endIndex === null) endIndex = index;
          }
        });
        //
        //根据顺序搜索Item
        if (startIndex !== null && endIndex !== null) {
          mode = 'multi';
          state.shiftAnchorId = null;
          if (startIndex > endIndex) {
            let tmp = startIndex;
            startIndex = endIndex;
            endIndex = tmp
          }
          for (let i = startIndex; i <= endIndex; i++) {
            let item = state.items.get(nodes[i].dataset.gsFavId);
            if (!item && !item.node.isConnected) continue;
            state.selectedItems.add(item.id);
            syncItemSelectionState(item);
          }
        }
      }
    }

    //
    if (mode === 'single') {
      if (checked) {
        state.selectedItems.add(id);
      } else {
        state.selectedItems.delete(id);
      }
      const item = state.items.get(id);
      if (item) {
        syncItemSelectionState(item);
      }
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
    state.shiftAnchorId = null;
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
    applyBtn.textContent = 'Set';
    applyBtn.disabled = true;
    toolbar.appendChild(applyBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.id = 'gs-fav-toolbar-cancel-btn';
    cancelBtn.className = 'gs-fav-toolbar-btn gs-fav-toolbar-cancel';
    cancelBtn.textContent = 'Clear';
    cancelBtn.disabled = true;
    toolbar.appendChild(cancelBtn);

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.id = 'gs-fav-toolbar-edit-btn';
    editBtn.className = 'gs-fav-toolbar-btn';
    editBtn.textContent = 'Edit';
    toolbar.appendChild(editBtn);
    editBtn.addEventListener('click', showEditPopup);

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
    const categories = {};
    for (let id in state.favorites) {
      let entry = state.favorites[id];
      if (!categories[entry.category]) categories[entry.category] = new Set()
      categories[entry.category].add(id)
    }
    state.items.forEach((item) => {
      const entry = state.favorites[item.id];
      if (!entry) return;
      if (!categories[entry.category]) categories[entry.category] = new Set()
      categories[entry.category].add(item.id)
    });
    let result = [];
    Object.keys(categories).forEach((key) => result.push(`${key}(${categories[key].size})`));
    return result.sort((a, b) => a.localeCompare(b, 'en-US', { sensitivity: 'base' }));
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
    state.shiftAnchorId = null;
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
      cancelSelectionBtn.textContent = count ? `Clear(${count})` : 'Clear';
    }
  }
  function hideToolbar() {
    if (state.toolbar && state.toolbar.isConnected) {
      state.toolbar.remove();
    }
  }
  // #endregion

  // #region Popup
  function ensureCategoryPopup() {
    if (state.popup) return;

    const overlay = document.createElement('div');
    overlay.className = 'gs-fav-popup-overlay';
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) hideCategoryPopup();
    });

    const modal = document.createElement('div');
    modal.className = 'gs-fav-popup-modal';
    modal.innerHTML = `
      <h3 class="gs-fav-popup-title">Set Category</h3>
      <div class="gs-fav-popup-form-group">
        <label for="gs-fav-popup-name-input" class="gs-fav-popup-label">Category Name</label>
        <input type="text" id="gs-fav-popup-name-input" class="gs-fav-popup-input" placeholder="e.g., Landscapes, People">
      </div>
      <div class="gs-fav-popup-form-group">
        <label for="gs-fav-popup-folder-input" class="gs-fav-popup-label">Folder Name (Optional)</label>
        <input type="text" id="gs-fav-popup-folder-input" class="gs-fav-popup-input" placeholder="e.g., 2024-Q4">
      </div>
      <div class="gs-fav-popup-actions">
        <button id="gs-fav-popup-cancel-btn" type="button" class="gs-fav-popup-btn gs-fav-popup-btn-secondary">Cancel</button>
        <button id="gs-fav-popup-save-btn" type="button" class="gs-fav-popup-btn gs-fav-popup-btn-primary">Save</button>
      </div>
    `;

    overlay.appendChild(modal);

    state.popup = overlay;

    modal.querySelector('#gs-fav-popup-save-btn').addEventListener('click', () => {
      const categoryName = modal.querySelector('#gs-fav-popup-name-input').value;
      const folderName = modal.querySelector('#gs-fav-popup-folder-input').value;
      applySelectedCategory(categoryName, folderName);
      hideCategoryPopup();
    });

    modal.querySelector('#gs-fav-popup-cancel-btn').addEventListener('click', () => hideCategoryPopup());
  }

  function showCategoryPopup() {
    if (!state.popup) return;

    const categoryInput = state.popup.querySelector('#gs-fav-popup-name-input');
    const folderInput = state.popup.querySelector('#gs-fav-popup-folder-input');

    // Reset values
    categoryInput.value = '';
    folderInput.value = '';

    // Determine placeholders based on selection
    const selectedIds = Array.from(state.selectedItems);
    const categories = new Set();
    const folders = new Set();

    selectedIds.forEach(id => {
      const data = state.favorites[id];
      if (data) {
        if (data.category && data.category !== DEFAULT_CATEGORY) {
          categories.add(data.category);
        }
        if (data.folderName) {
          folders.add(data.folderName);
        }
      }
    });

    // Category placeholder logic
    if (categories.size === 0) {
      categoryInput.placeholder = 'e.g., Landscapes, People';
    } else {
      categoryInput.placeholder = Array.from(categories).join(', ');
      if (categories.size === 1) {
        categoryInput.value = categoryInput.textContent = categoryInput.placeholder;
      }
    }

    // Folder placeholder logic
    if (folders.size === 0) {
      folderInput.placeholder = 'e.g., 2024-Q4';
    } else {
      folderInput.placeholder = Array.from(folders).join(', ');
      if (folders.size === 1) {
        folderInput.value = folderInput.textContent = folderInput.placeholder;
      }
    }

    document.body.appendChild(state.popup);
    categoryInput.focus();
  }

  async function applySelectedCategory(categoryName, folderName) {
    if (!state.selectedItems.size) return;

    const normalizedCat = (categoryName || '').trim() || DEFAULT_CATEGORY;
    const normalizedFolder = (folderName || '').trim();
    if (normalizedCat === DEFAULT_CATEGORY) return;

    state.selectedItems.forEach((id) => {
      if (!state.favorites[id]) state.favorites[id] = {};
      state.favorites[id].category = normalizedCat;
      state.favorites[id].folderName = normalizedFolder;

      let item = state.items.get(id)
      if (item) {
        decorateItem(item);
      }
    });

    syncCategoryOptions();
    clearSelection();
    await saveData();
  }

  function hideCategoryPopup() {
    if (state.popup && state.popup.isConnected) {
      state.popup.remove();
    }
  }
  // #endregion

  // #region EditPopup
  function ensureEditPopup() {
    if (state.editPopup) return;

    const overlay = document.createElement('div');
    overlay.className = 'gs-fav-popup-overlay';
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) hideEditPopup();
    });

    const modal = document.createElement('div');
    modal.className = 'gs-fav-popup-modal gs-fav-edit-popup-modal';
    modal.innerHTML = `
      <h3 class="gs-fav-popup-title">Edit Favorites Data</h3>
      <div class="gs-fav-popup-form-group">
        <textarea id="gs-fav-edit-popup-textarea" class="gs-fav-popup-input gs-fav-popup-textarea"></textarea>
      </div>
      <div class="gs-fav-popup-actions">
        <button id="gs-fav-edit-popup-cancel-btn" type="button" class="gs-fav-popup-btn gs-fav-popup-btn-secondary">Cancel</button>
        <button id="gs-fav-edit-popup-clean-btn" type="button" class="gs-fav-popup-btn gs-fav-popup-btn-secondary">Auto Clean</button>
        <button id="gs-fav-edit-popup-save-btn" type="button" class="gs-fav-popup-btn gs-fav-popup-btn-primary">Save</button>
      </div>
    `;

    overlay.appendChild(modal);

    state.editPopup = overlay;

    modal.querySelector('#gs-fav-edit-popup-clean-btn').addEventListener('click', () => {
      const textarea = modal.querySelector('#gs-fav-edit-popup-textarea');
      let currentData;
      try {
        currentData = JSON.parse(textarea.value);
      } catch (e) {
        alert("Cannot clean, the current content is not valid JSON.");
        return;
      }

      for (const id in currentData) {
        // Keep entry if it's an object and has a valid, non-empty category string
        if (!state.seenIds.has(id)) {
          delete currentData[id];
        }
      }

      // Update textarea with cleaned data
      textarea.value = JSON.stringify(currentData, null, 4);
    });

    modal.querySelector('#gs-fav-edit-popup-save-btn').addEventListener('click', async () => {
      const textarea = modal.querySelector('#gs-fav-edit-popup-textarea');
      try {
        state.favorites = JSON.parse(textarea.value);

        await saveData();
        hideEditPopup();
        // Refresh UI
        renderWithLatestData();
      } catch (e) {
        alert('Error parsing JSON. Please check the format.');
        console.error("Error parsing favorites data:", e);
      }
    });

    modal.querySelector('#gs-fav-edit-popup-cancel-btn').addEventListener('click', hideEditPopup);
  }

  function showEditPopup() {
    if (!state.editPopup) return;
    const textarea = state.editPopup.querySelector('#gs-fav-edit-popup-textarea');
    textarea.value = JSON.stringify(state.favorites, null, 4);
    document.body.appendChild(state.editPopup);
    textarea.focus();
  }

  function hideEditPopup() {
    if (state.editPopup && state.editPopup.isConnected) {
      state.editPopup.remove();
    }
  }
  // #endregion
})();
