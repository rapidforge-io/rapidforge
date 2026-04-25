import { TreeNode } from "./tree";
import { marked } from "marked";

function styleToString(style: Record<string, string>): string {
  if (!style || Object.keys(style).length === 0) return "";
  return Object.entries(style)
    .filter(([, v]) => v !== "" && v !== null && v !== undefined)
    .map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${v}`)
    .join("; ");
}

async function nodeToHtml(node: TreeNode): Promise<string> {
  const ep = node.editableProps || {};
  const childrenHtml = (
    await Promise.all((node.children || []).map(nodeToHtml))
  ).join("");

  switch (node.componentName) {
    case "CanvasDropZone": {
      const style = styleToString(ep.style || {});
      const classes = ep.classes || "";
      return `<div class="${classes}" style="${style}">${childrenHtml}</div>`;
    }
    case "ButtonComponent": {
      const style = styleToString(ep.style || {});
      return `<button class="button is-primary is-link" name="${ep.name || ""}" type="${ep.type || "submit"}" style="${style}">${ep.label || "Button"}</button>`;
    }
    case "TextInputComponent":
      return `<input class="input" type="text" name="${ep.name || ""}" placeholder="${ep.name || ""}" />`;
    case "TextAreaComponent":
      return `<textarea class="textarea" name="${ep.name || ""}" placeholder="${ep.name || ""}"></textarea>`;
    case "CheckboxComponent": {
      const label = ep.label ? `<legend style="font-weight:600;margin-bottom:6px;font-size:15px">${ep.label}</legend>` : "";
      const items = (ep.items || [])
        .map(
          (item) =>
            `<label class="checkbox"><input type="checkbox" name="${ep.name || ""}" value="${item.value}" /> ${item.key}</label>`
        )
        .join("\n");
      return `<fieldset style="border:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px">${label}${items}</fieldset>`;
    }
    case "RadioboxComponent": {
      const items = (ep.items || [])
        .map(
          (item) =>
            `<label class="radio"><input type="radio" name="${ep.name || ""}" value="${item.value}" /> ${item.key}</label>`
        )
        .join("\n");
      return `<fieldset style="border:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px"><legend style="font-weight:600;margin-bottom:6px;font-size:15px">${ep.label || ""}</legend>${items}</fieldset>`;
    }
    case "FormComponent":
      return `<form class="rf-stack" action="${ep.action || ""}" method="POST">${childrenHtml}</form>`;
    case "GridComponent":
      return `<div class="columns">${childrenHtml}</div>`;
    case "Dropzone":
      return `<div class="column rf-stack">${childrenHtml}</div>`;
    case "ContainerComponent": {
      const classes = ep.classes || "";
      return `<div class="rf-stack ${classes}">${childrenHtml}</div>`;
    }
    case "ParagraphComponent": {
      const style = styleToString(ep.style || {});
      return `<p style="${style}">${ep.label || ""}</p>`;
    }
    case "DividerComponent":
      return `<hr />`;
    case "HtmlContainer":
      return ep.html || "";
    case "MarkdownContainer": {
      const html = await marked.parse(ep.markdown || "");
      return `<div class="content">${html}</div>`;
    }
    case "DropdownComponent": {
      const options = (ep.items || [])
        .map((item) => `<option value="${item.value}">${item.key}</option>`)
        .join("\n");
      return `<div class="select is-fullwidth"><select name="${ep.name || ""}" required><option value="" disabled selected>${ep.label || ""}</option>${options}</select></div>`;
    }
    default:
      return childrenHtml;
  }
}

export async function treeToHtml(root: TreeNode): Promise<string> {
  if (!root) return "";
  return nodeToHtml(root);
}
