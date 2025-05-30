const assets = [
  { name: "Bitcoin", price: "$0.00", change: "+0.0%", positive: true, source: "-" },
  { name: "Gold", price: "$0.00", change: "+0.0%", positive: true, source: "-" },
  { name: "Silver", price: "$0.00", change: "+0.0%", positive: false, source: "-" },
  { name: "10-Year Treasury Yield", price: "0.00%", change: "+0.00%", positive: true, source: "-" },
  { name: "Dollar Index", price: "0.00", change: "+0.0%", positive: false, source: "-" },
  { name: "S&P 500", price: "0.00", change: "+0.0%", positive: true, source: "-" }
];

const quotes = [
  "The root problem with conventional currency is all the trust that's required to make it work. The central bank must be trusted not to debase the currency, but the history of fiat currencies is full of breaches of that trust.",
  "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks.",
  "I've been working on a new electronic cash system that's fully peer-to-peer, with no trusted third party.",
  "The central bank must be trusted not to debase the currency, but the history of fiat currencies is full of breaches of that trust.",
  "Banks must be trusted to hold our money and transfer it electronically, but they lend it out in waves of credit bubbles with barely a fraction in reserve.",
  "With e-currency based on cryptographic proof, without the need to trust a third party middleman, money can be secure and transactions effortless."
];

// --- Funções de busca de dados --- 

// Chave API Alpha Vantage
const ALPHA_VANTAGE_API_KEY = "YXNV7ACP45FN4RZC";

// Função auxiliar para formatar números
function formatNumber(num, options = {}) {
  return num.toLocaleString("en-US", options);
}

// Função auxiliar para buscar dados com timeout
async function fetchWithTimeout(resource, options = {}, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal  
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    } 
    throw error;
  }
}

// Função para buscar o preço do Bitcoin
async function fetchBitcoinPrice() {
  let price = null, change = null, source = "Error";
  
  // 1. Tentar CoinGecko (mais confiável para crypto)
  try {
    console.log("Fetching Bitcoin from CoinGecko...");
    const response = await fetchWithTimeout('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
    if (!response.ok) throw new Error(`CoinGecko HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data && data.bitcoin) {
      price = data.bitcoin.usd;
      change = data.bitcoin.usd_24h_change;
      source = "CoinGecko";
      console.log(`Bitcoin from CoinGecko: Price=${price}, Change=${change}%`);
      const formattedPrice = formatNumber(price, { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
      return { name: "Bitcoin", price: formattedPrice, change: formattedChange, positive: change >= 0, source: source };
    }
  } catch (error) {
    console.error('Error fetching Bitcoin from CoinGecko:', error.message);
  }

  // 2. Tentar Alpha Vantage como fallback
  if (source === "Error") {
    try {
      console.log("Fetching Bitcoin from Alpha Vantage...");
      const response = await fetchWithTimeout(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=${ALPHA_VANTAGE_API_KEY}`);
      if (!response.ok) throw new Error(`Alpha Vantage HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data && data['Realtime Currency Exchange Rate']) {
        const exchangeData = data['Realtime Currency Exchange Rate'];
        price = parseFloat(exchangeData['5. Exchange Rate']);
        // Alpha Vantage não fornece variação % direta para FX, tentaremos calcular
        try {
          const dailyResponse = await fetchWithTimeout(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=${ALPHA_VANTAGE_API_KEY}`);
          if (dailyResponse.ok) {
            const dailyData = await dailyResponse.json();
            if (dailyData && dailyData['Time Series (Digital Currency Daily)']) {
              const timeSeriesData = dailyData['Time Series (Digital Currency Daily)'];
              const dates = Object.keys(timeSeriesData).sort().reverse();
              if (dates.length >= 2) {
                const todayClose = parseFloat(timeSeriesData[dates[0]]['4a. close (USD)']);
                const yesterdayClose = parseFloat(timeSeriesData[dates[1]]['4a. close (USD)']);
                change = ((todayClose - yesterdayClose) / yesterdayClose) * 100;
              }
            }
          }
        } catch (changeError) {
          console.error('Error fetching Bitcoin change from Alpha Vantage:', changeError.message);
          change = 0; // Default to 0 if change calculation fails
        }
        source = "AlphaVantage";
        console.log(`Bitcoin from Alpha Vantage: Price=${price}, Change=${change}%`);
        const formattedPrice = formatNumber(price, { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
        return { name: "Bitcoin", price: formattedPrice, change: formattedChange, positive: change >= 0, source: source };
      }
    } catch (error) {
      console.error('Error fetching Bitcoin from Alpha Vantage:', error.message);
    }
  }

  // 3. Fallback para valor estático se tudo falhar
  console.warn("Using static fallback for Bitcoin");
  return { name: "Bitcoin", price: "$107,016.57", change: "+2.4%", positive: true, source: "Static Fallback" };
}

// Função para buscar o preço do Ouro
async function fetchGoldPrice() {
  let price = null, change = null, source = "Error";

  // 1. Tentar metals.live
  try {
    console.log("Fetching Gold from metals.live...");
    const response = await fetchWithTimeout('https://api.metals.live/v1/spot/gold');
    if (!response.ok) throw new Error(`metals.live HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data && data.length > 0) {
      price = data[0].price;
      // Tentar obter variação 24h
      try {
        const yesterdayResponse = await fetchWithTimeout('https://api.metals.live/v1/spot/gold/24h');
        if (yesterdayResponse.ok) {
          const yesterdayData = await yesterdayResponse.json();
          if (yesterdayData && yesterdayData.length > 0) {
            const oldestPrice = yesterdayData[0].price;
            change = ((price - oldestPrice) / oldestPrice) * 100;
          }
        } else {
          change = 0; // Default se não conseguir dados de 24h
        }
      } catch (changeError) {
        console.error('Error fetching Gold 24h change from metals.live:', changeError.message);
        change = 0;
      }
      source = "Metals.live";
      console.log(`Gold from Metals.live: Price=${price}, Change=${change}%`);
      const formattedPrice = formatNumber(price, { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
      return { name: "Gold", price: formattedPrice, change: formattedChange, positive: change >= 0, source: source };
    }
  } catch (error) {
    console.error('Error fetching Gold from metals.live:', error.message);
  }

  // 2. Tentar Alpha Vantage como fallback
  if (source === "Error") {
    try {
      console.log("Fetching Gold from Alpha Vantage...");
      const response = await fetchWithTimeout(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey=${ALPHA_VANTAGE_API_KEY}`);
      if (!response.ok) throw new Error(`Alpha Vantage HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data && data['Realtime Currency Exchange Rate']) {
        const exchangeData = data['Realtime Currency Exchange Rate'];
        price = parseFloat(exchangeData['5. Exchange Rate']);
        // Calcular variação
        try {
          const dailyResponse = await fetchWithTimeout(`https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=XAU&to_symbol=USD&apikey=${ALPHA_VANTAGE_API_KEY}`);
          if (dailyResponse.ok) {
            const dailyData = await dailyResponse.json();
            if (dailyData && dailyData['Time Series FX (Daily)']) {
              const timeSeriesData = dailyData['Time Series FX (Daily)'];
              const dates = Object.keys(timeSeriesData).sort().reverse();
              if (dates.length >= 2) {
                const todayClose = parseFloat(timeSeriesData[dates[0]]['4. close']);
                const yesterdayClose = parseFloat(timeSeriesData[dates[1]]['4. close']);
                change = ((todayClose - yesterdayClose) / yesterdayClose) * 100;
              }
            }
          }
        } catch (changeError) {
          console.error('Error fetching Gold change from Alpha Vantage:', changeError.message);
          change = 0;
        }
        source = "AlphaVantage";
        console.log(`Gold from Alpha Vantage: Price=${price}, Change=${change}%`);
        const formattedPrice = formatNumber(price, { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
        return { name: "Gold", price: formattedPrice, change: formattedChange, positive: change >= 0, source: source };
      }
    } catch (error) {
      console.error('Error fetching Gold from Alpha Vantage:', error.message);
    }
  }

  // 3. Fallback para valor estático
  console.warn("Using static fallback for Gold");
  return { name: "Gold", price: "$3,323.10", change: "+0.8%", positive: true, source: "Static Fallback" };
}

// Função para buscar o preço da Prata
async function fetchSilverPrice() {
  let price = null, change = null, source = "Error";

  // 1. Tentar metals.live
  try {
    console.log("Fetching Silver from metals.live...");
    const response = await fetchWithTimeout('https://api.metals.live/v1/spot/silver');
    if (!response.ok) throw new Error(`metals.live HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data && data.length > 0) {
      price = data[0].price;
      // Tentar obter variação 24h
      try {
        const yesterdayResponse = await fetchWithTimeout('https://api.metals.live/v1/spot/silver/24h');
        if (yesterdayResponse.ok) {
          const yesterdayData = await yesterdayResponse.json();
          if (yesterdayData && yesterdayData.length > 0) {
            const oldestPrice = yesterdayData[0].price;
            change = ((price - oldestPrice) / oldestPrice) * 100;
          }
        } else {
          change = 0;
        }
      } catch (changeError) {
        console.error('Error fetching Silver 24h change from metals.live:', changeError.message);
        change = 0;
      }
      source = "Metals.live";
      console.log(`Silver from Metals.live: Price=${price}, Change=${change}%`);
      const formattedPrice = formatNumber(price, { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
      return { name: "Silver", price: formattedPrice, change: formattedChange, positive: change >= 0, source: source };
    }
  } catch (error) {
    console.error('Error fetching Silver from metals.live:', error.message);
  }

  // 2. Tentar Alpha Vantage como fallback
  if (source === "Error") {
    try {
      console.log("Fetching Silver from Alpha Vantage...");
      const response = await fetchWithTimeout(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAG&to_currency=USD&apikey=${ALPHA_VANTAGE_API_KEY}`);
      if (!response.ok) throw new Error(`Alpha Vantage HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data && data['Realtime Currency Exchange Rate']) {
        const exchangeData = data['Realtime Currency Exchange Rate'];
        price = parseFloat(exchangeData['5. Exchange Rate']);
        // Calcular variação
        try {
          const dailyResponse = await fetchWithTimeout(`https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=XAG&to_symbol=USD&apikey=${ALPHA_VANTAGE_API_KEY}`);
          if (dailyResponse.ok) {
            const dailyData = await dailyResponse.json();
            if (dailyData && dailyData['Time Series FX (Daily)']) {
              const timeSeriesData = dailyData['Time Series FX (Daily)'];
              const dates = Object.keys(timeSeriesData).sort().reverse();
              if (dates.length >= 2) {
                const todayClose = parseFloat(timeSeriesData[dates[0]]['4. close']);
                const yesterdayClose = parseFloat(timeSeriesData[dates[1]]['4. close']);
                change = ((todayClose - yesterdayClose) / yesterdayClose) * 100;
              }
            }
          }
        } catch (changeError) {
          console.error('Error fetching Silver change from Alpha Vantage:', changeError.message);
          change = 0;
        }
        source = "AlphaVantage";
        console.log(`Silver from Alpha Vantage: Price=${price}, Change=${change}%`);
        const formattedPrice = formatNumber(price, { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
        return { name: "Silver", price: formattedPrice, change: formattedChange, positive: change >= 0, source: source };
      }
    } catch (error) {
      console.error('Error fetching Silver from Alpha Vantage:', error.message);
    }
  }

  // 3. Fallback para valor estático
  console.warn("Using static fallback for Silver");
  return { name: "Silver", price: "$33.69", change: "-0.3%", positive: false, source: "Static Fallback" };
}

// Função para buscar o rendimento do Treasury de 10 anos
async function fetchTreasuryYield() {
  let price = null, change = null, source = "Error";

  // 1. Tentar Yahoo Finance (mais direto para TNX)
  try {
    console.log("Fetching Treasury Yield from Yahoo Finance...");
    // Usar um proxy CORS se necessário ou buscar via backend
    const response = await fetchWithTimeout('https://query1.finance.yahoo.com/v8/finance/chart/%5ETNX?interval=1d');
    if (!response.ok) throw new Error(`Yahoo Finance HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data && data.chart && data.chart.result && data.chart.result[0]) {
      const result = data.chart.result[0];
      const meta = result.meta;
      if (meta && meta.regularMarketPrice && meta.previousClose) {
        price = meta.regularMarketPrice; // Yahoo já fornece o valor correto
        const previousClose = meta.previousClose;
        change = ((price - previousClose) / previousClose) * 100;
        source = "YahooFinance";
        console.log(`Treasury Yield from Yahoo Finance: Price=${price}, Change=${change}%`);
        const formattedYield = `${price.toFixed(2)}%`;
        const formattedChange = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
        return { name: "10-Year Treasury Yield", price: formattedYield, change: formattedChange, positive: change >= 0, source: source };
      }
    }
  } catch (error) {
    console.error('Error fetching Treasury Yield from Yahoo Finance:', error.message);
  }

  // 2. Tentar Alpha Vantage como fallback
  if (source === "Error") {
    try {
      console.log("Fetching Treasury Yield from Alpha Vantage...");
      const response = await fetchWithTimeout(`https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=daily&maturity=10year&apikey=${ALPHA_VANTAGE_API_KEY}`);
      if (!response.ok) throw new Error(`Alpha Vantage HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data && data.data && data.data.length >= 2) {
        const latestData = data.data[0];
        const previousData = data.data[1];
        price = parseFloat(latestData.value);
        const previousClose = parseFloat(previousData.value);
        change = ((price - previousClose) / previousClose) * 100;
        source = "AlphaVantage";
        console.log(`Treasury Yield from Alpha Vantage: Price=${price}, Change=${change}%`);
        const formattedYield = `${price.toFixed(2)}%`;
        const formattedChange = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
        return { name: "10-Year Treasury Yield", price: formattedYield, change: formattedChange, positive: change >= 0, source: source };
      }
    } catch (error) {
      console.error('Error fetching Treasury Yield from Alpha Vantage:', error.message);
    }
  }

  // 3. Fallback para valor estático
  console.warn("Using static fallback for Treasury Yield");
  return { name: "10-Year Treasury Yield", price: "4.38%", change: "+0.05%", positive: true, source: "Static Fallback" };
}

// Função para buscar o Dollar Index
async function fetchDollarIndex() {
  let price = null, change = null, source = "Error";

  // 1. Tentar Yahoo Finance (DX-Y.NYB)
  try {
    console.log("Fetching Dollar Index from Yahoo Finance...");
    const response = await fetchWithTimeout('https://query1.finance.yahoo.com/v8/finance/chart/DX-Y.NYB?interval=1d');
    if (!response.ok) throw new Error(`Yahoo Finance HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data && data.chart && data.chart.result && data.chart.result[0]) {
      const result = data.chart.result[0];
      const meta = result.meta;
      if (meta && meta.regularMarketPrice && meta.previousClose) {
        price = meta.regularMarketPrice;
        const previousClose = meta.previousClose;
        change = ((price - previousClose) / previousClose) * 100;
        source = "YahooFinance";
        console.log(`Dollar Index from Yahoo Finance: Price=${price}, Change=${change}%`);
        const formattedPrice = price.toFixed(2);
        const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
        return { name: "Dollar Index", price: formattedPrice, change: formattedChange, positive: change >= 0, source: source };
      }
    }
  } catch (error) {
    console.error('Error fetching Dollar Index from Yahoo Finance:', error.message);
  }

  // 2. Tentar Alpha Vantage como fallback
  if (source === "Error") {
    try {
      console.log("Fetching Dollar Index from Alpha Vantage...");
      // Alpha Vantage não tem endpoint direto para DXY, usar GLOBAL_QUOTE pode ser instável
      const response = await fetchWithTimeout(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=DXY&apikey=${ALPHA_VANTAGE_API_KEY}`);
      if (!response.ok) throw new Error(`Alpha Vantage HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data && data['Global Quote'] && data['Global Quote']['05. price']) {
        price = parseFloat(data['Global Quote']['05. price']);
        change = parseFloat(data['Global Quote']['10. change percent'].replace('%', ''));
        source = "AlphaVantage";
        console.log(`Dollar Index from Alpha Vantage: Price=${price}, Change=${change}%`);
        const formattedPrice = price.toFixed(2);
        const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
        return { name: "Dollar Index", price: formattedPrice, change: formattedChange, positive: change >= 0, source: source };
      }
    } catch (error) {
      console.error('Error fetching Dollar Index from Alpha Vantage:', error.message);
    }
  }

  // 3. Fallback para valor estático
  console.warn("Using static fallback for Dollar Index");
  return { name: "Dollar Index", price: "103.42", change: "-0.2%", positive: false, source: "Static Fallback" };
}

// Função para buscar o S&P 500
async function fetchSP500() {
  let price = null, change = null, source = "Error";

  // 1. Tentar Yahoo Finance (^GSPC)
  try {
    console.log("Fetching S&P 500 from Yahoo Finance...");
    const response = await fetchWithTimeout('https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC?interval=1d');
    if (!response.ok) throw new Error(`Yahoo Finance HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data && data.chart && data.chart.result && data.chart.result[0]) {
      const result = data.chart.result[0];
      const meta = result.meta;
      if (meta && meta.regularMarketPrice && meta.previousClose) {
        price = meta.regularMarketPrice;
        const previousClose = meta.previousClose;
        change = ((price - previousClose) / previousClose) * 100;
        source = "YahooFinance";
        console.log(`S&P 500 from Yahoo Finance: Price=${price}, Change=${change}%`);
        const formattedPrice = formatNumber(price, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
        return { name: "S&P 500", price: formattedPrice, change: formattedChange, positive: change >= 0, source: source };
      }
    }
  } catch (error) {
    console.error('Error fetching S&P 500 from Yahoo Finance:', error.message);
  }

  // 2. Tentar Alpha Vantage como fallback
  if (source === "Error") {
    try {
      console.log("Fetching S&P 500 from Alpha Vantage...");
      // GLOBAL_QUOTE para SPX pode ser limitado ou atrasado
      const response = await fetchWithTimeout(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPX&apikey=${ALPHA_VANTAGE_API_KEY}`);
      if (!response.ok) throw new Error(`Alpha Vantage HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data && data['Global Quote'] && data['Global Quote']['05. price']) {
        price = parseFloat(data['Global Quote']['05. price']);
        change = parseFloat(data['Global Quote']['10. change percent'].replace('%', ''));
        source = "AlphaVantage";
        console.log(`S&P 500 from Alpha Vantage: Price=${price}, Change=${change}%`);
        const formattedPrice = formatNumber(price, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
        return { name: "S&P 500", price: formattedPrice, change: formattedChange, positive: change >= 0, source: source };
      }
    } catch (error) {
      console.error('Error fetching S&P 500 from Alpha Vantage:', error.message);
    }
  }

  // 3. Tentar Finnhub como fallback (usando SPY como proxy)
  if (source === "Error") {
    try {
      console.log("Fetching S&P 500 from Finnhub (via SPY)...");
      // Token público pode ter limitações, idealmente usar chave própria
      const response = await fetchWithTimeout('https://finnhub.io/api/v1/quote?symbol=SPY&token=c2qih42ad3ickc1qkdog'); 
      if (!response.ok) throw new Error(`Finnhub HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data && data.c && data.pc) {
        // SPY é ~1/10 do S&P 500, ajustar é apenas uma aproximação
        price = data.c * 10; 
        const previousClose = data.pc * 10;
        change = ((price - previousClose) / previousClose) * 100;
        source = "Finnhub(SPY)";
        console.log(`S&P 500 from Finnhub (SPY): Price=${price}, Change=${change}%`);
        const formattedPrice = formatNumber(price, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
        return { name: "S&P 500", price: formattedPrice, change: formattedChange, positive: change >= 0, source: source };
      }
    } catch (error) {
      console.error('Error fetching S&P 500 from Finnhub:', error.message);
    }
  }

  // 4. Fallback para valor estático
  console.warn("Using static fallback for S&P 500");
  return { name: "S&P 500", price: "5,218.24", change: "+0.7%", positive: true, source: "Static Fallback" };
}

// Função para buscar a quantidade de Bitcoins minerados
async function fetchMinedBitcoins() {
  let mined = null, source = "Error";
  // 1. Tentar Blockchair
  try {
    console.log("Fetching Mined Bitcoins from Blockchair...");
    const response = await fetchWithTimeout('https://api.blockchair.com/bitcoin/stats');
    if (!response.ok) throw new Error(`Blockchair HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data && data.data && data.data.circulation_180d) { // Usar circulation_180d para valor mais estável
      mined = data.data.circulation_180d / 100000000; // Converter de satoshis
      source = "Blockchair";
      console.log(`Mined Bitcoins from Blockchair: ${mined}`);
      return { value: mined, source: source };
    }
  } catch (error) {
    console.error('Error fetching Mined Bitcoins from Blockchair:', error.message);
  }

  // 2. Tentar Blockchain.info como fallback
  if (source === "Error") {
    try {
      console.log("Fetching Mined Bitcoins from Blockchain.info...");
      // Pode exigir proxy CORS
      const response = await fetchWithTimeout('https://blockchain.info/q/totalbc?cors=true');
      if (!response.ok) throw new Error(`Blockchain.info HTTP error! status: ${response.status}`);
      const totalbcSatoshis = await response.text();
      mined = parseFloat(totalbcSatoshis) / 100000000;
      source = "Blockchain.info";
      console.log(`Mined Bitcoins from Blockchain.info: ${mined}`);
      return { value: mined, source: source };
    }
     catch (error) {
      console.error('Error fetching Mined Bitcoins from Blockchain.info:', error.message);
    }
  }

  // 3. Fallback para valor estático
  console.warn("Using static fallback for Mined Bitcoins");
  return { value: 19700000, source: "Static Fallback" }; // Valor mais atualizado para ~Maio 2025
}

// Função para buscar o número atual de blocos na blockchain do Bitcoin
async function fetchBitcoinBlockCount() {
  let blockCount = null, source = "Error";
  // 1. Tentar Blockchair
  try {
    console.log("Fetching Block Count from Blockchair...");
    const response = await fetchWithTimeout('https://api.blockchair.com/bitcoin/stats');
    if (!response.ok) throw new Error(`Blockchair HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data && data.data && data.data.blocks) {
      blockCount = data.data.blocks;
      source = "Blockchair";
      console.log(`Block Count from Blockchair: ${blockCount}`);
      return { value: blockCount, source: source };
    }
  } catch (error) {
    console.error('Error fetching Block Count from Blockchair:', error.message);
  }

  // 2. Tentar Blockchain.info como fallback
  if (source === "Error") {
    try {
      console.log("Fetching Block Count from Blockchain.info...");
      // Pode exigir proxy CORS
      const response = await fetchWithTimeout('https://blockchain.info/q/getblockcount?cors=true');
      if (!response.ok) throw new Error(`Blockchain.info HTTP error! status: ${response.status}`);
      const blockCountText = await response.text();
      blockCount = parseInt(blockCountText);
      source = "Blockchain.info";
      console.log(`Block Count from Blockchain.info: ${blockCount}`);
      return { value: blockCount, source: source };
    }
     catch (error) {
      console.error('Error fetching Block Count from Blockchain.info:', error.message);
    }
  }

  // 3. Fallback para valor estático
  console.warn("Using static fallback for Block Count");
  return { value: 845000, source: "Static Fallback" }; // Valor mais atualizado para ~Maio 2025
}

// --- Funções de Renderização e Atualização --- 

// Função para renderizar os indicadores principais (cotações)
async function renderQuotes() {
  const quotesContainer = document.getElementById('quotes');
  if (!quotesContainer) return;
  
  // Adicionar indicador visual de atualização apenas se não existir
  let loadingIndicator = quotesContainer.querySelector('.loading-indicator');
  if (!loadingIndicator) {
      loadingIndicator = document.createElement('div');
      loadingIndicator.className = 'loading-indicator';
      loadingIndicator.textContent = 'Updating prices...';
      // Inserir no início para não atrapalhar o layout existente
      if (quotesContainer.firstChild) {
          quotesContainer.insertBefore(loadingIndicator, quotesContainer.firstChild);
      } else {
          quotesContainer.appendChild(loadingIndicator);
      }
  }
  
  console.log('Starting price update...');

  try {
    const updatedAssetsData = await fetchAllLatestPrices();
    console.log('Updated prices received:', updatedAssetsData);
    
    // Remover indicador de carregamento
    if (loadingIndicator) loadingIndicator.remove();
    
    // Limpar apenas os itens de cotação existentes, preservando outros elementos se houver
    const existingQuotes = quotesContainer.querySelectorAll('.quote-wrapper');
    existingQuotes.forEach(q => q.remove());
    
    const assetsToRender = updatedAssetsData || assets; // Usa atualizado ou fallback
    assetsToRender.forEach(asset => {
      const quoteWrapper = document.createElement('div');
      quoteWrapper.className = 'quote-wrapper';
      const quote = document.createElement('div');
      quote.className = 'quote';
      const quoteLeft = document.createElement('div');
      quoteLeft.className = 'quote-left';
      const nameStrong = document.createElement('strong');
      nameStrong.textContent = asset.name;
      let tooltip = '';
      if (asset.name === "10-Year Treasury Yield") {
        tooltip = `<span class="index-tooltip">The yield on the U.S. 10-year Treasury note, a key benchmark for interest rates. Source: ${asset.source}</span>`;
      } else if (asset.name === "Dollar Index") {
        tooltip = `<span class="index-tooltip">Measures the value of the U.S. dollar relative to a basket of foreign currencies. Source: ${asset.source}</span>`;
      } else if (asset.name === "S&P 500") {
        tooltip = `<span class="index-tooltip">Stock market index tracking the performance of 500 large companies listed on U.S. exchanges. Source: ${asset.source}</span>`;
      } else {
        tooltip = `<span class="index-tooltip">Source: ${asset.source}</span>`;
      }
      quoteLeft.appendChild(nameStrong);
      quoteLeft.innerHTML += tooltip;
      const quoteRight = document.createElement('div');
      quoteRight.className = 'quote-right';
      const quotePrice = document.createElement('span');
      quotePrice.className = 'quote-price';
      quotePrice.textContent = asset.price;
      const quoteChange = document.createElement('span');
      quoteChange.className = `quote-change ${asset.positive ? 'positive' : 'negative'}`;
      quoteChange.textContent = asset.change;
      quoteRight.appendChild(quotePrice);
      quoteRight.appendChild(document.createElement('br'));
      quoteRight.appendChild(quoteChange);
      quote.appendChild(quoteLeft);
      quote.appendChild(quoteRight);
      quoteWrapper.appendChild(quote);
      quotesContainer.appendChild(quoteWrapper);
    });
    updateFooterPrices(assetsToRender);
    
    // Registrar timestamp da última atualização
    const now = new Date();
    console.log(`Price update completed at ${now.toLocaleTimeString()}`);
    
    // Adicionar timestamp de atualização no rodapé
    const footerCopyright = document.querySelector('.footer-copyright');
    if (footerCopyright) {
      footerCopyright.textContent = `© 2025 Scarcity Panel. Data updated at ${now.toLocaleTimeString()}.`;
    }
  } catch (error) {
      console.error("Error during renderQuotes:", error);
      if (loadingIndicator) loadingIndicator.textContent = 'Update failed';
      // Não limpar as cotações existentes se a atualização falhar
  }
}

// Função para buscar todos os preços atualizados
async function fetchAllLatestPrices() {
  console.log('Fetching all latest prices...');
  const promises = [
    fetchBitcoinPrice(),
    fetchGoldPrice(),
    fetchSilverPrice(),
    fetchTreasuryYield(),
    fetchDollarIndex(),
    fetchSP500()
  ];
  
  // Usar Promise.allSettled para garantir que todas as promessas sejam resolvidas
  const results = await Promise.allSettled(promises);
  
  // Processar resultados, usando o valor estático inicial como base
  const currentAssetsState = [...assets]; // Começa com a estrutura inicial
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      console.log(`Successfully fetched ${result.value.name} from ${result.value.source}`);
      currentAssetsState[index] = result.value; // Atualiza com o valor obtido
    } else {
      console.error(`Failed to fetch ${assets[index].name}:`, result.reason?.message || result.reason || 'Unknown error');
      // Mantém o valor estático/anterior se a busca falhar
      // Opcional: poderia tentar buscar de novo ou marcar como 'stale'
      currentAssetsState[index] = { ...assets[index], price: "Error", change: "-", source: "Failed" }; // Indica erro na UI
    }
  });
  
  console.log('Finished fetching all prices.');
  return currentAssetsState;
}

// Função para atualizar as métricas de escassez (Bitcoins Minerados e Blocos)
async function updateScarcityMetrics() {
  const minedElement = document.getElementById('bitcoins-mined');
  const progressFillElement = document.querySelector('.supply-progress-fill');
  const progressTextElement = document.querySelector('.supply-progress-text');
  const blockCountElement = document.getElementById('current-block-count'); // Novo elemento para contagem de blocos
  const totalPossibleBitcoins = 21000000;

  if (minedElement && progressFillElement && progressTextElement && blockCountElement) {
    try {
      console.log('Updating scarcity metrics...');
      const [minedData, blockData] = await Promise.all([
        fetchMinedBitcoins(),
        fetchBitcoinBlockCount()
      ]);

      const minedBitcoins = minedData.value;
      const blockCount = blockData.value;

      const formattedMinedBitcoins = formatNumber(minedBitcoins, { maximumFractionDigits: 0 });
      minedElement.textContent = formattedMinedBitcoins;
      minedElement.title = `Source: ${minedData.source}`; // Adiciona tooltip com a fonte

      const percentageMined = (minedBitcoins / totalPossibleBitcoins) * 100;
      const remainingBitcoins = totalPossibleBitcoins - minedBitcoins;
      const formattedRemaining = formatNumber(remainingBitcoins, { maximumFractionDigits: 0 });

      progressFillElement.style.width = `${percentageMined.toFixed(2)}%`;
      progressTextElement.textContent = `${percentageMined.toFixed(2)}% (${formattedRemaining} remaining)`;

      // Atualizar contagem de blocos
      blockCountElement.textContent = formatNumber(blockCount);
      blockCountElement.title = `Source: ${blockData.source}`; // Adiciona tooltip com a fonte
      
      console.log(`Scarcity metrics updated: ${formattedMinedBitcoins} BTC (Source: ${minedData.source}), Block ${formatNumber(blockCount)} (Source: ${blockData.source})`);

    } catch (error) {
      console.error('Error updating scarcity metrics:', error);
      // Mantém os valores estáticos do HTML em caso de erro
      minedElement.textContent = "Error";
      blockCountElement.textContent = "Error";
      progressTextElement.textContent = "Update failed";
    }
  }
}

// Função para atualizar a contagem regressiva do Halving
async function updateHalvingCountdown() {
  const daysRemainingElement = document.getElementById('days-remaining');
  const blocksRemainingElement = document.getElementById('blocks-remaining'); // Novo elemento
  const nextHalvingDateElement = document.getElementById('next-halving-date'); // Novo elemento
  
  if (!daysRemainingElement || !blocksRemainingElement || !nextHalvingDateElement) return;

  try {
    console.log('Updating Halving countdown...');
    // Buscar o número atual de blocos
    const blockData = await fetchBitcoinBlockCount();
    const currentBlock = blockData.value;
    
    // Calcular o próximo halving (a cada 210.000 blocos)
    const blockInterval = 210000;
    const nextHalvingBlock = Math.ceil(currentBlock / blockInterval) * blockInterval;
    const blocksToHalving = nextHalvingBlock - currentBlock;
    
    // Estimar a data com base na média de 10 minutos por bloco
    const minutesPerBlock = 10;
    const minutesRemaining = blocksToHalving * minutesPerBlock;
    const daysRemaining = Math.floor(minutesRemaining / (60 * 24));
    
    // Calcular a data estimada do halving
    const now = new Date();
    const halvingDate = new Date(now.getTime() + (minutesRemaining * 60 * 1000));
    const halvingMonth = halvingDate.toLocaleString('en-US', { month: 'long' });
    const halvingYear = halvingDate.getFullYear();
    
    if (daysRemaining >= 0) {
      daysRemainingElement.textContent = `${formatNumber(daysRemaining)} days`;
      blocksRemainingElement.textContent = `(${formatNumber(blocksToHalving)} blocks)`;
      nextHalvingDateElement.textContent = `Est. ${halvingMonth} ${halvingYear}`;
      daysRemainingElement.title = `Source: Block ${formatNumber(currentBlock)} from ${blockData.source}`;
      console.log(`Halving countdown updated: ${daysRemaining} days, ${blocksToHalving} blocks (Source: ${blockData.source})`);
    } else {
      daysRemainingElement.textContent = `Halving occurred`;
      blocksRemainingElement.textContent = "-";
      nextHalvingDateElement.textContent = `Completed`;
      console.log('Halving already occurred');
    }
  } catch (error) {
    console.error('Error updating Halving countdown:', error);
    
    // Fallback para estimativa fixa se a API falhar
    const fallbackHalvingDate = new Date(Date.UTC(2028, 3, 15, 0, 0, 0)); // Estimativa ~Abril 2028
    const now = new Date();
    const nowUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const diffTime = fallbackHalvingDate - nowUtc;
    const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

    daysRemainingElement.textContent = `${formatNumber(diffDays)} days`;
    blocksRemainingElement.textContent = "(Fallback Estimate)";
    nextHalvingDateElement.textContent = `Est. April 2028`;
    daysRemainingElement.title = "Source: Fallback Estimate";
    console.warn(`Using fallback for Halving countdown: ${diffDays} days`);
  }
}

// Eventos para a agenda (mantido como estava)
const events = [
  {
    date: new Date(2025, 4, 27), // 27 de maio de 2025
    endDate: new Date(2025, 4, 29), // 29 de maio de 2025
    title: "Bitcoin 2025 Conference",
    description: "Largest annual Bitcoin event in Miami",
    impact: "medium"
  },
  {
    date: new Date(2025, 5, 11), // 11 de junho de 2025
    title: "US Inflation Report",
    description: "Consumer Price Index (CPI) release",
    impact: "high"
  },
  {
    date: new Date(2025, 5, 17), // 17 de junho de 2025
    endDate: new Date(2025, 5, 18), // 18 de junho de 2025
    title: "FOMC Meeting",
    description: "Federal Reserve interest rate decision",
    impact: "high"
  },
  {
    date: new Date(2025, 6, 3), // 3 de julho de 2025
    title: "US Employment Report",
    description: "US labor market data",
    impact: "medium"
  }
];

// Função para renderizar eventos ordenados por data (mantida como estava)
function renderEvents() {
  const eventsContainer = document.getElementById('events-container');
  if (!eventsContainer) return;
  
  console.log('Rendering events ordered by date...');
  
  // Ordenar eventos por proximidade da data
  const sortedEvents = [...events].sort((a, b) => a.date - b.date);
  
  // Criar grid para os eventos
  const eventsGrid = document.createElement('div');
  eventsGrid.className = 'events-grid';
  
  // Adicionar eventos ordenados
  sortedEvents.forEach(event => {
    const eventItem = document.createElement('div');
    eventItem.className = `event-item ${event.impact}`;
    
    const eventDate = document.createElement('div');
    eventDate.className = 'event-date';
    
    // Formatar a data do evento
    let dateSpan = document.createElement('span');
    if (event.endDate) {
      const options = { month: 'long', day: 'numeric' };
      const startFormatted = event.date.toLocaleDateString('en-US', options);
      const endFormatted = event.endDate.toLocaleDateString('en-US', options);
      dateSpan.textContent = `${startFormatted}-${event.endDate.getDate()}, ${event.date.getFullYear()}`;
    } else {
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      dateSpan.textContent = event.date.toLocaleDateString('en-US', options);
    }
    
    eventDate.appendChild(dateSpan);
    
    // Adicionar indicador de impacto
    const eventImpact = document.createElement('div');
    eventImpact.className = 'event-impact';
    for (let i = 0; i < 3; i++) {
      const impactDot = document.createElement('div');
      impactDot.className = 'impact-dot';
      eventImpact.appendChild(impactDot);
    }
    eventDate.appendChild(eventImpact);
    
    const eventTitle = document.createElement('div');
    eventTitle.className = 'event-title';
    eventTitle.textContent = event.title;
    
    const eventDescription = document.createElement('div');
    eventDescription.className = 'event-description';
    eventDescription.textContent = event.description;
    
    eventItem.appendChild(eventDate);
    eventItem.appendChild(eventTitle);
    eventItem.appendChild(eventDescription);
    
    eventsGrid.appendChild(eventItem);
  });
  
  // Limpar e adicionar a nova grid
  eventsContainer.innerHTML = '';
  eventsContainer.appendChild(eventsGrid);
  
  console.log(`${sortedEvents.length} events rendered and ordered by date`);
}

// Função para atualizar os preços no rodapé (mantida como estava)
function updateFooterPrices(currentAssets) {
  const footerPrices = document.getElementById('footer-prices');
  if (!footerPrices) return;
  footerPrices.innerHTML = ''; // Limpar antes de adicionar
  currentAssets.forEach(asset => {
    const priceItem = document.createElement('span');
    priceItem.className = 'footer-price-item';
    priceItem.innerHTML = `<strong>${asset.name}:</strong> ${asset.price} <span class="${asset.positive ? 'positive' : 'negative'}">(${asset.change})</span>`;
    footerPrices.appendChild(priceItem);
  });
}

// Função para alternar a visibilidade das fontes (mantida como estava)
function toggleSources() {
  const sourcesDiv = document.getElementById('market-cap-sources');
  const toggleButton = document.getElementById('sources-toggle');
  if (sourcesDiv && toggleButton) {
    if (sourcesDiv.style.display === 'none' || sourcesDiv.style.display === '') {
      sourcesDiv.style.display = 'block';
      toggleButton.textContent = 'Hide sources';
    } else {
      sourcesDiv.style.display = 'none';
      toggleButton.textContent = 'Show sources';
    }
  }
}

// Função para atualizar a citação de Satoshi (mantida como estava)
function updateSatoshiQuote() {
  const quoteElement = document.getElementById('satoshi-quote');
  if (quoteElement) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteElement.textContent = quotes[randomIndex];
  }
}

// Função para copiar o endereço de doação (mantida como estava)
function setupCopyButton() {
  const copyButton = document.getElementById('copy-button');
  const donationAddress = document.getElementById('donation-address');
  
  if (copyButton && donationAddress) {
    copyButton.addEventListener('click', () => {
      const textArea = document.createElement('textarea');
      textArea.value = donationAddress.textContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      // Feedback visual
      const originalText = copyButton.textContent;
      copyButton.textContent = 'Copied!';
      setTimeout(() => {
        copyButton.textContent = originalText;
      }, 2000);
    });
  }
}

// --- Novas Funções para Notícias --- 

// Função para buscar notícias de fontes focadas em Bitcoin
async function fetchBitcoinNews() {
    console.log("Fetching Bitcoin news...");
    // Placeholder: Idealmente, usaríamos uma API de notícias (ex: NewsAPI com query específica)
    // ou um feed RSS de fontes como Bitcoin Magazine, Coindesk, Blockworks.
    // Por agora, retornaremos as notícias estáticas do HTML original como fallback.
    
    // Exemplo (simulado) de como poderia ser com uma API:
    /*
    try {
        // Substituir por chamada real à API de notícias ou RSS parser
        // const response = await fetchWithTimeout('URL_DA_API_DE_NOTICIAS_OU_RSS');
        // if (!response.ok) throw new Error('News API error');
        // const newsData = await response.json(); 
        // return processNewsData(newsData); // Função para formatar os dados
        
        // Simulação de falha para mostrar o fallback
        throw new Error("Simulated News API failure");

    } catch (error) {
        console.error("Error fetching news:", error.message);
        console.warn("Using static news fallback.");
        return getStaticNews(); // Retorna notícias estáticas
    }
    */
    
    // Retornando notícias estáticas por enquanto
    return getStaticNews(); 
}

// Função para obter as notícias estáticas (do HTML original)
function getStaticNews() {
    return [
        {
            source: "Bitcoin Magazine",
            title: "Bitcoin Surpasses $100,000 for First Time in History",
            description: "The world's largest cryptocurrency has reached a new all-time high, breaking the psychological barrier of $100,000.",
            date: "May 21, 2025 14:32 UTC",
            url: "https://bitcoinmagazine.com/"
        },
        {
            source: "Blockworks",
            title: "Central Banks Accelerate Digital Currency Development",
            description: "Major central banks are fast-tracking CBDC projects in response to growing cryptocurrency adoption.",
            date: "May 20, 2025 09:15 UTC",
            url: "https://blockworks.co/"
        },
        {
            source: "The Bitcoin Times",
            title: "Gold Reaches Record High Amid Inflation Concerns",
            description: "The precious metal continues its upward trajectory as investors seek protection from rising inflation.",
            date: "May 19, 2025 16:45 UTC",
            url: "https://bitcointimes.news/"
        },
        {
            source: "Bitcoin Magazine",
            title: "Mining Difficulty Hits New Record as Hash Rate Soars",
            description: "Bitcoin's network security continues to strengthen as mining operations expand globally.",
            date: "May 18, 2025 11:20 UTC",
            url: "https://bitcoinmagazine.com/"
        },
        {
            source: "CoinDesk",
            title: "SEC Approves Spot Ethereum ETFs for US Market",
            description: "Following Bitcoin ETFs, the SEC has now given the green light to spot Ethereum ETFs, expanding institutional access.",
            date: "May 17, 2025 15:10 UTC",
            url: "https://www.coindesk.com/"
        },
        {
            source: "Financial Times",
            title: "Global Debt Reaches $400 Trillion as Interest Rates Rise",
            description: "Governments and corporations face mounting pressure as debt servicing costs increase substantially.",
            date: "May 16, 2025 08:45 UTC",
            url: "https://www.ft.com/"
        }
    ];
}

// Função para renderizar as notícias
async function renderNews() {
    const newsContainer = document.getElementById('news-content');
    if (!newsContainer) return;

    console.log("Rendering news...");
    newsContainer.innerHTML = '<div class="loading-indicator">Loading news...</div>'; // Indicador de carregamento

    try {
        const newsItems = await fetchBitcoinNews();
        newsContainer.innerHTML = ''; // Limpar indicador

        if (!newsItems || newsItems.length === 0) {
            newsContainer.innerHTML = '<p>No news available at the moment.</p>';
            return;
        }

        const newsGrid = document.createElement('div');
        newsGrid.className = 'news-grid';

        newsItems.forEach(item => {
            const newsLink = document.createElement('a');
            newsLink.href = item.url || '#';
            newsLink.target = '_blank';
            newsLink.className = 'news-item';

            const newsContentDiv = document.createElement('div');
            newsContentDiv.className = 'news-content';

            const newsSource = document.createElement('div');
            newsSource.className = 'news-source';
            newsSource.textContent = item.source;

            const newsTitle = document.createElement('div');
            newsTitle.className = 'news-title';
            newsTitle.textContent = item.title;

            const newsDescription = document.createElement('div');
            newsDescription.className = 'news-description';
            newsDescription.textContent = item.description;

            const newsDate = document.createElement('div');
            newsDate.className = 'news-date';
            newsDate.textContent = item.date;

            newsContentDiv.appendChild(newsSource);
            newsContentDiv.appendChild(newsTitle);
            newsContentDiv.appendChild(newsDescription);
            newsContentDiv.appendChild(newsDate);
            newsLink.appendChild(newsContentDiv);
            newsGrid.appendChild(newsLink);
        });

        newsContainer.appendChild(newsGrid);
        console.log(`${newsItems.length} news items rendered.`);

    } catch (error) {
        console.error("Error rendering news:", error);
        newsContainer.innerHTML = '<p>Failed to load news. Please try again later.</p>';
    }
}


// --- Inicialização --- 

document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing application...');
  
  // Renderizações iniciais
  renderQuotes(); 
  updateScarcityMetrics(); 
  updateHalvingCountdown(); 
  renderEvents(); 
  updateSatoshiQuote(); 
  setupCopyButton(); 
  renderNews(); // Renderização inicial das notícias

  // --- Intervalos de Atualização --- 
  
  // Atualiza cotações a cada 60 segundos (60000 ms) - Reduzido para evitar limites de API
  setInterval(renderQuotes, 60000);
  console.log('Set interval for quote updates (60 seconds)');
  
  // Atualiza métricas de escassez a cada 2 minutos (120000 ms)
  setInterval(updateScarcityMetrics, 120000);
  console.log('Set interval for scarcity metric updates (2 minutes)');

  // Atualiza contagem regressiva do Halving a cada 10 minutos (600000 ms)
  setInterval(updateHalvingCountdown, 600000);
  console.log('Set interval for Halving countdown updates (10 minutes)');

  // Atualiza citação de Satoshi a cada 5 minutos (300000 ms)
  setInterval(updateSatoshiQuote, 300000);
  console.log('Set interval for Satoshi quote updates (5 minutes)');
  
  // Atualiza notícias a cada 1 hora (3600000 ms)
  setInterval(renderNews, 3600000); 
  console.log('Set interval for news updates (1 hour)');

  // Adiciona listener para o botão de fontes (mantido)
  const sourcesButton = document.getElementById('sources-toggle');
  if (sourcesButton) {
    sourcesButton.addEventListener('click', toggleSources);
  }
  
  console.log('Initialization complete, all update intervals configured.');
});
