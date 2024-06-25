import React, { useEffect, useState } from "react";
import { BaseComponent, BaseDrag, BaseSortable, ComponentHelper, OutsideClickHandler } from "./Components";
import CodeMirror from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";
import { useCanvasItems } from "./App";
import { marked } from 'marked';

export function MarkdownContainer(props) {
  const { id, onCanvas, label, name, currentParent, markdown, active } = props;
  const { canvasItems } = useCanvasItems();
  const componentName = 'MarkdownContainer';

  function handlerUpdateProp(markdownContent) {
    const canvasHtmlEditor = canvasItems.search(id);
    canvasHtmlEditor.editableProps = { markdown: markdownContent };
  }

  return onCanvas === true ? (
    <BaseSortable
      onCanvas={true}
      id={id}
      active={active}
      currentParent={currentParent}
      componentName={componentName}
    >
      <MarkdownEditor updateProp={handlerUpdateProp} markdown={markdown}></MarkdownEditor>
    </BaseSortable>
  ) : (
    <BaseDrag id={id} onCanvas={onCanvas} componentName={componentName}>
      {ComponentHelper('Markdown Editor', 'markdown')}
    </BaseDrag>
  );
}

// TODO make parsing more efficient
export function MarkdownEditor(props) {
    const {id, markdown, updateProp} = props
    const [markdownContent, setMarkdownContent] = useState(markdown)
    const [editMode, setEditMode] = useState(true);
    // match initial values of markdown and htmlContent manually for now
    const [htmlContent, setHtmlContent] = useState('<p>Write <strong>markdown</strong> here');

    useEffect(() => {
      setMarkdownContent(markdownContent);
    }, [markdown]);

    return (
      <>
        {editMode === true ? (
          <OutsideClickHandler
            onOutsideClick={(_) => {
              setEditMode(false);
              updateProp(markdownContent);
            }}
          >
            <CodeMirror
              style={{ textAlign: "left" }}
              height="100%"
              width="100%"
              minHeight="100px"
              value={
                markdownContent !== undefined ? markdownContent : undefined
              }
              placeholder={"/* Write markdown code  */"}
              extensions={[langs.markdown()]}
              onChange={async (value) => {
                setMarkdownContent(value);
                const html = await marked.parse(value);
                console.log('html', html)
                setHtmlContent(html);
              }}
            />
          </OutsideClickHandler>
        ) : (
          <div
            onClick={() => setEditMode(true)}
            style={{ width: "100%" }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          ></div>
        )}
      </>
    );
}
