import React from "react";
import { CanvasDropZone, classMap } from "./Components";

export class TreeNode {
  id: string;
  componentName: string;
  children: TreeNode[];
  active: boolean;
  // TODO rename this to state
  editableProps: { [key: string]: any };

  constructor(id: string, componentName: string, active?: boolean, editableProps?: { [key: string]: any }) {
    this.id = id;
    this.componentName = componentName;
    this.children = [];
    this.active = active ?? false; // Using nullish coalescing operator to default to false
    this.editableProps = editableProps || {}; // Default to an empty object if not provided
  }
}

export class Tree {
  root: TreeNode;

  constructor() {
    this.root = null;
  }

  renderTree(node: TreeNode) {
    // Check if the component name exists in the classMap
    const Component = classMap[node.componentName];

    if (Component) {
      return Component;
    } else {
      return null;
    }
  }

  findParentNode(
    nodeId: string,
    currentNode: TreeNode = this.root,
    parent: TreeNode = null
  ): TreeNode {
    if (!currentNode) {
      // Tree is empty or node not found
      return null;
    }

    if (currentNode.id === nodeId) {
      // Node found, return its parent
      return parent;
    }

    // Recursively search for the node in children
    for (const child of currentNode.children) {
      const result = this.findParentNode(nodeId, child, currentNode);
      if (result) {
        return result;
      }
    }

    // Node not found in this branch
    return null;
  }

  deleteNode(nodeId: string): boolean {
    if (!this.root) {
      return false;
    }

    // Find the node to delete
    const nodeToDelete = this.search(nodeId);
    if (!nodeToDelete) {
      return false;
    }


    // If the node has children, delete its children first
    if (nodeToDelete.children.length > 0) {
      const childrenCopy = [...nodeToDelete.children];
      childrenCopy.forEach((child) => {
        this.deleteNode(child.id);
      })
    }

    // Remove the node
    const parent = this.findParentNode(nodeId);
    if (parent) {
      const index = parent.children.findIndex((child) => child.id === nodeId);
      parent.children.splice(index, 1);
    } else {
      // If the node is the root, set root to null
      this.root = null;
    }

    return true;
  }

   // Method to move a node from source to destination within the tree
   moveNode(sourceId: string, destinationId: string): boolean {
    const sourceNode = this.search(sourceId);
    if (!sourceNode) {
      console.error(`Source node with id ${sourceId} not found.`);
      return false;
    }

    const destinationNode = this.search(destinationId);
    if (!destinationNode) {
      console.error(`Destination node with id ${destinationId} not found.`);
      return false;
    }

    // Remove the source node from its parent's children
    const sourceParent = this.findParentNode(sourceId);
    if (!sourceParent) {
      console.error(`Parent of source node with id ${sourceId} not found.`);
      return false;
    }
    sourceParent.children = sourceParent.children.filter(child => child.id !== sourceId);

    // Add the source node as a child of the destination node
    destinationNode.children.push(sourceNode);

    return true;
  }

  appendToChild(sourceId: string, targetId: string): TreeNode {
    const parent = this.search(targetId);
    if (parent) {
      let sourceNode = this.search(sourceId);
      let p2 = Object.assign({}, sourceNode);
      if (sourceNode != null) {
        this.deleteNode(sourceNode.id);
      }
      parent.children.push(p2);
    }

    return this.root;
  }

  renderTreeStructure(node: TreeNode, parentId?: String) {
    if (!node) return null;

    const Component = this.renderTree(node);
    if (!Component) return null;

    const commonProps = {
      id: node.id,
      onCanvas: true,
      currentParent: parentId,
      active: node.active,
      ...node.editableProps
    };

    const hasChildren = node.children.length > 0;

    if (hasChildren) {
      return (
        <Component {...commonProps}>
          {node.children.map((child) =>
            this.renderTreeStructure(child, node.id)
          )}
        </Component>
      );
    }

    return <Component {...commonProps} />;
  }

  search(id: string, node: TreeNode = this.root): TreeNode | null {
    if (node === null) return null;
    if (node.id === id) return node;

    for (const child of node.children) {
      const result = this.search(id, child);
      if (result !== null) return result;
    }

    return null;
  }

  findClosestParent(
    targetId: string,
    startNode: TreeNode = this.root,
    parent: TreeNode = null
  ): TreeNode {
    if (startNode === null) return parent;

    if (startNode.id === targetId) return parent;

    for (const child of startNode.children) {
      const result = this.findClosestParent(targetId, child, startNode);
      if (result !== null) return result;
    }

    return parent;
  }


  traverseTree(callback: (node: TreeNode) => void) {
    this.traverseTreeRecursive(this.root, callback);
  }

  private traverseTreeRecursive(
    node: TreeNode,
    callback: (node: TreeNode) => void
  ) {
    callback(node);
    for (const child of node.children) {
      this.traverseTreeRecursive(child, callback);
    }
  }
}

// Example Usage
// const tree = new Tree();

// // Create some tree nodes
// const node1 = new TreeNode("1", "<div>Node 1</div>");
// const node2 = new TreeNode("2", "<div>Node 2</div>");
// const node3 = new TreeNode("3", "<div>Node 3</div>");

// // Set node1 as the root
// tree.root = node1;

// // Add node2 and node3 as children of node1
// node1.children.push(node2, node3);

// // Move node2 under node3
// tree.moveNode("2", "3");

// // Output the HTML content of node3 after the move
