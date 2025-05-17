// Chaves das APIs
const ALPHA_API_KEY = 'AYD0CU34ZWEG2WM2';
const GOLDAPI_API_KEY = 'goldapi-4czjlk1mmar2m084-io';
const FRED_API_KEY = '5cea6c897e85a36d7573bcf686ef03fe';

const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return 'N/A';
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
};

const fetchJSON = async (url, headers = {}) => {
  try {
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

// Atualizar preço e gráfico do Bitcoin (BTC/USD)
async function updateBTC() {
  const url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=${ALPHA_API_KEY}`;
  const data = await fetchJSON(url);
  if (!data || !data['Time Series (Digital Currency Daily)']) {
    document.getElementById('btc-price').innerText = 'Error loading';
    return;
  }

  const timeSeries = data['Time Series (Digital Currency Daily)'];
  const dates = Object.keys(timeSeries).slice(0, 30).reverse();
  const prices = dates.map(date => parseFloat(timeSeries[date]['4a. close (USD)']));
  const latestPrice = prices[prices.length - 1];

  document.getElementById('btc-price').innerText = `$${formatNumber(latestPrice)}`;

  drawChart('btc-chart', dates, prices, 'BTC/USD');
}

// Atualizar preço e gráfico do Ouro (XAU/USD)
async function updateGold() {
  const url = 'https://www.goldapi.io/api/XAU/USD';
  const headers = { 'x-access-token': GOLDAPI_API_KEY, 'Content-Type': 'application/json' };
  const data = await fetchJSON(url, headers);
  if (!data || !data.price) {
    document.getElementById('gold-price').innerText = 'Error loading';
    return;
  }
  document.getElementById('gold-price').innerText = `$${formatNumber(data.price)}`;

  // Para o gráfico do ouro vamos pegar os preços do Alpha Vantage como fallback:
  const avUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=GLD&apikey=${ALPHA_API_KEY}`;
  const avData = await fetchJSON(avUrl);
  if (!avData || !avData['Time Series (Daily)']) {
    drawChart('gold-chart', [], [], 'Gold');
    return;
  }
  const timeSeries = avData['Time Series (Daily)'];
  const dates = Object.keys(timeSeries).slice(0, 30).reverse();
  const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));
  drawChart('gold-chart', dates, prices, 'Gold');
}

// Atualizar preço e gráfico da Prata (XAG/USD)
async function updateSilver() {
  const url = 'https://www.goldapi.io/api/XAG/USD';
  const headers = { 'x-access-token': GOLDAPI_API_KEY, 'Content-Type': 'application/json' };
  const data = await fetchJSON(url, headers);
  if (!data || !data.price) {
    document.getElementById('silver-price').innerText = 'Error loading';
    return;
  }
  document.getElementById('silver-price').innerText = `$${formatNumber(data.price)}`;

  // Gráfico similar ao ouro com fallback Alpha Vantage (usando SLV ETF)
  const avUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SLV&apikey=${ALPHA_API_KEY}`;
  const avData = await fetchJSON(avUrl);
  if (!avData || !avData['Time Series (Daily)']) {
    drawChart('silver-chart', [], [], 'Silver');
    return;
  }
  const timeSeries = avData['Time Series (Daily)'];
  const dates = Object.keys(timeSeries).slice(0, 30).reverse();
  const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));
  drawChart('silver-chart', dates, prices, 'Silver');
}

// Atualizar yield do título de 10 anos dos EUA
async function updateYield() {
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=GS10&api_key=${FRED_API_KEY}&file_type=json&limit=30`;
  const data = await fetchJSON(url);
  if (!data || !data.observations) {
    document.getElementById('yield-price').innerText = 'Error loading';
    return;
  }
  const observations = data.observations.filter(obs => obs.value !== '.');
  const dates = observations.map(obs => obs.date).reverse();
  const values = observations.map(obs => parseFloat(obs.value)).reverse();
  const latestValue = values[values.length - 1];

  document.getElementById('yield-price').innerText = `${formatNumber(latestValue)}%`;

  drawChart('yield-chart', dates, values, '10Y Yield (%)');
}

// Atualizar cotação USD/BRL
async function updateUSD_BRL() {
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=BRL&apikey=${ALPHA_API_KEY}`;
  const data = await fetchJSON(url);
  if (!data || !data['Realtime Currency Exchange Rate']) {
    document.getElementById('usdbrl-price').innerText = 'Error loading';
    return;
  }
  const price = parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
  document.getElementById('usdbrl-price').innerText = `R$ ${formatNumber(price)}`;

  // Gráfico - pegar histórico (usando Alpha Vantage FX_DAILY)
  const histUrl = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=USD&to_symbol=BRL&apikey=${ALPHA_API_KEY}`;
  const histData = await fetchJSON(histUrl);
  if (!histData || !histData['Time Series FX (Daily)']) {
    drawChart('usdbrl-chart', [], [], 'USD/BRL');
    return;
  }
  const timeSeries = histData['Time Series FX (Daily)'];
  const dates = Object.keys(timeSeries).slice(0, 30).reverse();
  const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));
  drawChart('usdbrl-chart', dates, prices, 'USD/BRL');
}

// Atualizar cotação do ETF UUP (proxy para o índice dólar)
async function updateUUP() {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=UUP&apikey=${ALPHA_API_KEY}`;
  const data = await fetchJSON(url);
  if (!data || !data['Time Series (Daily)']) {
    document.getElementById('uup-price').innerText = 'Error loading';
    return;
  }
  const timeSeries = data['Time Series (Daily)'];
  const dates = Object.keys(timeSeries).slice(0, 30).reverse();
  const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));
  const latestPrice = prices[prices.length - 1];

  document.getElementById('uup-price').innerText = `$${formatNumber(latestPrice)}`;
  drawChart('uup-chart', dates, prices, 'UUP ETF');
}

// Função para desenhar gráficos com Chart.js
function drawChart(canvasId, labels, data, label) {
  const ctx = document.getElementById(canvasId).getContext('2d');

  // Limpar gráfico anterior se houver
  if (window[canvasId]) {
    window[canvasId].destroy();
  }

  window[canvasId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label,
        data,
        borderColor: '#007acc',
        backgroundColor: 'rgba(0, 122, 204, 0.2)',
        fill: true,
        tension: 0.3,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { display: false },
        y: {
          beginAtZero: false,
          ticks: {
            callback: function(value) {
              return value.toLocaleString('en-US');
            }
          }
        }
      },
      plugins: {
        legend: { display: true }
      },
      elements: {
        line: {
          borderWidth: 2
        }
      }
    }
  });
}

// Função principal para atualizar tudo
async function updateAll() {
  await Promise.all([
    updateBTC(),
    updateGold(),
    updateSilver(),
    updateYield(),
    updateUSD_BRL(),
    updateUUP()
  ]);
}

// Atualizar a página toda vez que carregar e depois a cada 5 minutos
updateAll();
setInterval(updateAll, 300000); // 300.000 ms = 5 min
