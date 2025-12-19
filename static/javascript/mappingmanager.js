export class MappingManager {
  constructor(containerId = 'mappings') {
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    this.updateRemoveButtons();
  }

  addRow() {
    const newRow = document.createElement("div");
    const uniqueId = Date.now();
    newRow.id = `columns-${uniqueId}`;
    newRow.className = "columns is-mobile is-align-items-end";
    newRow.style.marginBottom = "0";
    newRow.innerHTML = `
      <div class="column is-5">
        <sl-input size="small" name="exitCode[]" type="number" label="Exit Code" placeholder="Enter exit code" required></sl-input>
      </div>
      <div class="column is-5">
        <sl-input size="small" name="httpResponseCode[]" type="number" label="HTTP Response Code" placeholder="Enter HTTP code" required></sl-input>
      </div>
      <div class="column is-2 pb-4">
        <sl-button type="button" variant="danger" size="small" onclick="deleteRow(this)">
          <sl-icon slot="prefix" name="dash-circle"></sl-icon>
          Remove
        </sl-button>
      </div>
    `;
    this.container.appendChild(newRow);
    this.updateRemoveButtons();
  }

  deleteRow(button) {
    const row = button.closest(".columns");
    if (row) row.remove();
    this.updateRemoveButtons();
  }

  updateRemoveButtons() {
    const rows = this.container.querySelectorAll(".columns");
    const removeButtons = this.container.querySelectorAll("sl-button[variant='danger']");

    removeButtons.forEach(button => {
      button.style.display = rows.length === 1 ? "none" : "";
    });
  }
}

window.addRow = function() {
  if (window.mappingManager) {
    window.mappingManager.addRow();
  }
};

window.deleteRow = function(button) {
  if (window.mappingManager) {
    window.mappingManager.deleteRow(button);
  }
};