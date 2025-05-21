const assets = [
  { name: "Bitcoin", symbol: "BTC", price: "$107,016.57", change: "+0.2%", color: "#f7931a", api: "coindesk" },
  { name: "Gold", symbol: "XAU", price: "$3,323.10", change: "+1.2%", color: "#d4af37", api: "metals" },
  { name: "Silver", symbol: "XAG", price: "$33.69", change: "+1.5%", color: "#c0c0c0", api: "metals" },
  { name: "10-Year Treasury Yield <span class='index-tooltip'>ⓘ<span class='tooltip-text'>Reveals the cost of government debt financing and signals market expectations for inflation. Rising yields expose the unsustainable nature of endless deficit spending and currency debasement.</span></span>", symbol: "10Y", price: "4.60%", change: "+0.12%", color: "#6a5acd", api: "treasury" },
  { name: "Dollar Index <span class='index-tooltip'>ⓘ<span class='tooltip-text'>Measures the strength of the US dollar against a basket of major foreign currencies. Declining values reflect the erosion of purchasing power through monetary expansion.</span></span>", symbol: "DXY", price: "99.55", change: "-0.6%", color: "#20b2aa", api: "forex" }
];

// Historical data for charts (5 years)
const historicalData = {
  "Bitcoin": [
    { year: 2020, data: [7200, 8300, 9450, 8700, 9800, 9200, 11300, 11800, 10500, 13800, 17500, 29000] },
    { year: 2021, data: [33000, 45000, 58000, 56000, 37000, 35000, 42000, 47000, 43000, 61000, 58000, 46000] },
    { year: 2022, data: [38000, 44000, 40000, 39000, 31000, 20000, 23000, 24000, 19000, 20500, 17000, 16500] },
    { year: 2023, data: [16800, 23500, 28000, 30000, 27000, 30500, 29800, 28000, 26500, 34000, 37000, 42000] },
    { year: 2024, data: [45000, 52000, 61000, 64000, 59000, 62000, 65000, 67000, 66000, 68000, 67500, 68900] },
    { year: 2025, data: [66500, 78200, 89500, 95100, 107016] }
  ],
  "Gold": [
    { year: 2020, data: [1520, 1585, 1620, 1680, 1730, 1780, 1960, 1920, 1880, 1900, 1860, 1895] },
    { year: 2021, data: [1850, 1810, 1730, 1770, 1900, 1780, 1810, 1815, 1760, 1780, 1820, 1805] },
    { year: 2022, data: [1800, 1870, 1920, 1880, 1840, 1810, 1760, 1770, 1670, 1650, 1750, 1820] },
    { year: 2023, data: [1910, 1830, 1970, 1990, 1960, 1920, 1970, 2010, 1920, 1980, 2040, 2060] },
    { year: 2024, data: [2050, 2120, 2180, 2220, 2260, 2290, 2310, 2330, 2400, 2480, 2550, 2625] },
    { year: 2025, data: [2680, 2810, 2940, 3180, 3323] }
  ],
  "Silver": [
    { year: 2020, data: [17.8, 18.5, 14.6, 15.7, 17.9, 18.2, 24.5, 27.4, 24.2, 24.1, 23.8, 26.3] },
    { year: 2021, data: [27.0, 26.7, 25.0, 26.1, 27.4, 26.0, 25.5, 24.0, 22.5, 23.9, 23.1, 22.5] },
    { year: 2022, data: [22.4, 24.3, 24.9, 23.0, 21.6, 20.3, 19.2, 19.5, 18.8, 19.5, 21.5, 23.9] },
    { year: 2023, data: [24.1, 21.7, 24.2, 25.0, 23.5, 22.8, 24.5, 24.8, 23.0, 22.7, 24.5, 24.3] },
    { year: 2024, data: [23.8, 25.6, 26.9, 27.5, 28.2, 28.9, 29.3, 29.8, 30.2, 30.5, 31.0, 31.8] },
    { year: 2025, data: [30.9, 31.2, 32.5, 33.1, 33.69] }
  ],
  "10-Year Treasury Yield": [
    { year: 2020, data: [1.88, 1.50, 0.70, 0.66, 0.65, 0.68, 0.55, 0.72, 0.68, 0.85, 0.84, 0.93] },
    { year: 2021, data: [1.07, 1.44, 1.74, 1.65, 1.58, 1.45, 1.24, 1.30, 1.52, 1.55, 1.44, 1.51] },
    { year: 2022, data: [1.78, 1.83, 2.32, 2.89, 2.84, 3.01, 2.65, 3.19, 3.83, 4.05, 3.68, 3.88] },
    { year: 2023, data: [3.51, 3.92, 3.47, 3.45, 3.64, 3.84, 3.96, 4.10, 4.57, 4.89, 4.47, 3.88] },
    { year: 2024, data: [4.05, 4.25, 4.35, 4.50, 4.60, 4.55, 4.48, 4.42, 4.38, 4.35, 4.30, 4.28] },
    { year: 2025, data: [4.30, 4.32, 4.35, 4.48, 4.60] }
  ],
  "Dollar Index": [
    { year: 2020, data: [97.3, 98.1, 99.0, 99.5, 98.3, 97.4, 93.3, 92.1, 93.9, 94.0, 92.3, 89.9] },
    { year: 2021, data: [90.5, 90.9, 93.2, 91.3, 90.0, 92.4, 92.1, 92.5, 94.2, 94.1, 95.9, 95.7] },
    { year: 2022, data: [96.5, 96.7, 98.3, 102.9, 101.8, 104.7, 106.1, 108.7, 112.1, 111.5, 106.7, 103.5] },
    { year: 2023, data: [102.1, 104.4, 102.5, 101.9, 104.2, 102.6, 101.9, 104.1, 106.1, 106.6, 103.4, 101.9] },
    { year: 2024, data: [103.4, 104.1, 104.5, 105.2, 104.8, 104.3, 103.9, 103.7, 103.5, 103.3, 103.2, 103.1] },
    { year: 2025, data: [103.6, 103.5, 102.3, 101.8, 99.55] }
  ]
};

// Global market capitalization data
const marketCapData = [
  { name: "Real Estate", value: 326.5, color: "#4CAF50", percentage: 47.3 },
  { name: "Bonds", value: 133.0, color: "#2196F3", percentage: 19.3 },
  { name: "Equities", value: 106.0, color: "#9C27B0", percentage: 15.3 },
  { name: "Money", value: 102.9, color: "#FF9800", percentage: 14.9 },
  { name: "Gold", value: 12.5, color: "#d4af37", percentage: 1.8 },
  { name: "Art & Collectibles", value: 7.8, color: "#E91E63", percentage: 1.1 },
  { name: "Bitcoin", value: 2.0, color: "#f7931a", percentage: 0.3 }
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

// News data
const newsData = [
  {
    title: "Bitcoin Surpasses $100,000 for First Time in History",
    description: "The world's largest cryptocurrency has reached a new all-time high, breaking the psychological barrier of $100,000.",
    source: "Cointelegraph",
    date: "May 21, 2025",
    url: "#"
  },
  {
    title: "Central Banks Accelerate Digital Currency Development",
    description: "Major central banks are fast-tracking CBDC projects in response to growing cryptocurrency adoption.",
    source: "Financial Times",
    date: "May 20, 2025",
    url: "#"
  },
  {
    title: "Gold Reaches Record High Amid Inflation Concerns",
    description: "The precious metal continues its upward trajectory as investors seek protection from rising inflation.",
    source: "Bloomberg",
    date: "May 19, 2025",
    url: "#"
  },
  {
    title: "Bitcoin Mining Difficulty Hits All-Time High",
    description: "Network security continues to strengthen as mining difficulty adjusts upward following hashrate increases.",
    source: "Bitcoin Magazine",
    date: "May 18, 2025",
    url: "#"
  },
  {
    title: "Institutional Adoption Accelerates as Pension Funds Enter Crypto",
    description: "Major pension funds are now allocating portions of their portfolios to Bitcoin and other digital assets.",
    source: "Reuters",
    date: "May 17, 2025",
    url: "#"
  },
  {
    title: "El Salvador's Bitcoin Strategy Shows Long-term Success",
    description: "The country's Bitcoin reserves have appreciated significantly since adoption as legal tender in 2021.",
    source: "Cointelegraph",
    date: "May 16, 2025",
    url: "#"
  }
];

// Initialize the page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Fetch latest prices
  fetchLatestPrices();
  
  // Render main asset indicators
  renderAssetIndicators();
  
  // Initialize charts
  initializeCharts();
  
  // Render scarcity metrics
  renderScarcityMetrics();
  
  // Render upcoming events
  renderUpcomingEvents();
  
  // Render news
  renderNews();
  
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
  
  // Rotate Satoshi quotes periodically
  setInterval(rotateSatoshiQuote, 30000);
});

// Fetch latest prices from API
function fetchLatestPrices() {
  fetch('/data/prices.json?' + new Date().getTime())
    .then(response => response.json())
    .then(data => {
      // Update assets array with latest prices
      assets.forEach(asset => {
        if (data[asset.name.split(' <')[0]]) {
          asset.price = data[asset.name.split(' <')[0]].price;
          asset.change = data[asset.name.split(' <')[0]].change;
        }
      });
      
      // Re-render asset indicators with updated prices
      renderAssetIndicators();
    })
    .catch(error => {
      console.error('Error fetching latest prices:', error);
    });
}

// Render main asset indicators
function renderAssetIndicators() {
  const quotesContainer = document.getElementById('quotes');
  if (!quotesContainer) return;
  
  quotesContainer.innerHTML = '';
  
  assets.forEach(asset => {
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
      <div class="asset-chart-area" id="chart-area-${asset.symbol}">
        <div class="chart-container">
          <button class="chart-close">×</button>
          <canvas id="chart-${asset.symbol}"></canvas>
        </div>
      </div>
    `;
    
    quotesContainer.appendChild(assetElement);
    
    // Add click event to toggle chart visibility
    const quoteElement = assetElement.querySelector('.quote');
    const chartArea = assetElement.querySelector('.asset-chart-area');
    
    quoteElement.addEventListener('click', function() {
      if (chartArea.classList.contains('visible')) {
        chartArea.classList.remove('visible');
        quoteElement.classList.remove('active');
      } else {
        // Hide all other charts first
        document.querySelectorAll('.asset-chart-area').forEach(area => {
          area.classList.remove('visible');
        });
        document.querySelectorAll('.quote').forEach(q => {
          q.classList.remove('active');
        });
        
        // Show this chart
        chartArea.classList.add('visible');
        quoteElement.classList.add('active');
        
        // Create or update chart
        createAssetChart(asset, document.getElementById(`chart-${asset.symbol}`));
      }
    });
    
    // Add close button functionality
    const closeButton = assetElement.querySelector('.chart-close');
    closeButton.addEventListener('click', function(e) {
      e.stopPropagation();
      chartArea.classList.remove('visible');
      quoteElement.classList.remove('active');
    });
  });
}

// Create chart for an asset
function createAssetChart(asset, canvas) {
  const data = historicalData[asset.name.split(' <')[0]];
  if (!data) return;
  
  // Prepare labels and datasets
  const labels = [];
  const values = [];
  
  // Flatten the data structure for Chart.js
  data.forEach(yearData => {
    const year = yearData.year;
    yearData.data.forEach((value, monthIndex) => {
      labels.push(`${year}-${monthIndex + 1}`);
      values.push(value);
    });
  });
  
  // Create chart
  const ctx = canvas.getContext('2d');
  
  // Destroy existing chart if it exists
  if (canvas.chart) {
    canvas.chart.destroy();
  }
  
  // Create new chart
  canvas.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: asset.name.split(' <')[0],
        data: values,
        borderColor: asset.color,
        backgroundColor: `${asset.color}20`,
        borderWidth: 2,
        fill: true,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            title: function(tooltipItems) {
              const label = tooltipItems[0].label.split('-');
              const year = label[0];
              const month = new Date(0, parseInt(label[1]) - 1).toLocaleString('default', { month: 'long' });
              return `${month} ${year}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            callback: function(value, index, values) {
              const label = this.getLabelForValue(value).split('-');
              // Only show year labels for January (month 1)
              if (label[1] === '1') {
                return label[0];
              }
              return '';
            },
            font: {
              size: 16,
              weight: 'bold'
            },
            color: '#666'
          }
        },
        y: {
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: {
              size: 12
            },
            color: '#666'
          }
        }
      }
    }
  });
}

// Initialize charts
function initializeCharts() {
  // Market sentiment charts
  renderMarketSentiment();
  
  // Market cap comparison
  renderMarketCapComparison();
}

// Render market sentiment indicators
function renderMarketSentiment() {
  const sentimentContainer = document.getElementById('market-sentiment');
  if (!sentimentContainer) return;
  
  const sentimentIndicators = sentimentContainer.querySelector('.sentiment-indicators');
  if (!sentimentIndicators) return;
  
  // Fear & Greed Index
  const fearGreedElement = document.createElement('div');
  fearGreedElement.className = 'indicator';
  fearGreedElement.innerHTML = `
    <div class="indicator-title">Fear & Greed Index</div>
    <div class="indicator-value" id="fear-greed">
      <div class="gauge">
        <div class="gauge-fill" style="width: 65%;"></div>
      </div>
      <div class="gauge-value">65 - Greed</div>
      <div class="indicator-change">+5 from yesterday</div>
    </div>
  `;
  sentimentIndicators.appendChild(fearGreedElement);
  
  // Bitcoin Dominance
  const dominanceElement = document.createElement('div');
  dominanceElement.className = 'indicator';
  dominanceElement.innerHTML = `
    <div class="indicator-title">Bitcoin Dominance</div>
    <div class="indicator-value" id="btc-dominance">
      <div class="gauge">
        <div class="gauge-fill" style="width: 52%; background: linear-gradient(to right, #f7931a, #f7931a);"></div>
      </div>
      <div class="gauge-value">52%</div>
      <div class="indicator-change">+1.2% from last week</div>
    </div>
  `;
  sentimentIndicators.appendChild(dominanceElement);
  
  // Total Market Cap
  const marketCapElement = document.createElement('div');
  marketCapElement.className = 'indicator';
  marketCapElement.innerHTML = `
    <div class="indicator-title">Total Market Cap</div>
    <div class="indicator-value" id="total-market-cap">
      <div class="gauge">
        <div class="gauge-fill" style="width: 45%; background: linear-gradient(to right, #2196F3, #2196F3);"></div>
      </div>
      <div class="gauge-value">$2.0T</div>
      <div class="indicator-change">+3.5% from last week</div>
    </div>
  `;
  sentimentIndicators.appendChild(marketCapElement);
  
  // Volatility
  const volatilityElement = document.createElement('div');
  volatilityElement.className = 'indicator';
  volatilityElement.innerHTML = `
    <div class="indicator-title">Volatility</div>
    <div class="indicator-value" id="volatility">
      <div class="gauge">
        <div class="gauge-fill" style="width: 38%; background: linear-gradient(to right, #4CAF50, #4CAF50);"></div>
      </div>
      <div class="gauge-value">Low (2.1%)</div>
      <div class="indicator-change negative">-0.5% from last week</div>
    </div>
  `;
  sentimentIndicators.appendChild(volatilityElement);
  
  // Exchange Inflows
  const inflowsElement = document.createElement('div');
  inflowsElement.className = 'indicator';
  inflowsElement.innerHTML = `
    <div class="indicator-title">Exchange Inflows</div>
    <div class="indicator-value" id="exchange-inflows">
      <div class="gauge">
        <div class="gauge-fill" style="width: 32%; background: linear-gradient(to right, #4CAF50, #4CAF50);"></div>
      </div>
      <div class="gauge-value">Low (12.5k BTC)</div>
      <div class="indicator-change negative">-8.3% from last week</div>
    </div>
  `;
  sentimentIndicators.appendChild(inflowsElement);
  
  // Futures Funding Rate
  const fundingRateElement = document.createElement('div');
  fundingRateElement.className = 'indicator';
  fundingRateElement.innerHTML = `
    <div class="indicator-title">Futures Funding Rate</div>
    <div class="indicator-value" id="funding-rate">
      <div class="gauge">
        <div class="gauge-fill" style="width: 58%; background: linear-gradient(to right, #FF9800, #FF9800);"></div>
      </div>
      <div class="gauge-value">Moderate (0.015%)</div>
      <div class="indicator-change">+0.002% from yesterday</div>
    </div>
  `;
  sentimentIndicators.appendChild(fundingRateElement);
}

// Render market cap comparison
function renderMarketCapComparison() {
  const marketCapContainer = document.getElementById('market-cap-comparison');
  if (!marketCapContainer) return;
  
  const marketCapVisual = marketCapContainer.querySelector('.market-cap-visual');
  if (!marketCapVisual) return;
  
  marketCapData.forEach(item => {
    const marketCapItem = document.createElement('div');
    marketCapItem.className = 'market-cap-item';
    
    marketCapItem.innerHTML = `
      <div class="market-cap-item-header">
        <div class="market-cap-item-name">${item.name}</div>
        <div class="market-cap-item-value">$${item.value.toFixed(1)}T</div>
      </div>
      <div class="market-cap-item-bar">
        <div class="market-cap-item-fill" style="width: ${item.percentage}%; background-color: ${item.color};">
          <span class="market-cap-item-percentage">${item.percentage.toFixed(1)}%</span>
        </div>
      </div>
    `;
    
    marketCapVisual.appendChild(marketCapItem);
  });
}

// Render scarcity metrics
function renderScarcityMetrics() {
  const scarcityContainer = document.getElementById('scarcity-metrics');
  if (!scarcityContainer) return;
  
  const scarcityGrid = scarcityContainer.querySelector('.scarcity-metrics-grid');
  if (!scarcityGrid) return;
  
  scarcityMetrics.forEach(metric => {
    const metricElement = document.createElement('div');
    metricElement.className = 'scarcity-metric';
    
    let metricContent = `
      <div class="scarcity-metric-title">${metric.title}</div>
      <div class="scarcity-metric-value">${metric.value}</div>
      <div class="scarcity-metric-description">${metric.description}</div>
    `;
    
    if (metric.comparison) {
      metricContent += `<div class="scarcity-comparison">`;
      metric.comparison.forEach(item => {
        metricContent += `<div class="scarcity-comparison-item ${item.name.toLowerCase()}">${item.name}: ${item.value}</div>`;
      });
      metricContent += `</div>`;
    }
    
    if (metric.title === 'Bitcoins Mined') {
      metricContent += `
        <div class="supply-progress">
          <div class="supply-progress-fill"></div>
          <div class="supply-progress-text">${metric.percentage}% (${metric.remaining} remaining)</div>
        </div>
      `;
    }
    
    if (metric.title === 'Next Halving') {
      metricContent += `
        <div class="days-remaining">${metric.daysRemaining} days remaining</div>
      `;
    }
    
    metricElement.innerHTML = metricContent;
    scarcityGrid.appendChild(metricElement);
  });
}

// Render upcoming events
function renderUpcomingEvents() {
  const calendarContainer = document.getElementById('economic-calendar');
  if (!calendarContainer) return;
  
  const eventsGrid = document.createElement('div');
  eventsGrid.className = 'events-grid';
  
  upcomingEvents.forEach(event => {
    const eventItem = document.createElement('div');
    eventItem.className = `event-item ${event.impact}`;
    
    eventItem.innerHTML = `
      <div class="event-date">
        ${event.date}
        <div class="event-impact">
          <div class="impact-dot"></div>
          <div class="impact-dot"></div>
          <div class="impact-dot"></div>
        </div>
      </div>
      <div class="event-title">${event.title}</div>
      <div class="event-description">${event.description}</div>
    `;
    
    eventsGrid.appendChild(eventItem);
  });
  
  const calendarContent = calendarContainer.querySelector('.calendar-container');
  if (calendarContent) {
    calendarContent.innerHTML = '';
    calendarContent.appendChild(eventsGrid);
  }
}

// Render news
function renderNews() {
  const newsContainer = document.getElementById('news-summary');
  if (!newsContainer) return;
  
  const newsContent = newsContainer.querySelector('#news-content');
  if (!newsContent) return;
  
  const newsGrid = document.createElement('div');
  newsGrid.className = 'news-grid';
  
  newsData.forEach(news => {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item';
    
    newsItem.innerHTML = `
      <div class="news-content">
        <div class="news-source">${news.source}</div>
        <div class="news-title">${news.title}</div>
        <div class="news-description">${news.description}</div>
        <div class="news-date">${news.date}</div>
      </div>
    `;
    
    newsGrid.appendChild(newsItem);
  });
  
  newsContent.innerHTML = '';
  newsContent.appendChild(newsGrid);
}

// Rotate Satoshi quotes
function rotateSatoshiQuote() {
  const quoteElement = document.getElementById('satoshi-quote');
  if (!quoteElement) return;
  
  const randomIndex = Math.floor(Math.random() * satoshiQuotes.length);
  quoteElement.textContent = satoshiQuotes[randomIndex];
}
