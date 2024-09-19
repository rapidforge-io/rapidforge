const curlGeneratorDialog = document.getElementById('curlGenerator');
const urlInput = document.getElementById('url');
       urlInput.addEventListener('sl-blur', function () {
           urlInput.reportValidity();
       })

document.addEventListener('DOMContentLoaded', () => {
    const addHeaderBtn = document.getElementById('add-header');
    const headersSection = document.getElementById('headers-section');
    const generateCurlBtn = document.getElementById('generate-curl');
    const curlOutput = document.getElementById('curl-output');
    const contentTypeDropdown = document.getElementById('content-type');
    const customContentTypeInput = document.getElementById('custom-content-type');
    const clearFieldsBtn = document.getElementById('clear-fields');
    const bodyInput = document.getElementById('request-body');
    const verboseCheckbox = document.getElementById('verbose');
    const insecureCheckbox = document.getElementById('insecure');
    const timeoutInput = document.getElementById('timeout');
    const urlInput = document.getElementById('url');


    contentTypeDropdown.addEventListener('sl-change', () => {
        if (contentTypeDropdown.value === 'custom') {
            customContentTypeInput.style.display = 'block';
        } else {
            customContentTypeInput.style.display = 'none';
        }
    });

    addHeaderBtn.addEventListener('click', () => {
        const headerRow = document.createElement('div');
        headerRow.classList.add('header-row');
        headerRow.innerHTML = `
      <div class="is-flex mb-10" style="gap: 10px;">
        <sl-input size="small" label="Header Name" class="header-name"></sl-input>
        <sl-input size="small" label="Header Value" class="header-value"></sl-input>
        <sl-button size="small" variant="danger" class="pt-5 remove-header">Remove</sl-button>
      </div>`;
        headersSection.append(headerRow, addHeaderBtn);

        headerRow.querySelector('.remove-header').addEventListener('click', () => {
            headerRow.remove();
        });
    });

    generateCurlBtn.addEventListener('click', () => {
        const method = document.getElementById('method').value;
        const url = document.getElementById('url').value;
        const body = document.getElementById('request-body').value;
        const verbose = document.getElementById('verbose').checked;
        const insecure = document.getElementById('insecure').checked;
        const timeout = document.getElementById('timeout').value;
        let contentType = contentTypeDropdown.value;


        let curlCommand = `curl -X ${method} "${url}"`;

        // Add Content-Type header if selected
        if (contentType) {
            curlCommand += ` -H "Content-Type: ${contentType}"`;
        }

        // If custom content-type is selected, use the custom input value
        if (contentType === 'custom') {
            contentType = customContentTypeInput.value;
        }


        // Headers
        const headerNames = document.querySelectorAll('.header-name');
        const headerValues = document.querySelectorAll('.header-value');
        headerNames.forEach((header, index) => {
            const name = header.value;
            const value = headerValues[index].value;
            if (name && value) {
                curlCommand += ` -H "${name}: ${value}"`;
            }
        });

        // Body (for POST, PUT, PATCH)
        if ((method === 'POST' || method === 'PUT' || method === 'PATCH') && body) {
            curlCommand += ` -d '${body}'`;
        }

        // Additional options
        if (verbose) {
            curlCommand += ' -v';
        }
        if (insecure) {
            curlCommand += ' -k';
        }
        if (timeout) {
            curlCommand += ` --max-time ${timeout}`;
        }

        // Update the cURL output
        curlOutput.innerHTML = curlCommand;
        // for copy button
        curlOutput.value = curlCommand;
    });

    clearFieldsBtn.addEventListener('click', () => {
        document.getElementById('method').value = 'GET';
        urlInput.value = '';
        bodyInput.value = '';
        verboseCheckbox.checked = false;
        insecureCheckbox.checked = false;
        timeoutInput.value = '';
        curlOutput.value = '';
        curlOutput.innerHTML = '//output command';
        contentTypeDropdown.value = 'application/json';
        customContentTypeInput.value = '';
        customContentTypeInput.style.display = 'none';

        const headerRows = document.querySelectorAll('.header-row');
        headerRows.forEach((headerRow, index) => {
          if (index > 0) {
            headerRow.remove();
          } else {
            headerRow.querySelector('.header-name').value = '';
            headerRow.querySelector('.header-value').value = '';
          }
        });

      });
});
