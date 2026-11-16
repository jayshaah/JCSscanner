export async function onRequestGet() {
  try {
    const res = await fetch("https://api.india.delta.exchange/v2/products", {
      headers: { "Accept": "application/json" }
    });
    if (!res.ok) {
      return new Response(JSON.stringify({ success: false, error: `Upstream ${res.status}` }), {
        status: res.status,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
    const data = await res.json();
    const products = (data.result || [])
      .filter((p) => p.contract_type === "perpetual_futures" && p.state === "live")
      .map((p) => ({
        id: p.id,
        symbol: p.symbol,
        description: p.description || p.symbol,
        underlying: p.underlying_asset?.symbol || p.symbol
      }));

    return new Response(JSON.stringify({ success: true, result: products }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
