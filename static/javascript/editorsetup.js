import {
  lintConfig, EditorState, EditorView, EditorSelection,
  basicSetup, luaLanguage, languageConfig,
  rubyLanguage,
  autocompletion, themeConfig, dracula,
  shellLanguage, lintGutter, luaLinter
} from 'codemirror';

import { generateCustomWordSuggestions } from '/static/javascript/editorcommon.js';
import { luaSnippets } from '/static/javascript/luasnippets.js';
import { bashSnippets } from '/static/javascript/bashsnippets.js';
import { mrubySnippets } from '/static/javascript/mrubysnippets.js';

/**
 * Creates a CodeMirror editor with Lua, Bash, and mRuby support
 * @param {Object} config - Configuration object
 * @param {string} config.fileContent - Initial content for the editor
 * @param {string[]} config.customWords - Array of custom words for autocomplete
 * @param {string} config.parentElementId - ID of the parent DOM element (default: 'codeEditor')
 * @param {string} config.initialMode - Initial language mode ('lua', 'bash', or 'mruby'; default: 'lua')
 * @returns {Object} - Object containing the view and switch functions
 */
export function createEditor({ fileContent = '', customWords = [], parentElementId = 'codeEditor', initialMode = 'lua' }) {
  // Add standard custom words
  const allCustomWords = [...customWords, 'PAYLOAD_DATA', 'HEADER_NAME', 'URL_PARAM_NAME', 'FORM_NAME'];
  const { bash: bashCustomWords, lua: luaCustomWords, mruby: mrubyCustomWords } = generateCustomWordSuggestions(allCustomWords);

  const currentTheme = localStorage.getItem('theme') || 'light';
  const theme = currentTheme === 'dark' ? dracula : [];

  // Workaround for style to appear - create temp view to inject styles
  const tempView = new EditorView({
    state: EditorState.create({
      doc: "",
      extensions: [basicSetup, themeConfig.of(theme)]
    })
  });

  // Destroy the temp view immediately - styles are now injected
  tempView.focus();
  tempView.destroy();

  const parentElement = document.getElementById(parentElementId);

  function resizeEditorContainer() {
    if (!parentElement) {
      return;
    }

    const rect = parentElement.getBoundingClientRect();
    const bottomPadding = 24;
    const minHeight = 320;
    const availableHeight = Math.max(minHeight, window.innerHeight - rect.top - bottomPadding);

    parentElement.style.height = `${availableHeight}px`;
  }

  const view = new EditorView({
    state: EditorState.create({
      doc: fileContent,
      extensions: [
        basicSetup,
        autocompletion(),
        languageConfig.of(luaLanguage),
        luaLanguage.data.of({
          autocomplete: [...luaCustomWords, ...luaSnippets]
        }),
        shellLanguage.data.of({
          autocomplete: [...bashCustomWords, ...bashSnippets]
        }),
        rubyLanguage.data.of({
          autocomplete: [...mrubyCustomWords, ...mrubySnippets]
        }),
        themeConfig.of(theme),
        lintConfig.of(luaLinter),
        lintGutter(),
      ]
    }),
    parent: parentElement,
  });

  resizeEditorContainer();
  window.addEventListener('resize', resizeEditorContainer);


  function switchLua() {
    view.dispatch({
      effects: [
        languageConfig.reconfigure(luaLanguage),
        lintConfig.reconfigure(luaLinter),
      ]
    });
  }

  function switchShell() {
    view.dispatch({
      effects: [
        languageConfig.reconfigure(shellLanguage),
        lintConfig.reconfigure([]),
      ]
    });
  }

  function switchMRuby() {
    view.dispatch({
      effects: [
        languageConfig.reconfigure(rubyLanguage),
        lintConfig.reconfigure([]),
      ]
    });
  }

  function switchMode(mode) {
    if (mode === "bash") {
      switchShell();
    } else if (mode === "lua") {
      switchLua();
    } else if (mode === "mruby") {
      switchMRuby();
    }

    view.focus();
  }

  switchMode(initialMode);

  // Return public API
  return {
    view,
    switchLua,
    switchShell,
    switchMRuby,
    switchMode,
    EditorSelection,
    focus: () => view.focus(),
    insertText: (text) => {
      const selection = view.state.selection.main;
      view.dispatch({
        changes: { from: selection.from, to: selection.to, insert: text },
        selection: { anchor: selection.from + text.length }
      });
      view.focus();
    },
    getContent: () => view.state.doc.toString(),
    destroy: () => {
      window.removeEventListener('resize', resizeEditorContainer);
      view.destroy();
    }
  };
}
