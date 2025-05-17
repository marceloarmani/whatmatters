const alphaKey = 'AYD0CU34ZWEG2WM2'; // sua chave Alpha Vantage
const fmpKey = 'JCEPmwMrTPyj5nEP9gEuFuSKOKCxPlQp'; // sua chave Financial Modeling Prep

const endpoints = [
  {
    id: 'btc',
    symbol: 'BTC/USD',
    chartId: 'btcChart',
    label: 'Bitcoin',
  },
  {
    id: 'gold',
    symbol: 'XAU/USD',
    chartId: 'goldChart',
    label: 'Gold',
  },
  {
    id: 'silver',
    symbol: 'XAG/USD',
    chartId: 'silverChart',
    label: 'Silver',
  },
  {
    id: 'usdbrl',
    symbol: 'USD/BRL',
    chartId: 'usdbrlChart',
    label: 'USD/BRL',
  },
  {
    id: 'us10y',
    symbol: 'US10Y',
    chartId: 'us10yChart',
    label: '10Y Yield',
    useRateAPI: true,
  },
];

function formatNumber(n) {
  return Number(n).toLocaleString('en-US', {
    maximumFractionDigits: 4,
    minimumFractionDigits: 2
  });
}

async function fetchAlpha(symbol, id, chartId, label, useRateAPI = false) {
  let url = useRateAPI
    ? `https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=daily&maturity=10year&apikey=${alphaKey}`
    : `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${symbol.split('/')[0]}&to_symbol=${symbol.split('/')[1]}&apikey=${alphaKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    let value, timeSeries;

    if (useRateAPI) {
      value = data?.data?.[0]?.value;
      timeSeries = data?.data?.slice(0, 30).reverse();
    } else {
      const ts = data['Time Series FX (Daily)'];
      const dates = Object.keys(ts).slice(0, 30).reverse();
      timeSeries = dates.map(date => ({
        date,
        value: ts[date]['4. close']
      }));
      value = timeSeries[timeSeries.length - 1].value;
    }

    document.getElementById(id).textContent = formatNumber(value) + ' USD';

    const ctx = document.getElementById(chartId);
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: timeSeries.map(p => p.date),
        datasets: [{
          label: label,
          data: timeSeries.map(p => p.value),
          borderColor: '#4FD1C5',
          backgroundColor: 'rgba(79, 209, 197, 0.1)',
          tension: 0.3,
        }]
      },
      options: {
        scales: {
          x: { display: false },
          y: {
            ticks: { color: '#fff' }
          }
        },
        plugins: { legend: { labels: { color: '#fff' } } }
      }
    });

  } catch (err) {
    document.getElementById(id).textContent = `${label}: Error loading`;
  }
}

async function fetchDXY() {
  try {
    const res = await fetch(`https://financialmodelingprep.com/api/v3/quotes/index?apikey=${fmpKey}`);
    const data = await res.json();
    const dxy = data.find(item => item.symbol === 'DXY');
    if (dxy) {
      document.getElementById('dxy').textContent = formatNumber(dxy.price) + ' USD';
    } else {
      document.getElementById('dxy').textContent = 'DXY: Not found';
    }
  } catch {
    document.getElementById('dxy').textContent = 'DXY: Error loading';
  }
}

endpoints.forEach(ep => {
  fetchAlpha(ep.symbol, ep.id, ep.chartId, ep.label, ep.useRateAPI);
});

fetchDXY();
