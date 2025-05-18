document.addEventListener("DOMContentLoaded", async function () {
  const assets = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      id: "bitcoin"
    },
    {
      name: "Gold (Ounce)",
      symbol: "GOLD",
      id: "gold"
    },
    {
      name: "Silver (Ounce)",
      symbol: "SILVER",
      id: "silver"
    },
    {
      name: "10Y US Treasury Yield",
      symbol: "US10Y",
      fixedValue: 4.32
    },
    {
      name: "USD/BRL",
      symbol: "USDBRL",
      id: "usdbrl"
    }
  ];

  const container = document.getElementById("quotes");

  for (const asset of assets) {
    const wrapper = document.createElement("div");
    wrapper.className = "quote";
    const title = document.createElement("strong");
    title.textContent = asset.name;
    const valueEl = document.createElement("span");
    valueEl.textContent = "Loading...";
    wrapper.appendChild(title);
    wrapper.appendChild(valueEl);
    container.appendChild(wrapper);

    try {
      let price, change, historical;

      if (asset.fixedValue !== undefined) {
        price = asset.fixedValue;
        change = 0;
        historical = [];
      } else if (asset.symbol === "USDBRL") {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await res.json();
        price = data.rates.BRL;
        change = 0; // Substitua por cálculo real, se disponível
        historical = [];
      } else {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${asset.id}/market_chart?vs_currency=usd&days=1`);
        const hist = await res.json();
        historical = hist.prices;
        const latest = hist.prices[hist.prices.length - 1][1];
        const first = hist.prices[0][1];
        price = latest;
        change = ((latest - first) / first) * 100;
      }

      let formatted;
      if (asset.symbol === "US10Y") {
        formatted = `${price.toFixed(2)}%`;
      } else if (asset.symbol === "USDBRL") {
        formatted = `R$ ${price.toFixed(2)}`;
      } else {
        formatted = `$${price.toFixed(2)}`;
      }

      const changeEl = document.createElement("span");
      changeEl.textContent = ` (${change.toFixed(2)}%)`;
      changeEl.className = change >= 0 ? "up" : "down";

      valueEl.textContent = formatted;
      valueEl.appendChild(changeEl);

      if (historical.length > 0) {
        const canvas = document.createElement("canvas");
        wrapper.appendChild(canvas);
        new Chart(canvas, {
          type: "line",
          data: {
            labels: historical.map(p => new Date(p[0]).toLocaleTimeString()),
            datasets: [{
              label: asset.name,
              data: historical.map(p => p[1]),
              borderColor: change >= 0 ? "green" : "red",
              fill: false
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
                display: false
              },
              y: {
                display: true
              }
            }
          }
        });
      }

    } catch (e) {
      valueEl.textContent = "Erro ao carregar";
      console.error(`Erro ao carregar ${asset.name}:`, e);
    }
  }
});
