local kv = {}

local function shquote(s)
    s = tostring(s or "")
    return "'" .. s:gsub("'", "'\"'\"'") .. "'"
end

local function get_bin()
    local bin = os.getenv("RAPIDFORGE_BIN")
    if not bin or bin == "" then
        return nil, "RAPIDFORGE_BIN is not set"
    end
    return bin
end

local function run_capture(command)
    local handle = io.popen(command .. " 2>/dev/null")
    if not handle then
        return nil, "failed to execute command"
    end

    local output = handle:read("*a") or ""
    local ok, _, code = handle:close()
    if ok then
        return output, 0
    end

    return output, code or 1
end

local function trim_trailing_newline(value)
    return (value:gsub("\r?\n$", ""))
end

function kv.get(key)
    local bin, err = get_bin()
    if not bin then
        return nil, err
    end

    local output, code = run_capture(shquote(bin) .. " get --key " .. shquote(key))
    if code == 0 then
        return trim_trailing_newline(output)
    end
    if code == 1 then
        return nil
    end

    return nil, "kv.get failed with exit code " .. tostring(code)
end

function kv.set(key, value)
    local bin, err = get_bin()
    if not bin then
        return nil, err
    end

    local _, code = run_capture(shquote(bin) .. " set --key " .. shquote(key) .. " --value " .. shquote(value))
    if code == 0 then
        return true
    end

    return nil, "kv.set failed with exit code " .. tostring(code)
end

function kv.del(key)
    local bin, err = get_bin()
    if not bin then
        return nil, err
    end

    local _, code = run_capture(shquote(bin) .. " del --key " .. shquote(key))
    if code == 0 then
        return true
    end
    if code == 1 then
        return false
    end

    return nil, "kv.del failed with exit code " .. tostring(code)
end

function kv.list()
    local bin, err = get_bin()
    if not bin then
        return nil, err
    end

    local output, code = run_capture(shquote(bin) .. " list")
    if code ~= 0 then
        return nil, "kv.list failed with exit code " .. tostring(code)
    end

    local keys = {}
    for line in output:gmatch("[^\r\n]+") do
        table.insert(keys, line)
    end
    return keys
end

return kv
