export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const symbol = url.searchParams.get("symbol");
  if (!symbol) {
    return new Response(JSON.stringify({ success: false, error: "Missing symbol parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  const end = Math.floor(Date.now() / 1000);
  const start = end - 24 * 60 * 60; // Last 24 hours (1,440 1m candles)
  const upstreamUrl = `https://api.india.delta.exchange/v2/history/candles?resolution=1m&symbol=${encodeURIComponent(symbol)}&start=${start}&end=${end}`;

  try {
    const res = await fetch(upstreamUrl, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "delta-screener-cf/1.0"
      }
    });
    if (!res.ok) {
      return new Response(JSON.stringify({ success: false, error: `Upstream ${res.status}` }), {
        status: res.status,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
    const data = await res.json();
    const candles = (data.result || [])
      .map((c) => ({
        time: Number(c.time),
        open: Number(c.open),
        high: Number(c.high),
        low: Number(c.low),
        close: Number(c.close),
        volume: Number(c.volume || 0)
      }))
      .sort((a, b) => a.time - b.time);

    return new Response(JSON.stringify({ success: true, symbol, result: candles }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
