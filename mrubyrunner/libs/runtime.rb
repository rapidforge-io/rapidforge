EXIT_MARKER = "\n__RF_EXIT__:"
RAPIDFORGE_ENV = {}

def rapidforge_load_context(path)
  data = File.read(path)
  parsed = JSON.parse(data)
  parsed.each do |key, value|
    RAPIDFORGE_ENV[key.to_s] = value.nil? ? nil : value.to_s
  end
end

def env(name)
  RAPIDFORGE_ENV[name.to_s]
end

def shell_escape(value)
  "'#{value.to_s.split("'").join(%q('"'"'))}'"
end

def shell_capture(command)
  output = `#{command}; code=$?; printf "#{EXIT_MARKER}%s\n" "$code"`
  marker_index = output.rindex(EXIT_MARKER)
  return [output, 1] unless marker_index

  body = output[0...marker_index]
  exit_code = output[(marker_index + EXIT_MARKER.length)..-1].to_i
  [body, exit_code]
end

def rapidforge_bin!
  bin = env("RAPIDFORGE_BIN")
  raise "RAPIDFORGE_BIN is not set" if bin.nil? || bin.empty?

  bin
end

def curl_headers(headers)
  parts = []
  return parts if headers.nil?

  headers.each do |key, value|
    parts << "-H #{shell_escape("#{key}: #{value}")}"
  end

  parts
end

def curl_client
  Curl.global_init
  @rapidforge_curl_client ||= Curl.new
end

def curl_request(method, url, body = nil, headers = {})
  client = curl_client
  normalized_headers = {}
  (headers || {}).each do |key, value|
    normalized_headers[key.to_s] = value.to_s
  end

  response =
    case method
    when "GET"
      client.get(url, normalized_headers)
    when "POST"
      client.post(url, body.to_s, normalized_headers)
    when "PUT"
      client.put(url, body.to_s, normalized_headers)
    when "PATCH"
      client.patch(url, body.to_s, normalized_headers)
    when "DELETE"
      client.delete(url, normalized_headers)
    else
      raise "unsupported HTTP method #{method}"
    end

  [response.body.to_s, response.status_code.to_i]
end

def http_get(url, headers = {})
  curl_request("GET", url, nil, headers)
end

def http_post(url, body = "", headers = {})
  curl_request("POST", url, body, headers)
end

def http_put(url, body = "", headers = {})
  curl_request("PUT", url, body, headers)
end

def http_patch(url, body = "", headers = {})
  curl_request("PATCH", url, body, headers)
end

def http_delete(url, headers = {})
  curl_request("DELETE", url, nil, headers)
end

def kv_get(key)
  output, code = shell_capture("#{shell_escape(rapidforge_bin!)} get --key #{shell_escape(key)} 2>/dev/null")
  return output.chomp if code == 0
  return nil if code == 1

  raise "kv_get failed with exit code #{code}"
end

def kv_set(key, value)
  _, code = shell_capture("#{shell_escape(rapidforge_bin!)} set --key #{shell_escape(key)} --value #{shell_escape(value)} 2>/dev/null")
  return true if code == 0

  raise "kv_set failed with exit code #{code}"
end

def kv_del(key)
  _, code = shell_capture("#{shell_escape(rapidforge_bin!)} del --key #{shell_escape(key)} 2>/dev/null")
  return true if code == 0
  return false if code == 1

  raise "kv_del failed with exit code #{code}"
end

def kv_list
  output, code = shell_capture("#{shell_escape(rapidforge_bin!)} list 2>/dev/null")
  raise "kv_list failed with exit code #{code}" unless code == 0

  output.split("\n").map { |l| l.chomp }.reject { |l| l.empty? }
end
