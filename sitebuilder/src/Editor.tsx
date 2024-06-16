import React, { useEffect, useRef, useState } from "react";
import {
  editableProps,
  classMap,
} from "./Components";
import { SlDivider } from "@shoelace-style/shoelace/dist/react";


export const ComponentPanel = (props) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <aside className={`leftAside ${isVisible ? "show" : ""}`}>
      <button className="menuLeftbtn" onClick={toggleVisibility}>
        <i className="fa-solid fa-chevron-right"></i>
      </button>
      <div className="container">
        <h2>Components</h2>
        <SlDivider />
        <Accordion />
      </div>
    </aside>
  );
};

function Accordion() {
  const {CanvasDropZone, Dropzone, ...componentNames} = classMap;

  return (
    <div>
      {Object.values(componentNames).map((Component) => (
        <Component id={`${Component.name}-lib`} />
      ))}
    </div>
  );
}