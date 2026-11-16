# Delta Exchange India — Live Volatility Screener (Cloudflare Pages)

A zero-cost, globally accessible crypto volatility screener for Delta Exchange India perpetual futures.

## Features
- **Per-second live updates** directly via `wss://socket.india.delta.exchange` (`v2/ticker`)
- **All 10 timeframes:** `5m`, `15m`, `30m`, `45m`, `1h`, `4h`, `6h`, `8h`, `12h`, `24h`
- **Metrics:** Range %, 14-period ATR %, Net Change %, Bid-Ask Spread %, and 24h USD Volume
- **Zero-CORS backend proxy:** `functions/api/products.js` and `functions/api/candles.js` run on Cloudflare Workers Free tier

## Deploy to Cloudflare Pages (Free)

### Option 1: GitHub Integration (Recommended)
1. Unzip this folder and push its contents to a new GitHub repository.
2. Go to **Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git**.
3. Select your repository, leave **Build command** empty, set **Build output directory** to `/`, and click **Save and Deploy**.

### Option 2: Wrangler CLI
```bash
npx wrangler pages deploy . --project-name=delta-volatility-screener
```
