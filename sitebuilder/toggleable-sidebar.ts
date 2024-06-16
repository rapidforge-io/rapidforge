// toggleable-sidebar.js
import { LitElement, html, css } from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement("toggleable-sidebar")
export class ToggleableSidebar extends LitElement {

  static styles = css`
    :host {
      display: block;
      width: 250px;
      background-color: #f8f9fa;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
      overflow-y: auto;
      transition: transform 0.3s ease;
      transform: translateX(0);
    }
    :host(.hidden) {
      transform: translateX(-100%);
    }
    .menu-label {
      font-weight: bold;
      padding: 15px 10px;
    }
    .menu-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .menu-list sl-button {
      padding-left: 20px;
    }
    .menu-list li {
      margin-bottom: 5px;
    }

    .menu-button-left {
      padding-left: 250px;
    }
  `;


  render() {
    return html`
      <div>
        <div id="sidebar">
          ${this.generateMenu(menuData)}
        </div>
      </div>
    `;
  }

  generateMenu(menuData) {
    return menuData.map(
      (section) => html`
        <p class="menu-label">${section.label}</p>
        <ul class="menu-list">
          ${section.items.map(
            (item) => html`
              <li>
                <sl-button size="small" href="${item.href}">${item.text}</sl-button>
              </li>
            `
          )}
        </ul>
      `
    );
  }
}

const menuData = [
  {
    label: "General",
    items: [
      { text: "Dashboard", href: "#" },
      { text: "Customers", href: "#" }
    ]
  },
  {
    label: "Administration",
    items: [
      { text: "Team Settings", href: "#" },
      { text: "Manage Your Team", href: "#" },
      { text: "Invitations", href: "#" },
      { text: "Cloud Storage", href: "#" },
      { text: "Authentication", href: "#" }
    ]
  },
  {
    label: "Transactions",
    items: [
      { text: "Payments", href: "#" },
      { text: "Transfers", href: "#" },
      { text: "Balance", href: "#" }
    ]
  }
];
