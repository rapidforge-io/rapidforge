package services

import "testing"

func TestGetRunnerMRuby(t *testing.T) {
	runner := GetRunner(MRubyRunner)
	if runner == nil {
		t.Fatal("GetRunner(mruby) returned nil")
	}
}
