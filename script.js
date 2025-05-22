const assets = [
  { name: "Bitcoin", symbol: "BTC", price: "$107,016.57", change: "+0.2%", color: "#f7931a", api: "coindesk" },
  { name: "Gold", symbol: "XAU", price: "$3,323.10", change: "+1.2%", color: "#d4af37", api: "metals" },
  { name: "Silver", symbol: "XAG", price: "$33.69", change: "+1.5%", color: "#c0c0c0", api: "metals" },
  { name: "10-Year Treasury Yield <span class='index-tooltip'>ⓘ<span class='tooltip-text'>Reveals the cost of government debt financing and signals market expectations for inflation. Rising yields expose the unsustainable nature of endless deficit spending and currency debasement.</span></span>", symbol: "10Y", price: "4.60%", change: "+0.12%", color: "#6a5acd", api: "treasury" },
  { name: "Dollar Index <span class='index-tooltip'>ⓘ<span class='tooltip-text'>Measures the strength of the US dollar against a basket of major foreign currencies. Declining values reflect the erosion of purchasing power through monetary expansion.</span></span>", symbol: "DXY", price: "99.55", change: "-0.6%", color: "#20b2aa", api: "forex" },
  { name: "S&P 500 <span class='index-tooltip'>ⓘ<span class='tooltip-text'>Benchmark index of 500 large US companies, often used as a barometer for the overall US stock market performance.</span></span>", symbol: "SPX", price: "5,218.24", change: "+0.3%", color: "#3d85c6", api: "stocks" }
];

// Market sentiment data
const marketSentimentData = [
  { title: "BTC Dominance", value: "52% - Moderate", percentage: 52, change: "+0.8% (24h)" },
  { title: "Volatility (30D)", value: "3.8% - Low", percentage: 38, change: "-0.5% (24h)" },
  { title: "Transaction Volume (24h)", value: "$78.5B - High", percentage: 68, change: "+12% (24h)" },
  { title: "Fear & Greed Index", value: "65 - Greed", percentage: 65, change: "+5% (24h)" },
  { title: "Bitcoin Market Cap", value: "$2.3T - All-time High", percentage: 75, change: "+2.3% (24h)" },
  { title: "Network Hash Rate", value: "512 EH/s - Record High", percentage: 72, change: "+5.2% (7d)" }
];

// Global market capitalization data
const marketCapData = [
  { name: "Real Estate", value: 326.5, color: "#4CAF50", percentage: 47.3 },
  { name: "Bonds", value: 133.0, color: "#2196F3", percentage: 19.3 },
  { name: "Equities", value: 106.0, color: "#9C27B0", percentage: 15.3 },
  { name: "Money", value: 102.9, color: "#FF9800", percentage: 14.9 },
  { name: "Gold", value: 12.5, color: "#d4af37", percentage: 1.8 },
  { name: "Art & Collectibles", value: 7.8, color: "#E91E63", percentage: 1.1 },
  { name: "Bitcoin", value: 2.3, color: "#f7931a", percentage: 0.3 }
];

// Scarcity metrics data
const scarcityMetrics = [
  {
    title: "Stock-to-Flow",
    value: "56",
    description: "Ratio between existing stock and annual production",
    comparison: [
      { name: "Bitcoin", value: "56" },
      { name: "Gold", value: "62" },
      { name: "Silver", value: "22" }
    ]
  },
  {
    title: "Annual Inflation",
    value: "1.74%",
    description: "Annual issuance rate relative to total supply",
    comparison: [
      { name: "Bitcoin", value: "1.74%" },
      { name: "Gold", value: "1.60%" },
      { name: "Silver", value: "4.50%" }
    ]
  },
  {
    title: "Bitcoins Mined",
    value: "19,368,750",
    description: "Amount of bitcoins already mined out of 21 million total",
    percentage: 92.23,
    remaining: "1,631,250"
  },
  {
    title: "Next Halving",
    value: "April 2028",
    description: "Event that cuts mining reward in half",
    daysRemaining: 1056
  }
];

// Important upcoming events data
const upcomingEvents = [
  {
    date: "May 25, 2025",
    title: "FOMC Meeting",
    description: "Federal Reserve interest rate decision",
    impact: "high"
  },
  {
    date: "June 02, 2025",
    title: "US Inflation Report",
    description: "Consumer Price Index (CPI) release",
    impact: "high"
  },
  {
    date: "June 10, 2025",
    title: "Bitcoin 2025 Conference",
    description: "Largest annual Bitcoin event in Miami",
    impact: "medium"
  },
  {
    date: "June 15, 2025",
    title: "US Employment Report",
    description: "US labor market data",
    impact: "medium"
  }
];

// Satoshi Nakamoto quotes
const satoshiQuotes = [
  "The root problem with conventional currency is all the trust that's required to make it work. The central bank must be trusted not to debase the currency, but the history of fiat currencies is full of breaches of that trust.",
  "Bitcoin is very attractive from a libertarian viewpoint if you don't like the idea of government controlling your money and being able to freeze your accounts at will.",
  "I've chosen to implement proof-of-work over proof-of-stake because the latter would require an identification mechanism, which would hurt anonymity.",
  "Lost coins only make everyone else's coins worth slightly more. Think of it as a donation to everyone.",
  "I'm sure that in 20 years there will either be very large transaction volume or no volume.",
  "It might make sense just to get some in case it catches on. If enough people think the same way, that becomes a self fulfilling prophecy.",
  "The price of any commodity tends to gravitate toward the production cost. If the price is below cost, then production slows down. If the price is above cost, profit can be made by generating and selling more.",
  "Writing a description for this thing for general audiences is bloody hard. There's nothing to relate it to.",
  "I'm sure that in 20 years there will either be very large transaction volume or no volume.",
  "Bitcoin might make a good currency for purchases on the Internet."
];

// News data with timestamps
const newsData = [
  {
    title: "Bitcoin Surpasses $100,000 for First Time in History",
    description: "The world's largest cryptocurrency has reached a new all-time high, breaking the psychological barrier of $100,000.",
    source: "Bitcoin Magazine",
    date: "May 21, 2025",
    time: "14:32 UTC",
    url: "https://bitcoinmagazine.com/"
  },
  {
    title: "Central Banks Accelerate Digital Currency Development",
    description: "Major central banks are fast-tracking CBDC projects in response to growing cryptocurrency adoption.",
    source: "Blockworks",
    date: "May 20, 2025",
    time: "09:15 UTC",
    url: "https://blockworks.co/"
  },
  {
    title: "Gold Reaches Record High Amid Inflation Concerns",
    description: "The precious metal continues its upward trajectory as investors seek protection from rising inflation.",
    source: "The Bitcoin Times",
    date: "May 19, 2025",
    time: "16:45 UTC",
    url: "https://bitcointimes.news/"
  },
  {
    title: "Bitcoin Mining Difficulty Hits All-Time High",
    description: "Network security continues to strengthen as mining difficulty adjusts upward following hashrate increases.",
    source: "Bitcoin Magazine",
    date: "May 18, 2025",
    time: "11:20 UTC",
    url: "https://bitcoinmagazine.com/"
  },
  {
    title: "Institutional Adoption Accelerates as Pension Funds Enter Crypto",
    description: "Major pension funds are now allocating portions of their portfolios to Bitcoin and other digital assets.",
    source: "Satoshi's Journal",
    date: "May 17, 2025",
    time: "13:05 UTC",
    url: "https://satoshisjournal.com/"
  },
  {
    title: "El Salvador's Bitcoin Strategy Shows Long-term Success",
    description: "The country's Bitcoin reserves have appreciated significantly since adoption as legal tender in 2021.",
    source: "Bitcoinist",
    date: "May 16, 2025",
    time: "08:30 UTC",
    url: "https://bitcoinist.com/"
  }
];

// Fetch real-time price data from APIs
async function fetchRealTimePrices() {
  try {
    // Bitcoin price from CoinGecko
    const btcResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true');
    const btcData = await btcResponse.json();
    if (btcData && btcData.bitcoin && btcData.bitcoin.usd) {
      const btcPrice = btcData.bitcoin.usd;
      assets[0].price = `$${btcPrice.toLocaleString('en-US')}`;
      
      // Calculate change (simplified for demo)
      const randomChange = (Math.random() * 5 - 2.5).toFixed(1);
      assets[0].change = `${randomChange > 0 ? '+' : ''}${randomChange}%`;
      
      // Update footer price
      const footerBtcPrice = document.getElementById('footer-btc-price');
      if (footerBtcPrice) footerBtcPrice.textContent = assets[0].price;
      
      // Update Bitcoin Market Cap in Market Sentiment
      if (btcData.bitcoin.usd_market_cap) {
        const marketCapInTrillions = (btcData.bitcoin.usd_market_cap / 1000000000000).toFixed(1);
        const marketCapFormatted = `$${marketCapInTrillions}T`;
        
        // Update in Market Sentiment section
        const btcMarketCapIndex = marketSentimentData.findIndex(item => item.title === "Bitcoin Market Cap");
        if (btcMarketCapIndex !== -1) {
          marketSentimentData[btcMarketCapIndex].value = `${marketCapFormatted} - All-time High`;
        }
        
        // Update in Global Market Capitalization section
        const btcGlobalCapIndex = marketCapData.findIndex(item => item.name === "Bitcoin");
        if (btcGlobalCapIndex !== -1) {
          marketCapData[btcGlobalCapIndex].value = parseFloat(marketCapInTrillions);
          // Recalculate percentages
          const totalMarketCap = marketCapData.reduce((sum, item) => sum + item.value, 0);
          marketCapData.forEach(item => {
            item.percentage = ((item.value / totalMarketCap) * 100).toFixed(1);
          });
        }
        
        // Re-render market sentiment and global market cap sections
        renderMarketSentiment();
        renderGlobalMarketCap();
      }
    }
    
    // Gold price (simplified for demo)
    const goldPrice = (3300 + Math.random() * 50).toFixed(2);
    assets[1].price = `$${Number(goldPrice).toLocaleString('en-US')}`;
    const goldChange = (Math.random() * 2 - 0.5).toFixed(1);
    assets[1].change = `${goldChange > 0 ? '+' : ''}${goldChange}%`;
    
    // Update footer price
    const footerGoldPrice = document.getElementById('footer-gold-price');
    if (footerGoldPrice) footerGoldPrice.textContent = assets[1].price;
    
    // Silver price (simplified for demo)
    const silverPrice = (33 + Math.random()).toFixed(2);
    assets[2].price = `$${Number(silverPrice).toLocaleString('en-US')}`;
    const silverChange = (Math.random() * 3 - 1).toFixed(1);
    assets[2].change = `${silverChange > 0 ? '+' : ''}${silverChange}%`;
    
    // Update footer price
    const footerSilverPrice = document.getElementById('footer-silver-price');
    if (footerSilverPrice) footerSilverPrice.textContent = assets[2].price;
    
    // 10-Year Treasury Yield (simplified for demo)
    const treasuryYield = (4.5 + Math.random() * 0.2).toFixed(2);
    assets[3].price = `${treasuryYield}%`;
    const treasuryChange = ((Math.random() * 0.2 - 0.1) * 100).toFixed(2);
    assets[3].change = `${treasuryChange > 0 ? '+' : ''}${treasuryChange}%`;
    
    // Dollar Index (simplified for demo)
    const dollarIndex = (99 + Math.random()).toFixed(2);
    assets[4].price = `${dollarIndex}`;
    const dollarChange = (Math.random() * 1.2 - 0.8).toFixed(1);
    assets[4].change = `${dollarChange > 0 ? '+' : ''}${dollarChange}%`;
    
    // S&P 500 (simplified for demo)
    const spPrice = (5200 + Math.random() * 50).toFixed(2);
    assets[5].price = `${Number(spPrice).toLocaleString('en-US')}`;
    const spChange = (Math.random() * 1.5 - 0.5).toFixed(1);
    assets[5].change = `${spChange > 0 ? '+' : ''}${spChange}%`;
    
    // Re-render the indicators with updated data
    renderAssetIndicators();
    
  } catch (error) {
    console.error('Error fetching real-time prices:', error);
    // Fallback to random price generation if API fails
    updateAssetPrices();
  }
}

// Fetch Bitcoin supply data
async function fetchBitcoinSupply() {
  try {
    // Try to get Bitcoin supply from Blockchain.info API
    const response = await fetch('https://blockchain.info/q/totalbc');
    if (response.ok) {
      const totalSupply = await response.text();
      if (totalSupply && !isNaN(totalSupply)) {
        // Convert satoshis to BTC and format
        const supplyInBTC = (parseInt(totalSupply) / 100000000).toFixed(0);
        const formattedSupply = parseInt(supplyInBTC).toLocaleString('en-US');
        
        // Calculate percentage mined and remaining
        const totalPossible = 21000000;
        const percentageMined = ((supplyInBTC / totalPossible) * 100).toFixed(2);
        const remaining = (totalPossible - supplyInBTC).toLocaleString('en-US');
        
        // Update scarcity metrics data
        const bitcoinMinedIndex = scarcityMetrics.findIndex(metric => metric.title === "Bitcoins Mined");
        if (bitcoinMinedIndex !== -1) {
          scarcityMetrics[bitcoinMinedIndex].value = formattedSupply;
          scarcityMetrics[bitcoinMinedIndex].percentage = parseFloat(percentageMined);
          scarcityMetrics[bitcoinMinedIndex].remaining = remaining;
          
          // Update DOM elements
          const valueElement = document.querySelector('.scarcity-metric:nth-child(3) .scarcity-metric-value');
          const progressTextElement = document.querySelector('.scarcity-metric:nth-child(3) .supply-progress-text');
          const progressFillElement = document.querySelector('.scarcity-metric:nth-child(3) .supply-progress-fill');
          
          if (valueElement) valueElement.textContent = formattedSupply;
          if (progressTextElement) progressTextElement.textContent = `${percentageMined}% (${remaining} remaining)`;
          if (progressFillElement) {
            progressFillElement.style.width = `${percentageMined}%`;
          }
        }
      }
    } else {
      throw new Error('Failed to fetch Bitcoin supply');
    }
  } catch (error) {
    console.error('Error fetching Bitcoin supply:', error);
    // Fallback to static data if API fails
  }
}

// Initialize the page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Fetch real-time prices on page load
  fetchRealTimePrices();
  
  // Fetch Bitcoin supply data
  fetchBitcoinSupply();
  
  // Render main asset indicators
  renderAssetIndicators();
  
  // Render market sentiment indicators
  renderMarketSentiment();
  
  // Render global market cap
  renderGlobalMarketCap();
  
  // Render scarcity metrics
  renderScarcityMetrics();
  
  // Render upcoming events
  renderUpcomingEvents();
  
  // Render news
  renderNews();
  
  // Render Satoshi quote
  renderSatoshiQuote();
  
  // Add event listener for sources toggle
  document.getElementById('sources-toggle').addEventListener('click', function() {
    const sourcesElement = document.getElementById('market-cap-sources');
    if (sourcesElement.style.display === 'block') {
      sourcesElement.style.display = 'none';
      this.textContent = 'Show sources';
    } else {
      sourcesElement.style.display = 'block';
      this.textContent = 'Hide sources';
    }
  });
  
  // Add event listener for copy address button
  document.getElementById('copy-address').addEventListener('click', function() {
    const addressText = document.querySelector('.donation-address-text').textContent;
    navigator.clipboard.writeText(addressText).then(function() {
      const originalText = document.getElementById('copy-address').textContent;
      document.getElementById('copy-address').textContent = 'Copied!';
      setTimeout(function() {
        document.getElementById('copy-address').textContent = originalText;
      }, 2000);
    });
  });
  
  // Rotate Satoshi quotes periodically
  setInterval(rotateSatoshiQuote, 30000);
});

// Generate random prices for assets (fallback if API fails)
function updateAssetPrices() {
  // Bitcoin: Random price between $100,000 and $110,000
  const btcPrice = Math.floor(100000 + Math.random() * 10000);
  const btcChange = (Math.random() * 5 - 2.5).toFixed(1); // Random change between -2.5% and +2.5%
  
  // Gold: Random price between $3,300 and $3,350
  const goldPrice = (3300 + Math.random() * 50).toFixed(2);
  const goldChange = (Math.random() * 2 - 0.5).toFixed(1); // Random change between -0.5% and +1.5%
  
  // Silver: Random price between $33 and $34
  const silverPrice = (33 + Math.random()).toFixed(2);
  const silverChange = (Math.random() * 3 - 1).toFixed(1); // Random change between -1% and +2%
  
  // 10-Year Treasury Yield: Random yield between 4.5% and 4.7%
  const treasuryYield = (4.5 + Math.random() * 0.2).toFixed(2);
  const treasuryChange = ((Math.random() * 0.2 - 0.1) * 100).toFixed(2); // Random change between -0.1% and +0.1%
  
  // Dollar Index: Random value between 99 and 100
  const dollarIndex = (99 + Math.random()).toFixed(2);
  const dollarChange = (Math.random() * 1.2 - 0.8).toFixed(1); // Random change between -0.8% and +0.4%
  
  // S&P 500: Random value between 5200 and 5250
  const spPrice = (5200 + Math.random() * 50).toFixed(2);
  const spChange = (Math.random() * 1.5 - 0.5).toFixed(1); // Random change between -0.5% and +1.0%
  
  // Update assets array with new prices
  assets[0].price = `$${btcPrice.toLocaleString('en-US')}`;
  assets[0].change = `${btcChange > 0 ? '+' : ''}${btcChange}%`;
  
  assets[1].price = `$${Number(goldPrice).toLocaleString('en-US')}`;
  assets[1].change = `${goldChange > 0 ? '+' : ''}${goldChange}%`;
  
  assets[2].price = `$${Number(silverPrice).toLocaleString('en-US')}`;
  assets[2].change = `${silverChange > 0 ? '+' : ''}${silverChange}%`;
  
  assets[3].price = `${treasuryYield}%`;
  assets[3].change = `${treasuryChange > 0 ? '+' : ''}${treasuryChange}%`;
  
  assets[4].price = `${dollarIndex}`;
  assets[4].change = `${dollarChange > 0 ? '+' : ''}${dollarChange}%`;
  
  assets[5].price = `${Number(spPrice).toLocaleString('en-US')}`;
  assets[5].change = `${spChange > 0 ? '+' : ''}${spChange}%`;
  
  // Update footer prices
  const footerBtcPrice = document.getElementById('footer-btc-price');
  const footerGoldPrice = document.getElementById('footer-gold-price');
  const footerSilverPrice = document.getElementById('footer-silver-price');
  
  if (footerBtcPrice) footerBtcPrice.textContent = assets[0].price;
  if (footerGoldPrice) footerGoldPrice.textContent = assets[1].price;
  if (footerSilverPrice) footerSilverPrice.textContent = assets[2].price;
}

// Render main asset indicators (simplified without charts)
function renderAssetIndicators() {
  const quotesContainer = document.getElementById('quotes');
  if (!quotesContainer) return;
  
  quotesContainer.innerHTML = '';
  
  assets.forEach((asset, index) => {
    const assetElement = document.createElement('div');
    assetElement.className = 'quote-wrapper';
    
    const changeClass = asset.change.startsWith('+') ? 'positive' : asset.change.startsWith('-') ? 'negative' : '';
    
    assetElement.innerHTML = `
      <div class="quote" style="border-left-color: ${asset.color};">
        <div class="quote-left">
          <strong>${asset.name}</strong>
        </div>
        <div class="quote-right">
          <span class="quote-price">${asset.price}</span>
          <span class="quote-change ${changeClass}">${asset.change}</span>
        </div>
      </div>
    `;
    
    quotesContainer.appendChild(assetElement);
  });
}

// Render market sentiment indicators
function renderMarketSentiment() {
  const sentimentContainer = document.querySelector('.sentiment-indicators');
  if (!sentimentContainer) return;
  
  // Clear existing content
  sentimentContainer.innerHTML = '';
  
  // Render each sentiment indicator
  marketSentimentData.forEach(indicator => {
    const indicatorElement = document.createElement('div');
    indicatorElement.className = 'indicator';
    
    const changeClass = indicator.change.includes('+') ? 'positive' : indicator.change.includes('-') ? 'negative' : '';
    
    indicatorElement.innerHTML = `
      <div class="indicator-title">${indicator.title}</div>
      <div class="indicator-value">
        <div class="gauge">
          <div class="gauge-fill" style="width: ${indicator.percentage}%;"></div>
        </div>
        <div class="gauge-value">${indicator.value}</div>
        <div class="indicator-change ${changeClass}">${indicator.change}</div>
      </div>
    `;
    
    sentimentContainer.appendChild(indicatorElement);
  });
}

// Render global market capitalization
function renderGlobalMarketCap() {
  const marketCapContainer = document.getElementById('market-cap-treemap');
  const totalMarketCapElement = document.getElementById('total-market-cap');
  
  if (!marketCapContainer || !totalMarketCapElement) return;
  
  // Calculate total market cap
  const totalMarketCap = marketCapData.reduce((sum, item) => sum + item.value, 0);
  totalMarketCapElement.textContent = `$${totalMarketCap.toLocaleString('en-US')}T`;
  
  // Clear existing content
  marketCapContainer.innerHTML = '';
  
  // Render each market cap item
  marketCapData.forEach(item => {
    const marketCapElement = document.createElement('div');
    marketCapElement.className = 'market-cap-item';
    
    marketCapElement.innerHTML = `
      <div class="market-cap-item-header">
        <div class="market-cap-item-name">${item.name}</div>
        <div class="market-cap-item-value">$${item.value.toLocaleString('en-US')}T</div>
      </div>
      <div class="market-cap-item-bar">
        <div class="market-cap-item-fill" style="width: ${item.percentage}%; background-color: ${item.color};"></div>
        <div class="market-cap-item-percentage">${item.percentage}%</div>
      </div>
    `;
    
    marketCapContainer.appendChild(marketCapElement);
  });
}

// Render scarcity metrics
function renderScarcityMetrics() {
  // Scarcity metrics are already in the HTML
}

// Render upcoming events
function renderUpcomingEvents() {
  // Upcoming events are already in the HTML
}

// Render news
function renderNews() {
  const newsContainer = document.querySelector('.news-grid');
  if (!newsContainer) return;
  
  // Clear existing content
  newsContainer.innerHTML = '';
  
  // Render each news item
  newsData.forEach(news => {
    const newsElement = document.createElement('a');
    newsElement.href = news.url;
    newsElement.target = "_blank";
    newsElement.className = 'news-item';
    
    newsElement.innerHTML = `
      <div class="news-content">
        <div class="news-source">${news.source}</div>
        <div class="news-title">${news.title}</div>
        <div class="news-description">${news.description}</div>
        <div class="news-date">${news.date} ${news.time}</div>
      </div>
    `;
    
    newsContainer.appendChild(newsElement);
  });
}

// Render Satoshi quote
function renderSatoshiQuote() {
  const quoteContainer = document.getElementById('satoshi-quotes');
  if (!quoteContainer) return;
  
  const randomIndex = Math.floor(Math.random() * satoshiQuotes.length);
  const quote = satoshiQuotes[randomIndex];
  
  const quoteSection = quoteContainer.querySelector('.quote-container');
  if (quoteSection) {
    quoteSection.innerHTML = `
      <blockquote>${quote}</blockquote>
      <div class="quote-author">- Satoshi Nakamoto</div>
    `;
  } else {
    quoteContainer.innerHTML = `
      <h2 class="section-header">Word of Satoshi</h2>
      <div class="quote-container">
        <blockquote>${quote}</blockquote>
        <div class="quote-author">- Satoshi Nakamoto</div>
      </div>
    `;
  }
}

// Rotate Satoshi quotes
function rotateSatoshiQuote() {
  const quoteContainer = document.getElementById('satoshi-quotes');
  if (!quoteContainer) return;
  
  const randomIndex = Math.floor(Math.random() * satoshiQuotes.length);
  const quote = satoshiQuotes[randomIndex];
  
  const quoteElement = quoteContainer.querySelector('.quote-container');
  if (!quoteElement) return;
  
  // Fade out
  quoteElement.style.transition = 'opacity 0.5s ease';
  quoteElement.style.opacity = 0;
  
  // Update content and fade in after a short delay
  setTimeout(() => {
    quoteElement.innerHTML = `
      <blockquote>${quote}</blockquote>
      <div class="quote-author">- Satoshi Nakamoto</div>
    `;
    quoteElement.style.opacity = 1;
  }, 500);
}
