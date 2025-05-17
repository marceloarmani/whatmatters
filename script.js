const apiKey = "JCEPmwMrTPyj5nEP9gEuFuSKOKCxPlQp";

function formatNumber(value) {
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

async function fetchQuote(symbol, elementId, isPercentage = false) {
  try {
    const res = await fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`);
    const data = await res.json();
    if (!data || data.length === 0) throw new Error("No data");
    const value = isPercentage ? `${data[0].price.toFixed(2)}%` : `$${formatNumber(data[0].price)}`;
    document.getElementById(elementId).textContent = value;
  } catch (e) {
    console.error(`Error loading ${symbol}`, e);
    document.getElementById(elementId).textContent = "Error loading";
  }
}

async function drawChart(symbol, canvasId, label, isPercentage = false) {
  try {
    const res = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=30&apikey=${apiKey}`);
    const data = await res.json();
    if (!data.historical || data.historical.length === 0) throw new Error("No historical data");
    const prices = data.historical.map(day => day.close).reverse();
    const labels = data.historical.map(day => day.date).reverse();

    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: prices,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          tension: 0.3,
          fill: true,
          pointRadius: 0,
        }]
      },
      options: {
        scales: {
          y: {
            ticks: {
              callback: function(value) {
                return isPercentage ? value + '%' : '$' + formatNumber(value);
              }
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        responsive: false,
      }
    });
  } catch (e) {
    console.error(`Error drawing chart for ${symbol}`, e);
  }
}

// Executa tudo junto
fetchQuote("BTCUSD", "btc");
fetchQuote("XAUUSD", "gold");
fetchQuote("XAGUSD", "silver");
fetchQuote("USDBRL", "usdbrl");
fetchQuote("US10Y", "us10y", true);

drawChart("BTCUSD", "btcChart", "Bitcoin (USD)");
drawChart("XAUUSD", "goldChart", "Gold (USD)");
drawChart("XAGUSD", "silverChart", "Silver (USD)");
drawChart("USDBRL", "usdbrlChart", "USD to BRL");
drawChart("US10Y", "us10yChart", "10Y US Treasury Yield", true);
