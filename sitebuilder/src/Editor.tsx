import React, { useState } from "react";
import {
  classMap,
} from "./Components";
import { SlIcon } from "@shoelace-style/shoelace/dist/react";


export const ComponentPanel = (props) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <aside className={`leftAside ${isVisible ? "show" : ""}`}>
      <button className="menuLeftbtn" onClick={toggleVisibility}>
        <SlIcon name="arrow-right"></SlIcon>
      </button>
      <div className="components-panel-header">
        <p className="props-panel-title">Components</p>
      </div>
      <div className="leftAside-scroll">
        <Accordion />
      </div>
    </aside>
  );
};

function Accordion() {
  const {CanvasDropZone, Dropzone, ...componentNames} = classMap;

  return (
    <div className="accordion-list">
      {Object.values(componentNames).map((Component) => (
        <Component id={`${Component.name}-lib`} key={`${Component.name}-lib`} />
      ))}
    </div>
  );
}