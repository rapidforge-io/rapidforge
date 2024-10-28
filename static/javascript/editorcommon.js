function hideOrShowCurlGenerator(programType) {
    const curlContainer = document.getElementById("curlGeneratorContainer");
    if (programType === "bash") {
        curlContainer.classList.remove("is-invisible");
    } else {
        curlContainer.classList.add("is-invisible");
    }
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
