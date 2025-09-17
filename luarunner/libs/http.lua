local http = {}

local function execute_curl_command(command)
    local handle = io.popen(command)
    local result = handle:read("*a")
    handle:close()
    return result
end

function http.get(url, headers)
    local command = "curl -s -X GET " .. url
    if headers then
        for key, value in pairs(headers) do
            command = command .. " -H '" .. key .. ": " .. value .. "'"
        end
    end
    return execute_curl_command(command)
end

function http.post(url, data, headers)
    local command = "curl -s -X POST -d '" .. data .. "' " .. url
    if headers then
        for key, value in pairs(headers) do
            command = command .. " -H '" .. key .. ": " .. value .. "'"
        end
    end
    return execute_curl_command(command)
end

function http.put(url, data, headers)
    local command = "curl -s -X PUT -d '" .. data .. "' " .. url
    if headers then
        for key, value in pairs(headers) do
            command = command .. " -H '" .. key .. ": " .. value .. "'"
        end
    end
    return execute_curl_command(command)
end

function http.delete(url, headers)
    local command = "curl -s -X DELETE " .. url
    if headers then
        for key, value in pairs(headers) do
            command = command .. " -H '" .. key .. ": " .. value .. "'"
        end
    end
    return execute_curl_command(command)
end

return http