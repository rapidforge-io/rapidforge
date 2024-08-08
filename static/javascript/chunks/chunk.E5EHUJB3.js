import {
  carousel_item_styles_default
} from "./chunk.FQH4RL5J.js";
import {
  component_styles_default
} from "./chunk.K23QWHWK.js";
import {
  ShoelaceElement
} from "./chunk.Y4BRRKVC.js";
import {
  x
} from "./chunk.CXZZ2LVK.js";

// src/components/carousel-item/carousel-item.component.ts
var SlCarouselItem = class extends ShoelaceElement {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "group");
  }
  render() {
    return x` <slot></slot> `;
  }
};
SlCarouselItem.styles = [component_styles_default, carousel_item_styles_default];

export {
  SlCarouselItem
};
