function formatNumber(num) {
  return Number(num).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

async function fetchData(symbol, elementId, label, source = 'fmp') {
  try {
    let price;
    if (source === 'fmp') {
      const url = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=JCEPmwMrTPyj5nEP9gEuFuSKOKCxPlQp`;
      const response = await fetch(url);
      const data = await response.json();
      price = data[0]?.price;
    } else if (source === 'alphavantage') {
      const url = `https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=daily&maturity=10year&apikey=AYD0CU34ZWEG2WM2`;
      const response = await fetch(url);
      const data = await response.json();
      const latest = data['data']?.at(-1);
      price = latest?.value;
    }

    if (!price) throw new Error("No data");

    document.getElementById(elementId).textContent = `${label}: ${formatNumber(price)}${label === '10Y US Treasury Yield' ? '%' : ' USD'}`;
  } catch (err) {
    console.error(`${label} error:`, err);
    document.getElementById(elementId).textContent = `${label}: Error loading`;
  }
}

fetchData('USD/BRL', 'usdbrl', 'USD/BRL');
fetchData('BTCUSD', 'btc', 'Bitcoin');
fetchData('GCUSD', 'gold', 'Gold');
fetchData('SIUSD', 'silver', 'Silver');
fetchData(null, 'us10y', '10Y US Treasury Yield', 'alphavantage');
