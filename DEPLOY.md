# Putting the site behind eclipseproductionsllc.com

Hosting: **GitHub Pages** (free, HTTPS included, custom domain supported).
Domain registrar: **Squarespace Domains**.

## 1. GitHub side (once)
1. Push this repo to GitHub (public repo, branch `main`).
2. Repo → Settings → Pages → Source: **GitHub Actions**.
3. Repo → Settings → Pages → Custom domain: `eclipseproductionsllc.com` → Save.
   Tick **Enforce HTTPS** once the DNS check passes (can take up to an hour).

## 2. Squarespace DNS (you do this — needs your Squarespace login)
Squarespace → Domains → eclipseproductionsllc.com → **DNS settings** → add these records:

| Type  | Host | Value                   | TTL  |
|-------|------|-------------------------|------|
| A     | @    | 185.199.108.153         | auto |
| A     | @    | 185.199.109.153         | auto |
| A     | @    | 185.199.110.153         | auto |
| A     | @    | 185.199.111.153         | auto |
| CNAME | www  | ivansito87.github.io    | auto |

Delete any existing Squarespace A / CNAME records for `@` and `www` that point at Squarespace
(they look like `198.185.159.x` / `ext-cust.squarespace.com`). Leave MX records alone.

## 3. Verify
```bash
dig +short eclipseproductionsllc.com      # → the four 185.199.x.x addresses
dig +short www.eclipseproductionsllc.com  # → ivansito87.github.io
```
Then open https://eclipseproductionsllc.com. First HTTPS cert can take ~15–60 min.
