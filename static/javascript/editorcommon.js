export function getProgramType() {
    return document.getElementById("programType").value;
  }

export function hideOrShowCurlGenerator(programType) {
    const curlContainer = document.getElementById("curlGeneratorContainer");
    if (programType === "bash") {
        curlContainer.classList.remove("is-invisible");
    } else {
        curlContainer.classList.add("is-invisible");
    }
}

function getInfoForVar(word) {
  if (word === "PAYLOAD_DATA") {
    return "Request body data";
  }
  if (word.startsWith("FORM_")) {
    return "e.g. FROM_COMMENT if your submission has comment field";
  }
  if (word.startsWith("URL_PARAM_")) {
    return "e.g. URL_PARAM_ID if your url has `?id=1`";
  }
  if (word.startsWith("HEADER_")) {
    return "Header name e.g. HEADER_USER_AGENT";
  }
  if (word.startsWith("CRED_")) {
    return "Credential name";
  }
  return "Environment variable";
}

export function generateCustomWordSuggestions(words ) {
  const bash = [];
  const lua = [];
  words.forEach(w => {
    const info = getInfoForVar(w);
    bash.push({
      label: `\${${w}}`,
      type: "variable",
      info: info
    });
    lua.push({
      label: `os.getenv('${w}')`,
      type: "variable",
      info: info
    });
  });
  return { bash, lua };
}

function setEditorMode(programType) {
    if (programType === "bash") {
        editor.setOption("mode", "shell");
    } else if (programType === "lua") {
        editor.setOption("mode", "lua");
    }
}

function changeEditor(e) {
  const programType = e.target.value;
  hideOrShowCurlGenerator(programType);
  setEditorMode(programType);
}
