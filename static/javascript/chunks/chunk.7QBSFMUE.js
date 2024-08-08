import {
  visually_hidden_styles_default
} from "./chunk.WCW35DM2.js";
import {
  component_styles_default
} from "./chunk.K23QWHWK.js";
import {
  ShoelaceElement
} from "./chunk.Y4BRRKVC.js";
import {
  x
} from "./chunk.CXZZ2LVK.js";

// src/components/visually-hidden/visually-hidden.component.ts
var SlVisuallyHidden = class extends ShoelaceElement {
  render() {
    return x` <slot></slot> `;
  }
};
SlVisuallyHidden.styles = [component_styles_default, visually_hidden_styles_default];

export {
  SlVisuallyHidden
};
