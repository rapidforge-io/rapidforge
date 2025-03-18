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
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2>
            <b>Components</b>
          </h2>
        </div>
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