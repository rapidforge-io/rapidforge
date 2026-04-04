function setVisible(element, visible) {
  if (!element) {
    return;
  }
  element.style.display = visible ? '' : 'none';
}

function formatTimestamp(value) {
  if (!value) {
    return '';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toLocaleString();
}

function buildSummary(data) {
  const parts = [
    `Status: ${data.status}`,
    `Exit Code: ${data.exitCode}`,
    `Runner: ${data.runner}`
  ];

  if (typeof data.durationMs === 'number') {
    parts.push(`Duration: ${data.durationMs} ms`);
  }
  if (data.eventId) {
    parts.push(`Event ID: ${data.eventId}`);
  }
  const formattedTime = formatTimestamp(data.timestamp);
  if (formattedTime) {
    parts.push(`Finished: ${formattedTime}`);
  }

  return parts.join(' | ');
}

export function initRunNowDialog(config) {
  const dialog = document.getElementById(config.dialogId);
  const openButton = document.getElementById(config.openButtonId);
  const executeButton = document.getElementById(config.executeButtonId);
  const rerunButton = document.getElementById(config.rerunButtonId);
  const backButton = document.getElementById(config.backButtonId);
  const configureView = document.getElementById(config.configureViewId);
  const resultView = document.getElementById(config.resultViewId);
  const summaryAlert = document.getElementById(config.summaryAlertId);
  const stdoutOutput = document.getElementById(config.stdoutOutputId);
  const stderrSection = document.getElementById(config.stderrSectionId);
  const stderrOutput = document.getElementById(config.stderrOutputId);
  const runErrorSection = document.getElementById(config.runErrorSectionId);
  const runErrorOutput = document.getElementById(config.runErrorOutputId);
  const closeButtons = dialog?.querySelectorAll('[data-run-now-close]') || [];

  function showConfigureView() {
    setVisible(configureView, true);
    setVisible(resultView, false);
  }

  function showResultView() {
    setVisible(configureView, false);
    setVisible(resultView, true);
  }

  function resetResults() {
    if (summaryAlert) {
      summaryAlert.innerHTML = '';
      summaryAlert.open = false;
      setVisible(summaryAlert, false);
    }
    if (stdoutOutput) {
      stdoutOutput.textContent = '';
    }
    if (stderrOutput) {
      stderrOutput.textContent = '';
    }
    if (runErrorOutput) {
      runErrorOutput.textContent = '';
    }
    setVisible(stderrSection, false);
    setVisible(runErrorSection, false);
  }

  async function executeRun() {
    executeButton.loading = true;
    if (rerunButton) {
      rerunButton.loading = true;
    }

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config.buildRequest())
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Execution failed');
      }

      summaryAlert.variant = data.status === 'success' ? 'success' : 'danger';
      summaryAlert.innerHTML = buildSummary(data);
      summaryAlert.open = true;
      setVisible(summaryAlert, true);

      stdoutOutput.textContent = data.output || 'No stdout.';
      stderrOutput.textContent = data.stderr || '';
      runErrorOutput.textContent = data.runError || '';

      setVisible(stderrSection, Boolean(data.stderr));
      setVisible(runErrorSection, Boolean(data.runError));
      showResultView();
    } catch (error) {
      summaryAlert.variant = 'danger';
      summaryAlert.innerHTML = `Execution failed: ${error.message}`;
      summaryAlert.open = true;
      setVisible(summaryAlert, true);
      stdoutOutput.textContent = '';
      stderrOutput.textContent = '';
      runErrorOutput.textContent = '';
      setVisible(stderrSection, false);
      setVisible(runErrorSection, false);
      showResultView();
    } finally {
      executeButton.loading = false;
      if (rerunButton) {
        rerunButton.loading = false;
      }
    }
  }

  openButton?.addEventListener('click', () => {
    resetResults();
    showConfigureView();
    dialog.show();
  });

  executeButton?.addEventListener('click', executeRun);
  rerunButton?.addEventListener('click', executeRun);
  backButton?.addEventListener('click', showConfigureView);
  closeButtons.forEach((button) => {
    button.addEventListener('click', () => dialog.hide());
  });
}
