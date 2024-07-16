import React, { useRef, useEffect } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { markdown } from "@codemirror/lang-markdown";
import { css } from "@codemirror/lang-css";
import { placeholder } from "@codemirror/view";


const CodeMirrorComponent = (props) => {
  const editor = useRef();
  const {setCode, language, defaultText} = props;

  const onUpdate = EditorView.updateListener.of((v) => {
    setCode(v.state.doc.toString())
  })

  let baseExtensions = [
    basicSetup,
    javascript(),
    onUpdate,
    placeholder(defaultText),
  ];

  if (language === "js") {
    baseExtensions.push(javascript());
  } else if (language === "html") {
    baseExtensions.push(html());
  } else if (language === "css") {
    baseExtensions.push(css());
  } else if (language === "markdown") {
    baseExtensions.push(markdown());
  }

  useEffect(() => {
    const startState = EditorState.create({
      doc: "",
      extensions: [...baseExtensions],
    });

    const view = new EditorView({ state: startState, parent: editor.current });

    return () => {
      view.destroy();
    };
  }, []);

  return <div ref={editor}></div>;
};

export default CodeMirrorComponent;
