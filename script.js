document.addEventListener("DOMContentLoaded", function () {
  const assets = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      fetch: async () => {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
        const data = await res.json();
        return data.bitcoin.usd;
      }
    },
    {
      name: "Gold (Ounce)",
      symbol: "GOLD",
      fetch: async () => {
        const res = await fetch("https://www.goldapi.io/api/XAU/USD", {
          headers: {
            "x-access-token": "goldapi-4czjlk1mmar2m084-io",
            "Content-Type": "application/json"
          }
        });
        if (!res.ok) throw new Error("Erro Gold");
        const data = await res.json();
        return data.price;
      }
    },
    {
      name: "Silver (Ounce)",
      symbol: "SILVER",
      fetch: async () => {
        const res = await fetch("https://www.goldapi.io/api/XAG/USD", {
          headers: {
            "x-access-token": "goldapi-4czjlk1mmar2m084-io",
            "Content-Type": "application/json"
          }
        });
        if (!res.ok) throw new Error("Erro Silver");
        const data = await res.json();
        return data.price;
      }
    },
    {
      name: "10Y US Treasury Yield",
      symbol: "US10Y",
      fetch: async () => {
        try {
          const res = await fetch("https://api.stlouisfed.org/fred/series/observations?series_id=DGS10&api_key=5cea6c897e85a36d7573bcf686ef03fe&file_type=json");
          const data = await res.json();
          const latest = data.observations.reverse().find(obs => obs.value !== ".");
          if (!latest) throw new Error("Sem dados");
          return parseFloat(latest.value);
        } catch (e) {
          console.error("Erro ao buscar US Treasury:", e);
          throw e;
        }
      }
    },
    {
      name: "USD/BRL",
      symbol: "USDBRL",
      fetch: async () => {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        if (!res.ok) throw new Error("Erro USD/BRL");
        const data = await res.json();
        return data.rates.BRL;
      }
    }
  ];

  const container = document.getElementById("quotes");

  assets.forEach(async (asset) => {
    const el = document.createElement("div");
    el.className = "quote";
    el.innerHTML = `<strong>${asset.name}:</strong> <em>Loading...</em>`;
    container.appendChild(el);

    try {
      const price = await asset.fetch();
      let formatted;

      if (asset.symbol === "US10Y") {
        formatted = `${price.toFixed(2)}%`;
      } else if (asset.symbol === "USDBRL") {
        formatted = `R$ ${price.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;
      } else {
        formatted = `$${price.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;
      }

      el.innerHTML = `<strong>${asset.name}:</strong> ${formatted}`;
    } catch (e) {
      el.innerHTML = `<strong>${asset.name}:</strong> <span style="color:red">Error loading</span>`;
      console.error(`Erro ao carregar ${asset.name}:`, e);
    }
  });
});
