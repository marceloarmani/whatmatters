const assets = [
  { name: "Bitcoin", symbol: "BTC", price: "$69,420.69", change: "+2.4%", color: "#f7931a", api: "coindesk" },
  { name: "Gold", symbol: "XAU", price: "$2,512.35", change: "+0.8%", color: "#d4af37", api: "metals" },
  { name: "Silver", symbol: "XAG", price: "$30.75", change: "+1.2%", color: "#c0c0c0", api: "metals" },
  { name: "10-Year Treasury Yield", symbol: "10Y", price: "4.32%", change: "-0.05%", color: "#6a5acd", api: "treasury", tooltip: "Reveals the cost of government debt financing and signals market expectations for inflation. Rising yields expose the unsustainable nature of endless deficit spending and currency debasement." },
  { name: "Dollar Index", symbol: "DXY", price: "103.42", change: "-0.3%", color: "#20b2aa", api: "forex", tooltip: "Measures the strength of the US dollar against a basket of major foreign currencies. Declining values reflect the erosion of purchasing power through monetary expansion." }
];

// Historical data for charts (5 years)
const historicalData = {
  "Bitcoin": [
    { year: 2020, data: [7200, 8300, 9450, 8700, 9800, 9200, 11300, 11800, 10500, 13800, 17500, 29000] },
    { year: 2021, data: [33000, 45000, 58000, 56000, 37000, 35000, 42000, 47000, 43000, 61000, 58000, 46000] },
    { year: 2022, data: [38000, 44000, 40000, 39000, 31000, 20000, 23000, 24000, 19000, 20500, 17000, 16500] },
    { year: 2023, data: [16800, 23500, 28000, 30000, 27000, 30500, 29800, 28000, 26500, 34000, 37000, 42000] },
    { year: 2024, data: [45000, 52000, 61000, 64000, 59000, 62000, 65000, 67000, 66000, 68000, 69000, 69420] },
    { year: 2025, data: [67500, 69800, 72000, 70500, 69420] }
  ],
  "Gold": [
    { year: 2020, data: [1520, 1585, 1620, 1680, 1730, 1780, 1960, 1920, 1880, 1900, 1860, 1895] },
    { year: 2021, data: [1850, 1810, 1730, 1770, 1900, 1780, 1810, 1815, 1760, 1780, 1820, 1805] },
    { year: 2022, data: [1800, 1870, 1920, 1880, 1840, 1810, 1760, 1770, 1670, 1650, 1750, 1820] },
    { year: 2023, data: [1910, 1830, 1970, 1990, 1960, 1920, 1970, 2010, 1920, 1980, 2040, 2060] },
    { year: 2024, data: [2050, 2120, 2180, 2220, 2260, 2290, 2310, 2330, 2300, 2420, 2480, 2512] },
    { year: 2025, data: [2360, 2380, 2410, 2470, 2512] }
  ],
  "Silver": [
    { year: 2020, data: [17.8, 18.5, 14.6, 15.7, 17.9, 18.2, 24.5, 27.4, 24.2, 24.1, 23.8, 26.3] },
    { year: 2021, data: [27.0, 26.7, 25.0, 26.1, 27.4, 26.0, 25.5, 24.0, 22.5, 23.9, 23.1, 22.5] },
    { year: 2022, data: [22.4, 24.3, 24.9, 23.0, 21.6, 20.3, 19.2, 19.5, 18.8, 19.5, 21.5, 23.9] },
    { year: 2023, data: [24.1, 21.7, 24.2, 25.0, 23.5, 22.8, 24.5, 24.8, 23.0, 22.7, 24.5, 24.3] },
    { year: 2024, data: [23.8, 25.6, 26.9, 27.5, 28.2, 28.9, 29.3, 29.8, 30.2, 30.5, 30.8, 30.75] },
    { year: 2025, data: [30.9, 31.2, 31.5, 31.0, 30.75] }
  ],
  "10-Year Treasury Yield": [
    { year: 2020, data: [1.88, 1.50, 0.70, 0.66, 0.65, 0.68, 0.55, 0.72, 0.68, 0.85, 0.84, 0.93] },
    { year: 2021, data: [1.07, 1.44, 1.74, 1.65, 1.58, 1.45, 1.24, 1.30, 1.52, 1.55, 1.44, 1.51] },
    { year: 2022, data: [1.78, 1.83, 2.32, 2.89, 2.84, 3.01, 2.65, 3.19, 3.83, 4.05, 3.68, 3.88] },
    { year: 2023, data: [3.51, 3.92, 3.47, 3.45, 3.64, 3.84, 3.96, 4.10, 4.57, 4.89, 4.47, 3.88] },
    { year: 2024, data: [4.05, 4.25, 4.35, 4.50, 4.60, 4.55, 4.48, 4.42, 4.38, 4.35, 4.33, 4.32] },
    { year: 2025, data: [4.30, 4.28, 4.35, 4.33, 4.32] }
  ],
  "Dollar Index": [
    { year: 2020, data: [97.3, 98.1, 99.0, 99.5, 98.3, 97.4, 93.3, 92.1, 93.9, 94.0, 92.3, 89.9] },
    { year: 2021, data: [90.5, 90.9, 93.2, 91.3, 90.0, 92.4, 92.1, 92.5, 94.2, 94.1, 95.9, 95.7] },
    { year: 2022, data: [96.5, 96.7, 98.3, 102.9, 101.8, 104.7, 106.1, 108.7, 112.1, 111.5, 106.7, 103.5] },
    { year: 2023, data: [102.1, 104.4, 102.5, 101.9, 104.2, 102.6, 101.9, 104.1, 106.1, 106.6, 103.4, 101.9] },
    { year: 2024, data: [103.4, 104.1, 104.5, 105.2, 104.8, 104.3, 103.9, 103.7, 103.5, 103.4, 103.5, 103.42] },
    { year: 2025, data: [103.6, 103.8, 103.5, 103.4, 103.42] }
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

// Reliable news sources
const newsSources = [
  { name: "Bloomberg", url: "https://www.bloomberg.com/" },
  { name: "Wall Street Journal", url: "https://www.wsj.com/" },
  { name: "Financial Times", url: "https://www.ft.com/" },
  { name: "Reuters", url: "https://www.reuters.com/" },
  { name: "The Economist", url: "https://www.economist.com/" },
  { name: "Bitcoin Magazine", url: "https://bitcoinmagazine.com/" },
  { name: "Cointelegraph", url: "https://cointelegraph.com/" },
  { name: "Jesse Myers", url: "https://www.onceinaspecies.com/" }
];

// Site initialization
document.addEventListener('DOMContentLoaded', function() {
  // Render main indicators
  renderQuotes();
  
  // Set up click events for indicators
  setupQuoteClickEvents();
  
  // Render market sentiment
  renderMarketSentiment();
  
  // Render global market capitalization
  renderMarketCap();
  
  // Render scarcity metrics
  renderScarcityMetrics();
  
  // Render upcoming events
  renderUpcomingEvents();
  
  // Fetch and render news
  fetchAndRenderNews();
  
  // Render Satoshi quote
  renderSatoshiQuote();
  
  // Set up sources toggle
  setupSourcesToggle();
  
  // Set up theme toggle
  setupThemeToggle();
});

// Function to render main indicators
function renderQuotes() {
  const quotesContainer = document.getElementById('quotes');
  quotesContainer.innerHTML = '';
  
  assets.forEach((asset, index) => {
    const quoteWrapper = document.createElement('div');
    quoteWrapper.className = 'quote-wrapper';
    quoteWrapper.id = `quote-wrapper-${index}`;
    
    const quoteElement = document.createElement('div');
    quoteElement.className = 'quote';
    quoteElement.dataset.asset = asset.name;
    quoteElement.dataset.index = index;
    
    // Add tooltip for indicators with explanations
    let tooltipHtml = '';
    if (asset.tooltip) {
      tooltipHtml = `<span class="index-tooltip">ⓘ<span class="tooltip-text">${asset.tooltip}</span></span>`;
    }
    
    quoteElement.innerHTML = `
      <div class="quote-left">
        <strong>${asset.name} ${tooltipHtml}</strong>
      </div>
      <div class="quote-right">
        <span class="quote-price">${asset.price}</span>
        <span class="quote-change" style="color: ${asset.change.includes('-') ? '#f44336' : '#4caf50'}">${asset.change}</span>
      </div>
    `;
    
    // Create individual chart area for this asset
    const chartArea = document.createElement('div');
    chartArea.className = 'asset-chart-area';
    chartArea.id = `chart-area-${index}`;
    
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    
    const canvas = document.createElement('canvas');
    canvas.id = `chart-${index}`;
    
    chartContainer.appendChild(canvas);
    chartArea.appendChild(chartContainer);
    
    quoteWrapper.appendChild(quoteElement);
    quoteWrapper.appendChild(chartArea);
    quotesContainer.appendChild(quoteWrapper);
  });
}

// Function to set up click events for indicators
function setupQuoteClickEvents() {
  const quotes = document.querySelectorAll('.quote');
  const charts = {};
  
  quotes.forEach(quote => {
    quote.addEventListener('click', function() {
      const assetName = this.dataset.asset;
      const assetIndex = parseInt(this.dataset.index);
      const asset = assets[assetIndex];
      const chartArea = document.getElementById(`chart-area-${assetIndex}`);
      
      // Toggle chart visibility
      if (this.classList.contains('active')) {
        this.classList.remove('active');
        chartArea.classList.remove('visible');
        if (charts[assetIndex]) {
          charts[assetIndex].destroy();
          charts[assetIndex] = null;
        }
      } else {
        // Close any other open charts
        quotes.forEach((q, i) => {
          if (q !== this && q.classList.contains('active')) {
            q.classList.remove('active');
            document.getElementById(`chart-area-${i}`).classList.remove('visible');
            if (charts[i]) {
              charts[i].destroy();
              charts[i] = null;
            }
          }
        });
        
        // Open this chart
        this.classList.add('active');
        chartArea.classList.add('visible');
        
        // Add close button if it doesn't exist
        const chartContainer = chartArea.querySelector('.chart-container');
        if (!chartContainer.querySelector('.chart-close')) {
          const closeButton = document.createElement('button');
          closeButton.className = 'chart-close';
          closeButton.innerHTML = '✕';
          closeButton.addEventListener('click', function(e) {
            e.stopPropagation();
            quote.classList.remove('active');
            chartArea.classList.remove('visible');
            if (charts[assetIndex]) {
              charts[assetIndex].destroy();
              charts[assetIndex] = null;
            }
          });
          chartContainer.appendChild(closeButton);
        }
        
        // Render chart
        charts[assetIndex] = renderChart(assetName, asset.color, `chart-${assetIndex}`);
      }
    });
  });
}

// Function to render chart for an asset
function renderChart(assetName, color, canvasId) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  // Get historical data for the asset
  const assetData = historicalData[assetName];
  if (!assetData) return;
  
  // Prepare data for the chart
  const labels = [];
  const data = [];
  
  // Combine all data from the last 5 years
  assetData.forEach(yearData => {
    yearData.data.forEach((value, monthIndex) => {
      labels.push(`${monthIndex + 1}/${yearData.year}`);
      data.push(value);
    });
  });
  
  // Create the chart
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: assetName,
        data: data,
        borderColor: color,
        backgroundColor: `${color}20`,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: {
              family: "'Segoe UI', sans-serif",
              size: 12
            },
            color: '#666'
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: '#fff',
          titleColor: '#333',
          bodyColor: '#666',
          borderColor: '#ddd',
          borderWidth: 1,
          titleFont: {
            family: "'Segoe UI', sans-serif",
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            family: "'Segoe UI', sans-serif",
            size: 13
          },
          padding: 10,
          boxPadding: 5,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                if (assetName === "Bitcoin") {
                  label += '$' + context.parsed.y.toLocaleString();
                } else if (assetName === "Gold") {
                  label += '$' + context.parsed.y.toLocaleString() + '/oz';
                } else if (assetName === "Silver") {
                  label += '$' + context.parsed.y.toLocaleString() + '/oz';
                } else if (assetName === "10-Year Treasury Yield") {
                  label += context.parsed.y.toFixed(2) + '%';
                } else if (assetName === "Dollar Index") {
                  label += context.parsed.y.toFixed(2);
                } else {
                  label += context.parsed.y.toLocaleString();
                }
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: (context) => {
              // Show vertical grid lines for January of each year
              const label = context.tick.label;
              if (label && label.split('/')[0] === '1') {
                return '#e0e0e0';
              }
              return 'transparent';
            },
            drawBorder: true,
            drawOnChartArea: true,
            drawTicks: true
          },
          ticks: {
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 12,
            callback: function(value, index, values) {
              // Show only years
              const label = this.getLabelForValue(value);
              if (label) {
                const parts = label.split('/');
                if (parts.length === 2) {
                  // Only show the year part for January (month 1)
                  if (parts[0] === '1') {
                    return parts[1]; // Return just the year
                  }
                }
              }
              return ''; // Return empty string for all other ticks
            },
            font: {
              weight: 'bold'
            }
          }
        },
        y: {
          grid: {
            color: '#f0f0f0',
            drawBorder: true,
            drawOnChartArea: true
          },
          ticks: {
            callback: function(value, index, values) {
              if (assetName === "Bitcoin") {
                return '$' + value.toLocaleString();
              } else if (assetName === "Gold") {
                return '$' + value.toLocaleString();
              } else if (assetName === "Silver") {
                return '$' + value.toFixed(1);
              } else if (assetName === "10-Year Treasury Yield") {
                return value.toFixed(2) + '%';
              } else if (assetName === "Dollar Index") {
                return value.toFixed(1);
              }
              return value;
            }
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      elements: {
        line: {
          tension: 0.4
        }
      }
    }
  });
  
  return chart;
}

// Function to render market sentiment
function renderMarketSentiment() {
  // Already in HTML, just update values if needed
}

// Function to render global market capitalization
function renderMarketCap() {
  const marketCapVisual = document.getElementById('market-cap-treemap');
  marketCapVisual.innerHTML = '';
  
  // Sort by value (largest to smallest)
  const sortedData = [...marketCapData].sort((a, b) => b.value - a.value);
  
  // Calculate total
  const total = sortedData.reduce((sum, item) => sum + item.value, 0);
  
  // Update total in HTML
  document.getElementById('total-market-cap').textContent = `$${total.toFixed(1)}T`;
  
  // Create bar visualization
  sortedData.forEach(item => {
    const marketCapItem = document.createElement('div');
    marketCapItem.className = 'market-cap-item';
    
    const marketCapItemHeader = document.createElement('div');
    marketCapItemHeader.className = 'market-cap-item-header';
    
    const marketCapItemName = document.createElement('div');
    marketCapItemName.className = 'market-cap-item-name';
    marketCapItemName.textContent = item.name;
    
    const marketCapItemValue = document.createElement('div');
    marketCapItemValue.className = 'market-cap-item-value';
    marketCapItemValue.textContent = `$${item.value.toFixed(1)}T`;
    
    marketCapItemHeader.appendChild(marketCapItemName);
    marketCapItemHeader.appendChild(marketCapItemValue);
    
    const marketCapItemBar = document.createElement('div');
    marketCapItemBar.className = 'market-cap-item-bar';
    
    const marketCapItemFill = document.createElement('div');
    marketCapItemFill.className = 'market-cap-item-fill';
    marketCapItemFill.style.width = `${item.percentage}%`;
    marketCapItemFill.style.backgroundColor = item.color;
    
    const marketCapItemPercentage = document.createElement('div');
    marketCapItemPercentage.className = 'market-cap-item-percentage';
    marketCapItemPercentage.textContent = `${item.percentage.toFixed(1)}%`;
    
    marketCapItemBar.appendChild(marketCapItemFill);
    marketCapItemBar.appendChild(marketCapItemPercentage);
    
    marketCapItem.appendChild(marketCapItemHeader);
    marketCapItem.appendChild(marketCapItemBar);
    
    marketCapVisual.appendChild(marketCapItem);
  });
}

// Function to render scarcity metrics
function renderScarcityMetrics() {
  const scarcityContainer = document.querySelector('.scarcity-metrics-grid');
  scarcityContainer.innerHTML = '';
  
  scarcityMetrics.forEach(metric => {
    const metricElement = document.createElement('div');
    metricElement.className = 'scarcity-metric';
    
    let metricContent = `
      <div class="scarcity-metric-title">${metric.title}</div>
      <div class="scarcity-metric-value">${metric.value}</div>
      <div class="scarcity-metric-description">${metric.description}</div>
    `;
    
    // Add specific visualization for bitcoins mined
    if (metric.title === "Bitcoins Mined") {
      metricContent += `
        <div class="supply-progress">
          <div class="supply-progress-fill" style="width: ${metric.percentage}%"></div>
          <div class="supply-progress-text">${metric.percentage.toFixed(2)}% (${metric.remaining} remaining)</div>
        </div>
      `;
    } else if (metric.title === "Next Halving") {
      // Calculate days remaining until next halving
      const today = new Date();
      const daysRemaining = metric.daysRemaining;
      
      metricContent += `
        <div class="days-remaining">${daysRemaining} days remaining</div>
      `;
    } else if (metric.comparison) {
      // Add comparison for other metrics
      metricContent += `<div class="scarcity-comparison">`;
      
      metric.comparison.forEach(item => {
        metricContent += `
          <div class="scarcity-comparison-item ${item.name.toLowerCase()}">
            ${item.name}: ${item.value}
          </div>
        `;
      });
      
      metricContent += `</div>`;
    }
    
    metricElement.innerHTML = metricContent;
    scarcityContainer.appendChild(metricElement);
  });
}

// Function to render upcoming events
function renderUpcomingEvents() {
  const eventsContainer = document.getElementById('events-container');
  eventsContainer.innerHTML = '';
  
  // Add impact legend at the top
  const impactLegendContainer = document.createElement('div');
  impactLegendContainer.className = 'impact-legend-container';
  impactLegendContainer.innerHTML = `
    <div class="impact-legend-title">Impact indicator: </div>
    <div class="impact-legend-item">
      <div class="impact-dots high">
        <span class="impact-dot"></span>
        <span class="impact-dot"></span>
        <span class="impact-dot"></span>
      </div>
      <span>High</span>
    </div>
    <div class="impact-legend-item">
      <div class="impact-dots medium">
        <span class="impact-dot"></span>
        <span class="impact-dot"></span>
        <span class="impact-dot"></span>
      </div>
      <span>Medium</span>
    </div>
    <div class="impact-legend-item">
      <div class="impact-dots low">
        <span class="impact-dot"></span>
        <span class="impact-dot"></span>
        <span class="impact-dot"></span>
      </div>
      <span>Low</span>
    </div>
  `;
  
  eventsContainer.appendChild(impactLegendContainer);
  
  // Show only the first 4 events
  const eventsToShow = upcomingEvents.slice(0, 4);
  
  // Create events grid
  const eventsGrid = document.createElement('div');
  eventsGrid.className = 'events-grid';
  
  eventsToShow.forEach(event => {
    const eventElement = document.createElement('div');
    eventElement.className = `event-item ${event.impact}`;
    
    eventElement.innerHTML = `
      <div class="event-date">
        ${event.date}
        <div class="event-impact">
          <span class="impact-dot"></span>
          <span class="impact-dot"></span>
          <span class="impact-dot"></span>
          <span class="impact-legend">Market impact</span>
        </div>
      </div>
      <div class="event-title">${event.title}</div>
      <div class="event-description">${event.description}</div>
    `;
    
    eventsGrid.appendChild(eventElement);
  });
  
  eventsContainer.appendChild(eventsGrid);
}

// Function to fetch and render news
function fetchAndRenderNews() {
  const newsContent = document.getElementById('news-content');
  
  // Simulate news fetch from Cointelegraph (in production, this would be an API call)
  setTimeout(() => {
    const mockNews = [
      {
        title: "Bitcoin Surpasses $70,000 for the First Time in History",
        description: "The world's leading cryptocurrency reached a new all-time high driven by strong institutional demand.",
        source: "Cointelegraph",
        date: "May 18, 2025",
        image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      },
      {
        title: "Fed Maintains Interest Rate, Signals Possible Cut in 2025",
        description: "The US Federal Reserve kept its benchmark interest rate unchanged but indicated it may begin cutting rates later this year.",
        source: "Cointelegraph",
        date: "May 17, 2025",
        image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      },
      {
        title: "Bitcoin Adoption Among Fortune 500 Companies Grows 150% in One Year",
        description: "Report shows significant increase in the number of large corporations that have added Bitcoin to their balance sheets.",
        source: "Cointelegraph",
        date: "May 16, 2025",
        image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      },
      {
        title: "Global Inflation Shows Signs of Slowing After 3 Years of Increases",
        description: "Economic data from various advanced economies indicate that inflationary pressures are beginning to ease.",
        source: "Cointelegraph",
        date: "May 15, 2025",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      },
      {
        title: "Bitcoin Scarcity: Less Than 1.7 Million Units Still to Be Mined",
        description: "With over 92% of the total supply already in circulation, experts point to increasing scarcity of the digital asset.",
        source: "Cointelegraph",
        date: "May 14, 2025",
        image: "https://images.unsplash.com/photo-1591994843349-f415893b3a6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      },
      {
        title: "Swiss Central Bank Adds Bitcoin to Official Reserves",
        description: "In a historic move, Switzerland becomes the first European country to officially include Bitcoin in its national reserves.",
        source: "Cointelegraph",
        date: "May 13, 2025",
        image: "https://images.unsplash.com/photo-1561414927-6d86591d0c4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      }
    ];
    
    // Create news grid
    const newsGrid = document.createElement('div');
    newsGrid.className = 'news-grid';
    
    mockNews.forEach(news => {
      const newsItem = document.createElement('div');
      newsItem.className = 'news-item';
      
      newsItem.innerHTML = `
        <img src="${news.image}" alt="${news.title}" class="news-image">
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
  }, 1000);
}

// Function to render Satoshi quote
function renderSatoshiQuote() {
  const quoteElement = document.getElementById('satoshi-quote');
  
  // Use current date as seed to select a quote
  // This ensures the quote changes each day but remains the same throughout the day
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const quoteIndex = seed % satoshiQuotes.length;
  
  quoteElement.textContent = satoshiQuotes[quoteIndex];
}

// Function to set up sources toggle
function setupSourcesToggle() {
  const sourcesToggle = document.getElementById('sources-toggle');
  const marketCapSources = document.getElementById('market-cap-sources');
  
  sourcesToggle.addEventListener('click', function() {
    if (marketCapSources.style.display === 'block') {
      marketCapSources.style.display = 'none';
      sourcesToggle.textContent = 'Show sources';
    } else {
      marketCapSources.style.display = 'block';
      sourcesToggle.textContent = 'Hide sources';
    }
  });
}

// Function to set up theme toggle
function setupThemeToggle() {
  // Check if theme is already saved
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
  
  // Create theme toggle button if it doesn't exist
  if (!document.getElementById('theme-toggle')) {
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
    
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-theme');
      
      if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '☀️';
      } else {
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '🌙';
      }
    });
    
    document.body.appendChild(themeToggle);
  }
}

// Function to set up periodic updates
function setupPeriodicUpdates() {
  // Update every 5 minutes
  setInterval(() => {
    // Update asset prices
    updateAssetPrices();
    
    // Update market sentiment
    updateMarketSentiment();
    
    // Update news
    fetchAndRenderNews();
  }, 5 * 60 * 1000);
}

// Function to update asset prices
function updateAssetPrices() {
  // In production, this would be an API call to get updated prices
  // Here we're just simulating an update
  
  // Re-render quotes
  renderQuotes();
}

// Function to update market sentiment
function updateMarketSentiment() {
  // In production, this would be an API call to get updated data
  // Here we're just simulating an update
  
  // Update values in DOM
  // ...
}

// Start periodic updates
setupPeriodicUpdates();
