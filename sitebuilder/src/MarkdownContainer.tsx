import React, { useEffect, useState } from "react";
import { BaseDrag, BaseSortable, ComponentHelper, OutsideClickHandler } from "./Components";
import { useCanvasItems } from "./App";
import { marked } from 'marked';
import { SlTextarea } from "@shoelace-style/shoelace/dist/react";

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
            <SlTextarea
              value={
                markdownContent !== undefined ? markdownContent : undefined
              }
              label="Markdown"
              style={{ fontFamily: "monospace" }}
              placeholder={"/* Write markdown code  */"}
              onSlInput={async (e) => {
                const value = e.target.value;

                if (value.length > 0) {
                  setMarkdownContent(value);
                  const html = await marked.parse(value);
                  setHtmlContent(html);
                }
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
