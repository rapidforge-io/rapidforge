import "@codemirror/view";

import {basicSetup} from "codemirror"
import { EditorState, Compartment, EditorSelection } from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import {autocompletion } from "@codemirror/autocomplete"

import {StreamLanguage} from "@codemirror/language"
import {lua} from "@codemirror/legacy-modes/mode/lua"
import {shell} from "@codemirror/legacy-modes/mode/shell"
import {dracula} from 'thememirror';
import { linter, lintGutter } from "@codemirror/lint";
import luaparse from "luaparse";

const luaLinter = linter((view) => {
  const diagnostics = [];
  const code = view.state.doc.toString();

  try {
    luaparse.parse(code, { comments: false });
  } catch (err) {
    if (err && err.index != null) {
      diagnostics.push({
        from: err.index,
        to: err.index,
        severity: "error",
        message: err.message,
      });
    }
  }

  return diagnostics;
});

const baseTheme = EditorView.baseTheme({});

// Create compartments
const themeConfig = new Compartment();
const languageConfig = new Compartment();
const lintConfig = new Compartment();

// Create language definitions
const shellLanguage = StreamLanguage.define(shell);
const luaLanguage = StreamLanguage.define(lua);

// Export everything your HTML needs
export {
  // Core CodeMirror
  baseTheme,
  basicSetup,
  EditorState,
  EditorView,
  EditorSelection,
  autocompletion,

  // Language support
  StreamLanguage,
  shellLanguage,
  luaLanguage,

  // Themes and configuration
  dracula,
  themeConfig,
  languageConfig,
  lintConfig,

  // Linting
  linter,
  lintGutter,
  luaLinter,

  // Utility
  Compartment,
};