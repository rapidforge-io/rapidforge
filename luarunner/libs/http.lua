local http = {}

local function shquote(s)
    s = tostring(s or "")
    return "'" .. s:gsub("'", "'\"'\"'") .. "'"
end

local function execute_curl_command(command)
    local marker = "\n__STATUS__:"
    local handle = io.popen(command .. ' -w "\\n__STATUS__:%{http_code}\\n"')
    if not handle then
        return nil, 0
    end
    local output = handle:read("*a") or ""
    handle:close()

    local status = output:match("__STATUS__:(%d%d%d)%s*$")
    local body = output:gsub("\n__STATUS__:%d%d%d%s*$", "")
    return body, tonumber(status)
end

local function append_headers(command, headers)
    if headers then
        for key, value in pairs(headers) do
            command = command .. " -H " .. shquote(tostring(key) .. ": " .. tostring(value))
        end
    end
    return command
end

function http.get(url, headers)
    local command = "curl -s -X GET " .. shquote(url)
    command = append_headers(command, headers)
    return execute_curl_command(command)
end

function http.post(url, data, headers)
    local command = "curl -s -X POST --data " .. shquote(data or "") .. " " .. shquote(url)
    command = append_headers(command, headers)
    return execute_curl_command(command)
end

function http.put(url, data, headers)
    local command = "curl -s -X PUT --data " .. shquote(data or "") .. " " .. shquote(url)
    command = append_headers(command, headers)
    return execute_curl_command(command)
end

function http.delete(url, headers)
    local command = "curl -s -X DELETE " .. shquote(url)
    command = append_headers(command, headers)
    return execute_curl_command(command)
end

return http