import React, { useRef, useEffect } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { markdown } from "@codemirror/lang-markdown";
import { css as cssLang } from "@codemirror/lang-css";
import { placeholder } from "@codemirror/view";
// import "@codemirror/view/style.css"; // add – ensures cursor + base styles


interface CodeMirrorProps {
  value?: string;
  language?: "js" | "html" | "css" | "markdown";
  defaultText?: string;
  setCode: (code: string) => void;
}

const CodeMirrorComponent: React.FC<CodeMirrorProps> = ({
  value = "",
  language = "js",
  defaultText = "",
  setCode,
}) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const internalUpdate = useRef(false); // prevent feedback loop


  // Build language extension
  const langExt = (() => {
    switch (language) {
      case "html":
        return html();
      case "css":
        return cssLang();
      case "markdown":
        return markdown();
      case "js":
      default:
        return javascript();
    }
  })();


  // Create editor once (or when language changes)
  useEffect(() => {
    if (!hostRef.current) return;


    const updateListener = EditorView.updateListener.of((v) => {
      if (v.docChanged) {
        if (internalUpdate.current) {
          internalUpdate.current = false;
          return;
        }
        setCode(v.state.doc.toString());
      }
    });


    const state = EditorState.create({
      doc: value, // initial content from prop
      extensions: [
        basicSetup,
        langExt,
        placeholder(defaultText),
        updateListener,
        EditorView.theme({
          ".cm-editor": { height: "100%" },
          ".cm-scroller": { overflow: "auto" }
        }, { dark: document.documentElement.classList.contains("dark") })
      ],
    });


    const view = new EditorView({
      state,
      parent: hostRef.current,
    });


    viewRef.current = view;


    // Focus so cursor shows
    requestAnimationFrame(() => view.focus());


    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [language]); // recreate if language changes


  // Sync external value -> editor (controlled behavior)
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (value !== current) {
      internalUpdate.current = true;
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);


  // If inside a tab (hidden at mount), force a layout refresh when it becomes visible
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    if (hostRef.current && hostRef.current.offsetParent === null) {
      const observer = new MutationObserver(() => {
        if (hostRef.current && hostRef.current.offsetParent !== null) {
          view.requestMeasure(); // re-measure so cursor blinks
          view.focus();
          observer.disconnect();
        }
      });
      observer.observe(document.body, { attributes: true, subtree: true });
      return () => observer.disconnect();
    }
  }, []);


  return <div ref={hostRef} style={{ height: "100%", width: "100%" }} />;
};

export default CodeMirrorComponent;
