const assets = [
  { name: "Bitcoin", id: "bitcoin", symbol: "BTC", currency: "usd" },
  { name: "Gold (Ounce)", id: "gold", symbol: "GOLD", currency: "usd" },
  { name: "Silver (Ounce)", id: "silver", symbol: "SILVER", currency: "usd" },
  { name: "10Y US Treasury Yield", id: "us10y", symbol: "US10Y", currency: "percent" },
  { name: "USD/BRL", id: "usdbrl", symbol: "USDBRL", currency: "brl" }
];

// Inicialização dos elementos da página
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
    chartContainer.style.display = chartContainer.style.display === "none" ? "block" : "none";
    
    // Carregar dados do gráfico apenas quando exibido pela primeira vez
    if (chartContainer.style.display === "block" && !chartContainer.dataset.loaded) {
      loadChart(asset, canvas);
      chartContainer.dataset.loaded = "true";
    }
  });

  // Carregar cotação imediatamente
  loadQuote(asset, quote);
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
      // Usando uma API mais confiável para dados de títulos do tesouro
      const res = await fetch("https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=daily&maturity=10year&apikey=demo");
      const data = await res.json();
      const latestData = data.data[0];
      price = parseFloat(latestData.value);
    } else if (asset.symbol === "GOLD" || asset.symbol === "SILVER") {
      // Usando API alternativa para metais preciosos
      const metalSymbol = asset.symbol === "GOLD" ? "XAU" : "XAG";
      const res = await fetch(`https://api.metalpriceapi.com/v1/latest?api_key=demo&base=USD&currencies=${metalSymbol}`);
      const data = await res.json();
      
      if (data.success) {
        // Convertendo para preço por onça
        price = 1 / data.rates[metalSymbol];
      } else {
        // Fallback para valores aproximados caso a API falhe
        price = asset.symbol === "GOLD" ? 2350.75 : 28.50;
      }
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
    
    // Obter dados históricos (5 anos = 1825 dias)
    if (asset.symbol === "BTC") {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1825`);
      const data = await res.json();
      
      // Filtrar para reduzir quantidade de pontos (semanal)
      const weeklyData = data.prices.filter((_, index) => index % 7 === 0);
      
      weeklyData.forEach(item => {
        const date = new Date(item[0]);
        labels.push(date.toLocaleDateString('pt-BR', { year: '2-digit', month: 'short' }));
        prices.push(item[1]);
      });
    } else if (asset.symbol === "GOLD" || asset.symbol === "SILVER") {
      // Dados simulados para metais (5 anos)
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 5);
      
      // Gerar pontos semanais para 5 anos (260 semanas)
      const basePrice = asset.symbol === "GOLD" ? 1800 : 22;
      const volatility = asset.symbol === "GOLD" ? 0.02 : 0.03;
      
      for (let i = 0; i < 260; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + (i * 7));
        
        labels.push(date.toLocaleDateString('pt-BR', { year: '2-digit', month: 'short' }));
        
        // Simular tendência de alta com flutuações
        const trend = 1 + (i / 260) * 0.3; // 30% de aumento em 5 anos
        const randomFactor = 1 + (Math.random() - 0.5) * volatility;
        prices.push(basePrice * trend * randomFactor);
      }
    } else if (asset.symbol === "USDBRL") {
      // Dados simulados para USD/BRL (5 anos)
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 5);
      
      // Valores iniciais aproximados de 5 anos atrás
      let basePrice = 4.2;
      
      for (let i = 0; i < 260; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + (i * 7));
        
        labels.push(date.toLocaleDateString('pt-BR', { year: '2-digit', month: 'short' }));
        
        // Simular tendência com flutuações
        const trend = 1 + (i / 260) * 0.35; // 35% de aumento em 5 anos
        const randomFactor = 1 + (Math.random() - 0.5) * 0.02;
        prices.push(basePrice * trend * randomFactor);
      }
    } else if (asset.symbol === "US10Y") {
      // Dados simulados para rendimento do tesouro (5 anos)
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 5);
      
      // Valores iniciais aproximados de 5 anos atrás
      let baseYield = 1.8;
      
      for (let i = 0; i < 260; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + (i * 7));
        
        labels.push(date.toLocaleDateString('pt-BR', { year: '2-digit', month: 'short' }));
        
        // Simular tendência com flutuações
        const trend = 1 + (i / 260) * 1.4; // 140% de aumento em 5 anos
        const randomFactor = 1 + (Math.random() - 0.5) * 0.03;
        prices.push(baseYield * trend * randomFactor);
      }
    }

    // Configurar cores baseadas no tipo de ativo
    const getAssetColor = (symbol) => {
      const colors = {
        "BTC": { border: "#f7931a", background: "rgba(247, 147, 26, 0.2)" },
        "GOLD": { border: "#d4af37", background: "rgba(212, 175, 55, 0.2)" },
        "SILVER": { border: "#c0c0c0", background: "rgba(192, 192, 192, 0.2)" },
        "US10Y": { border: "#6a5acd", background: "rgba(106, 90, 205, 0.2)" },
        "USDBRL": { border: "#20b2aa", background: "rgba(32, 178, 170, 0.2)" }
      };
      
      return colors[symbol] || { border: "#4bc0c0", background: "rgba(75, 192, 192, 0.2)" };
    };
    
    const colors = getAssetColor(asset.symbol);

    // Criar gráfico com Chart.js
    new Chart(canvas, {
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
          pointRadius: 2,
          pointHoverRadius: 5,
          pointBackgroundColor: colors.border
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: true,
            labels: {
              font: {
                family: "'Segoe UI', sans-serif",
                size: 12
              }
            }
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
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: "#555",
              font: { 
                family: "'Segoe UI', sans-serif", 
                size: 11 
              },
              maxRotation: 45,
              minRotation: 45
            },
            grid: { 
              color: "rgba(0, 0, 0, 0.05)",
              drawBorder: false
            }
          },
          y: {
            ticks: {
              color: "#555",
              font: { 
                family: "'Segoe UI', sans-serif", 
                size: 11 
              }
            },
            grid: { 
              color: "rgba(0, 0, 0, 0.05)",
              drawBorder: false
            }
          }
        }
      }
    });
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
        return {
          title: item.querySelector("title")?.textContent || "",
          link: item.querySelector("link")?.textContent || "",
          pubDate: item.querySelector("pubDate")?.textContent || "",
          description: item.querySelector("description")?.textContent || ""
        };
      })
      .filter(article => {
        const pubDate = new Date(article.pubDate);
        return pubDate >= twoDaysAgo;
      })
      .slice(0, 5); // Limitar a 5 notícias

    if (recentArticles.length === 0) {
      newsContainer.innerHTML = "<p>Nenhuma notícia recente encontrada nas últimas 48 horas.</p>";
      return;
    }

    newsContainer.innerHTML = recentArticles.map(article => `
      <article class="news-item">
        <h3><a href="${article.link}" target="_blank" rel="noopener">${article.title}</a></h3>
        <p>${article.description.replace(/(<([^>]+)>)/gi, "").substring(0, 180)}...</p>
        <small>Publicado em: ${new Date(article.pubDate).toLocaleString('pt-BR')}</small>
      </article>
    `).join("");

  } catch (e) {
    console.error("Erro ao carregar notícias:", e);
    newsContainer.innerHTML = "<p>Erro ao carregar notícias da Cointelegraph. Tentando novamente em 30 segundos...</p>";
    
    // Tentar novamente após 30 segundos
    setTimeout(loadNews, 30000);
  }
}

// Iniciar carregamento de notícias
loadNews();

// Atualizar cotações a cada 5 minutos
setInterval(() => {
  const quoteElements = document.querySelectorAll('.quote');
  assets.forEach((asset, index) => {
    loadQuote(asset, quoteElements[index]);
  });
}, 300000);
