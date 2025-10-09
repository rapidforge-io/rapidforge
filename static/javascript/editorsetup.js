import {
  lintConfig, EditorState, EditorView, EditorSelection,
  basicSetup, luaLanguage, languageConfig,
  autocompletion, themeConfig, dracula,
  shellLanguage, lintGutter, luaLinter
} from 'codemirror';

import { generateCustomWordSuggestions } from '/static/javascript/editorcommon.js';
import { luaSnippets } from '/static/javascript/luasnippets.js';
import { bashSnippets } from '/static/javascript/bashsnippets.js';

/**
 * Creates a CodeMirror editor with Lua and Bash support
 * @param {Object} config - Configuration object
 * @param {string} config.fileContent - Initial content for the editor
 * @param {string[]} config.customWords - Array of custom words for autocomplete
 * @param {string} config.parentElementId - ID of the parent DOM element (default: 'codeEditor')
 * @param {string} config.initialMode - Initial language mode ('lua' or 'bash', default: 'lua')
 * @returns {Object} - Object containing the view and switch functions
 */
export function createEditor({ fileContent = '', customWords = [], parentElementId = 'codeEditor', initialMode = 'lua' }) {
  // Add standard custom words
  const allCustomWords = [...customWords, 'PAYLOAD_DATA', 'HEADER_NAME', 'URL_PARAM_NAME', 'FORM_NAME'];
  const { bash: bashCustomWords, lua: luaCustomWords } = generateCustomWordSuggestions(allCustomWords);

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
        themeConfig.of(theme),
        lintConfig.of(luaLinter),
        lintGutter(),
      ]
    }),
    parent: document.getElementById(parentElementId),
  });


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

  function switchMode(mode) {
    if (mode === "bash") {
      switchShell();
    } else if (mode === "lua") {
      switchLua();
    }

    view.focus();
  }

  switchMode(initialMode);

  // Return public API
  return {
    view,
    switchLua,
    switchShell,
    switchMode,
    EditorSelection,
    getContent: () => view.state.doc.toString()
  };
}