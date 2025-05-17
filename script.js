const alphaKey = "AYD0CU34ZWEG2WM2";

const assets = [
  {
    id: "dxy",
    name: "US Dollar Index (DXY)",
    fetchUrl: "https://api.exchangerate.host/latest?base=USD",
    parse: (data) => {
      // Index against basket: approximate as 100 / average of major currencies
      const majors = ["EUR", "JPY", "GBP", "CHF", "CAD", "SEK"];
      const sum = majors.reduce((acc, cur) => acc + (1 / data.rates[cur]), 0);
      return (100 / (sum / majors.length)).toFixed(2);
    },
    showChart: false
  },
  {
    id: "usbrl",
    name: "USD/BRL",
    fetchUrl: "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=BRL&apikey=" + alphaKey,
    parse: (data) => parseFloat(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]).toFixed(2),
    showChart: false
  },
  {
    id: "us10y",
    name: "10Y US Treasury Yield",
    fetchUrl: "https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=daily&maturity=10year&apikey=" + alphaKey,
    parse: (data) => {
      const entry = data.data[0];
      return entry && entry.value ? parseFloat(entry.value).toFixed(2) + "%" : "N/A";
    },
    showChart: false
  },
  {
    id: "btc",
    name: "Bitcoin (BTC/USD)",
    fetchUrl: "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=" + alphaKey,
    parse: (data) => parseFloat(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
    showChart: true
  },
  {
    id: "gold",
    name: "Gold (XAU/USD)",
    fetchUrl: "https://www.alphavantage.co/query?function=COMMODITY_EXCHANGE_RATE&from_symbol=XAU&to_symbol=USD&apikey=" + alphaKey,
    parse: (data) => parseFloat(data["Realtime Commodity Exchange Rate"]["5. Exchange Rate"]).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }),
    showChart: true
  },
  {
    id: "silver",
    name: "Silver (XAG/USD)",
    fetchUrl: "https://www.alphavantage.co/query?function=COMMODITY_EXCHANGE_RATE&from_symbol=XAG&to_symbol=USD&apikey=" + alphaKey,
    parse: (data) => parseFloat(data["Realtime Commodity Exchange Rate"]["5. Exchange Rate"]).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }),
    showChart: true
  }
];

function createChart(containerId, label, data) {
  const ctx = document.getElementById(containerId).getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from({ length: data.length }, (_, i) => i + 1),
      datasets: [{
        label,
        data,
        borderColor: "#007bff",
        borderWidth: 2,
        fill: false,
        pointRadius: 0
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
          ticks: {
            callback: function(value) {
              return value.toLocaleString();
            }
          }
        }
      }
    }
  });
}

function loadData() {
  assets.forEach(async (asset) => {
    const valueElement = document.getElementById(asset.id + "-value");
    try {
      const response = await fetch(asset.fetchUrl);
      const data = await response.json();
      const value = asset.parse(data);
      valueElement.textContent = value;

      // Simulated chart data
      if (asset.showChart) {
        const chartData = Array.from({ length: 30 }, () => {
          const base = parseFloat(value.toString().replace(/[^0-9.]/g, ""));
          return (base * (0.95 + Math.random() * 0.1)).toFixed(2);
        });
        createChart(asset.id + "-chart", asset.name, chartData);
      }
    } catch (error) {
      console.error("Error loading", asset.id, error);
      valueElement.textContent = "Error loading";
    }
  });
}

document.addEventListener("DOMContentLoaded", loadData);
