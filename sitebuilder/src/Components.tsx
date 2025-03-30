import { DragEvent, SyntheticEvent, useEffect, useRef, useState } from "react";
import { useCanvasItems } from "./App";
import { Tree, TreeNode } from "./tree";
import React from "react";
import { HtmlContainer } from "./HtmlContainer";
import { useDraggable, useDroppable } from "@dnd-kit/react";
import {useSortable} from '@dnd-kit/react/sortable';
import {cloneDeep} from 'lodash';


// import { useDraggable, useDroppable } from "@dnd-kit/core";
// import { useSortable } from "@dnd-kit/sortable";
// import { SortableContext } from "@dnd-kit/sortable";
import { MarkdownContainer } from "./MarkdownContainer";
import {
  SlColorPicker,
  SlButton,
  SlInput,
  SlDivider,
  SlDropdown,
  SlMenu,
  SlMenuItem,
  SlButtonGroup,
  SlIcon,
  SlSelect,
  SlOption,
  SlRange,
} from "@shoelace-style/shoelace/dist/react";


export const classMap = {
  GridComponent,
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
    style: { backgroundColor: "", width: "100%" },
    classes:'',
  },
  GridComponent: {
    columns: 2,
  },
  ButtonComponent: {
    label: "Button Label",
    name: "button",
    style: {},
    type: "submit",
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
    name: 'radio',
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
    style: [ColorPicker, WidthAdjuster],
    classes: ContentAligner,
  },
  ButtonComponent: {
    delete: DeleteButton,
    name: NamePropEditor,
    label: LabelPropEditor,
    type: ButtonTypePropEditor,
  },
  HtmlContainer: {
    delete: DeleteButton,
  },
  FormComponent: {
    delete: DeleteButton,
    action: FormActionPropEditor,
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
    name: NamePropEditor,
    delete: DeleteButton,
    items: ListInput,
  },
  RadioboxComponent: {
    name: NamePropEditor,
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
    name: NamePropEditor,
    delete: DeleteButton,
    label: LabelPropEditor,
    items: ListInput,
  },
  GridComponent: {
    delete: DeleteButton,
  }
};

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

function WidthAdjuster(handlePropOnChange, value) {
  const key = Object.keys(value)[0]

  return (
    <div className="is-flex is-flex-direction-column is-align-items-flex-start">
      <SlRange
       label={capitalize(key)}
       value={value[key].replace("%", "")}
       min={0}
       max={100}
       onSlChange={(e) => handlePropOnChange("style", { [key]: `${e.target.value}%` })}

       />
    </div>
  );
}

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

  const onChange = (e) => {
    const val = e.target.value;
    const updatedObj= { [key]: val };
    handlePropOnChange("style", { ...value, ...updatedObj});
  }

  const resetColor = (e) => {
    const updatedObj= { [key]: "" };
    handlePropOnChange("style", { ...value, ...updatedObj});
  }

  return (
    <div>
      <div className="field is-horizontal m-1">
        <div className="field-label is-normal">
          <p>{capitalize(key)}</p>
        </div>
        <div className="field-body">
          <div className="is-flex is-align-items-center">
           <SlButton onClick={resetColor} size="small" className="mr-1">Reset </SlButton>
            <SlColorPicker
              size="small"
              label="Select a color"
              onSlChange={onChange}
              value={value[key]}
            ></SlColorPicker>
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
    let updated = [...data, {key: "key", value: "value"}]
    setData(updated);
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

export function DeleteButton(_handlePropOnChange, _value) {
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
      console.error("Somethings wrong with delete ");
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

export function FormActionPropEditor(handlePropOnChange, value) {
  return InputPropEditorHelper(handlePropOnChange, value, "action")
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

export function ButtonTypePropEditor(handlePropOnChange, value) {
  return (
    <SlSelect
      label="Button Type"

      size="small"
      value={value}
      // defaultValue={"submit"}
      onSlChange={(e) => {
        handlePropOnChange("type", e.target.value)
      } }
    >
      <SlOption value="button">button</SlOption>
      <SlOption value="submit">submit</SlOption>
    </SlSelect>
  );
}

export function CanvasDropZone(props) {
  const { children, style, classes,index } = props;
  const { canvasItems, setActiveItem, containerRef  } = useCanvasItems();
  const id = "dropzone";
  const componentName = 'CanvasDropZone';

  const settings = {
    id: id,
    data: { dropZone: true },
  };

  const droppable = useDroppable(settings);

  const defaultStyle = {
    // backgroundColor: isOver ? "#eaeaea" : undefined,
    backgroundColor: undefined,
  };

  const updatedStyle = {...defaultStyle, ...style}
  // const ids = canvasItems.root.children.map((x) => x.id);

  const handleSetActiveItem = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveItem((prevActiveItem) => {
      if (prevActiveItem !== null) {
        const prevItem = canvasItems.search(prevActiveItem.id);
        prevItem.active = false;
      }
      return { id: id, type: componentName };
    });
  };

  return (
    // <SortableContext items={ids}>
      <div ref={containerRef}>
        <div
          id={id}
          key={id}
          ref={droppable.ref}
          className={`dropzone  ${classes}`}
          style={updatedStyle}
          onClick={(e) => handleSetActiveItem(e)}
        >
          <div>{children}</div>
        </div>
      </div>
    // </SortableContext>
  );
}

export function TextInputComponent(props) {
  const { id, onCanvas, name, currentParent, type, active, index } = props;
  const componentName = "TextInputComponent";

  return onCanvas === true ? (
    <BaseSortable
      onCanvas={true}
      id={id}
      index={index}
      active={active}
      currentParent={currentParent}
      componentName={componentName}
    >
      <input className="input" type="text" name={name} type={type || "text"}></input>
    </BaseSortable>
  ) : (
    <BaseDrag id={id} onCanvas={onCanvas} componentName={componentName}>
      {ComponentHelper('Text Input', 'input-cursor-text')}
    </BaseDrag>
  );
}

// TODO: check this
export function CheckboxComponent(props) {
  const { id, onCanvas, name, items, currentParent, active, index } = props;
  const componentName = "CheckboxComponent";

  return onCanvas === true ? (
    <BaseSortable
      onCanvas={true}
      id={id}
      index={index}
      active={active}
      currentParent={currentParent}
      componentName={componentName}
    >
      <div className="is-flex is-flex-direction-column m-2">
        {items.map((option, _) => (
          <div className="is-flex">
            <label className="checkbox">
              <input type="checkbox" value={option.value} name={name} />
               {option.key}
            </label>
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
  const { id, onCanvas, name, items, label, currentParent, active,index } = props;
  const componentName = "RadioboxComponent";
  return onCanvas === true ? (
    <BaseSortable
      onCanvas={true}
      id={id}
      index={index}
      active={active}
      currentParent={currentParent}
      componentName={componentName}
    >
      <div className="is-flex is-flex-direction-column">
        <p>{label}</p>
        {items.map((option, _) => (
          <label className="radio m-1">
            <input type="radio" name={name} value={option.value} />
            {option.key}
          </label>
        ))}
      </div>
    </BaseSortable>
  ) : (
    <BaseDrag id={id} onCanvas={onCanvas} componentName={componentName}>
      {ComponentHelper("RadioBox", "ui-radios-grid")}
    </BaseDrag>
  );
}

export function TextAreaComponent(props) {
  const { id, onCanvas, name, currentParent, active, index } = props;
  const componentName = "TextAreaComponent";

  return onCanvas === true ? (
    <BaseSortable
      onCanvas={true}
      id={id}
      index={index}
      active={active}
      currentParent={currentParent}
      componentName={componentName}
    >
      <textarea className="textarea" name={name} ></textarea>
    </BaseSortable>
  ) : (
    <BaseDrag id={id} onCanvas={onCanvas} componentName={componentName}>
      {ComponentHelper('Text Area', 'bounding-box-circles')}
    </BaseDrag>
  );
}

export function ButtonComponent(props) {
  const { id, onCanvas, label, name, currentParent, style, active, type, index } = props;
  const componentName = "ButtonComponent";

  function Body() {
    return (
      <div className="is-flex">
      <button key={`${id}-${name}`} className="button is-primary is-link" name={name} type={type} style={style}>
        {label}
      </button>
      </div>
    );
  }
  return onCanvas === true ? (
    <BaseSortable
      onCanvas={true}
      id={id}
      index={index}
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
  const { id, currentParent, onCanvas, action, children, active, index } = props;
  const componentName = "FormComponent";

  return onCanvas === true ? (
    <BaseSortable
      onCanvas={true}
      id={id}
      index={index}
      active={active}
      currentParent={currentParent}
      componentName={componentName}
    >
      <div className="base-component m-4">
        <form className="form-gap is-flex is-align-items-center" action={action} method="POST">{children}</form>
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
  const { id, currentParent, onCanvas, active, index } = props;
  const componentName = "DividerComponent";


  return onCanvas === true ? (
    <BaseSortable
      onCanvas={true}
      id={id}
      index={index}
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
const { id, currentParent, onCanvas, label, style, active, index } = props;
  const componentName = "ParagraphComponent";

  return onCanvas === true ? (
    <BaseSortable
      onCanvas={true}
      id={id}
      index={index}
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
    index,
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

  // console.trace("index", index);

  const sortable = useSortable({id: id, index: index, data: settings.data, group: currentParent});

  // const { attributes, listeners, setNodeRef, transform } =
  //   useSortable(settings);

  // const style = transform
  //   ? {
  //       transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  //     }
  //   : undefined;
  return (
    <>
      <div
        key={id}
        id={id}
        ref={sortable.ref}
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
          // const newTree = new Tree();

          // Perform deep cloning to ensure immutability
          // const newTree = cloneDeep(prevTree);
          return cloneDeep(prevTree);
          // newTree.root = cloneDeep(prevTree.root);
          // return newTree;
          // const newTree = new Tree();
          // newTree.root = prevTree.root;
          // return newTree;
        });
        }}
        className={`base-component ${active === true ? "selected-item" : ""}`}
      >
        <div >
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

  const draggable = useDraggable(settings);

  // const { attributes, listeners, setNodeRef, transform } =
  //   useDraggable(settings);

  // const style = transform
  //   ? {
  //       transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  //       zIndex: 9999,
  //     }
  //   : undefined;

  return (
    <div
      draggable={true}
      // style={style}
      ref={draggable.ref}
      // ref={setNodeRef}
      // {...listeners}
      // {...attributes}
    >
      {children}
    </div>
  );
}

export function ContainerComponent(props) {
  const { id, currentParent, onCanvas, children, classes, active, index } = props;
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
      index={index}
      currentParent={currentParent}
      componentName={componentName}
    >
      <div className="draggable" style={{ padding: "15px" }}>
        <div className={`is-flex is-flex-direction-column ${classes}`}>{children}</div>
      </div>
    </BaseSortable>
  );
}

export function GridComponent(props) {
  const { id, currentParent, onCanvas, children, active, index} = props;
  const componentName = "GridComponent";
  const [columnsCount, setColumnsCount] = useState(2);

  return onCanvas !== true ? (
    <BaseDrag
      id={id}
      onCanvas={onCanvas}
      dropzoneCount={columnsCount}
      dropzoneComponentName={"Dropzone"}
      componentName={componentName}
    >
      <div className="component-item">
        <SlButton variant="default" size="small" style={{ width: "50%" }}>
          <SlIcon slot="prefix" name={"grid-3x3"}></SlIcon>
          Grid
        </SlButton>
          <SlInput
            type="number"
            size="small"
            max={10}
            value={`${columnsCount}`}
            style={{ width: "30%" }}
            onSlInput={(e) => setColumnsCount(e.currentTarget.value)}
          ></SlInput>
      </div>
    </BaseDrag>
  ) : (
    <BaseSortable
      id={id}
      index={index}
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
  const { id, children, currentParent } = props;
  const componentName = "Dropzone";

  const settings = {
    id: id,
    data: { dropZone: true, componentName: componentName },
  }
  const {ref, isDropTarget} = useDroppable(settings);
  // let ids = [];

  // console.trace("children", children);

  // if (children !== undefined && onCanvas === true) {
  //   ids = children.map((x) => x.props.id);
  // }

  const classes = () => {
    let base = "dropzone-elem";
    if (!children) {
      base = `${base} innCol`;
    }

    if (isDropTarget) {
      base = `${base} has-background-grey-lighter`;
    }

    return base;
  };

  //  {React.Children.map(children, (child, index) =>
  //         React.isValidElement(child)
  //           ? React.cloneElement(child, { key: index })
  //           : child
  //       )}

    return (

      <div id={id} ref={ref} className={classes()}>
        {children}
      </div>
    );
}

export function DropdownComponent(props) {
  const { id, currentParent, name, onCanvas, items, label, active, index } = props;
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
      index={index}
      onCanvas={true}
      active={active}
      currentParent={currentParent}
      componentName={componentName}
    >
      <div className="is-flex">
        <div className="select is-fullwidth">
          <select id="options" name={name} required>
            <option value="" disabled selected>
              {label}
            </option>
            {items.map((option, _) => (
              <option value={option.value}>{option.key}</option>
            ))}
          </select>
        </div>
      </div>
    </BaseSortable>
  );
}

export const OutsideClickHandler = ({ onOutsideClick, children }) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {

      const targetId = event.target.id;
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        if ((targetId!==null || targetId !== undefined) && targetId == "modal-confirm") {
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