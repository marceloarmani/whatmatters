const assets = [
  { name: "Bitcoin", id: "bitcoin", symbol: "BTC", currency: "usd" },
  { name: "Gold (Ounce)", id: "gold", symbol: "GOLD", currency: "usd" },
  { name: "Silver (Ounce)", id: "silver", symbol: "SILVER", currency: "usd" },
  { name: "10Y US Treasury Yield", id: "us10y", symbol: "US10Y", currency: "percent" },
  { name: "USD/BRL", id: "usdbrl", symbol: "USDBRL", currency: "brl" }
];

// Citações de Satoshi Nakamoto
const satoshiQuotes = [
  "O problema raiz com a moeda convencional é toda a confiança que é necessária para fazê-la funcionar. O banco central deve ser confiável para não desvalorizar a moeda, mas a história das moedas fiduciárias está cheia de quebras dessa confiança.",
  "Bitcoin é muito atrativo do ponto de vista libertário, se nós conseguirmos explicá-lo corretamente. Mas eu estou melhor com código do que com palavras.",
  "Eu escolhi implementar a prova de trabalho em vez de provas de participação porque esta última requer um mecanismo de identificação, o que prejudicaria o anonimato.",
  "Governos são bons em cortar a cabeça de redes centralmente controladas como o Napster, mas redes puramente P2P como Gnutella e Tor parecem estar se mantendo.",
  "Muitas pessoas descartam automaticamente e-currency como uma causa perdida por causa de todas as empresas que falharam desde os anos 1990. Espero que seja óbvio que foi apenas a natureza centralizada desses sistemas que os condenou.",
  "Com e-currency baseada em prova criptográfica, sem a necessidade de confiar em um terceiro intermediário, o dinheiro pode ser seguro e as transações effortless.",
  "O preço de qualquer commodity tende a gravitar em direção ao custo de produção. Se o preço estiver abaixo do custo, então a produção diminui. Se o preço estiver acima do custo, o lucro pode ser obtido aumentando a produção.",
  "Eu estou seguro de que daqui a 20 anos haverá um volume muito grande de transações ou nenhum.",
  "Perdidos são os bitcoins cujas chaves privadas foram perdidas. Eles são como moedas de ouro que foram perdidas no oceano.",
  "A raiz do problema com a moeda convencional é toda a confiança que é necessária para fazê-la funcionar."
];

// Eventos do calendário econômico
const economicEvents = [
  {
    date: "2025-05-22",
    title: "Reunião do FOMC",
    description: "Decisão de taxa de juros pelo Federal Reserve dos EUA",
    impact: "high"
  },
  {
    date: "2025-05-25",
    title: "Dados de Inflação (CPI) - Brasil",
    description: "Divulgação do índice de preços ao consumidor pelo IBGE",
    impact: "medium"
  },
  {
    date: "2025-06-01",
    title: "Relatório de Empregos (EUA)",
    description: "Divulgação dos dados de emprego não-agrícola dos EUA",
    impact: "high"
  },
  {
    date: "2025-06-05",
    title: "Reunião do BCE",
    description: "Decisão de política monetária do Banco Central Europeu",
    impact: "high"
  },
  {
    date: "2025-06-12",
    title: "Reunião do COPOM",
    description: "Decisão da taxa Selic pelo Banco Central do Brasil",
    impact: "high"
  },
  {
    date: "2025-06-15",
    title: "PIB da China (Q2)",
    description: "Divulgação do crescimento econômico trimestral da China",
    impact: "medium"
  },
  {
    date: "2025-06-20",
    title: "Vencimento de Opções BTC",
    description: "Vencimento de contratos de opções de Bitcoin",
    impact: "medium"
  },
  {
    date: "2025-07-01",
    title: "Balanço Trimestral MicroStrategy",
    description: "Divulgação dos resultados financeiros e holdings de Bitcoin",
    impact: "low"
  }
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
  
  // Inicializar calendário econômico
  initEconomicCalendar();

  // Configurar modo escuro
  setupDarkModeToggle();

  // Configurar relógio
  setupClock();
  
  // Configurar citação de Satoshi
  setupSatoshiQuote();
  
  // Configurar indicadores de mercado
  updateMarketIndicators();

  // Atualizar cotações e indicadores a cada 5 minutos
  setInterval(() => {
    const quoteElements = document.querySelectorAll('.quote');
    assets.forEach((asset, index) => {
      loadQuote(asset, quoteElements[index]);
    });
    updateMarketIndicators();
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
        "BTC": { 
          border: "#f7931a", 
          background: {
            gradient: true,
            colorStart: "rgba(247, 147, 26, 0.2)",
            colorEnd: "rgba(247, 147, 26, 0.05)"
          }
        },
        "GOLD": { 
          border: "#d4af37", 
          background: {
            gradient: true,
            colorStart: "rgba(212, 175, 55, 0.2)",
            colorEnd: "rgba(212, 175, 55, 0.05)"
          }
        },
        "SILVER": { 
          border: "#c0c0c0", 
          background: {
            gradient: true,
            colorStart: "rgba(192, 192, 192, 0.2)",
            colorEnd: "rgba(192, 192, 192, 0.05)"
          }
        },
        "US10Y": { 
          border: "#6a5acd", 
          background: {
            gradient: true,
            colorStart: "rgba(106, 90, 205, 0.2)",
            colorEnd: "rgba(106, 90, 205, 0.05)"
          }
        },
        "USDBRL": { 
          border: "#20b2aa", 
          background: {
            gradient: true,
            colorStart: "rgba(32, 178, 170, 0.2)",
            colorEnd: "rgba(32, 178, 170, 0.05)"
          }
        }
      };
      
      return colors[symbol] || { 
        border: "#4bc0c0", 
        background: {
          gradient: true,
          colorStart: "rgba(75, 192, 192, 0.2)",
          colorEnd: "rgba(75, 192, 192, 0.05)"
        }
      };
    };
    
    const colors = getAssetColor(asset.symbol);
    
    // Criar gradiente para o preenchimento
    const ctx = canvas.getContext('2d');
    let gradient = null;
    
    if (colors.background.gradient) {
      gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, colors.background.colorStart);
      gradient.addColorStop(1, colors.background.colorEnd);
    }

    // Criar gráfico com Chart.js
    const chart = new Chart(canvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: asset.name,
          data: prices,
          borderColor: colors.border,
          backgroundColor: gradient || colors.background,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: colors.border,
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderWidth: 2,
          pointHoverBorderColor: colors.border
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: { 
            display: false
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#333',
            bodyColor: '#666',
            borderColor: '#ddd',
            borderWidth: 1,
            cornerRadius: 4,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            titleFont: {
              family: "'Segoe UI', sans-serif",
              size: 14,
              weight: '600'
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
              },
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                
                const value = context.parsed.y;
                if (asset.symbol === "US10Y") {
                  label += value.toFixed(2) + '%';
                } else if (asset.symbol === "USDBRL") {
                  label += 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
                } else {
                  label += '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2 });
                }
                
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.03)",
              drawBorder: false,
              drawTicks: false
            },
            ticks: {
              color: "#888",
              font: { 
                family: "'Segoe UI', sans-serif", 
                size: 11
              },
              maxRotation: 0,
              minRotation: 0,
              padding: 10,
              callback: function(value, index) {
                // Mostrar apenas os anos
                return yearLabels.some(yl => yl.index === index) ? yearLabels.find(yl => yl.index === index).year : '';
              }
            }
          },
          y: {
            position: 'right',
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.03)",
              drawBorder: false
            },
            ticks: {
              color: "#888",
              font: { 
                family: "'Segoe UI', sans-serif", 
                size: 11
              },
              padding: 10,
              maxTicksLimit: 6,
              callback: function(value) {
                if (asset.symbol === "US10Y") {
                  return value.toFixed(2) + '%';
                } else if (asset.symbol === "USDBRL") {
                  return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                } else {
                  return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                }
              }
            }
          }
        },
        elements: {
          line: {
            tension: 0.4
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
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
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.07)';
      ctx.setLineDash([]);
      
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

// Inicializar calendário econômico
function initEconomicCalendar() {
  const eventsContainer = document.getElementById('events-container');
  if (!eventsContainer) return;
  
  // Ordenar eventos por data
  const sortedEvents = [...economicEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Filtrar apenas eventos futuros ou recentes (últimos 2 dias)
  const now = new Date();
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
  const relevantEvents = sortedEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= twoDaysAgo;
  });
  
  // Exibir apenas os próximos 4 eventos
  const displayEvents = relevantEvents.slice(0, 4);
  
  // Renderizar eventos
  if (displayEvents.length === 0) {
    eventsContainer.innerHTML = "<p class='no-events'>Nenhum evento econômico próximo encontrado.</p>";
    return;
  }
  
  eventsContainer.innerHTML = displayEvents.map(event => {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
    
    // Determinar quantos pontos ativos baseado no impacto
    const impactDots = {
      high: [1, 1, 1],
      medium: [1, 1, 0],
      low: [1, 0, 0]
    };
    
    const dots = impactDots[event.impact] || [0, 0, 0];
    
    return `
      <div class="event-card">
        <div class="event-date">${formattedDate}</div>
        <div class="event-title">${event.title}</div>
        <div class="event-description">${event.description}</div>
        <div class="event-impact impact-${event.impact}">
          <span class="impact-label">Impacto:</span>
          <div class="impact-dots">
            <div class="impact-dot ${dots[0] ? 'active' : ''}"></div>
            <div class="impact-dot ${dots[1] ? 'active' : ''}"></div>
            <div class="impact-dot ${dots[2] ? 'active' : ''}"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // Configurar botões de navegação
  const prevButton = document.getElementById('prev-events');
  const nextButton = document.getElementById('next-events');
  
  if (prevButton && nextButton) {
    let currentPage = 0;
    const eventsPerPage = 4;
    const totalPages = Math.ceil(relevantEvents.length / eventsPerPage);
    
    prevButton.addEventListener('click', () => {
      if (currentPage > 0) {
        currentPage--;
        updateCalendarPage();
      }
    });
    
    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages - 1) {
        currentPage++;
        updateCalendarPage();
      }
    });
    
    function updateCalendarPage() {
      const startIdx = currentPage * eventsPerPage;
      const endIdx = startIdx + eventsPerPage;
      const pageEvents = relevantEvents.slice(startIdx, endIdx);
      
      eventsContainer.innerHTML = pageEvents.map(event => {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('pt-BR', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        });
        
        const impactDots = {
          high: [1, 1, 1],
          medium: [1, 1, 0],
          low: [1, 0, 0]
        };
        
        const dots = impactDots[event.impact] || [0, 0, 0];
        
        return `
          <div class="event-card">
            <div class="event-date">${formattedDate}</div>
            <div class="event-title">${event.title}</div>
            <div class="event-description">${event.description}</div>
            <div class="event-impact impact-${event.impact}">
              <span class="impact-label">Impacto:</span>
              <div class="impact-dots">
                <div class="impact-dot ${dots[0] ? 'active' : ''}"></div>
                <div class="impact-dot ${dots[1] ? 'active' : ''}"></div>
                <div class="impact-dot ${dots[2] ? 'active' : ''}"></div>
              </div>
            </div>
          </div>
        `;
      }).join('');
      
      // Atualizar estado dos botões
      prevButton.disabled = currentPage === 0;
      nextButton.disabled = currentPage === totalPages - 1;
    }
  }
}

// Atualizar indicadores de mercado
function updateMarketIndicators() {
  // Índice de Medo e Ganância
  const fearGreedElement = document.getElementById('fear-greed');
  if (fearGreedElement) {
    const fearGreedValue = Math.floor(Math.random() * (80 - 50 + 1)) + 50; // Valor entre 50 e 80
    const fearGreedText = fearGreedValue >= 75 ? "Ganância Extrema" : 
                          fearGreedValue >= 60 ? "Ganância" : 
                          fearGreedValue >= 45 ? "Neutro" : 
                          fearGreedValue >= 25 ? "Medo" : "Medo Extremo";
    
    fearGreedElement.querySelector('.gauge-fill').style.width = `${fearGreedValue}%`;
    fearGreedElement.querySelector('.gauge-value').textContent = `${fearGreedValue} - ${fearGreedText}`;
  }
  
  // Volatilidade
  const volatilityElement = document.getElementById('volatility');
  if (volatilityElement) {
    const volatilityValue = Math.floor(Math.random() * (60 - 30 + 1)) + 30; // Valor entre 30 e 60
    const volatilityText = volatilityValue >= 60 ? "Alta" : 
                           volatilityValue >= 40 ? "Moderada" : "Baixa";
    
    volatilityElement.querySelector('.gauge-fill').style.width = `${volatilityValue}%`;
    volatilityElement.querySelector('.gauge-value').textContent = `${volatilityValue}% - ${volatilityText}`;
  }
  
  // Dominância BTC
  const btcDominanceElement = document.getElementById('btc-dominance');
  if (btcDominanceElement) {
    const dominanceValue = Math.floor(Math.random() * (60 - 50 + 1)) + 50; // Valor entre 50 e 60
    
    btcDominanceElement.querySelector('.gauge-fill').style.width = `${dominanceValue}%`;
    btcDominanceElement.querySelector('.gauge-value').textContent = `${dominanceValue}%`;
  }
  
  // Volume de Transações
  const volumeElement = document.getElementById('transaction-volume');
  if (volumeElement) {
    const volumeValue = Math.floor(Math.random() * (80 - 60 + 1)) + 60; // Valor entre 60 e 80
    const volumeAmount = (70 + Math.random() * 20).toFixed(1);
    const volumeText = volumeValue >= 75 ? "Alto" : 
                       volumeValue >= 50 ? "Moderado" : "Baixo";
    
    volumeElement.querySelector('.gauge-fill').style.width = `${volumeValue}%`;
    volumeElement.querySelector('.gauge-value').textContent = `$${volumeAmount}B - ${volumeText}`;
  }
  
  // Capitalização de Mercado
  const marketCapElement = document.getElementById('market-cap');
  if (marketCapElement) {
    const marketCapValue = (2.2 + Math.random() * 0.4).toFixed(1);
    const marketCapChange = (Math.random() * 8).toFixed(1);
    
    const marketCapValueElement = marketCapElement.querySelector('.market-cap-value');
    const marketCapTrendElement = marketCapElement.querySelector('.market-cap-trend');
    
    if (marketCapValueElement && marketCapTrendElement) {
      marketCapValueElement.textContent = `$${marketCapValue}T`;
      marketCapTrendElement.textContent = `+${marketCapChange}% nas últimas 24h`;
      marketCapTrendElement.style.color = '#4caf50';
    }
  }
  
  // Liquidez do Mercado
  const liquidityElement = document.getElementById('market-liquidity');
  if (liquidityElement) {
    const liquidityValue = Math.floor(Math.random() * (70 - 50 + 1)) + 50; // Valor entre 50 e 70
    const liquidityText = liquidityValue >= 70 ? "Alta" : 
                          liquidityValue >= 50 ? "Moderada-Alta" : 
                          liquidityValue >= 30 ? "Moderada" : "Baixa";
    
    liquidityElement.querySelector('.gauge-fill').style.width = `${liquidityValue}%`;
    liquidityElement.querySelector('.gauge-value').textContent = liquidityText;
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

// Configurar citação de Satoshi
function setupSatoshiQuote() {
  const quoteElement = document.getElementById('satoshi-quote');
  
  // Usar o timestamp atual para selecionar uma citação
  // Isso garante que a citação mude a cada dia, sem precisar de tarefas agendadas
  function updateQuote() {
    // Obter a data atual e resetar para o início do dia
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Usar o timestamp do dia como seed para selecionar uma citação
    const dayTimestamp = Math.floor(today.getTime() / (24 * 60 * 60 * 1000));
    const quoteIndex = dayTimestamp % satoshiQuotes.length;
    
    // Atualizar a citação
    quoteElement.textContent = satoshiQuotes[quoteIndex];
  }
  
  // Atualizar a citação imediatamente
  updateQuote();
  
  // Verificar a cada hora se o dia mudou para atualizar a citação
  setInterval(() => {
    const now = new Date();
    // Se for meia-noite (0h), atualizar a citação
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      updateQuote();
    }
  }, 60000); // Verificar a cada minuto
}
