export class AuthManager {
  constructor(config = {}) {
    this.tokens = config.initialTokens || [];
    this.authEnabledCheckbox = document.getElementById(config.authEnabledId || 'authEnabled');
    this.authWarning = document.getElementById(config.authWarningId || 'authWarning');
    this.authConfigInput = document.getElementById(config.authConfigInputId || 'authConfigInput');
    this.tokensList = document.getElementById(config.tokensListId || 'tokensList');
    this.newTokenInput = document.getElementById(config.newTokenInputId || 'newTokenInput');
    this.generateBtn = document.getElementById(config.generateBtnId || 'generateTokenBtn');
    this.addBtn = document.getElementById(config.addBtnId || 'addTokenBtn');
    this.saveButton = config.saveButtonSelector ? document.querySelector(config.saveButtonSelector) : null;

    this.init();
  }

  init() {
    this.attachEventListeners();
    this.updateAuthConfigInput();
    this.validateAuthConfig();
  }

  generateToken() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = 'rf_live_';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  maskToken(token) {
    return token.length > 4 ? '****' + token.slice(-4) : '****';
  }

  updateAuthConfigInput() {
    const authEnabled = this.authEnabledCheckbox.checked;
    const authConfig = {
      enabled: authEnabled,
      tokens: this.tokens
    };
    this.authConfigInput.value = JSON.stringify(authConfig);
    this.validateAuthConfig();
  }

  validateAuthConfig() {
    const authEnabled = this.authEnabledCheckbox.checked;

    if (authEnabled && this.tokens.length === 0) {
      this.authWarning.style.display = 'block';
      this.authWarning.open = true;
      if (this.saveButton) {
        this.saveButton.disabled = true;
      }
    } else {
      this.authWarning.style.display = 'none';
      this.authWarning.open = false;
      if (this.saveButton) {
        this.saveButton.disabled = false;
      }
    }
  }

  addToken(token, isUnsaved = false) {
    const tokenRow = document.createElement('div');
    tokenRow.className = 'token-row';
    tokenRow.style.cssText = 'display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: var(--sl-color-neutral-50); border-radius: var(--sl-border-radius-medium);';
    tokenRow.dataset.token = token;
    if (isUnsaved) {
      tokenRow.dataset.unsaved = 'true';
    }

    const maskedToken = this.maskToken(token);
    const unsavedBadge = isUnsaved ? '<sl-badge variant="warning" pill style="margin-left: 0.5rem;">Unsaved</sl-badge>' : '';

    tokenRow.innerHTML = `
      <sl-input value="${maskedToken}" password readonly style="flex: 1;" size="small"></sl-input>
      ${unsavedBadge}
      <sl-tooltip content="Copy Token">
        <sl-icon-button name="copy-fill" class="copy-token-btn" size="small"></sl-icon-button>
      </sl-tooltip>
      <sl-tooltip content="Delete Token">
        <sl-icon-button name="trash" class="delete-token-btn" size="small"></sl-icon-button>
      </sl-tooltip>
    `;

    this.tokensList.appendChild(tokenRow);

    tokenRow.querySelector('.delete-token-btn').addEventListener('click', () => {
      this.removeToken(token, tokenRow);
    });

    tokenRow.querySelector('.copy-token-btn').addEventListener('click', () => {
      navigator.clipboard.writeText(token);
    });
  }

  removeToken(token, tokenRow) {
    this.tokens = this.tokens.filter(t => t !== token);
    tokenRow.remove();
    this.updateAuthConfigInput();
    this.updateTokenCount();
  }

  updateTokenCount() {
    const countBadge = document.querySelector('#activeTokensSection sl-badge');
    if (countBadge) {
      countBadge.textContent = this.tokens.length;
    }
  }

  clearUnsavedBadges() {
    document.querySelectorAll('.token-row[data-unsaved="true"]').forEach(row => {
      const badge = row.querySelector('sl-badge');
      if (badge) {
        badge.remove();
      }
      row.removeAttribute('data-unsaved');
    });
    this.updateTokenCount();
  }

  attachEventListeners() {
    this.generateBtn.addEventListener('click', () => {
      const token = this.generateToken();
      this.newTokenInput.value = token;
    });

    this.addBtn.addEventListener('click', () => {
      const token = this.newTokenInput.value.trim();

      if (!token) {
        alert('Please enter or generate a token');
        return;
      }

      if (this.tokens.includes(token)) {
        alert('This token already exists');
        return;
      }

      this.tokens.push(token);
      this.addToken(token, true);
      this.newTokenInput.value = '';
      this.updateAuthConfigInput();
      this.updateTokenCount();
    });

    this.authEnabledCheckbox.addEventListener('sl-change', () => {
      this.updateAuthConfigInput();
    });

    document.querySelectorAll('.delete-token-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tokenRow = btn.closest('.token-row');
        const token = tokenRow.dataset.token;
        this.removeToken(token, tokenRow);
      });
    });
  }

  getTokens() {
    return this.tokens;
  }
}