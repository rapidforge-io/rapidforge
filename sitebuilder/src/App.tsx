import React, { useState, useContext, createContext, useRef } from "react";
import { ComponentPanel } from "./Editor";
import { TreeNode, Tree } from "./tree";
import { editableProps, editablePropsRender } from "./Components";

import {
  SlTab,
  SlTabGroup,
  SlInput,
  SlDivider,
  SlButton,
  SlIcon,
  SlSwitch,
  SlCopyButton,
  SlIconButton,
  SlTextarea,
  SlAlert,
  SlTabPanel,
} from "@shoelace-style/shoelace/dist/react";

// import SlIcon from '@shoelace-style/shoelace/dist/react/icon';

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { v4 as uuid } from "uuid";
import CodeMirrorComponent  from "./CodeMirrorComponent";

interface ActiveItem {
  id: string;
  type: string;
}

interface PageMetaData {
  js: string;
  css: string;
  title: string;
  pageUrl: string;
  description: string;
  enabled: boolean;
}

interface PageData {
  metadata: PageMetaData;
  canvasItems: Tree;
  htmlOutput: string;
}

// component library components ids are missing
// Try nested structure
type CanvasItemsContextType = {
  canvasItems: Tree;
  setCanvasItems: React.Dispatch<React.SetStateAction<Tree>>;
  activeItem: ActiveItem | null;
  setActiveItem: React.Dispatch<React.SetStateAction<ActiveItem> | null>;
  containerRef: React.MutableRefObject<HTMLElement | null>;

  pageMetaData: {};
  setPageMetadata: React.Dispatch<React.SetStateAction<PageMetaData>>;
  previewTab: Window | null;
  setPreviewTab: React.Dispatch<React.SetStateAction<Window | null>>;
};

const CanvasItemsContext = createContext<CanvasItemsContextType>({
  canvasItems: new Tree(),
  setCanvasItems: () => {},
  activeItem: null,
  setActiveItem: () => {},
  containerRef: null,
  pageMetaData: {},
  setPageMetadata: () => {},
  previewTab: null,
  setPreviewTab: () => {},
});

export const useCanvasItems = () => useContext(CanvasItemsContext);

const setupTree = () => {
  const tree = new Tree();
  const rootNode = new TreeNode(
    "dropzone",
    "CanvasDropZone",
    false,
    editableProps["CanvasDropZone"]
  );
  tree.root = rootNode;
  return tree;
}
// Provider component to wrap your app
export const CanvasItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const containerRef = useRef(null);
  const loadedTree = window.pageData.canvasState;
  let tree = null;
  if (loadedTree && Object.keys(loadedTree).length !== 0) {
    tree = new Tree();
    tree.root = window.pageData.canvasState;
  } else {
    tree = setupTree();
  }

  const [canvasItems, setCanvasItems] = useState<Tree>(tree);
  const [activeItem, setActiveItem] = useState<ActiveItem>(null);
  const [pageMetaData, setPageMetadata] = useState<PageMetaData>({
    title: window.pageData.title || "title",
    description: window.pageData.description || "description",
    active: window.pageData.active || true,
    pageUrl: window.pageData.path,
  });
  const [previewTab, setPreviewTab] = useState(null);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const dropZone = over?.data?.current.dropZone || false;
    const overData = over?.data?.current || {};
    const activeData = active?.data?.current || {};

    if (
      activeData.onCanvas === true &&
      dropZone === true &&
      activeData.currentParent !== over.id
    ) {
      // somehow drop event ends up like this
      const activeNode = canvasItems.search(active.id.toString());
      const collidingChild = activeNode.children.find(
        (child) => child.id === over.id
      );
      if (collidingChild) {
        return;
      }

      canvasItems.moveNode(active.id, over.id);
      setCanvasItems((prevTree) => {
        const newTree = new Tree();
        newTree.root = prevTree.root;
        return newTree;
      });
      //  dropping item to canvas
    } else if (dropZone === true && activeData.currentParent !== over.id) {
      const id = `${uuid()}-${activeData.componentName}`;
      let obj = { ...editableProps[activeData.componentName] };
      let tmp = new TreeNode(id, activeData.componentName, false, obj || {});

      for (let i = 1; i <= activeData.dropzoneCount; i++) {
        const childNode = new TreeNode(
          `${activeData.dropzoneComponentName}-${uuid()}`,
          activeData.dropzoneComponentName,
          false
        );
        tmp.children.push(childNode);
      }

      const targetId = over.id;
      const targetNode = canvasItems.search(targetId.toString());
      targetNode.children.push(tmp);
      setCanvasItems((prevTree) => {
        const newTree = new Tree();
        newTree.root = prevTree.root;
        return newTree;
      });
    } else if (
      dropZone === false &&
      overData &&
      overData.dropZone === undefined &&
      activeData.parentId === overData.parentId
    ) {
      const currentNode = canvasItems.search(activeData.currentParent);
      const cloneChildren = [...currentNode.children];
      const activeIndex = activeData.sortable.index;
      const overIndex = overData.sortable.index;
      const tmp = cloneChildren[activeIndex];
      cloneChildren[activeIndex] = cloneChildren[overIndex];
      cloneChildren[overIndex] = tmp;
      currentNode.children = cloneChildren;
      setCanvasItems((prevTree) => {
        const newTree = new Tree();
        newTree.root = prevTree.root;
        return newTree;
      });
    }
  }

  const pointerSensor = useSensor(PointerSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });

  const sensors = useSensors(pointerSensor);

  return (
    <CanvasItemsContext.Provider
      value={{
        canvasItems,
        setCanvasItems,
        activeItem,
        setActiveItem,
        containerRef,
        previewTab,
        setPreviewTab,
        pageMetaData,
        setPageMetadata,
      }}
    >
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {children}
      </DndContext>
    </CanvasItemsContext.Provider>
  );
};

const App = () => {
  return (
    <>
      <CanvasItemsProvider>
        <Header />
        <ComponentPanel />
        <Canvas />
        <PropEditor />
      </CanvasItemsProvider>
    </>
  );
};

const Canvas = (props) => {
  const {
    containerRef,
    canvasItems,
    pageMetaData,
    setPageMetadata,
  } = useCanvasItems();

  function renderCanvasItems() {
    return canvasItems.renderTreeStructure(canvasItems.root);
  }

  return (
    <div id="builder-container">
      <SlTabGroup>
        <SlTab slot="nav" panel="canvas" id="canvas">
          Canvas
        </SlTab>
        <SlTab slot="nav" panel="pageGlobals" id="pageGlobals">
          Settings
        </SlTab>
        <SlTab slot="nav" panel="css" id="css">
          CSS
        </SlTab>
        <SlTab slot="nav" panel="js" id="js">
          Javascript
        </SlTab>

        <SlTabPanel name="canvas">{renderCanvasItems()}</SlTabPanel>
        <SlTabPanel name="css">
          <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
          <CodeMirrorComponent
              language="css"
              defaultText={"/* Write css code  */"}
              setCode={(value) =>
                setPageMetadata({ ...pageMetaData, ["css"]: value })
              }
            ></CodeMirrorComponent>
          </div>
        </SlTabPanel>
        <SlTabPanel name="pageGlobals">
          <div className="is-flex is-justify-content-space-between is-flex-direction-column">
            <div className="is-flex mb-2 mt-2">
              <SlSwitch
                checked={pageMetaData.active}
                onClick={(e) =>
                  setPageMetadata({ ...pageMetaData, active: e.target.checked })
                }
              >
                Enabled/Disabled
              </SlSwitch>
            </div>
            <div className="mb-2 ml-1 mr-1">
              <SlInput
                label="Page Url"
                id="pageUrl"
                value={pageMetaData.pageUrl}
                onSlInput={(e) =>
                  setPageMetadata({
                    ...pageMetaData,
                    pageUrl: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-2 ml-1 mr-1">
              <SlInput
                label="Page Title"
                value={pageMetaData.title}
                onSlInput={(e) =>
                  setPageMetadata({
                    ...pageMetaData,
                    title: e.target.value,
                  })
                }
              />
            </div>
            <div className=" mb-2 ml-1 mr-1">
              <SlTextarea
                label="Page description"
                value={pageMetaData.description}
                onSlInput={(e) =>
                  setPageMetadata({
                    ...pageMetaData,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </SlTabPanel>
        <SlTabPanel name="js">
          <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
            <CodeMirrorComponent
              language="js"
              defaultText={"/* Write javascript code  */"}
              setCode={(value) =>
                setPageMetadata({ ...pageMetaData, ["js"]: value })
              }
            ></CodeMirrorComponent>
          </div>
        </SlTabPanel>
      </SlTabGroup>
    </div>
  );
};

function wrapWithHTML(htmlContent, pageMetadata) {
  let scriptTag = "";
  if (pageMetadata.js) {
    scriptTag = `<script>${pageMetadata.js}</script>`;
  }

  let styleTag = "";
  if (pageMetadata.css) {
    styleTag = `<style>${pageMetadata.css}</style>`;
  }

  const fullHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="description" content="${pageMetadata.description}" >
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1.0.0/css/bulma.min.css"/>
      <style>

        .app {
          width: 100%;
          margin: 0 auto;
          text-align: center;
          align-items: center;
          margin-bottom: 50px;
          margin-top: 10px;
          margin: 5%;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .base-component {
          position: relative;
          padding: 2px;
        }

        body {
          margin: 0;
          display: flex;
        }

      </style>
      <title>${pageMetadata.title}</title>

      ${styleTag}
    </head>
    <body>
      <div class="app">
        ${htmlContent}
      </div>
      ${scriptTag}
    </body>
    </html>
  `;

  return fullHTML;
}

const Header = () => {
  const {
    canvasItems,
    containerRef,
    setCanvasItems,
    pageMetaData,
    previewTab,
    setPreviewTab,
    setActiveItem,
  } = useCanvasItems();

  const toastRef = useRef(null);
  const url = `${window.pageData.baseUrl}/page/${pageMetaData.pageUrl}`;
  const backUrl = `${window.pageData.baseUrl}/blocks/${window.pageData.blockId}`;
  return (
    <div className="header">
      <SlAlert ref={toastRef} variant="success" duration="3000" closable>
        <SlIcon slot="icon" name="check2-circle" />
        <strong>Your changes have been saved</strong>
        <br />
      </SlAlert>
      <div className="is-flex is-align-items-center mr-8">
        <SlIconButton name="arrow-left" label="Back" href={backUrl}  className="mr-2" >
        </SlIconButton>
        <p id="pageUrl">{url}</p>
        <SlCopyButton from="pageUrl" />
      </div>
      <div className="is-flex is-align-items-center" style={{ gap: "5px" }}>
        <SlButton
          size="small"
          onClick={() => {
            const result = window.confirm(
              "Are you sure you want to clear canvas?"
            );
            if (result) {
              setupTree();
              setCanvasItems((_) => {
                setActiveItem(null);
                return setupTree();
              });
            }
          }}
        >
          <SlIcon slot="prefix" name="eraser" />
          Clear
        </SlButton>
        <SlButton
          size="small"
          disabled={containerRef.current === null}
          onClick={() => {
            if (containerRef.current) {
              const htmlContent = containerRef.current.innerHTML;

              let newWindow = null;

              if (previewTab == null || previewTab.closed) {
                newWindow = window.open("", "_blank");
                setPreviewTab(newWindow);
              } else {
                newWindow = previewTab;
              }

              newWindow.document.write(wrapWithHTML(htmlContent, pageMetaData));
              newWindow.document.close();
            }
          }}
        >
          <SlIcon slot="prefix" name="easel3"></SlIcon>
          Preview
        </SlButton>
        {import.meta.env.MODE == 'development' && <SlButton
          size="small"
          onClick={() => {
            console.log("canvasItems", canvasItems);
          }}
        >
          {" "}
          Debug{" "}
        </SlButton>}
        <SlButton
          size="small"
          onClick={async () => {
            if (
              containerRef.current == null ||
              containerRef.current.innerHTML == undefined
            ) {
              return;
            }
            const htmlContent = containerRef.current.innerHTML;
            const htmlOutput = wrapWithHTML(htmlContent, pageMetaData);
            const { title, description, active, path, ...otherMetaData } =
              pageMetaData;
            const pageData: PageData = {
              title: title,
              path: url,
              description: description,
              active: active,
              metadata: otherMetaData,
              canvasItems: canvasItems,
              htmlOutput: htmlOutput,
            };

            try {
              const response = await fetch(
                `${window.pageData.baseUrl}/pages/${window.pageData.pageId}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(pageData),
                }
              );

              if (response.ok) {
                toastRef.current.toast();
              }
            } catch (error) {
              console.error("Error:", error);
            }
          }}
        >
          <SlIcon slot="prefix" name="floppy"></SlIcon>
          Save
        </SlButton>
      </div>
    </div>
  );
};

function LayoutEditor() {
  // when hover on item circle canvas item
  // don't allow dropzone to be moved
  const Tree = () => {
    const { canvasItems } = useCanvasItems();

    const TreeNodeComponent = ({ node }) => {
      const [open, setOpen] = useState(true);

      const handleToggle = () => {
        setOpen(!open);
      };

      return (
        <li data-id={node.id}>
          <div onClick={handleToggle} style={{ cursor: "pointer" }}>
            {node.children.length > 0 && (
              <i
                className={`fa ${open ? "fa-angle-down" : "fa-angle-right"}`}
                style={{ marginRight: "5px" }}
              />
            )}
            {node.componentName}
          </div>
          <ul className={`list-unstyled ${open ? "show" : "collapse"}`}>
            {node.children.map((child) => (
              <TreeNodeComponent key={child.id} node={child} />
            ))}
          </ul>
        </li>
      );
    };

    const pointerSensor = useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    });

    const sensors = useSensors(pointerSensor);

    return (
      <DndContext sensors={sensors}>
        <ul className="list-unstyled">
          <TreeNodeComponent node={canvasItems.root} />
        </ul>
      </DndContext>
    );
  };

  return (
    <>
      <Tree />
    </>
  );
}

function PropEditor() {
  const [isVisible, setIsVisible] = useState(false);
  const { activeItem, canvasItems, setCanvasItems } =
    useCanvasItems(CanvasItemsContext);

  const [activeTab, setActiveTab] = useState("props");
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  function propsRender() {
    function handlePropOnChange(propKey: string, newValue: string | Object) {
      const canvasItem = canvasItems.search(activeItem?.id);
      // debugger;
      if (canvasItem === null) return;
      // TODO: add default editable keys when dropped into canvas
      // debugger;
      if (canvasItem.editableProps == undefined) {
        canvasItem.editableProps = { [propKey]: newValue };
      } else {
        if (
          propKey == "style" &&
          canvasItem.editableProps[propKey] !== null &&
          typeof newValue === "object"
        ) {
          canvasItem.editableProps[propKey] = {
            ...canvasItem.editableProps[propKey],
            ...newValue,
          };
        } else {
          canvasItem.editableProps[propKey] = newValue;
        }
      }

      setCanvasItems((prevTree) => {
        const newTree = new Tree();
        newTree.root = prevTree.root;
        return newTree;
      });
    }

    if (activeItem == null) {
      return <></>;
    }

    const propEntries = editablePropsRender[activeItem?.type];
    const canvasItem = canvasItems.search(activeItem?.id);

    if (propEntries === undefined) {
      return <></>;
    }

    return Object.entries(propEntries).map(([key, renderFunc], index) => {
      // style: { color: "black", fontSize: "10px" },
      // nested props
      if (key === "style" && Array.isArray(renderFunc)) {
        const currentValues = canvasItem.editableProps[key];

        return Object.entries(currentValues).map(([key, value], idx) => {
          let obj = { [key]: value };
          return (
            <div className="columns pl-1 pr-1">
              <SlDivider />
              {renderFunc[idx](handlePropOnChange, obj)}
              <SlDivider />
            </div>
          );
        });
      } else {
        const currentValue = canvasItem.editableProps[key];
        return (
          <div className="columns p-1">
            {renderFunc(handlePropOnChange, currentValue)}
          </div>
        );
      }
    });
  }

  // function renderTabBody() {
  //   if (activeTab === "props") {
  //     return <>{propsRender()}</>;
  //   } else if (activeTab === "layout") return <LayoutEditor />;
  // }

  return (
    <aside className={`rightAside ${isVisible ? "show" : ""}`}>
      <button className="menuRightbtn" onClick={toggleVisibility}>
        <SlIcon name="arrow-left"></SlIcon>
      </button>

      <div className="flex-grid has-1-cols">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2>
            <b>Props</b>
          </h2>
        </div>
        <SlDivider />
        <div className="container pt-3 pl-3">{propsRender()}</div>
      </div>
    </aside>
  );
}

export default App;
