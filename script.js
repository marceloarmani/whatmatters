const urls = {
  btc: 'https://query1.finance.yahoo.com/v8/finance/chart/BTC-USD',
  us10y: 'https://query1.finance.yahoo.com/v8/finance/chart/^TNX',
  gold: 'https://query1.finance.yahoo.com/v8/finance/chart/XAUUSD=X',
  silver: 'https://query1.finance.yahoo.com/v8/finance/chart/XAGUSD=X'
};

function format(value, decimals = 2) {
  return Number(value).toFixed(decimals);
}

async function fetchQuote(id, url, transform) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    const price = data.chart.result[0].meta.regularMarketPrice;
    document.getElementById(id).innerText = transform(price);
  } catch (err) {
    document.getElementById(id).innerText = `${id.toUpperCase()}: Error loading`;
  }
}

function updatePrices() {
  fetchQuote('btc', urls.btc, (p) => `BTC: $${format(p, 0)}`);
  fetchQuote('us10y', urls.us10y, (p) => `10Y Yield: ${format(p / 100, 2)}%`);
  fetchQuote('gold', urls.gold, (p) => `Gold: $${format(p, 2)} / oz`);
  fetchQuote('silver', urls.silver, (p) => `Silver: $${format(p, 2)} / oz`);
}

updatePrices();
setInterval(updatePrices, 30000); // Atualiza a cada 30s
