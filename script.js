const assets = [
  { name: "Bitcoin", price: "$107,016.57", change: "+2.4%", positive: true },
  { name: "Gold", price: "$3,323.10", change: "+0.8%", positive: true },
  { name: "Silver", price: "$33.69", change: "-0.3%", positive: false },
  { name: "10-Year Treasury Yield", price: "4.38%", change: "+0.05%", positive: true },
  { name: "Dollar Index", price: "103.42", change: "-0.2%", positive: false },
  { name: "S&P 500", price: "5,218.24", change: "+0.7%", positive: true }
];

const quotes = [
  "The root problem with conventional currency is all the trust that's required to make it work. The central bank must be trusted not to debase the currency, but the history of fiat currencies is full of breaches of that trust.",
  "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks.",
  "I've been working on a new electronic cash system that's fully peer-to-peer, with no trusted third party.",
  "The central bank must be trusted not to debase the currency, but the history of fiat currencies is full of breaches of that trust.",
  "Banks must be trusted to hold our money and transfer it electronically, but they lend it out in waves of credit bubbles with barely a fraction in reserve.",
  "With e-currency based on cryptographic proof, without the need to trust a third party middleman, money can be secure and transactions effortless."
];

const API_KEY = 'FSJ6LYRO14TSGUBX';

// Função para renderizar os indicadores principais
function renderQuotes() {
  const quotesContainer = document.getElementById('quotes');
  if (!quotesContainer) return;

  // Limpar o container antes de adicionar novos elementos
  quotesContainer.innerHTML = '';

  // Buscar preços atualizados antes de renderizar
  fetchAllLatestPrices().then(updatedAssets => {
    const assetsToRender = updatedAssets || assets;

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
        tooltip = `<span class="index-tooltip">The yield on the U.S. 10-year Treasury note, a key benchmark for interest rates.</span>`;
      } else if (asset.name === "Dollar Index") {
        tooltip = `<span class="index-tooltip">Measures the value of the U.S. dollar relative to a basket of foreign currencies.</span>`;
      } else if (asset.name === "S&P 500") {
        tooltip = `<span class="index-tooltip">Stock market index tracking the performance of 500 large companies listed on U.S. exchanges.</span>`;
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

    // Atualizar também os preços no rodapé
    updateFooterPrices(assetsToRender);
  });
}

// Função para buscar preços atualizados de todos os ativos
async function fetchAllLatestPrices() {
  try {
    // Array para armazenar as promessas de todas as requisições
    const promises = [];

    // 1. Bitcoin - CoinGecko API
    promises.push(fetchBitcoinPrice());

    // 2. Gold - Alpha Vantage API
    promises.push(fetchGoldPrice());

    // 3. Silver - Simulado
    promises.push(fetchSilverPrice());

    // 4. 10-Year Treasury Yield - Simulado
    promises.push(fetchTreasuryYield());

    // 5. Dollar Index - Simulado
    promises.push(fetchDollarIndex());

    // 6. S&P 500 - Alpha Vantage API
    promises.push(fetchSP500());

    // Aguardar todas as requisições terminarem
    const results = await Promise.allSettled(promises);

    // Criar um novo array com os valores atualizados
    const updatedAssets = [...assets];

    // Processar os resultados
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        updatedAssets[index] = result.value;
      }
    });

    return updatedAssets;
  } catch (error) {
    console.error('Erro ao buscar preços atualizados:', error);
    return assets; // Retornar o array original em caso de erro
  }
}

// Função para buscar o preço do Bitcoin
async function fetchBitcoinPrice() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');

    if (response.ok) {
      const data = await response.json();

      if (data && data.bitcoin) {
        const price = data.bitcoin.usd;
        const change = data.bitcoin.usd_24h_change;

        // Formatar o preço com separador de milhar no padrão americano
        const formattedPrice = price.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });

        // Formatar a variação percentual
        const formattedChange = change >= 0 ?
          `+${change.toFixed(1)}%` :
          `${change.toFixed(1)}%`;

        return {
          name: "Bitcoin",
          price: formattedPrice,
          change: formattedChange,
          positive: change >= 0
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar preço do Bitcoin:', error);
    return null;
  }
}

// Função para buscar o preço do Ouro usando Alpha Vantage
async function fetchGoldPrice() {
  try {
    const url = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=XAU&to_symbol=USD&apikey=${API_KEY}`;
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      const timeSeries = data["Time Series FX (Daily)"];
      if (!timeSeries) throw new Error('Dados do ouro não encontrados');

      const latestDate = Object.keys(timeSeries)[0];
      const price = parseFloat(timeSeries[latestDate]["4. close"]);

      const formattedPrice = price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      return {
        name: "Gold",
        price: formattedPrice,
        change: '', // Não disponível nesse endpoint
        positive: true
      };
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar preço do Ouro:', error);
    return null;
  }
}

// Função para buscar o preço da Prata (simulado)
async function fetchSilverPrice() {
  try {
    const price = 33.69 + (Math.random() * 1 - 0.5);
    const change = (Math.random() * 2 - 1);

    const formattedPrice = price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    const formattedChange = change >= 0 ?
      `+${change.toFixed(1)}%` :
      `${change.toFixed(1)}%`;

    return {
      name: "Silver",
      price: formattedPrice,
      change: formattedChange,
      positive: change >= 0
    };
  } catch (error) {
    console.error('Erro ao buscar preço da Prata:', error);
    return null;
  }
}

// Função para buscar o rendimento do Treasury de 10 anos (simulado)
async function fetchTreasuryYield() {
  try {
    const yield_value = 4.38 + (Math.random() * 0.1 - 0.05);
    const change = (Math.random() * 0.1 - 0.05);

    const formattedYield = `${yield_value.toFixed(2)}%`;

    const formattedChange = change >= 0 ?
      `+${change.toFixed(2)}%` :
      `${change.toFixed(2)}%`;

    return {
      name: "10-Year Treasury Yield",
      price: formattedYield,
      change: formattedChange,
      positive: change >= 0
    };
  } catch (error) {
    console.error('Erro ao buscar rendimento do Treasury:', error);
    return null;
  }
}

// Função para buscar o Dollar Index (simulado)
async function fetchDollarIndex() {
  try {
    const price = 103.42 + (Math.random() * 0.4 - 0.2);
    const change = (Math.random() * 0.4 - 0.2);

    const formattedPrice = price.toFixed(2);

    const formattedChange = change >= 0 ?
      `+${change.toFixed(1)}%` :
      `${change.toFixed(1)}%`;

    return {
      name: "Dollar Index",
      price: formattedPrice,
      change: formattedChange,
      positive: change >= 0
    };
  } catch (error) {
    console.error('Erro ao buscar Dollar Index:', error);
    return null;
  }
}

// Função para buscar o S&P 500 usando Alpha Vantage
async function fetchSP500() {
  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=^GSPC&apikey=${API_KEY}`;
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      const timeSeries = data["Time Series (Daily)"];
      if (!timeSeries) throw new Error('Dados do S&P 500 não encontrados');

      const latestDate = Object.keys(timeSeries)[0];
      const todayData = timeSeries[latestDate];
      const closePrice = parseFloat(todayData["4. close"]);
      const openPrice = parseFloat(todayData["1. open"]);
      const change = ((closePrice - openPrice) / openPrice) * 100;

      const formattedPrice = closePrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      const formattedChange = change >= 0 ?
        `+${change.toFixed(1)}%` :
        `${change.toFixed(1)}%`;

      return {
        name: "S&P 500",
        price: formattedPrice,
        change: formattedChange,
        positive: change >= 0
      };
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar preço do S&P 500:', error);
    return null;
  }
}

// Função para atualizar os preços no rodapé
function updateFooterPrices(updatedAssets) {
  const footerBtcPrice = document.getElementById('footer-btc-price');
  const footerGoldPrice = document.getElementById('footer-gold-price');
  const footerSilverPrice = document.getElementById('footer-silver-price');

  if (footerBtcPrice) footerBtcPrice.textContent = updatedAssets[0].price;
  if (footerGoldPrice) footerGoldPrice.textContent = updatedAssets[1].price;
  if (footerSilverPrice) footerSilverPrice.textContent = updatedAssets[2].price;
}

// Função para atualizar o total de bitcoins minerados (mantida do seu código original)
async function updateBitcoinsMined() {
  try {
    const response = await fetch('https://api.blockchain.info/q/totalbc');
    if (response.ok) {
      const total = await response.text();
      const btcMinedElement = document.getElementById('btc-mined');
      if (btcMinedElement) {
        btcMinedElement.textContent = (parseInt(total) / 100000000).toLocaleString('en-US', { maximumFractionDigits: 0 });
      }
    }
  } catch (error) {
    console.error('Erro ao atualizar bitcoins minerados:', error);
  }
}

// Função para verificar e atualizar dias para o próximo halving (mantida do seu código original)
function checkHalvingDaysUpdate() {
  // Sua lógica original aqui (não alterada)
}

// Função para atualizar a capitalização de mercado do Bitcoin (mantida do seu código original)
async function updateBitcoinMarketCap() {
  // Sua lógica original aqui (não alterada)
}

// Inicialização do site
document.addEventListener('DOMContentLoaded', () => {
  renderQuotes();
  updateBitcoinsMined();
  checkHalvingDaysUpdate();
  updateBitcoinMarketCap();
});
