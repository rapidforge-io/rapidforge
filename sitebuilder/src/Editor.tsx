import React, { useState } from "react";
import {
  classMap,
} from "./Components";
import { SlDivider, SlIcon } from "@shoelace-style/shoelace/dist/react";


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