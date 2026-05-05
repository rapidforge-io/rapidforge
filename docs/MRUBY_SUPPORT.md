# mRuby Support

RapidForge now supports `mruby` as a script runtime for webhooks, periodic tasks, and on-fail scripts.

## Runtime Notes

- RapidForge embeds a cross-platform `mruby.com` binary built from `/Users/caneldem/mruby-cosmo-curl/mruby/build/host/bin/mruby.com`.
- The bundled runtime includes `mruby-curl` and JSON support.
- This runtime does not expose Ruby's usual `ENV` or `require`, so RapidForge boots scripts with a small compatibility layer instead.

## Top-Level Helpers

mRuby scripts can use these helpers directly:

```ruby
env("PAYLOAD_DATA")
http_get(url, headers = {})
http_post(url, body = "", headers = {})
http_put(url, body = "", headers = {})
http_patch(url, body = "", headers = {})
http_delete(url, headers = {})
kv_get(key)
kv_set(key, value)
kv_del(key)
kv_list()
RAPIDFORGE_ENV
```

Use `JSON.parse(...)` and `JSON.generate(...)` for JSON work.

## Editor Support

- RapidForge uses Ruby syntax highlighting for `mruby`.
- Autocomplete includes RapidForge helpers plus curated mRuby snippets for classes, modules, Enumerable patterns, hashes, arrays, JSON, HTTP, and KV usage.

## Maintenance Note

If the external `mruby-cosmo-curl` artifact is rebuilt or upgraded, replace the embedded binary in `mrubyrunner/mruby.com` and rerun the relevant Go tests plus the CodeMirror bundle build.
