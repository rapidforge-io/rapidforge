import {
  SlTree
} from "./chunk.ANBL6F7Z.js";

// src/react/tree/index.ts
import * as React from "react";
import { createComponent } from "@lit/react";
import "@lit/react";
var tagName = "sl-tree";
SlTree.define("sl-tree");
var reactWrapper = createComponent({
  tagName,
  elementClass: SlTree,
  react: React,
  events: {
    onSlSelectionChange: "sl-selection-change"
  },
  displayName: "SlTree"
});
var tree_default = reactWrapper;

export {
  tree_default
};
