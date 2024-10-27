package runner

type Runner interface {
	Run(script string, envVars map[string]string) (ScriptResult, error)
}

type ScriptResult struct {
	ExitCode int    `json:"exit_code"`
	Output   string `json:"output"`
	Error    string `json:"error,omitempty"`
}
