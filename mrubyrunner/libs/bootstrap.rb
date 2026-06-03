context_path = ARGV.shift
script_path = ARGV.shift
runtime_path = File.join(File.dirname(__FILE__), "runtime.rb")

eval(File.read(runtime_path), nil, runtime_path)
rapidforge_load_context(context_path)
eval(File.read(script_path), nil, script_path)
