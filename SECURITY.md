# security header deployment hand-off

Deploy the `dist/` directory (produced by `bash build.sh`), NOT the repo root. That keeps internal files such as `steering/`, `package.json`, and `.git/` off the public web.

| host | file to use |
| --- | --- |
| Cloudflare Pages / Netlify | `_headers` in the output directory |
| Vercel | `vercel.json` at project root |
| Firebase | `firebase.json` |
| nginx | include `nginx-security-headers.conf` |
| Apache | `.htaccess` in web root |

nginx note: `add_header` directives are not inherited into any `location` block that defines its own `add_header`. If you add per-location headers, re-include `nginx-security-headers.conf` inside that block, or the security headers silently vanish there.

GitHub Pages cannot set custom response headers. On GitHub Pages, the only CSP is the in-page `<meta>` CSP already in the HTML, and there is no HSTS and no `frame-ancestors` / `X-Frame-Options` clickjacking protection. GitHub Pages is the weakest option and is unsuitable if response-header security or privacy is required.

Making the site private or gated is host-dependent, such as Cloudflare Access or a paid Netlify/Vercel access tier. A public GitHub repo on GitHub Pages is a public site; do not assume privacy the host does not provide.

These configs ship HSTS as `max-age=31536000` with no `includeSubDomains` or `preload`. `includeSubDomains` forces HTTPS on every subdomain of the domain for the max-age window, so add it only after confirming all subdomains are HTTPS-ready. `preload` is a hard-to-reverse browser preload-list commitment.

The in-page meta CSP and these header configs share the same script hash: `sha256-xccjRKJkULpA2QTMQzwusuAnDmKLJgjVozvd5Z8vEHY=`. If the site's inline `<head>` script is ever edited, update both the meta CSP in every HTML file and the CSP here with the new hash.

Header CSP used by these deployment configs:

```text
default-src 'self'; script-src 'self' 'sha256-xccjRKJkULpA2QTMQzwusuAnDmKLJgjVozvd5Z8vEHY='; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests
```
