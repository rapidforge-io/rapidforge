import {basicSetup} from "codemirror"
import { EditorState, Compartment } from "@codemirror/state"
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




const luaSnippets = [
  {
    label: "for loop",
    type: "snippet",
    detail: "Lua for loop",
    apply: `for i = 1, 10 do
  print(i)
end`
  },
  { label: "function", type: "keyword", apply: "function $1()\n  $2\nend" },
  { label: "if", type: "keyword", apply: "if $1 then\n  $2\nend" },
  { label: "for", type: "keyword", apply: "for $1 = 1, $2 do\n  $3\nend" }
];

const themeConfig = new Compartment()
const languageConfig = new Compartment()
const lintConfig = new Compartment()

const shellLanguage = StreamLanguage.define(shell)
const luaLanguage = StreamLanguage.define(lua)


export {
  basicSetup,
  dracula,
  EditorState,
  EditorView,
  autocompletion,
  StreamLanguage,
  Compartment,
  lintGutter,
  lua,
  shell,
  shellLanguage,
  luaLanguage,
  languageConfig,
  lintConfig,
  themeConfig,
  luaLinter,
}

// const  view = new EditorView({
//   state: EditorState.create({
//     doc: "local aq =  1",
//     extensions: [basicSetup, autocompletion(), languageConfig.of(luaLanguage),
//       luaLanguage.data.of({
//         autocomplete: ["os.getenv('id')", "name", "address" ,...luaSnippets]
//       }),
//       themeConfig.of([]),lintConfig.of(luaLinter), lintGutter(),
//     ]
//   }),
//   parent: document.getElementById('app'),
// })

//window.view = view


// window.getText = function() {
//   return view.state.doc.toString()
// }

// window.changeLua = function() {
//   view.dispatch({
//     effects: [languageConfig.reconfigure(luaLanguage), lintConfig.reconfigure(luaLinter)]
//   });
// }

// window.changeShell = function() {
//    view.dispatch({
//     effects: [languageConfig.reconfigure(shellLanguage), lintConfig.reconfigure([])]
//   });
// }

// window.setValue = function(value) {
//   view.dispatch({
//     changes: {
//       from: 0,
//       to: view.state.doc.length,
//       insert: value
//     }
//   });
// }

// window.changeThemeDark = function() {
//   const theme =   {
//     extension: dracula,
//     name: 'dracula'
//   }
//   view.dispatch({
//     effects: themeConfig.reconfigure([theme])
//   })
// }

// window.changeThemeLight = function() {
//   view.dispatch({
//     effects: themeConfig.reconfigure([])
//   })
// }

