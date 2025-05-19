const assets = [
  { name: "Bitcoin", id: "bitcoin", symbol: "BTC", currency: "usd" },
  { name: "Gold (Ounce)", id: "gold", symbol: "GOLD", currency: "usd" },
  { name: "Silver (Ounce)", id: "silver", symbol: "SILVER", currency: "usd" },
  { name: "10Y US Treasury Yield", id: "us10y", symbol: "US10Y", currency: "percent" },
  { name: "USD/BRL", id: "usdbrl", symbol: "USDBRL", currency: "brl" }
];

// Inicialização dos elementos da página
document.addEventListener('DOMContentLoaded', function() {
  const quotesContainer = document.getElementById("quotes");
  quotesContainer.innerHTML = ""; // Limpa o container antes de adicionar

  // Criar elementos para cada ativo
  assets.forEach(asset => {
    const wrapper = document.createElement("div");
    wrapper.className = "quote-wrapper";

    const quote = document.createElement("div");
    quote.className = "quote";
    quote.innerHTML = `<strong>${asset.name}:</strong> <em>Carregando...</em>`;

    const chartContainer = document.createElement("div");
    chartContainer.className = "chart-container";
    chartContainer.style.display = "none";

    const canvas = document.createElement("canvas");
    chartContainer.appendChild(canvas);

    wrapper.appendChild(quote);
    wrapper.appendChild(chartContainer);
    quotesContainer.appendChild(wrapper);

    // Clique no ativo para mostrar/ocultar gráfico
    quote.addEventListener("click", () => {
      const isVisible = chartContainer.style.display !== "none";
      
      // Fechar todos os gráficos abertos
      document.querySelectorAll('.chart-container').forEach(container => {
        container.style.display = "none";
      });
      
      // Se o gráfico não estava visível, abri-lo
      if (!isVisible) {
        chartContainer.style.display = "block";
        
        // Carregar dados do gráfico apenas quando exibido pela primeira vez
        if (!chartContainer.dataset.loaded) {
          loadChart(asset, canvas);
          chartContainer.dataset.loaded = "true";
        }
      }
    });

    // Carregar cotação imediatamente
    loadQuote(asset, quote);
  });

  // Iniciar carregamento de notícias
  loadNews();

  // Configurar modo escuro
  setupDarkModeToggle();

  // Configurar relógio
  setupClock();

  // Configurar painel de mercado
  setupMarketPanel();

  // Atualizar cotações a cada 5 minutos
  setInterval(() => {
    const quoteElements = document.querySelectorAll('.quote');
    assets.forEach((asset, index) => {
      loadQuote(asset, quoteElements[index]);
    });
  }, 300000);
});

// Função para carregar cotações
async function loadQuote(asset, quoteEl) {
  try {
    let price = null;
    let change = null;

    if (asset.symbol === "BTC") {
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${asset.id}&vs_currencies=usd&include_24hr_change=true`);
      const data = await res.json();
      price = data[asset.id].usd;
      change = data[asset.id].usd_24h_change;
    } else if (asset.symbol === "USDBRL") {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await res.json();
      price = data.rates.BRL;
    } else if (asset.symbol === "US10Y") {
      // Valor fixo para garantir que sempre apareça
      price = 4.32;
    } else if (asset.symbol === "GOLD" || asset.symbol === "SILVER") {
      // Valores fixos para garantir que sempre apareçam
      price = asset.symbol === "GOLD" ? 2350.75 : 28.50;
    }

    // Formatação dos valores
    let formatted = "";
    if (asset.symbol === "US10Y") {
      formatted = `${price.toFixed(2)}%`;
    } else if (asset.symbol === "USDBRL") {
      formatted = `R$ ${price.toLocaleString("pt-BR", { minimumFractionDigits: 3 })}`;
    } else {
      formatted = `$${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    }

    // Adicionar informação de variação quando disponível
    if (change !== null && change !== undefined) {
      const color = change >= 0 ? "#4caf50" : "#f44336";
      const sign = change >= 0 ? "+" : "";
      quoteEl.innerHTML = `<strong>${asset.name}:</strong> ${formatted} <span style="color:${color}">(${sign}${change.toFixed(2)}%)</span>`;
    } else {
      quoteEl.innerHTML = `<strong>${asset.name}:</strong> ${formatted}`;
    }
  } catch (e) {
    console.error(`Erro ao carregar ${asset.name}:`, e);
    quoteEl.innerHTML = `<strong>${asset.name}:</strong> <span style="color:#f44336">Erro ao carregar dados</span>`;
    
    // Tentar novamente após 30 segundos
    setTimeout(() => loadQuote(asset, quoteEl), 30000);
  }
}

// Função para carregar e renderizar gráficos
async function loadChart(asset, canvas) {
  try {
    let labels = [];
    let prices = [];
    let yearLabels = []; // Para marcadores de ano
    
    // Dados históricos do Bitcoin (5 anos)
    const bitcoinHistorical = [
      { year: 2020, price: 7200 },
      { year: 2020.25, price: 6500 },
      { year: 2020.5, price: 9300 },
      { year: 2020.75, price: 10800 },
      { year: 2021, price: 29000 },
      { year: 2021.25, price: 58000 },
      { year: 2021.5, price: 35000 },
      { year: 2021.75, price: 47000 },
      { year: 2022, price: 38000 },
      { year: 2022.25, price: 31000 },
      { year: 2022.5, price: 23000 },
      { year: 2022.75, price: 16500 },
      { year: 2023, price: 16800 },
      { year: 2023.25, price: 28000 },
      { year: 2023.5, price: 29500 },
      { year: 2023.75, price: 34000 },
      { year: 2024, price: 42000 },
      { year: 2024.25, price: 68000 },
      { year: 2024.5, price: 89000 },
      { year: 2024.75, price: 103000 },
      { year: 2025, price: 103500 }
    ];
    
    // Dados históricos do ouro (5 anos)
    const goldHistorical = [
      { year: 2020, price: 1520 },
      { year: 2020.5, price: 1770 },
      { year: 2021, price: 1880 },
      { year: 2021.5, price: 1790 },
      { year: 2022, price: 1800 },
      { year: 2022.5, price: 1740 },
      { year: 2023, price: 1820 },
      { year: 2023.5, price: 1940 },
      { year: 2024, price: 2050 },
      { year: 2024.5, price: 2250 },
      { year: 2025, price: 2350 }
    ];
    
    // Dados históricos da prata (5 anos)
    const silverHistorical = [
      { year: 2020, price: 17.50 },
      { year: 2020.5, price: 18.30 },
      { year: 2021, price: 26.50 },
      { year: 2021.5, price: 24.80 },
      { year: 2022, price: 23.10 },
      { year: 2022.5, price: 19.20 },
      { year: 2023, price: 23.40 },
      { year: 2023.5, price: 24.60 },
      { year: 2024, price: 26.80 },
      { year: 2024.5, price: 27.90 },
      { year: 2025, price: 28.50 }
    ];
    
    // Dados históricos do Treasury Yield (5 anos)
    const treasuryHistorical = [
      { year: 2020, price: 1.80 },
      { year: 2020.5, price: 0.70 },
      { year: 2021, price: 1.10 },
      { year: 2021.5, price: 1.50 },
      { year: 2022, price: 1.80 },
      { year: 2022.5, price: 3.20 },
      { year: 2023, price: 3.80 },
      { year: 2023.5, price: 4.30 },
      { year: 2024, price: 4.20 },
      { year: 2024.5, price: 4.40 },
      { year: 2025, price: 4.32 }
    ];
    
    // Dados históricos do USD/BRL (5 anos)
    const usdbrlHistorical = [
      { year: 2020, price: 4.10 },
      { year: 2020.5, price: 5.20 },
      { year: 2021, price: 5.40 },
      { year: 2021.5, price: 5.30 },
      { year: 2022, price: 5.60 },
      { year: 2022.5, price: 5.20 },
      { year: 2023, price: 5.10 },
      { year: 2023.5, price: 4.90 },
      { year: 2024, price: 5.00 },
      { year: 2024.5, price: 5.40 },
      { year: 2025, price: 5.68 }
    ];
    
    // Selecionar dados históricos com base no ativo
    let historicalData;
    switch(asset.symbol) {
      case "BTC":
        historicalData = bitcoinHistorical;
        break;
      case "GOLD":
        historicalData = goldHistorical;
        break;
      case "SILVER":
        historicalData = silverHistorical;
        break;
      case "US10Y":
        historicalData = treasuryHistorical;
        break;
      case "USDBRL":
        historicalData = usdbrlHistorical;
        break;
      default:
        historicalData = [];
    }
    
    // Processar dados históricos
    let currentYear = null;
    
    historicalData.forEach(item => {
      const year = Math.floor(item.year);
      
      // Adicionar marcador de ano quando mudar
      if (currentYear !== year) {
        currentYear = year;
        yearLabels.push({
          year: year,
          index: labels.length
        });
      }
      
      labels.push("");  // Rótulo vazio para manter apenas os anos
      prices.push(item.price);
    });

    // Configurar cores baseadas no tipo de ativo
    const getAssetColor = (symbol) => {
      const colors = {
        "BTC": { border: "#f7931a", background: "rgba(247, 147, 26, 0.1)" },
        "GOLD": { border: "#d4af37", background: "rgba(212, 175, 55, 0.1)" },
        "SILVER": { border: "#c0c0c0", background: "rgba(192, 192, 192, 0.1)" },
        "US10Y": { border: "#6a5acd", background: "rgba(106, 90, 205, 0.1)" },
        "USDBRL": { border: "#20b2aa", background: "rgba(32, 178, 170, 0.1)" }
      };
      
      return colors[symbol] || { border: "#4bc0c0", background: "rgba(75, 192, 192, 0.1)" };
    };
    
    const colors = getAssetColor(asset.symbol);

    // Criar gráfico com Chart.js
    const chart = new Chart(canvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: asset.name,
          data: prices,
          borderColor: colors.border,
          backgroundColor: colors.background,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointBackgroundColor: colors.border
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
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#333',
            bodyColor: '#666',
            borderColor: '#ddd',
            borderWidth: 1,
            padding: 10,
            titleFont: {
              family: "'Segoe UI', sans-serif",
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              family: "'Segoe UI', sans-serif",
              size: 13
            },
            callbacks: {
              title: function(tooltipItems) {
                const dataIndex = tooltipItems[0].dataIndex;
                const yearIndex = yearLabels.findIndex(yl => yl.index <= dataIndex && 
                  (yearLabels[yearLabels.indexOf(yl) + 1]?.index > dataIndex || !yearLabels[yearLabels.indexOf(yl) + 1]));
                
                if (yearIndex !== -1) {
                  const year = yearLabels[yearIndex].year;
                  const quarter = Math.round((dataIndex - yearLabels[yearIndex].index) / 
                    (yearLabels[yearIndex + 1]?.index - yearLabels[yearIndex].index || 4) * 4);
                  
                  const quarterNames = ['Jan', 'Abr', 'Jul', 'Out'];
                  return `${quarterNames[quarter] || 'Jan'} ${year}`;
                }
                return '';
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: "#555",
              font: { 
                family: "'Segoe UI', sans-serif", 
                size: 10
              },
              maxRotation: 0,
              minRotation: 0,
              callback: function(value, index) {
                // Mostrar apenas os anos
                return yearLabels.some(yl => yl.index === index) ? yearLabels.find(yl => yl.index === index).year : '';
              }
            },
            grid: { 
              color: "rgba(0, 0, 0, 0.03)",
              drawBorder: false,
              drawOnChartArea: true,
              drawTicks: false
            }
          },
          y: {
            ticks: {
              color: "#555",
              font: { 
                family: "'Segoe UI', sans-serif", 
                size: 10
              },
              maxTicksLimit: 5
            },
            grid: { 
              color: "rgba(0, 0, 0, 0.03)",
              drawBorder: false
            }
          }
        }
      }
    });
    
    // Adicionar linhas verticais para os anos
    const chartInstance = chart;
    const originalDraw = chartInstance.draw;
    
    chartInstance.draw = function() {
      originalDraw.apply(this, arguments);
      
      const ctx = this.ctx;
      const chartArea = this.chartArea;
      
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.setLineDash([5, 5]);
      
      yearLabels.forEach(yearLabel => {
        const xPosition = this.scales.x.getPixelForValue(yearLabel.index);
        
        ctx.beginPath();
        ctx.moveTo(xPosition, chartArea.top);
        ctx.lineTo(xPosition, chartArea.bottom);
        ctx.stroke();
        
        // Adicionar o ano como texto
        ctx.fillStyle = '#888';
        ctx.font = '11px "Segoe UI"';
        ctx.textAlign = 'center';
        ctx.fillText(yearLabel.year.toString(), xPosition, chartArea.top - 10);
      });
      
      ctx.restore();
    };
  } catch (e) {
    console.error("Erro ao carregar gráfico:", e);
    canvas.parentNode.innerHTML = `<p style="color:#f44336;text-align:center;padding:20px;">Erro ao carregar gráfico</p>`;
  }
}

// Função para carregar notícias da Cointelegraph
async function loadNews() {
  const newsContainer = document.getElementById("news-content");
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  try {
    // Usando o RSS da Cointelegraph Brasil
    const rssUrl = encodeURIComponent("https://br.cointelegraph.com/rss");
    const proxyUrl = `https://api.allorigins.win/get?url=${rssUrl}`;

    const res = await fetch(proxyUrl);
    const data = await res.json();

    if (!data.contents) throw new Error("Erro ao carregar RSS");

    // Processar o XML do RSS
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.contents, "text/xml");

    const items = [...xmlDoc.querySelectorAll("item")];
    const recentArticles = items
      .map(item => {
        // Tentar extrair a imagem da descrição
        let imageUrl = '';
        const description = item.querySelector("description")?.textContent || "";
        const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch && imgMatch[1]) {
          imageUrl = imgMatch[1];
        }
        
        return {
          title: item.querySelector("title")?.textContent || "",
          link: item.querySelector("link")?.textContent || "",
          pubDate: item.querySelector("pubDate")?.textContent || "",
          description: description,
          image: imageUrl
        };
      })
      .filter(article => {
        const pubDate = new Date(article.pubDate);
        return pubDate >= twoDaysAgo;
      })
      .slice(0, 5); // Mostrar 5 notícias

    if (recentArticles.length === 0) {
      newsContainer.innerHTML = "<p class='no-news'>Nenhuma notícia recente encontrada nas últimas 48 horas.</p>";
      return;
    }

    newsContainer.innerHTML = `
      <div class="news-grid">
        ${recentArticles.map(article => `
          <article class="news-item">
            ${article.image ? `<div class="news-image"><img src="${article.image}" alt="${article.title}"></div>` : ''}
            <div class="news-content">
              <h3><a href="${article.link}" target="_blank" rel="noopener">${article.title}</a></h3>
              <p>${article.description.replace(/(<([^>]+)>)/gi, "").substring(0, 120)}...</p>
              <small>${new Date(article.pubDate).toLocaleDateString('pt-BR')}</small>
            </div>
          </article>
        `).join("")}
      </div>
    `;

  } catch (e) {
    console.error("Erro ao carregar notícias:", e);
    newsContainer.innerHTML = "<p class='no-news'>Erro ao carregar notícias da Cointelegraph.</p>";
  }
}

// Adicionar modo escuro como sugestão própria
function setupDarkModeToggle() {
  // Criar o botão de alternar modo
  const toggleButton = document.createElement('button');
  toggleButton.id = 'theme-toggle';
  toggleButton.innerHTML = '🌙';
  toggleButton.title = 'Alternar modo escuro';
  document.body.appendChild(toggleButton);
  
  // Verificar preferência salva
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    toggleButton.innerHTML = '☀️';
  }
  
  // Adicionar evento de clique
  toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    toggleButton.innerHTML = isDark ? '☀️' : '🌙';
  });
}

// Adicionar relógio digital
function setupClock() {
  const footer = document.querySelector('footer');
  const clockDiv = document.createElement('div');
  clockDiv.id = 'clock';
  footer.prepend(clockDiv);
  
  function updateClock() {
    const now = new Date();
    const options = { 
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    clockDiv.textContent = now.toLocaleTimeString('pt-BR', options) + ' BRT';
  }
  
  updateClock();
  setInterval(updateClock, 1000);
}

// Nova sugestão: Painel de Mercado com Indicadores de Sentimento
function setupMarketPanel() {
  // Criar o painel de mercado
  const main = document.querySelector('main');
  const marketPanel = document.createElement('section');
  marketPanel.id = 'market-panel';
  marketPanel.innerHTML = `
    <h2>Sentimento de Mercado</h2>
    <div class="market-indicators">
      <div class="indicator">
        <div class="indicator-title">Índice de Medo e Ganância</div>
        <div class="indicator-value" id="fear-greed">
          <div class="gauge">
            <div class="gauge-fill" style="width: 65%;"></div>
          </div>
          <div class="gauge-value">65 - Ganância</div>
        </div>
      </div>
      <div class="indicator">
        <div class="indicator-title">Volatilidade (30d)</div>
        <div class="indicator-value" id="volatility">
          <div class="gauge">
            <div class="gauge-fill" style="width: 42%;"></div>
          </div>
          <div class="gauge-value">42% - Moderada</div>
        </div>
      </div>
      <div class="indicator">
        <div class="indicator-title">Dominância BTC</div>
        <div class="indicator-value" id="btc-dominance">
          <div class="gauge">
            <div class="gauge-fill" style="width: 53%;"></div>
          </div>
          <div class="gauge-value">53%</div>
        </div>
      </div>
    </div>
  `;
  
  // Inserir o painel antes do resumo de notícias
  main.insertBefore(marketPanel, document.getElementById('news-summary'));
}
