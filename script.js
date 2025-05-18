const API_KEYS = {
  alpha: "AYD0CU34ZWEG2WM2",
  goldapi: "goldapi-4czjlk1mmar2m084-io",
  fred: "5cea6c897e85a36d7573bcf686ef03fe"
};

const assets = [
  {
    id: "BTC",
    label: "Bitcoin",
    fetch: async () => {
      const url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=${API_KEYS.alpha}`;
      const res = await fetch(url);
      const data = await res.json();
      const series = data["Time Series (Digital Currency Daily)"];
      return extractPriceData(series, "4b. close (USD)");
    }
  },
  {
    id: "GOLD",
    label: "Gold",
    fetch: async () => {
      const res = await fetch("https://www.goldapi.io/api/XAU/USD", {
        headers: { "x-access-token": API_KEYS.goldapi }
      });
      const data = await res.json();
      const today = new Date().toISOString().split("T")[0];
      return {
        latest: data.price,
        previous: data.prev_close_price,
        history: []
      };
    }
  },
  {
    id: "US10Y",
    label: "10Y US Treasury Yield",
    fetch: async () => {
      const url = `https://api.stlouisfed.org/fred/series/observations?series_id=DGS10&api_key=${API_KEYS.fred}&file_type=json`;
      const res = await fetch(url);
      const data = await res.json();
      const observations = data.observations.slice(-400).filter(o => o.value !== ".");
      const latest = parseFloat(observations.at(-1).value);
      const previous = parseFloat(observations.at(-2).value);
      const history = observations.map(o => ({
        date: o.date,
        value: parseFloat(o.value)
      }));
      return { latest, previous, history };
    }
  },
  {
    id: "USD/BRL",
    label: "USD/BRL",
    fetch: async () => {
      const url = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=USD&to_symbol=BRL&apikey=${API_KEYS.alpha}`;
      const res = await fetch(url);
      const data = await res.json();
      const series = data["Time Series FX (Daily)"];
      return extractPriceData(series, "4. close");
    }
  },
  {
    id: "UUP",
    label: "UUP ETF (US Dollar Index Proxy)",
    fetch: async () => {
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=UUP&apikey=${API_KEYS.alpha}`;
      const res = await fetch(url);
      const data = await res.json();
      const series = data["Time Series (Daily)"];
      return extractPriceData(series, "4. close");
    }
  }
];

function extractPriceData(series, key) {
  const dates = Object.keys(series).sort();
  const latestDate = dates.at(-1);
  const previousDate = dates.at(-2);
  const latest = parseFloat(series[latestDate][key]);
  const previous = parseFloat(series[previousDate][key]);
  const history = dates.map(d => ({
    date: d,
    value: parseFloat(series[d][key])
  }));
  return { latest, previous, history };
}

function formatNumber(value) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function createAssetCard(asset, value, diff, history) {
  const change = value - diff;
  const changePct = ((change / diff) * 100).toFixed(2);
  const color = change >= 0 ? "green" : "red";

  const container = document.createElement("div");
  container.className = "card";

  const title = document.createElement("h2");
  title.textContent = asset.label;

  const price = document.createElement("p");
  price.innerHTML = `💰 ${formatNumber(value)} <span style="color:${color}">(${change >= 0 ? "+" : ""}${formatNumber(change)} / ${changePct}%)</span>`;

  const canvas = document.createElement("canvas");
  canvas.id = `chart-${asset.id}`;

  container.appendChild(title);
  container.appendChild(price);
  container.appendChild(canvas);

  document.getElementById("quotes").appendChild(container);

  if (history && history.length > 0) {
    new Chart(canvas, {
      type: "line",
      data: {
        labels: history.map(p => p.date),
        datasets: [
          {
            label: asset.label,
            data: history.map(p => p.value),
            borderColor: color,
            backgroundColor: "transparent",
            tension: 0.2
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: false
          },
          y: {
            ticks: {
              color: "#888"
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
}

(async () => {
  for (const asset of assets) {
    try {
      const { latest, previous, history } = await asset.fetch();
      createAssetCard(asset, latest, previous, history);
    } catch (err) {
      const container = document.createElement("div");
      container.className = "card error";
      container.innerHTML = `<h2>${asset.label}</h2><p>Error loading</p>`;
      document.getElementById("quotes").appendChild(container);
      console.error(`Error loading ${asset.label}:`, err);
    }
  }
})();
