import { DragEvent, SyntheticEvent, useEffect, useRef, useState } from "react";
import { useCanvasItems } from "./App";
import { Tree, TreeNode } from "./tree";
import React from "react";
import { langs } from "@uiw/codemirror-extensions-langs";
import CodeMirror from "@uiw/react-codemirror";
import { useSortable } from "@dnd-kit/sortable";
import { HtmlContainer } from "./HtmlContainer";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { MarkdownContainer } from "./MarkdownContainer";
import {
  SlColorPicker,
  SlButton,
  SlInput,
  SlTextarea,
  SlCheckbox,
  SlRadio,
  SlRadioGroup,
  SlDivider,
  SlDropdown,
  SlMenu,
  SlMenuItem,
  SlButtonGroup,
  SlIcon,
} from "@shoelace-style/shoelace/dist/react";


export const classMap = {
  Grid2rowsHtmlItem,
  ButtonComponent,
  CanvasDropZone,
  Dropzone,
  HtmlContainer,
  FormComponent,
  TextInputComponent,
  TextAreaComponent,
  MarkdownContainer,
  CheckboxComponent,
  RadioboxComponent,
  DividerComponent,
  ContainerComponent,
  ParagraphComponent,
  DropdownComponent,
};

// map of what is editable on right side of the screen
export const editableProps = {
  CanvasDropZone: {
    style: { backgroundColor: "white" },
    classes:''
  },
  ButtonComponent: {
    label: "Button Label",
    name: "button",
    style: {},
  },
  RichText: {},
  FooterHtmlItem: {},
  CheckboxComponent: {
    items: [{ key: "key", value: "value" }],
    label: "CheckboxLabel",
    name: "checkbox",
    style: {},
  },
  RadioboxComponent: {
    label: 'Select option',
    items: [{ key: "key", value: "value" }],
  },
  MarkdownContainer: {markdown: 'Write **markdown** here'},
  HtmlContainer: {html: '<p>Click to edit</p>'},
  ParagraphComponent: {
    style: { color: "black", fontSize: "15px", textAlign: "center" },
    label: 'Content'
  },
  DropdownComponent: {
    label: 'Dropdown',
    items: [{ key: "key", value: "value" }],
  },
  ContainerComponent: {
    classes:''
  }
};

// how Prop attributes should be rendered, keys should match editableProps map
export const editablePropsRender = {
  CanvasDropZone: {
    style: ColorPicker,
    classes: ContentAligner
  },
  ButtonComponent: {
    delete: DeleteButton,
    name: NamePropEditor,
    label: LabelPropEditor,
  },
  FooterHtmlItem: {
    delete: DeleteButton,
  },
  Grid2rowsHtmlItem: {
    delete: DeleteButton,
  },
  HtmlContainer: {
    delete: DeleteButton,
  },
  FormComponent: {
    delete: DeleteButton,
  },
  TextInputComponent: {
    delete: DeleteButton,
    name: NamePropEditor,
  },
  TextAreaComponent: {
    delete: DeleteButton,
    name: NamePropEditor,
  },
  MarkdownContainer: {
    delete: DeleteButton,
  },
  CheckboxComponent: {
    delete: DeleteButton,
    items: ListInput,
  },
  RadioboxComponent: {
    delete: DeleteButton,
    label: LabelPropEditor,
    items: ListInput,
  },
  DividerComponent: {
    delete: DeleteButton,
  },
  ContainerComponent: {
    delete: DeleteButton,
    classes: ContentAligner
  },
  ParagraphComponent: {
    delete: DeleteButton,
    style: [ColorPicker, Size, TextAligner],
    label: LabelPropEditor,
  },
  DropdownComponent: {
    delete: DeleteButton,
    label: LabelPropEditor,
    items: ListInput,
  },
};

// {color: '', fontSize: ''}
function Size(handlePropOnChange, value) {
  const key = Object.keys(value)[0]
  return (
    <div className="is-flex is-flex-direction-column is-align-items-flex-start">
      <p>{`${capitalize(key)} px`}</p>
      <SlInput
        type="number"
        size={"small"}
        onSlChange={(e) => {
          const val = e.currentTarget.value || "12px";
          const updatedObj = { [key]: `${val}px` };
          handlePropOnChange("style", updatedObj);
        }}
        value={value[key].replace("px", "")}
      ></SlInput>
    </div>
  );
}

// {/* <div className="is-flex is-flex-direction-column is-align-items-flex-start"> */}
function ContentAligner(handlePropOnChange, classes: string) {
  const handleAlignmentChange = (val) => {
    const regex = /is-align-items-\S+/g;
    handlePropOnChange("classes", `${classes.replace(regex, '').trim()} ${val.trim()}`);
  };

  return (
    <div className="is-flex is-flex-direction-column is-align-items-flex-start">
      <p>Item alignment</p>
      <SlButtonGroup label="Alignment">
        <SlButton size="small" onClick={() => handleAlignmentChange('is-align-items-flex-start')}>
          Left
        </SlButton>

        <SlButton size="small" onClick={() => handleAlignmentChange('is-align-items-center')}>
          Center
        </SlButton>

        <SlButton size="small" onClick={() => handleAlignmentChange("is-align-items-flex-end")}>
          Right
        </SlButton>
      </SlButtonGroup>
    </div>
  );
}

function TextAligner(handlePropOnChange, _) {

  const handleAlignmentChange = (val) => {
    const updatedObj = { textAlign: val };
    handlePropOnChange("style", updatedObj);
  };

  return (
    <div className="is-flex is-flex-direction-column is-align-items-flex-start">
      <p>TextAlign</p>
      <SlButtonGroup label="Alignment">
        <SlButton size="small" onClick={() => handleAlignmentChange("left")}>
          Left
        </SlButton>

        <SlButton size="small" onClick={() => handleAlignmentChange("center")}>
          Center
        </SlButton>

        <SlButton size="small" onClick={() => handleAlignmentChange("right")}>
          Right
        </SlButton>
      </SlButtonGroup>
    </div>
  );
};

// value
// {backgroundColor: red }
// {color: white}
function ColorPicker(handlePropOnChange, value) {
  const key = Object.keys(value)[0]

  return (
    <div>
      <div className="field is-horizontal m-1">
        <div className="field-label is-normal">
          <p>{capitalize(key)}</p>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control">
              <SlColorPicker
                size="small"
                label="Select a color"
                onSlChange={(e) => {
                  const val = e.target.inputValue;
                  const updatedObj= { [key]: val };
                  handlePropOnChange("style", { ...value, ...updatedObj});
                }}
                value={value[key]}
              ></SlColorPicker>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KeyValueTable(prop) {
  const { handlePropOnChange, items } = prop;
  const [data, setData] = useState(items);

  const handleAddRow = () => {
    console.log("before data", data)
    let updated = [...data, {key: "key", value: "value"}]
    console.log('update', updated)
    setData(updated);
    console.log('data is', data)
    handlePropOnChange('items', updated);
  };

  const handleRemoveRow = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
    handlePropOnChange('items', newData);
  };

  const handleChange = (index, key, value) => {
    let updatedRow = {...data[index],  [key]: value }
    data[index] = updatedRow
    setData([...data]);
    handlePropOnChange('items', data);
  };

  return (
    <div className="is-flex is-flex-direction-column m-1 p-0" style={{border: "black"}}>
      <div className="is-flex is-flex-direction-column">
        {data.map((item, index) => (
          <div className="columns" key={index}>
            <div className="column is-2">
              <SlInput
                size="small"
                value={item.key}
                placeholder="key"
                onSlInput={(e) => handleChange(index, "key", e.target.value)}
              />
            </div>
            <div className="column is-2" >
              <SlInput
                size="small"
                placeholder="value"
                value={item.value}
                onSlInput={(e) => handleChange(index, "value", e.target.value)}
              />
            </div>
            <div className="column is-0">
              <SlButton size="small" onClick={() => handleRemoveRow(index)}>
                <SlIcon name="dash-lg"></SlIcon>
              </SlButton>
            </div>
          </div>
        ))}
      </div>
      <div className="is-flex is-justify-content-space-around	mt-2" style={{width: "50%"}}>
        <SlButton size="small" onClick={handleAddRow}>
          <SlIcon name="plus-lg"></SlIcon>
        </SlButton>
      </div>
    </div>
  );
}

// prop editor components beginning
export function ListInput(handlePropOnChange, value) {
  return (
    <div>
      <KeyValueTable handlePropOnChange={handlePropOnChange} items={value} />
    </div>
  );
}

export function DeleteButton(handlePropOnChange, value) {
  const { canvasItems, setCanvasItems, activeItem, setActiveItem } =
    useCanvasItems();

  const handleDelete = (nodeId: string) => {
    const res = canvasItems.deleteNode(nodeId);

    if (res == true) {
      setActiveItem(null);

      setCanvasItems((prevTree) => {
        const newTree = new Tree();
        newTree.root = prevTree.root;
        return newTree;
      });
    } else {
      console.log("Somethings wrong with delete ");
    }
  };

  return (
    <div className="field">
      <SlButton
        variant="danger"
        size="small"
        onClick={() => handleDelete(activeItem?.id)}
      >
        <SlIcon slot="prefix" name="trash"></SlIcon>
        Delete
      </SlButton>
    </div>
  );
}

export function ActionUrlEditor(handlePropOnChange, value) {
  return InputPropEditorHelper(handlePropOnChange, value, "actionUrl")
}

export function NamePropEditor(handlePropOnChange, value) {
  return InputPropEditorHelper(handlePropOnChange, value, "name")
}

export function ClassPropEditor(handlePropOnChange, value) {
  return InputPropEditorHelper(handlePropOnChange, value, "classes");
}

export function LabelPropEditor(handlePropOnChange, value) {
  return InputPropEditorHelper(handlePropOnChange, value, "label");
}

export function InputPropEditorHelper(handlePropOnChange, value, key) {
  return (
    <div className="is-flex is-flex-direction-column is-align-items-flex-start block">
      <p>{capitalize(key)}</p>
      <SlInput
        value={value}
        size={"small"}
        onSlInput={(e) => handlePropOnChange(key, e.currentTarget.value)}
      />
    </div>
  );
}

// TODO
export function StylePropEditor(handlePropOnChange, value) {
  return (
    <div className="field">
      <p>Inline Css Editor</p>
      <CodeMirror
        className="code-editor"
        height="100%"
        width="100%"
        placeholder={"/* Write css code  */"}
        extensions={[langs.css()]}
        // onFocus={}
        onChange={(value) => {
          console.log('yyy', value)
          // handlePropOnChange("style", value)

        }}
      />
    </div>
  );
}

// ------ prop editor components end

export function BaseDropZone(props) {
  const { children, id, componentName } = props;
  const { setNodeRef } = useDroppable({
    id: id,
    data: { dropZone: true, componentName: componentName },
  });

  return (
    <div id={id} ref={setNodeRef} className="dropzone">
      {children}
    </div>
  );
}

export function CanvasDropZone(props) {
  const { children, style, classes } = props;
  const { canvasItems, setActiveItem, containerRef  } = useCanvasItems();
  const id = "dropzone";
  const componentName = 'CanvasDropZone';

  const settings = {
    id: id,
    data: { dropZone: true },
  };

  const { isOver, setNodeRef } = useDroppable(settings);

  const defaultStyle = {
    backgroundColor: isOver ? "#eaeaea" : undefined,
  };

  const updatedStyle = {...defaultStyle, ...style}

  const ids = canvasItems.root.children.map((x) => x.id);

  const handleSetActiveItem = () => {
    // const item = canvasItems.search(id);
    // item?.active = true;
    setActiveItem({ id: id, type: componentName })
  }

  return (
    <SortableContext items={ids}>
      <div
        id={id}
        ref={setNodeRef}
        className={`dropzone  ${classes}`}
        style={updatedStyle}
        onClick={() => handleSetActiveItem()}
      >
        <div ref={containerRef}>{children}</div>
      </div>
    </SortableContext>
  );
}

export function TextInputComponent(props) {
  const { id, onCanvas, name, currentParent, type, active } = props;
  const componentName = "TextInputComponent";

  return onCanvas === true ? (
    <BaseSortable
      onCanvas={true}
      id={id}
      active={active}
      currentParent={currentParent}
      componentName={componentName}
    >
      <SlInput name={name} type={type || "text"}></SlInput>
    </BaseSortable>
  ) : (
    <BaseDrag id={id} onCanvas={onCanvas} componentName={componentName}>
      {ComponentHelper('Text Input', 'input-cursor-text')}
    </BaseDrag>
  );
}

export function CheckboxComponent(props) {
  const { id, onCanvas, name, items, currentParent, active } = props;
  const componentName = "CheckboxComponent";

  return onCanvas === true ? (
    <BaseSortable
      onCanvas={true}
      id={id}
      active={active}
      currentParent={currentParent}
      componentName={componentName}
    >
      <div className="is-flex is-flex-direction-column m-2">
        {items.map((option, _) => (
          <div className="is-flex">
            <SlCheckbox
              className="is-flex m-1"
              name={name}
              value={option.value}
            >
              <div className="is-flex"> {option.key}</div>
            </SlCheckbox>
          </div>
        ))}
      </div>
    </BaseSortable>
  ) : (
    <BaseDrag id={id} onCanvas={onCanvas} componentName={componentName}>
      {ComponentHelper("CheckBox", "ui-checks-grid")}
    </BaseDrag>
  );
}

export function RadioboxComponent(props) {
  const {
    id,
    onCanvas,
    name,
    items,
    label,
    currentParent,
    active,
  } = props;
  const componentName = "RadioboxComponent";
  return onCanvas === true ? (
    <BaseSortable
      onCanvas={true}
      id={id}
      active={active}
      currentParent={currentParent}
      componentName={componentName}
    >
      <div className="is-flex">
        <SlRadioGroup name={name} label={label}>
          {items.map((option, _) => (
            <SlRadio className="is-flex m-1" value={option.value}>
              {option.key}
            </SlRadio>
          ))}
        </SlRadioGroup>
      </div>
    </BaseSortable>
  ) : (
    <BaseDrag id={id} onCanvas={onCanvas} componentName={componentName}>
      {ComponentHelper("RadioBox", "ui-radios-grid")}
    </BaseDrag>
  );
}

export function TextAreaComponent(props) {
  const { id, onCanvas, name, currentParent, active } = props;
  const componentName = "TextAreaComponent";

  return onCanvas === true ? (
    <BaseSortable
      onCanvas={true}
      id={id}
      active={active}
      currentParent={currentParent}
      componentName={componentName}
    >
      <SlTextarea name={name} ></SlTextarea>
    </BaseSortable>
  ) : (
    <BaseDrag id={id} onCanvas={onCanvas} componentName={componentName}>
      {ComponentHelper('Text Area', 'bounding-box-circles')}
    </BaseDrag>
  );
}

export function ButtonComponent(props) {
  const { id, onCanvas, label, name, currentParent, style, active } = props;
  const componentName = "ButtonComponent";

  console.log('name', name)
  console.log('label', label)
  function Body() {
    return (
      <div className="is-flex">
      <SlButton variant="primary" name={name} type="button" style={style}>
        {label}
      </SlButton>
      </div>
    );
  }
  return onCanvas === true ? (
    <BaseSortable
      onCanvas={true}
      id={id}
      active={active}
      currentParent={currentParent}
      componentName={componentName}
    >
      {Body()}
    </BaseSortable>
  ) : (
    <BaseDrag id={id} onCanvas={onCanvas} componentName={componentName}>
      {ComponentHelper('Button', 'app')}
    </BaseDrag>
  );
}

export function FormComponent(props) {
  const { id, currentParent, onCanvas, actionUrl, children, active } = props;
  const componentName = "FormComponent";
  return onCanvas === true ? (
    <BaseSortable
      onCanvas={true}
      id={id}
      active={active}
      currentParent={currentParent}
      componentName={componentName}
    >
      <div className="base-component">
        <form className="form-gap is-flex is-align-items-center" action={actionUrl}>{children}</form>
      </div>
    </BaseSortable>
  ) : (
    <BaseDrag
      id={id}
      dropzoneCount={1}
      dropzoneComponentName={"Dropzone"}
      onCanvas={onCanvas}
      componentName={componentName}
    >
      {ComponentHelper("Form", "code-square")}
    </BaseDrag>
  );
}

export function DividerComponent(props) {
  const { id, currentParent, onCanvas, active } = props;
  const componentName = "DividerComponent";


  return onCanvas === true ? (
    <BaseSortable
      onCanvas={true}
      id={id}
      active={active}
      currentParent={currentParent}
      componentName={componentName}
    >
      <SlDivider />
    </BaseSortable>
  ) : (
    <BaseDrag id={id} onCanvas={onCanvas} componentName={componentName}>
      {ComponentHelper('Divider', 'hr')}
    </BaseDrag>
  );
}

export function ComponentHelper(name: string, iconClass: string) {
  return (
    <div className="component-item">
      <SlButton variant="default" size="small" style={{ width: '100%'}} >
        <SlIcon slot="prefix" name={iconClass}></SlIcon>
        {name}
      </SlButton>
    </div>
  );
}

export function ParagraphComponent(props) {
const { id, currentParent, onCanvas, label, style, active } = props;
  const componentName = "ParagraphComponent";

  return onCanvas === true ? (
    <BaseSortable
      onCanvas={true}
      id={id}
      active={active}
      currentParent={currentParent}
      componentName={componentName}
    >
      <p style={style}>{label}</p>
    </BaseSortable>
  ) : (
    <BaseDrag id={id} onCanvas={onCanvas} componentName={componentName}>
      {ComponentHelper("Paragraph", "paragraph")}
    </BaseDrag>
  );
}

export function BaseSortable(props) {
  const {
    id,
    onCanvas,
    componentName,
    children,
    active,
    currentParent,
    dropZoneCount,
  } = props;
  const { canvasItems, setActiveItem, setCanvasItems } = useCanvasItems();
  const settings = {
    id: id,
    data: {
      onCanvas: onCanvas,
      componentName: componentName,
      currentParent: currentParent,
      dropZoneCount: dropZoneCount,
    },
  };

  const { attributes, listeners, setNodeRef, transform } =
    useSortable(settings);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          const item = canvasItems.search(id);
          if (item !== null) {
            item.active = true;
          }

          setActiveItem((prevActiveItem) => {
            if (prevActiveItem !== null) {
              const prevItem = canvasItems.search(prevActiveItem.id)
              prevItem.active  = false;
            }
            return ({ id: id, type: componentName });
        });

        setCanvasItems((prevTree) => {
          const newTree = new Tree();
          newTree.root = prevTree.root;
          return newTree;
        });
        }}
        className={`base-component ${active === true ? "selected-item" : ""}`}
      >
        <div
          ref={setNodeRef}
          style={style}
          {...listeners}
          {...attributes}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export function BaseDrag(props) {
  const {
    children,
    id,
    onCanvas = false,
    componentName,
    dropzoneCount,
    dropzoneComponentName,
  } = props;

  const settings = {
    id: id,
    data: {
      onCanvas: onCanvas,
      componentName: componentName,
      dropzoneCount: dropzoneCount,
      dropzoneComponentName: dropzoneComponentName,
    },
  };

  const { attributes, listeners, setNodeRef, transform } =
    useDraggable(settings);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 9999,
      }
    : undefined;

  return (
    <div
      draggable={true}
      style={style}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}


export function ContainerComponent(props) {
  const { id, currentParent, onCanvas, children, classes, active } = props;
  const componentName = "ContainerComponent";
  return onCanvas !== true ? (
    <BaseDrag
      id={id}
      onCanvas={onCanvas}
      dropzoneCount={1}
      dropzoneComponentName={"Dropzone"}
      componentName={componentName}
    >
      {ComponentHelper('Container', 'archive')}
    </BaseDrag>
  ) : (
    <BaseSortable
      id={id}
      onCanvas={true}
      active={active}
      currentParent={currentParent}
      componentName={componentName}
    >
      <div className="draggable" style={{ padding: "15px" }}>
        <div className={`is-flex is-flex-direction-column ${classes}`}>{children}</div>
      </div>
    </BaseSortable>
  );
}

export function Grid2rowsHtmlItem(props) {
  const { id, currentParent, onCanvas, children, active } = props;
  const componentName = "Grid2rowsHtmlItem";

  return onCanvas !== true ? (
    <BaseDrag
      id={id}
      onCanvas={onCanvas}
      dropzoneCount={2}
      dropzoneComponentName={"Dropzone"}
      componentName={componentName}
    >
      {ComponentHelper('Grid 1X2', 'grid-3x3')}
    </BaseDrag>
  ) : (
    <BaseSortable
      id={id}
      onCanvas={true}
      active={active}
      currentParent={currentParent}
      componentName={componentName}
    >
      <div className="draggable" style={{ padding: "15px" }}>
        <div className="columns">{children}</div>
      </div>
    </BaseSortable>
  );
}

export function Dropzone(props) {
  const { id, children, onCanvas } = props;
  const componentName = "Dropzone";
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: { dropZone: true, componentName: componentName },
  });

  let ids = [];

  if (children !== undefined && onCanvas === true) {
    ids = children.map((x) => x.props.id);
  }

  const classes = () => {
    let base = "column base-component dropzone-elem";
    if (!children) {
      base = `${base} innCol`;
    }

    if (isOver) {
      base = `${base} border-2 border-dotted`;
    }

    return base;
  };

    return (
      <>
        <SortableContext items={ids}>
          <div id={id} ref={setNodeRef} className={classes()}>
            {children}
          </div>
        </SortableContext>
      </>
    );
}

export function DropdownComponent(props) {
  const { id, currentParent, onCanvas, items, label,active } = props;
  const componentName = "DropdownComponent";

  return onCanvas !== true ? (
    <BaseDrag
      id={id}
      onCanvas={onCanvas}
      dropzoneCount={1}
      dropzoneComponentName={"Dropzone"}
      componentName={componentName}
    >
      {ComponentHelper("Dropdown", "menu-button-wide")}
    </BaseDrag>
  ) : (
    <BaseSortable
      id={id}
      onCanvas={true}
      active={active}
      currentParent={currentParent}
      componentName={componentName}
    >
      <div className="is-flex">
      <SlDropdown>
        <SlButton slot="trigger" caret>
          {label}
        </SlButton>
        <SlMenu>
          {items.map((option, _) => (
            <SlMenuItem value={option.value}>
              {option.key}
            </SlMenuItem>
          ))}
        </SlMenu>
      </SlDropdown>
      </div>
    </BaseSortable>
  );
}

export const OutsideClickHandler = ({ onOutsideClick, children }) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {

      const targetId = event.target.id;
      // console.log("wrapref", wrapperRef.current)
      console.log("targetId:", targetId)
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        if ((targetId!==null || targetId !== undefined) && targetId == "modal-confirm") {
          console.log("here")
        } else {
          onOutsideClick();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onOutsideClick]);

  return <div ref={wrapperRef}>{children}</div>;
};

function capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
}