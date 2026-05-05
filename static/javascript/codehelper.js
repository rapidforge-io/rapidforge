function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (value === undefined || value === null || value === '') {
    return [];
  }
  return [value];
}

function slugLabel(value) {
  return String(value || '')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function displayProgramLabel(value) {
  if (value === 'mruby') {
    return 'mRuby';
  }
  if (value === 'lua') {
    return 'Lua';
  }
  if (value === 'bash') {
    return 'Bash';
  }
  return slugLabel(value);
}

function itemMatchesContext(item, context) {
  const contexts = normalizeList(item.contexts);
  if (contexts.length === 0 || contexts.includes('all')) {
    return true;
  }
  return contexts.includes(context);
}

function itemMatchesProgram(item, programType) {
  const languages = normalizeList(item.language);
  if (languages.length === 0) {
    return true;
  }
  return languages.includes(programType);
}

function getSnippetForProgram(item, programType) {
  if (item.snippets && typeof item.snippets === 'object') {
    return item.snippets[programType] || item.snippet || '';
  }
  return item.snippet || '';
}

function buildBadgeMarkup(item, context, programType) {
  const badges = [];
  const contexts = normalizeList(item.contexts);
  const languages = normalizeList(item.language);

  languages.forEach((lang) => {
    if (lang) {
      badges.push(`<sl-badge pill variant="${lang === programType ? 'primary' : 'neutral'}">${escapeHtml(displayProgramLabel(lang))}</sl-badge>`);
    }
  });

  contexts.forEach((ctx) => {
    if (ctx && ctx !== 'all') {
      const available = ctx === context;
      badges.push(`<sl-badge pill variant="${available ? 'success' : 'warning'}">${escapeHtml(slugLabel(ctx))}</sl-badge>`);
    }
  });

  if (!itemMatchesContext(item, context)) {
    badges.push('<sl-badge pill variant="warning">Unavailable here</sl-badge>');
  }

  return badges.join('');
}

function scoreItem(item, query, context) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return -1;
  }

  const title = String(item.title || '').toLowerCase();
  const keywords = normalizeList(item.keywords).join(' ').toLowerCase();
  const summary = String(item.summary || '').toLowerCase();
  const content = String(item.content || '').toLowerCase();

  let score = 0;

  if (title === normalizedQuery) {
    score += 100;
  } else if (title.startsWith(normalizedQuery)) {
    score += 75;
  } else if (title.includes(normalizedQuery)) {
    score += 60;
  }

  if (keywords.includes(normalizedQuery)) {
    score += 40;
  }

  if (summary.includes(normalizedQuery)) {
    score += 20;
  }

  if (content.includes(normalizedQuery)) {
    score += 10;
  }

  if (itemMatchesContext(item, context)) {
    score += 15;
  }

  return score;
}

function groupBy(items, getKey) {
  const grouped = new Map();
  items.forEach((item) => {
    const key = getKey(item);
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key).push(item);
  });
  return grouped;
}

export function initCodeHelper({
  context,
  programType,
  customWords = [],
  mountId = 'codeHelperDrawer',
  helperData,
  editor,
  triggerButtonId,
}) {
  const root = document.getElementById(mountId);
  if (!root || !helperData) {
    return {
      open() {},
      close() {},
      setProgramType() {},
    };
  }

  const drawer = root;
  const trigger = triggerButtonId ? document.getElementById(triggerButtonId) : null;
  const searchInput = document.getElementById('codeHelperSearch');
  const tabs = document.getElementById('codeHelperTabs');
  const quickRefsContainer = document.getElementById('codeHelperQuickRefs');
  const referenceSectionsContainer = document.getElementById('codeHelperReferenceSections');
  const searchResultsContainer = document.getElementById('codeHelperSearchResults');
  const searchState = document.getElementById('codeHelperSearchState');
  const docsSourcesContainer = document.getElementById('codeHelperDocsSources');
  const badgesContainer = document.getElementById('codeHelperBadges');
  const editorBody = drawer.closest('.rf-editor-body');

  const items = Array.isArray(helperData.items) ? helperData.items : [];
  const itemsById = new Map(items.map((item) => [item.id, item]));
  const sources = Array.isArray(helperData.sources) ? helperData.sources : [];
  const sourcesById = new Map(sources.map((source) => [source.id, source]));
  const sections = Array.isArray(helperData.sections) ? helperData.sections : [];

  let currentProgramType = programType;
  let currentDocSourceId = null;

  function renderGlobalBadges() {
    const contextBadge = `<sl-badge pill variant="primary">${escapeHtml(slugLabel(context))}</sl-badge>`;
    const languageBadge = `<sl-badge pill variant="success">${escapeHtml(displayProgramLabel(currentProgramType))}</sl-badge>`;
    const wordBadge = `<sl-badge pill variant="neutral">${customWords.length} env vars</sl-badge>`;
    badgesContainer.innerHTML = `${contextBadge}${languageBadge}${wordBadge}`;
  }

  function buildActionButtons(item) {
    const actions = [];
    const snippet = getSnippetForProgram(item, currentProgramType);

    if (snippet) {
      actions.push(`<sl-button size="small" variant="primary" data-helper-action="insert" data-item-id="${escapeHtml(item.id)}">Insert snippet</sl-button>`);
      actions.push(`<sl-button size="small" variant="default" data-helper-action="copy" data-copy-value="${escapeHtml(snippet)}">Copy example</sl-button>`);
    }

    return actions.join('');
  }

  function renderCard(item) {
    const snippet = getSnippetForProgram(item, currentProgramType);
    const snippetMarkup = snippet ? `<pre class="rf-code-helper__snippet">${escapeHtml(snippet)}</pre>` : '';

    return `
      <article class="rf-code-helper__card">
        <div class="rf-code-helper__card-head">
          <div>
            <div class="rf-code-helper__card-title">${escapeHtml(item.title)}</div>
            <div class="rf-code-helper__card-summary">${escapeHtml(item.summary || '')}</div>
          </div>
          <div class="rf-code-helper__card-badges">${buildBadgeMarkup(item, context, currentProgramType)}</div>
        </div>
        ${snippetMarkup}
        <div class="rf-code-helper__card-actions">${buildActionButtons(item)}</div>
      </article>
    `;
  }

  function getQuickRefItems() {
    return items
      .filter((item) => item.quickRef)
      .filter((item) => itemMatchesContext(item, context))
      .filter((item) => itemMatchesProgram(item, currentProgramType))
      .sort((left, right) => {
        const leftProgram = normalizeList(left.language).includes(currentProgramType) ? 1 : 0;
        const rightProgram = normalizeList(right.language).includes(currentProgramType) ? 1 : 0;
        return rightProgram - leftProgram;
      })
      .slice(0, 8);
  }

  function renderReferenceSections() {
    const quickItems = getQuickRefItems();
    const quickItemIds = new Set(quickItems.map((item) => item.id));
    quickRefsContainer.innerHTML = quickItems.length
      ? quickItems.map(renderCard).join('')
      : '<div class="rf-code-helper__empty-state">No quick references are available for this context yet.</div>';

    referenceSectionsContainer.innerHTML = sections.map((section) => {
      const sectionItems = normalizeList(section.itemIds)
        .map((itemId) => itemsById.get(itemId))
        .filter(Boolean);
      const visibleItems = sectionItems.filter((item) => (
        itemMatchesProgram(item, currentProgramType) && !quickItemIds.has(item.id)
      ));

      if (visibleItems.length === 0) {
        return '';
      }

      return `
        <section class="rf-code-helper__group">
          <div class="rf-code-helper__group-title">${escapeHtml(section.title)}</div>
          <div class="rf-code-helper__stack">
            ${visibleItems.map(renderCard).join('')}
          </div>
        </section>
      `;
    }).join('');
  }

  function renderSearchResults() {
    const query = searchInput.value || '';
    const trimmed = query.trim();

    if (!trimmed) {
      searchState.hidden = false;
      searchState.textContent = 'Start typing to search RapidForge helpers and docs sources.';
      searchResultsContainer.innerHTML = '';
      return;
    }

    const ranked = items
      .filter((item) => itemMatchesProgram(item, currentProgramType))
      .map((item) => ({ item, score: scoreItem(item, trimmed, context) }))
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score || left.item.title.localeCompare(right.item.title))
      .slice(0, 20);

    if (ranked.length === 0) {
      searchState.hidden = false;
      searchState.textContent = `No helper matches for "${trimmed}".`;
      searchResultsContainer.innerHTML = '';
      return;
    }

    searchState.hidden = true;
    const grouped = groupBy(ranked.map((entry) => entry.item), (item) => item.kind || 'Reference');
    searchResultsContainer.innerHTML = Array.from(grouped.entries()).map(([kind, groupedItems]) => `
      <section class="rf-code-helper__group">
        <div class="rf-code-helper__group-title">${escapeHtml(slugLabel(kind))}</div>
        <div class="rf-code-helper__stack">
          ${groupedItems.map(renderCard).join('')}
        </div>
      </section>
    `).join('');
  }

  function renderDocsSources() {
    docsSourcesContainer.innerHTML = sources.map((source) => {
      const isActive = currentDocSourceId === source.id;
      const actionLabel = 'Open docs';

      return `
        <article class="rf-code-helper__card ${isActive ? 'is-active' : ''}">
          <div class="rf-code-helper__card-head">
            <div>
              <div class="rf-code-helper__card-title">${escapeHtml(source.label)}</div>
              <div class="rf-code-helper__card-summary">${escapeHtml(source.description || '')}</div>
            </div>
            <div class="rf-code-helper__card-badges">
              <sl-badge pill variant="neutral">New tab</sl-badge>
            </div>
          </div>
          <div class="rf-code-helper__card-actions">
            <sl-button size="small" variant="default" data-helper-action="source" data-source-id="${escapeHtml(source.id)}">${actionLabel}</sl-button>
          </div>
        </article>
      `;
    }).join('');
  }

  function showTab(panelName) {
    if (typeof tabs.show === 'function') {
      tabs.show(panelName);
      return;
    }

    const tab = tabs.querySelector(`sl-tab[panel="${panelName}"]`);
    tab?.click();
  }

  function openSource(sourceId) {
    const source = sourcesById.get(sourceId);
    if (!source) {
      return;
    }

    currentDocSourceId = source.id;
    renderDocsSources();
    const url = source.externalUrlTemplate || source.previewUrl || '';
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    showTab('docs');
  }

  async function copyToClipboard(value) {
    try {
      await navigator.clipboard.writeText(value);
    } catch (_error) {
      // Keep the interaction non-blocking if clipboard access fails.
    }
  }

  function openDrawer() {
    drawer.dataset.open = 'true';
    drawer.setAttribute('aria-hidden', 'false');
    editorBody?.setAttribute('data-helper-open', 'true');
    document.body.classList.add('rf-code-helper-open');
    window.requestAnimationFrame(() => searchInput.focus());
  }

  function closeDrawer() {
    drawer.dataset.open = 'false';
    drawer.setAttribute('aria-hidden', 'true');
    editorBody?.removeAttribute('data-helper-open');
    document.body.classList.remove('rf-code-helper-open');
    if (trigger) {
      trigger.focus();
    }
  }

  function setProgram(nextProgramType) {
    currentProgramType = nextProgramType;
    renderGlobalBadges();
    renderReferenceSections();
    renderSearchResults();
  }

  trigger?.addEventListener('click', () => {
    const isOpen = drawer.dataset.open === 'true';
    if (isOpen) {
      closeDrawer();
      return;
    }
    openDrawer();
  });

  drawer.querySelectorAll('[data-code-helper-close]').forEach((element) => {
    element.addEventListener('click', closeDrawer);
  });

  searchInput.addEventListener('sl-input', () => {
    if (searchInput.value?.trim()) {
      showTab('search');
    }
    renderSearchResults();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer.dataset.open === 'true') {
      closeDrawer();
    }
  });

  drawer.addEventListener('click', (event) => {
    const target = event.target.closest('[data-helper-action]');
    if (!target) {
      return;
    }

    const action = target.dataset.helperAction;
    if (action === 'insert') {
      const item = itemsById.get(target.dataset.itemId);
      const snippet = getSnippetForProgram(item, currentProgramType);
      if (snippet && editor?.insertText) {
        editor.insertText(snippet);
      }
      return;
    }

    if (action === 'copy') {
      copyToClipboard(target.dataset.copyValue || '');
      return;
    }

    if (action === 'open') {
      const url = target.dataset.openUrl;
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    if (action === 'source') {
      openSource(target.dataset.sourceId);
    }
  });

  renderGlobalBadges();
  renderReferenceSections();
  renderSearchResults();
  renderDocsSources();

  return {
    open: openDrawer,
    close: closeDrawer,
    setProgramType: setProgram,
  };
}
