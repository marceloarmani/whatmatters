const apiKey = 'JCEPmwMrTPyj5nEP9gEuFuSKOKCxPlQp';

const assets = {
  btc: 'BTCUSD',
  us10y: 'US10Y',
  gold: 'GOLD',
  silver: 'SILVER',
  usd: 'DXY'
};

const fetchQuote = async (symbol, elementId) => {
  try {
    const res = await fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`);
    const data = await res.json();
    if (data[0] && data[0].price) {
      document.getElementById(elementId).textContent = `$${data[0].price.toFixed(2)}`;
    } else {
      document.getElementById(elementId).textContent = 'Data not available';
    }
  } catch (error) {
    document.getElementById(elementId).textContent = 'Error loading';
  }
};

Object.entries(assets).forEach(([id, symbol]) => {
  fetchQuote(symbol, id);
});
