const apiKey = "JCEPmwMrTPyj5nEP9gEuFuSKOKCxPlQp";

// Helper function to format numbers with commas
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
    const value = isPercentage ? `${data[0].price.toFixed(2)}%` : `$${formatNumber(data[0].price)}`;
    document.getElementById(elementId).textContent = value;
  } catch (error) {
    document.getElementById(elementId).textContent = "Error loading";
  }
}

fetchQuote("BTCUSD", "btc");
fetchQuote("XAUUSD", "gold");
fetchQuote("XAGUSD", "silver");
fetchQuote("USDBRL", "usdbrl");
fetchQuote("US10Y", "us10y", true); // Yield is shown as percentage
