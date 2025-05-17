const alphaVantageKey = "AYD0CU34ZWEG2WM2";
const goldApiKey = "goldapi-4czjlk1mmar2m084-io";

async function fetchData(url, parseFn, selector) {
  try {
    const response = await fetch(url, {
      headers: url.includes("goldapi") ? { "x-access-token": goldApiKey } : {}
    });
    const data = await response.json();
    const value = parseFn(data);
    document.querySelector(selector).textContent = `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } catch (e) {
    document.querySelector(selector).textContent = "Error loading";
  }
}

function fetchBTC() {
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=${alphaVantageKey}`;
  fetchData(url, data => parseFloat(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]), "#btc .price");
}

function fetchUSDToBRL() {
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=BRL&apikey=${alphaVantageKey}`;
  fetchData(url, data => parseFloat(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]), "#usdbrl .price");
}

function fetchGold() {
  const url = "https://www.goldapi.io/api/XAU/USD";
  fetchData(url, data => parseFloat(data.price), "#gold .price");
}

function fetchSilver() {
  const url = "https://www.goldapi.io/api/XAG/USD";
  fetchData(url, data => parseFloat(data.price), "#silver .price");
}

function fetch10YYield() {
  const url = `https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=daily&maturity=10year&apikey=${alphaVantageKey}`;
  fetchData(url, data => {
    const latest = data.data[0];
    return parseFloat(latest.value);
  }, "#us10y .price");
}

function fetchDXY() {
  // Usando o ETF UUP como proxy para o DXY
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=UUP&apikey=${alphaVantageKey}`;
  fetchData(url, data => parseFloat(data["Global Quote"]["05. price"]), "#dxy .price");
}

function loadAll() {
  fetchBTC();
  fetchUSDToBRL();
  fetchGold();
  fetchSilver();
  fetch10YYield();
  fetchDXY();
}

loadAll();
setInterval(loadAll, 5 * 60 * 1000); // Atualiza a cada 5 minutos
