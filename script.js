const ALPHA_API_KEY = 'AYD0CU34ZWEG2WM2';  // Sua Alpha Vantage API key
const GOLDAPI_API_KEY = 'goldapi-4czjlk1mmar2m084-io';  // Sua GoldAPI key
const FRED_API_KEY = '5cea6c897e85a36d7573bcf686ef03fe';  // Sua FRED API key
const FMP_API_KEY = ''; // Se tiver, coloque aqui. Se não, deixe vazio.

function formatNumber(num) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Função para atualizar gráfico (simplificada)
function updateChart(chartId, newValue) {
    const chart = window[chartId];
    if (!chart) return;
    chart.data.datasets[0].data.push(newValue);
    if(chart.data.datasets[0].data.length > 20) {
        chart.data.datasets[0].data.shift();
    }
    chart.update();
}

// Busca Bitcoin via Alpha Vantage
async function fetchBitcoin() {
    const el = document.getElementById('btc-price');
    try {
        const res = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=${ALPHA_API_KEY}`);
        const data = await res.json();
        const price = parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
        el.textContent = '$' + formatNumber(price);
        updateChart('btc-chart', price);
    } catch {
        el.textContent = 'Error loading';
    }
}

// Busca ouro e prata via GoldAPI
async function fetchGoldAndSilver() {
    try {
        const goldEl = document.getElementById('gold-price');
        const silverEl = document.getElementById('silver-price');

        // Ouro
        const goldRes = await fetch('https://www.goldapi.io/api/XAU/USD', {
            headers: { 'x-access-token': GOLDAPI_API_KEY, 'Content-Type': 'application/json' }
        });
        const goldData = await goldRes.json();
        const goldPrice = parseFloat(goldData.price);
        goldEl.textContent = '$' + formatNumber(goldPrice);
        updateChart('gold-chart', goldPrice);

        // Prata
        const silverRes = await fetch('https://www.goldapi.io/api/XAG/USD', {
            headers: { 'x-access-token': GOLDAPI_API_KEY, 'Content-Type': 'application/json' }
        });
        const silverData = await silverRes.json();
        const silverPrice = parseFloat(silverData.price);
        silverEl.textContent = '$' + formatNumber(silverPrice);
        updateChart('silver-chart', silverPrice);

    } catch {
        document.getElementById('gold-price').textContent = 'Error loading';
        document.getElementById('silver-price').textContent = 'Error loading';
    }
}

// Busca US Dollar Index proxy (UUP ETF) via FinancialModelingPrep
async function fetchUUP() {
    const el = document.getElementById('uup-price');
    try {
        let url = `https://financialmodelingprep.com/api/v3/quote-short/UUP`;
        if(FMP_API_KEY && FMP_API_KEY.trim() !== '') {
            url += `?apikey=${FMP_API_KEY}`;
        }
        const res = await fetch(url);
        if (!res.ok) {
            el.textContent = 'Unavailable';
            return;
        }
        const data = await res.json();
        if(data && data.length > 0 && data[0].price) {
            const price = data[0].price;
            el.textContent = '$' + formatNumber(price);
            updateChart('uup-chart', price);
        } else {
            el.textContent = 'Unavailable';
        }
    } catch {
        el.textContent = 'Error loading';
    }
}

// Busca USD/BRL via Alpha Vantage
async function fetchUSDBRL() {
    const el = document.getElementById('usdbrl-price');
    try {
        const res = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=BRL&apikey=${ALPHA_API_KEY}`);
        const data = await res.json();
        const price = parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
        el.textContent = 'R$ ' + formatNumber(price);
        updateChart('usdbrl-chart', price);
    } catch {
        el.textContent = 'Error loading';
    }
}

// Busca 10Y US Treasury Yield via FRED API
async function fetchUSTreasuryYield() {
    const el = document.getElementById('yield-price');
    try {
        const url = `https://api.stlouisfed.org/fred/series/observations?series_id=GS10&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=10`;
        const res = await fetch(url);
        const data = await res.json();

        if(data.observations && data.observations.length > 0){
            const validObservation = data.observations.find(obs => obs.value !== '.' && obs.value !== '');
            if(validObservation){
                const yieldVal = parseFloat(validObservation.value);
                el.textContent = formatNumber(yieldVal) + '%';
                updateChart('yield-chart', yieldVal);
                return;
            }
        }
        el.textContent = 'Error loading';
    } catch {
        el.textContent = 'Error loading';
    }
}

// Inicializa todos
function init() {
    fetchBitcoin();
    fetchGoldAndSilver();
    fetchUUP();
    fetchUSDBRL();
    fetchUSTreasuryYield();

    // Atualiza a cada 5 minutos (300000 ms)
    setInterval(() => {
        fetchBitcoin();
        fetchGoldAndSilver();
        fetchUUP();
        fetchUSDBRL();
        fetchUSTreasuryYield();
    }, 300000);
}

window.onload = init;
