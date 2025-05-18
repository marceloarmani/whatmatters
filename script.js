const assets = [
  { name: "Bitcoin", id: "bitcoin", symbol: "BTC", currency: "usd" },
  { name: "Gold (Ounce)", id: "gold", symbol: "GOLD", currency: "usd" },
  { name: "Silver (Ounce)", id: "silver", symbol: "SILVER", currency: "usd" },
  { name: "10Y US Treasury Yield", id: "us10y", symbol: "US10Y", currency: "percent" },
  { name: "USD/BRL", id: "usdbrl", symbol: "USDBRL", currency: "brl" }
];

const quotesContainer = document.getElementById("quotes");

assets.forEach(asset => {
  const wrapper = document.createElement("div");
  wrapper.className = "quote-wrapper";

  const quote = document.createElement("div");
  quote.className = "quote";
  quote.innerHTML = `<strong>${asset.name}:</strong> <em>Loading...</em>`;

  // Botão para mostrar/ocultar gráfico
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "Mostrar gráfico ▼";
  toggleBtn.style.marginLeft = "1rem";
  toggleBtn.style.cursor = "pointer";

  const chartContainer = document.createElement("div");
  chartContainer.className = "chart-container";
  chartContainer.style.display = "none";

  const canvas = document.createElement("canvas");
  chartContainer.appendChild(canvas);

  // Adiciona botão e quote no wrapper
  const headerDiv = document.createElement("div");
  headerDiv.style.display = "flex";
  headerDiv.style.alignItems = "center";
  headerDiv.appendChild(quote);
  headerDiv.appendChild(toggleBtn);

  wrapper.appendChild(headerDiv);
  wrapper.appendChild(chartContainer);
  quotesContainer.appendChild(wrapper);

  toggleBtn.addEventListener("click", () => {
    if (chartContainer.style.display === "none") {
      chartContainer.style.display = "block";
      toggleBtn.textContent = "Ocultar gráfico ▲";
    } else {
      chartContainer.style.display = "none";
      toggleBtn.textContent = "Mostrar gráfico ▼";
    }
  });

  loadQuote(asset, quote);
  loadChart(asset, canvas, asset);
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
    } else if (asset.symbol === "US10Y") {
      price = 4.32; // valor fixo, pode ser atualizado para API real
    } else if (asset.symbol === "GOLD" || asset.symbol === "SILVER") {
      // Usando Metals-API (substitua YOUR_API_KEY)
      const metalSymbols = { GOLD: "XAU", SILVER: "XAG" };
      const metal = metalSymbols[asset.symbol];
      const res = await fetch(`https://metals-api.com/api/latest?access_key=YOUR_API_KEY&base=USD&symbols=${metal}`);
      const data = await res.json();
      if (data.success) {
        // A API retorna taxa USD -> metal, queremos metal -> USD, então 1 / taxa
        price = 1 / data.rates[metal];
      } else {
        throw new Error("Erro na API Metals-API");
      }
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

async function loadChart(asset, canvas, assetObj) {
  try {
    let url = null;
    let labels = [];
    let prices = [];

    if (asset.symbol === "BTC") {
      url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=180`;
    } else if (asset.symbol === "USDBRL") {
      url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=brl&days=180`;
    } else if (asset.symbol === "GOLD" || asset.symbol === "SILVER") {
      // Infelizmente Metals-API gratuita não tem histórico
      // Aqui você pode colocar dados fictícios para o gráfico ou exibir mensagem
      // Vou criar dados fictícios para exemplo:
      const now = Date.now();
      for (let i = 180; i >= 0; i -= 7) {
        labels.push(new Date(now - i * 24 * 60 * 60 * 1000).toLocaleDateString());
        prices.push(1800 + Math.sin(i / 10) * 50); // exemplo para ouro
      }
    } else if (asset.symbol === "US10Y") {
      // Sem gráfico para yield, pode pular
      canvas.parentElement.style.display = "none";
      return;
    }

    if (url) {
      const res = await fetch(url);
      const data = await res.json();
      labels = data.prices.map(p => new Date(p[0]).toLocaleDateString());
      prices = data.prices.map(p => p[1]);
    }

    new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Preço",
          data: prices,
          borderColor: asset.symbol === "BTC" ? "#f7931a" : asset.symbol === "GOLD" ? "#d4af37" : asset.symbol === "SILVER" ? "#c0c0c0" : "#4bc0c0",
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
            ticks: { color: "#555" }
          },
          y: {
            ticks: { color: "#555" }
          }
        }
      }
    });
  } catch (e) {
    console.error("Erro ao carregar gráfico:", e);
  }
}
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

  // Clique no ativo para mostrar/ocultar gráfico
  quote.addEventListener("click", () => {
    chartContainer.style.display = chartContainer.style.display === "none" ? "block" : "none";
  });

  loadQuote(asset, quote);
  loadChart(asset, canvas, asset);
});
