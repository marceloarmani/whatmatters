const ALPHA_VANTAGE_API_KEY = 'AYD0CU34ZWEG2WM2';
const GOLDAPI_KEY = 'goldapi-4czjlk1mmar2m084-io';

function formatNumber(num) {
  return Number(num).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 4});
}

async function fetchUSD_BRL() {
  try {
    const res = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=BRL&apikey=${ALPHA_VANTAGE_API_KEY}`);
    const data = await res.json();
    const rate = data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
    document.querySelector('#usdbrl .price').textContent = formatNumber(rate);
  } catch {
    document.querySelector('#usdbrl .price').textContent = 'Error loading';
  }
}

async function fetchDXY() {
  try {
    // Alpha Vantage não tem DXY, usar FRED ou outra API
    // Aqui vamos usar a Alpha Vantage função FX_DAILY USD index proxy (exemplo)
    // Se quiser, podemos remover DXY para evitar erro.
    document.querySelector('#dxy .price').textContent = 'Unavailable';
  } catch {
    document.querySelector('#dxy .price').textContent = 'Error loading';
  }
}

async function fetch10YYield() {
  try {
    const res = await fetch(`https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=weekly&maturity=10year&apikey=${ALPHA_VANTAGE_API_KEY}`);
    const data = await res.json();
    const lastDate = Object.keys(data['data']).pop();
    const yieldValue = data['data'].find(d => d['date'] === lastDate)['value'];
    document.querySelector('#us10y .price').textContent = `${formatNumber(yieldValue)}%`;
  } catch {
    document.querySelector('#us10y .price').textContent = 'Error loading';
  }
}

async function fetchBitcoin() {
  try {
    const res = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=${ALPHA_VANTAGE_API_KEY}`);
    const data = await res.json();
    const price = data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
    document.querySelector('#bitcoin .price').textContent = `$${formatNumber(price)}`;
  } catch {
    document.querySelector('#bitcoin .price').textContent = 'Error loading';
  }
}

async function fetchGold() {
  try {
    const res = await fetch('https://www.goldapi.io/api/XAU/USD', {
      headers: { 'x-access-token': GOLDAPI_KEY, 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    document.querySelector('#gold .price').textContent = `$${formatNumber(data.price)}`;
  } catch {
    document.querySelector('#gold .price').textContent = 'Error loading';
  }
}

async function fetchSilver() {
  try {
    const res = await fetch('https://www.goldapi.io/api/XAG/USD', {
      headers: { 'x-access-token': GOLDAPI_KEY, 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    document.querySelector('#silver .price').textContent = `$${formatNumber(data.price)}`;
  } catch {
    document.querySelector('#silver .price').textContent = 'Error loading';
  }
}

function updateAll() {
  fetchUSD_BRL();
  fetchDXY();
  fetch10YYield();
  fetchBitcoin();
  fetchGold();
  fetchSilver();
}

window.onload = () => {
  updateAll();
  setInterval(updateAll, 300000); // Atualiza a cada 5 minutos
};
