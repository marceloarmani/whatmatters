const ALPHA_API_KEY = 'AYD0CU34ZWEG2WM2';  
const GOLDAPI_API_KEY = 'goldapi-4czjlk1mmar2m084-io';  
const FRED_API_KEY = '5cea6c897e85a36d7573bcf686ef03fe';  
const FMP_API_KEY = '';  // Deixe vazio se não tiver

function formatNumber(num) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function createChart(ctx) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Preço',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            animation: false,
            scales: {
                x: { display: false },
                y: { beginAtZero: false }
            }
        }
    });
}

const charts = {};

function updateChart(chartId, newValue) {
    const chart = charts[chartId];
    if (!chart) return;

    const labels = chart.data.labels;
    const data = chart.data.datasets[0].data;

    const now = new Date();
    const timeLabel = now.toLocaleTimeString();

    labels.push(timeLabel);
    data.push(newValue);

    if (labels.length > 20) {
        labels.shift();
        data.shift();
    }
    chart.update();
}

// Iniciar todos os gráficos na inicialização
function initCharts() {
    charts['btc-chart'] = createChart(document.getElementById('btc-chart').getContext('2d'));
    charts['gold-chart'] = createChart(document.getElementById('gold-chart').getContext('2d'));
    charts['silver-chart'] = createChart(document.getElementById('silver-chart').getContext('2d'));
    charts['yield-chart'] = createChart(document.getElementById('yield-chart').getContext('2d'));
    charts['usdbrl-chart'] = createChart(document.getElementById('usdbrl-chart').getContext('2d'));
    charts['uup-chart'] = createChart(document.getElementById('uup-chart').getContext('2d'));
}

async function fetchBitcoin() {
    const el = document.getElementById('btc-price');
    try {
        const res = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=${ALPHA_API_KEY}`);
        const data = await res.json();
        const price = parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
        el.textContent = '$ ' + formatNumber(price);
        updateChart('btc-chart', price);
    } catch {
        el.textContent = 'Error loading';
    }
}

async function fetchGoldAndSilver() {
    try {
        const goldEl = document.getElementById('gold-price');
        const silverEl = document.getElementById('silver-price');

        const goldRes = await fetch('https://www.goldapi.io/api/XAU/USD', {
            headers: { 'x-access-token': GOLDAPI_API_KEY, 'Content-Type': 'application/json' }
        });
        const goldData = await goldRes.json();
        const goldPrice = parseFloat(goldData.price);
        goldEl.textContent = '$ ' + formatNumber(goldPrice);
        updateChart('gold-chart', goldPrice);

        const silverRes = await fetch('https://www.goldapi.io/api/XAG/USD', {
            headers: { 'x-access-token': GOLDAPI_API_KEY, 'Content-Type': 'application/json' }
        });
        const silverData = await silverRes.json();
        const silverPrice = parseFloat(silverData.price);
        silverEl.textContent = '$ ' + formatNumber(silverPrice);
        updateChart('silver-chart', silverPrice);
    } catch {
        document.getElementById('gold-price').textContent = 'Error loading';
        document.getElementById('silver-price').textContent = 'Error loading';
    }
}

async function fetchUUP() {
    const el = document.getElementById('uup-price');
    try {
        let url = `https://financialmodelingprep.com/api/v3/quote-short/UUP`;
        if (FMP_API_KEY.trim() !== '') {
            url += `?apikey=${FMP_API_KEY}`;
        }
        const res = await fetch(url);
        if (!res.ok) {
            el.textContent = 'Unavailable';
            return;
        }
        const data = await res.json();
        if (data && data.length > 0 && data[0].price) {
            const price = data[0].price;
            el.textContent = '$ ' + formatNumber(price);
            updateChart('uup-chart', price);
        } else {
            el.textContent = 'Unavailable';
        }
    } catch {
        el.textContent = 'Error loading';
    }
}

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

async function fetchUSTreasuryYield() {
    const el = document.getElementById('yield-price');
    try {
        const url = `https://api.stlouisfed.org/fred/series/observations?series_id=
