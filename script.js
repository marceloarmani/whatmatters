// script.js

const alphaApiKey = "AYD0CU34ZWEG2WM2"; // Sua chave Alpha Vantage
const goldApiKey = "goldapi-4czjlk1mmar2m084-io"; // Sua chave GoldAPI

// IDs dos elementos no HTML para atualizar
const elements = {
  btcPrice: document.getElementById("btc-price"),
  goldPrice: document.getElementById("gold-price"),
  silverPrice: document.getElementById("silver-price"),
  usdbrlPrice: document.getElementById("usdbrl-price"),
  treasuryYield: document.getElementById("treasury-yield"),
  uupPrice: document.getElementById("uup-price"),
};

const charts = {};

// Função para formatar números com vírgula como separador de milhar e 2 decimais
function formatNumber(num) {
  return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Função para exibir erro no elemento
function showError(el, message) {
  el.textContent = message;
}

// --- BUSCA PREÇOS ---

// Bitcoin preço (usando CoinGecko)
async function fetchBitcoinPrice() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
    const data = await res.json();
    const price = data.bitcoin.usd;
    elements.btcPrice.textContent = "$" + formatNumber(price);
    updateChart("btcChart", price);
  } catch {
    showError(elements.btcPrice, "Error loading");
  }
}

// Ouro e prata (usando GoldAPI)
async function fetchGoldAndSilver() {
  try {
    const res = await fetch("https://www.goldapi.io/api/XAU/USD", {
      headers: { "x-access-token": goldApiKey, "Content-Type": "application/json" },
    });
    const dataGold = await res.json();
    elements.goldPrice.textContent = "$" + formatNumber(dataGold.price);
    updateChart("goldChart", dataGold.price);
  } catch {
    showError(elements.goldPrice, "Error loading");
  }

  try {
    const res = await fetch("https://www.goldapi.io/api/XAG/USD", {
      headers: { "x-access-token": goldApiKey, "Content-Type": "application/json" },
    });
    const dataSilver = await res.json();
    elements.silverPrice.textContent = "$" + formatNumber(dataSilver.price);
    updateChart("silverChart", dataSilver.price);
  } catch {
    showError(elements.silverPrice, "Error loading");
  }
}

// USD/BRL câmbio (Alpha Vantage)
async function fetchUSDToBRL() {
  try {
    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=BRL&apikey=${alphaApiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    const rate = parseFloat(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]);
    elements.usdbrlPrice.textContent = formatNumber(rate);
    updateChart("usdbrlChart", rate);
  } catch {
    showError(elements.usdbrlPrice, "Error loading");
  }
}

// 10Y US Treasury Yield (FRED API)
async function fetch10YYield() {
  try {
    // FRED API Key (já está na URL)
    const fredApiKey = "5cea6c897e85a36d7573bcf686ef03fe";
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=GS10&api_key=${fredApiKey}&file_type=json`;
    const res = await fetch(url);
    const data = await res.json();
    // Pega o último valor disponível (última observação)
    const observations = data.observations;
    let lastValid = null;
    for (let i = observations.length - 1; i >= 0; i--) {
      if (observations[i].value !== ".") {
        lastValid = parseFloat(observations[i].value);
        break;
      }
    }
    if (lastValid !== null) {
      elements.treasuryYield.textContent = lastValid.toFixed(2) + "%";
      updateChart("treasuryChart", lastValid);
    } else {
      showError(elements.treasuryYield, "No data");
    }
  } catch {
    showError(elements.treasuryYield, "Error loading");
  }
}

// UUP ETF preço (Alpha Vantage - símbolo: UUP)
async function fetchUUP() {
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=UUP&apikey=${alphaApiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    const price = parseFloat(data["Global Quote"]["05. price"]);
    if (!isNaN(price)) {
      elements.uupPrice.textContent = "$" + formatNumber(price);
      updateChart("uupChart", price);
    } else {
      showError(elements.uupPrice, "Unavailable");
    }
  } catch {
    showError(elements.uupPrice, "Error loading");
  }
}

// --- GRÁFICOS ---

// Inicializa gráficos vazios
function initCharts() {
  const ctxs = {
    btcChart: document.getElementById("btc-chart").getContext("2d"),
    goldChart: document.getElementById("gold-chart").getContext("2d"),
    silverChart: document.getElementById("silver-chart").getContext("2d"),
    usdbrlChart: document.getElementById("usdbrl-chart").getContext("2d"),
    treasuryChart: document.getElementById("treasury-chart").getContext("2d"),
    uupChart: document.getElementById("uup-chart").getContext("2d"),
  };

  for (const key in ctxs) {
    charts[key] = new Chart(ctxs[key], {
      type: "line",
      data: {
        labels: [],
        datasets: [{
          label: "Price",
          data: [],
          borderColor: "#0073e6",
          backgroundColor: "rgba(0, 115, 230, 0.2)",
          fill: true,
          tension: 0.3,
          pointRadius: 0,
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
        },
        elements: { line: { borderWidth: 2 } }
      }
    });
  }
}

// Atualiza gráfico adicionando novo valor, mantém últimos 30 pontos
function updateChart(chartId, value) {
  if (!charts[chartId]) return;
  const chart = charts[chartId];
  const now = new Date().toLocaleTimeString();

  chart.data.labels.push(now);
  chart.data.datasets[0].data.push(value);

  if (chart.data.labels.length > 30) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.update();
}

// --- MAIN ---

async function updateData() {
  await Promise.all([
    fetchBitcoinPrice(),
    fetchGoldAndSilver(),
    fetchUSDToBRL(),
    fetch10YYield(),
    fetchUUP(),
  ]);
}

// Inicialização
initCharts();
updateData();

// Atualiza a cada 5 minutos (300000 ms)
setInterval(updateData, 300000);
