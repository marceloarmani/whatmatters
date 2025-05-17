// Insira aqui suas keys
const ALPHA_API_KEY = 'AYD0CU34ZWEG2WM2'; // Troque pela sua
const GOLDAPI_API_KEY = 'goldapi-4czjlk1mmar2m084-io'; // Troque pela sua
const FRED_API_KEY = '5cea6c897e85a36d7573bcf686ef03fe'; // Troque pela sua

// Função de formatação simples
function formatNumber(num) {
  if (typeof num !== 'number') return '-';
  return num.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

// Cria gráfico básico com Chart.js
function createChart(ctx) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Preço',
        data: [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.3,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      animation: false,
      scales: {
        x: { display: false },
        y: { beginAtZero: false }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

const charts = {};

// Atualiza gráfico com novo dado
function updateChart(chartId, newValue) {
  const chart = charts[chartId];
  if (!chart) return;
  const now = new Date().toLocaleTimeString();
  chart.data.labels.push(now);
  chart.data.datasets[0].data.push(newValue);

  if (chart.data.labels.length > 20) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.update();
}

// Inicializa todos os gráficos
function initCharts() {
  charts['btc-chart'] = createChart(document.getElementById('btc-chart').getContext('2d'));
  charts['gold-chart'] = createChart(document.getElementById('gold-chart').getContext('2d'));
  charts['silver-chart'] = createChart(document.getElementById('silver-chart').getContext('2d'));
  charts['yield-chart'] = createChart(document.getElementById('yield-chart').getContext('2d'));
  charts['usdbrl-chart'] = createChart(document.getElementById('usdbrl-chart').getContext('2d'));
  charts['uup-chart'] = createChart(document.getElementById('uup-chart').getContext('2d'));
}

// Função para pegar preço BTC/USD (Alpha Vantage)
async function fetchBitcoin() {
  const el = document.getElementById('btc-price');
  try {
    const res = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=${ALPHA_API_KEY}`);
    const data = await res.json();
    const priceStr = data['Realtime Currency Exchange Rate']?.['5. Exchange Rate'];
    const price = parseFloat(priceStr);
    if (isNaN(price)) throw new Error('Preço inválido');
    el.textContent = '$ ' + formatNumber(price);
    updateChart('btc-chart', price);
  } catch (e) {
    el.textContent = 'Error loading';
    console.error('Erro BTC:', e);
  }
}

// Função para pegar Ouro e Prata (GoldAPI)
async function fetchGoldAndSilver() {
  try {
    const goldEl = document.getElementById('gold-price');
    const silverEl = document.getElementById('silver-price');

    const goldRes = await fetch('https://www.goldapi.io/api/XAU/USD', {
      headers: { 'x-access-token': GOLDAPI_API_KEY }
    });
    const goldData = await goldRes.json();
    const goldPrice = parseFloat(goldData.price);
    if (isNaN(goldPrice)) throw new Error('Preço ouro inválido');
    goldEl.textContent = '$ ' + formatNumber(goldPrice);
    updateChart('gold-chart', goldPrice);

    const silverRes = await fetch('https://www.goldapi.io/api/XAG/USD', {
      headers: { 'x-access-token': GOLDAPI_API_KEY }
    });
    const silverData = await silverRes.json();
    const silverPrice = parseFloat(silverData.price);
    if (isNaN(silverPrice)) throw new Error('Preço prata inválido');
    silverEl.textContent = '$ ' + formatNumber(silverPrice);
    updateChart('silver-chart', silverPrice);

  } catch (e) {
    document.getElementById('gold-price').textContent = 'Error loading';
    document.getElementById('silver-price').textContent = 'Error loading';
    console.error('Erro Ouro/Prata:', e);
  }
}

// Função para pegar USD/BRL (Alpha Vantage)
async function fetchUSDBRL() {
  const el = document.getElementById('usdbrl-price');
  try {
    const res = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=BRL&apikey=${ALPHA_API_KEY}`);
    const data = await res.json();
    const priceStr = data['Realtime Currency Exchange Rate']?.['5. Exchange Rate'];
    const price = parseFloat(priceStr);
    if (isNaN(price)) throw new Error('Preço inválido USD/BRL');
    el.textContent = 'R$ ' + formatNumber(price);
    updateChart('usdbrl-chart', price);
  } catch (e) {
    el.textContent = 'Error loading';
    console.error('Erro USD/BRL:', e);
  }
}

// Função para pegar 10Y Treasury Yield (FRED API)
async function fetchUSTreasuryYield() {
  const el = document.getElementById('yield-price');
  try {
    const res = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=GS10&api_key=${FRED_API_KEY}&file_type=json`);
    const data = await res.json();
    if (!data.observations || data.observations.length === 0) throw new Error('No data yield');
    // Pega último valor válido do yield
    let
