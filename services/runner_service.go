package services

import (
	"github.com/rapidforge-io/rapidforge/bashrunner"
	"github.com/rapidforge-io/rapidforge/luarunner"
	"github.com/rapidforge-io/rapidforge/runner"
)

type RunnerType string

const (
	BashRunner RunnerType = "bash"
	LuaRunner  RunnerType = "lua"
)

func GetRunner(runnerType RunnerType) runner.Runner {
	switch runnerType {
	case BashRunner:
		return bashrunner.NewBashRunner()
	case LuaRunner:
		tmp, _ := luarunner.NewLuaRunner()
		return tmp
	default:
		return bashrunner.NewBashRunner()
	}
}
