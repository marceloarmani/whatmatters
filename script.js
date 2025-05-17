// Insert your API keys here:
const ALPHA_API_KEY = "AYD0CU34ZWEG2WM2";
const GOLDAPI_KEY = "JCEPmwMrTPyj5nEP9gEuFuSKOKCxPlQp";

// Helper: format number with commas for thousands and fixed decimals
function formatNumber(num, decimals = 2) {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

// Chart instances storage
const charts = {};

// Create a line chart
function createChart(ctx, label, labels, data) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { x: { display: false } }
    }
  });
}

// Fetch USD/BRL from Alpha Vantage (FX_INTRADAY)
async function fetchUSD_BRL() {
  try {
    const url = `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=USD&to_symbol=BRL&interval=15min&apikey=${ALPHA_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const timeSeries = data['Time Series FX (15min)'];
    if (!timeSeries) throw new Error('No data');
    const times = Object.keys(timeSeries).sort();
    const prices = times.map(t => parseFloat(timeSeries[t]['4. close']));
    const latestPrice = prices[prices.length - 1];
    document.getElementById('usdbrl-price').textContent = formatNumber(latestPrice, 4);

    // Chart with last 20 points
    const ctx = document.getElementById('usdbrl-chart').getContext('2d');
    if (charts.usdbrl) charts.usdbrl.destroy();
    charts.usdbrl = createChart(ctx, 'USD/BRL', times.slice(-20), prices.slice(-20));
  } catch (e) {
    document.getElementById('usdbrl-price').textContent = 'Error loading';
  }
}

// Fetch Bitcoin from Alpha Vantage (CRYPTO_INTRADAY)
async function fetchBTC() {
  try {
    const url = `https://www.alphavantage.co/query?function=CRYPTO_INTRADAY&symbol=BTC&market=USD&interval=15min&apikey=${ALPHA_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const timeSeries = data['Time Series Crypto (15min)'];
    if (!timeSeries) throw new Error('No data');
    const times = Object.keys(timeSeries).sort();
    const prices = times.map(t => parseFloat(timeSeries[t]['4. close']));
    const latestPrice = prices[prices.length - 1];
    document.getElementById('btc-price').textContent = `$${formatNumber(latestPrice, 2)}`;

    const ctx = document.getElementById('btc-chart').getContext('2d');
    if (charts.btc) charts.btc.destroy();
    charts.btc = createChart(ctx, 'BTC/USD', times.slice(-20), prices.slice(-20));
  } catch (e) {
    document.getElementById('btc-price').textContent = 'Error loading';
  }
}

// Fetch Gold and Silver from GoldAPI
async function fetchGoldSilver() {
  const symbols = [
    { id: 'gold', symbol: 'XAU', name: 'Gold' },
    { id: 'silver', symbol: 'XAG', name: 'Silver' }
  ];
  for (const asset of symbols) {
    try {
      const url = `https://www.goldapi.io/api/XAU/USD`;
      if (asset.symbol === 'XAG') url = `https://www.goldapi.io/api/XAG/USD`;
      const res = await fetch(url, {
        headers: { "x-access-token": GOLDAPI_KEY }
      });
      const data = await res.json();
      if (!data.price) throw new Error('No price');
      const price = data.price;
      document.getElementById(`${asset.id}-price`).textContent = `$${formatNumber(price, 2)}`;
      // GoldAPI free tier doesn’t support historical prices, so no charts here
      const ctx = document.getElementById(`${asset.id}-chart`).getContext('2d');
      if (charts[asset.id]) charts[asset.id].destroy();
      charts[asset.id] = createChart(ctx, asset.name, ['Now'], [price]);
    } catch {
      document.getElementById(`${asset.id}-price`).textContent = 'Error loading';
    }
  }
}

// Fetch 10Y US Treasury Yield from Alpha Vantage (TREASURY_YIELD)
async function fetchUS10Y() {
  try {
    const url = `https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=monthly&maturity=10year&apikey=${ALPHA_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const series = data['data'];
    if (!series || series.length === 0) throw new Error('No data');
    const times = series.map(item => item['date']).reverse();
    const yields = series.map(item => parseFloat(item['value'])).reverse();
    const latestYield = yields[yields.length - 1];
    document.getElementById('us10y-price').textContent = `${formatNumber(latestYield, 2)}%`;

    const ctx = document.getElementById('us10y-chart').getContext('2d');
    if (charts.us10y) charts.us10y.destroy();
    charts.us10y = createChart(ctx, '10Y US Treasury Yield', times, yields);
  } catch {
    document.getElementById('us10y-price').textContent = 'Error loading';
  }
}

// Fetch DXY from exchangerate.host (free and no API key needed)
async function fetchDXY() {
  try {
    // DXY is a weighted index of USD against EUR, JPY, GBP, CAD, SEK, CHF
    // exchangerate.host supports rates, so approximate DXY as USD index relative to these currencies
    const symbols = ['EUR', 'JPY', 'GBP', 'CAD', 'SEK', 'CHF'];
    const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=' + symbols.join(','));
    const data = await res.json();
    if (!data.rates) throw new Error('No rates');

    // Weights based on official DXY weights:
    const weights = {
      EUR: 0.576,
      JPY: 0.136,
      GBP: 0.119,
      CAD: 0.091,
      SEK: 0.042,
      CHF: 0.036,
    };

    // DXY approx = weighted geometric mean of USD exchange rates to these currencies
    let logSum = 0;
    let weightSum = 0;
    for (const cur of symbols) {
      const rate = data.rates[cur];
      if (!rate) throw new Error(`Missing rate for ${cur}`);
      logSum += weights[cur] * Math.log(rate);
      weightSum += weights[cur];
    }
    const dxyValue = Math.exp(logSum / weightSum);

    document.getElementById('dxy-price').textContent = formatNumber(dxyValue, 4);

    // No historical data for chart here, so just a single point
    const ctx = document.getElementById('dxy-chart').getContext('2d');
    if (charts.dxy) charts.dxy.destroy();
    charts.dxy = createChart(ctx, 'US Dollar Index (approx)', ['Now'], [dxyValue]);
  } catch {
    document.getElementById('dxy-price').textContent = 'Error loading';
  }
}

// Main update function
async function updateAll() {
  await Promise.all([
    fetchUSD_BRL(),
    fetchBTC(),
    fetchGoldSilver(),
    fetchUS10Y(),
    fetchDXY()
  ]);
}

// Run update immediately and every 5 minutes
updateAll();
setInterval(updateAll, 5 * 60 * 1000);
