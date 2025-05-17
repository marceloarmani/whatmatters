const ALPHA_VANTAGE_API_KEY = 'AYD0CU34ZWEG2WM2';
const GOLDAPI_KEY = 'goldapi-4czjlk1mmar2m084-io';

function formatNumber(num) {
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  });
}

async function fetchUSD_BRL() {
  try {
    const res = await fetch(`https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=USD&to_symbol=BRL&apikey=${ALPHA_VANTAGE_API_KEY}`);
    const data = await res.json();
    const lastDate = Object.keys(data['Time Series FX (Daily)'])[0];
    const rate = data['Time Series FX (Daily)'][lastDate]['4. close'];
    document.querySelector('#usdbrl .price').textContent = `R$ ${formatNumber(rate)}`;
  } catch {
    document.querySelector('#usdbrl .price').textContent = 'Error loading';
  }
}

async function fetchDXY() {
  try {
    // DXY não é diretamente suportado pela Alpha Vantage com conta gratuita
    // Vamos mostrar "Unavailable" por enquanto
    document.querySelector('#dxy .price').textContent = 'Unavailable (API limit)';
  } catch {
    document.querySelector('#dxy .price').textContent = 'Error loading';
  }
}

async function fetch10YYield() {
  try {
    const res = await fetch(`https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=monthly&maturity=10year&apikey=${ALPHA_VANTAGE_API_KEY}`);
    const data = await res.json();
    const lastItem = data?.data?.[0];
    if (lastItem && lastItem.value) {
      document.querySelector('#us10y .price').textContent = `${formatNumber(lastItem.value)}%`;
    } else {
      document.querySelector('#us10y .price').textContent = 'Data not available';
    }
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
