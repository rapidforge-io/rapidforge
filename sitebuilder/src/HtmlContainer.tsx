import React, { useEffect, useState } from "react";
import { BaseDrag, BaseSortable, ComponentHelper, OutsideClickHandler } from "./Components";
import { useCanvasItems } from "./App";
import { SlTextarea } from "@shoelace-style/shoelace/dist/react";

export function HtmlContainer(props) {
  const { id, onCanvas, label, name, currentParent, html, active } = props;
  const { canvasItems } = useCanvasItems();
  const componentName = 'HtmlContainer';
  function handlerUpdateProp(htmlContent) {
    const canvasHtmlEditor = canvasItems.search(id);
    canvasHtmlEditor.editableProps = { html: htmlContent };
  }

  return onCanvas === true ? (
    <BaseSortable
      onCanvas={true}
      id={id}
      active={active}
      currentParent={currentParent}
      componentName={componentName}
    >
      <HtmlEditor updateProp={handlerUpdateProp} html={html}></HtmlEditor>
    </BaseSortable>
  ) : (
    <BaseDrag id={id} onCanvas={onCanvas} componentName={componentName}>
      {ComponentHelper('HTML container', 'filetype-html')}
    </BaseDrag>
  );
}


export function HtmlEditor(props) {
    const {html, updateProp} = props
    const [htmlContent, setHtmlContent] = useState("")
    const [editMode, setEditMode] = useState(true);

    useEffect(() => {
      setHtmlContent(html);
    }, [html]);

    return (
      <>
        {editMode === true ? (
          <OutsideClickHandler
            onOutsideClick={(_) => {
              setEditMode(false);
              updateProp(htmlContent);
            }}
          >
            <SlTextarea
              value={htmlContent !== undefined ? htmlContent: undefined}
              label="HTML"
              style={{ fontFamily: "monospace" }}
              placeholder={"/* Edit HTML code */"}
              onSlInput={(e) => {
                const value = e.target.value;
                if (value.length > 0) {
                  setHtmlContent(value);
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
