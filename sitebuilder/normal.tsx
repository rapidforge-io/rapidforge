// import CodeMirror from 'codemirror';
import {EditorView, basicSetup} from "codemirror"

// import 'codemirror/lib/codemirror.css';

// Import the modes you want to use, for example, JavaScript mode
// import 'codemirror/mode/javascript/javascript.js';
import {javascript} from "@codemirror/lang-javascript"

let editor = new EditorView({
    extensions: [basicSetup, javascript()],
    parent: document.body
  })

// // Initialize CodeMirror
// const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
//     mode: 'javascript',
//     lineNumbers: true,
//     theme: 'default',  // You can change the theme as needed
// });