const apiKey = 'JCEPmwMrTPyj5nEP9gEuFuSKOKCxPlQp';

const assets = {
  btc: 'BTCUSD',
  gold: 'XAUUSD',
  silver: 'XAGUSD',
  usdbrl: 'USDBRL'
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

const fetchTreasuryYield = async () => {
  try {
    const res = await fetch(`https://financialmodelingprep.com/api/v4/treasury?apikey=${apiKey}`);
    const data = await res.json();
    const tenYear = data.find(entry => entry.name === '10Y');
    if (tenYear && tenYear.value) {
      document.getElementById('us10y').textContent = `${tenYear.value.toFixed(2)}%`;
    } else {
      document.getElementById('us10y').textContent = 'Data not available';
    }
  } catch (error) {
    document.getElementById('us10y').textContent = 'Error loading';
  }
};

// Buscar os dados
Object.entries(assets).forEach(([id, symbol]) => {
  fetchQuote(symbol, id);
});
fetchTreasuryYield();
