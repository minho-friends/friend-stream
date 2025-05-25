# @minho-friends/friend-stream

```bash
$ yarn
$ yarn clean
# TODO: inject the vars(envs) at `./packages/@minho-friends/friend-stream-api/wrangler.jsonc`.
$ yarn build
$ yarn @api deploy
```

<!--
## Cloudflare Rule

```
(http.host wildcard "REDACTED" and http.request.uri.path eq "/api/streams" and ip.src.asnum ne 13335)
or (http.host wildcard "REDACTED" and http.request.uri.path eq "/api/streams" and not cf.tls_client_auth.cert_verified)
or (http.host wildcard "REDACTED" and http.request.uri.path wildcard r"/live/*" and ip.src.asnum ne 13335)
# FIXME: https://github.com/minho-friends/friend-stream/issues/1
# or (http.host wildcard "REDACTED" and http.request.uri.path wildcard r"/live/*" and not cf.tls_client_auth.cert_verified)
```

-->
