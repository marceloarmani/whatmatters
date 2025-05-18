// script.js

const assets = [
  {
    name: "Bitcoin",
    id: "bitcoin",
    symbol: "BTC",
    currency: "usd"
  },
  {
    name: "Gold (Ounce)",
    id: "gold",
    symbol: "GOLD",
    currency: "usd"
  },
  {
    name: "Silver (Ounce)",
    id: "silver",
    symbol: "SILVER",
    currency: "usd"
  },
  {
    name: "10Y US Treasury Yield",
    id: "us10y",
    symbol: "US10Y",
    currency: "percent"
  },
  {
    name: "USD/BRL",
    id: "usdbrl",
    symbol: "USDBRL",
    currency: "brl"
  }
];

const quotesContainer = document.getElementById("quotes");

assets.forEach(asset => {
  const wrapper = document.createElement("div");
  wrapper.className = "quote-wrapper";

  const quote = document.createElement("div");
  quote.className = "quote";
  quote.innerHTML = `<strong>${asset.name}:</strong> <em>Loading...</em>`;

  const chartContainer = document.createElement("div");
  chartContainer.className = "chart-container";
  chartContainer.style.display = "none";

  const canvas = document.createElement("canvas");
  chartContainer.appendChild(canvas);

  wrapper.appendChild(quote);
  wrapper.appendChild(chartContainer);
  quotesContainer.appendChild(wrapper);

  quote.addEventListener("click", () => {
    chartContainer.style.display = chartContainer.style.display === "none" ? "block" : "none";
  });

  loadQuote(asset, quote);
  loadChart(asset.id, canvas, asset.currency);
});

async function loadQuote(asset, quoteEl) {
  try {
    let price = null;
    let change = null;

    if (asset.symbol === "BTC") {
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${asset.id}&vs_currencies=usd&include_24hr_change=true`);
      const data = await res.json();
      price = data[asset.id].usd;
      change = data[asset.id].usd_24h_change;
    } else if (asset.symbol === "USDBRL") {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await res.json();
      price = data.rates.BRL;
      // Change não disponível nessa API
    } else if (asset.symbol === "US10Y") {
      price = 4.32;
    } else {
      const symbolMap = {
        GOLD: "XAU",
        SILVER: "XAG"
      };
      const metalSymbol = symbolMap[asset.symbol];
      const res = await fetch(`https://www.goldapi.io/api/${metalSymbol}/USD`, {
        headers: {
          "x-access-token": "goldapi-4czjlk1mmar2m084-io",
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      price = data.price;
    }

    let formatted = "";
    if (asset.symbol === "US10Y") {
      formatted = `${price.toFixed(2)}%`;
    } else if (asset.symbol === "USDBRL") {
      formatted = `R$ ${price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    } else {
      formatted = `$${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    }

    if (change !== null && change !== undefined) {
      const color = change >= 0 ? "#0f0" : "#f00";
      const sign = change >= 0 ? "+" : "";
      quoteEl.innerHTML = `<strong>${asset.name}:</strong> ${formatted} <span style="color:${color}">(${sign}${change.toFixed(2)}%)</span>`;
    } else {
      quoteEl.innerHTML = `<strong>${asset.name}:</strong> ${formatted}`;
    }
  } catch (e) {
    console.error(`Erro ao carregar ${asset.name}:`, e);
    quoteEl.innerHTML = `<strong>${asset.name}:</strong> <span style="color:red">Erro</span>`;
  }
}

async function loadChart(id, canvas, currency) {
  try {
    const url = currency === "brl"
      ? `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=brl&days=180`
      : currency === "percent"
      ? null
      : `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=180`;

    if (!url) return;

    const res = await fetch(url);
    const data = await res.json();
    const labels = data.prices.map(p => new Date(p[0]).toLocaleDateString());
    const prices = data.prices.map(p => p[1]);

    new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Preço",
          data: prices,
          borderColor: "#4bc0c0",
          backgroundColor: "rgba(75,192,192,0.2)",
          fill: true,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: {
              color: "#aaa"
            }
          },
          y: {
            ticks: {
              color: "#aaa"
            }
          }
        }
      }
    });
  } catch (e) {
    console.error("Erro ao carregar gráfico:", e);
  }
}
