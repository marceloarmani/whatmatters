// Your API keys
const GOLD_API_KEY = 'goldapi-4czjlk1mmar2m084-io';
const FRED_API_KEY = '5cea6c897e85a36d7573bcf686ef03fe';
const FMP_API_KEY = 'YOUR_FINANCIAL_MODELING_PREP_API_KEY'; // Substitua pela sua se tiver

// Utilitário para formatar números com vírgula como separador de milhar e 2 casas decimais
function formatNumber(num) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Chart instances
const charts = {};

// --- FETCH FUNCTIONS ---

// 1. Bitcoin - CoinGecko API
async function fetchBitcoin() {
    const priceEl = document.getElementById('btc-price');
    try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await res.json();
        const price = data.bitcoin.usd;
        priceEl.textContent = '$' + formatNumber(price);
        updateChart('btc-chart', price);
    } catch (e) {
        priceEl.textContent = 'Error loading';
    }
}

// 2. Gold and Silver - GoldAPI
async function fetchGoldSilver() {
    const goldEl = document.getElementById('gold-price');
    const silverEl = document.getElementById('silver-price');

    try {
        const goldRes = await fetch('https://www.goldapi.io/api/XAU/USD', {
            headers: { 'x-access-token': GOLD_API_KEY, 'Content-Type': 'application/json' },
        });
        const goldData = await goldRes.json();

        const silverRes = await fetch('https://www.goldapi.io/api/XAG/USD', {
            headers: { 'x-access-token': GOLD_API_KEY, 'Content-Type': 'application/json' },
        });
        const silverData = await silverRes.json();

        goldEl.textContent = goldData.price ? '$' + formatNumber(goldData.price) : 'Error loading';
        silverEl.textContent = silverData.price ? '$' + formatNumber(silverData.price) : 'Error loading';

        if(goldData.price) updateChart('gold-chart', goldData.price);
        if(silverData.price) updateChart('silver-chart', silverData.price);
    } catch (e) {
        goldEl.textContent = 'Error loading';
        silverEl.textContent = 'Error loading';
    }
}

// 3. USD/BRL - AwesomeAPI (não requer chave)
async function fetchUSDBRL() {
    const el = document.getElementById('usbrl-price');
    try {
        const res = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL');
        const data = await res.json();
        const price = parseFloat(data.USDBRL.bid);
        el.textContent = 'R$ ' + formatNumber(price);
        updateChart('usbrl-chart', price);
    } catch (e) {
        el.textContent = 'Error loading';
    }
}

// 4. 10Y US Treasury Yield - FRED API
async function fetchUSTreasuryYield() {
    const el = document.getElementById('yield-price');
    try {
        const url = `https://api.stlouisfed.org/fred/series/observations?series_id=GS10&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=1`;
        const res = await fetch(url);
        const data = await res.json();
        if(data.observations && data.observations.length > 0){
            const yieldVal = parseFloat(data.observations[0].value);
            el.textContent = yieldVal.toFixed(2) + '%';
            updateChart('yield-chart', yieldVal);
        } else {
            el.textContent = 'Error loading';
        }
    } catch (e) {
        el.textContent = 'Error loading';
    }
}

// 5. UUP ETF - FinancialModelingPrep API
async function fetchUUP() {
    const el = document.getElementById('uup-price');
    try {
        // Se não tiver sua chave, deixe sem &apikey=
        const url = `https://financialmodelingprep.com/api/v3/quote-short/UUP?apikey=${FMP_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if(data && data.length > 0){
            const price = data[0].price;
            el.textContent = '$' + formatNumber(price);
            updateChart('uup-chart', price);
        } else {
            el.textContent = 'Unavailable';
        }
    } catch (e) {
        el.textContent = 'Error loading';
    }
}

// --- CHART FUNCTION ---

function updateChart(canvasId, value) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    if (!charts[canvasId]) {
        charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [new Date().toLocaleTimeString()],
                datasets: [{
                    label: 'Price',
                    data: [value],
                    borderColor: '#204051',
                    backgroundColor: 'rgba(32, 64, 81, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 2,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { display: false },
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: (val) => val.toLocaleString('en-US', {maximumFractionDigits: 2})
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    } else {
        const chart = charts[canvasId];
        chart.data.labels.push(new Date().toLocaleTimeString());
        chart.data.datasets[0].data.push(value);
        if(chart.data.labels.length > 20){
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        chart.update();
    }
}

// --- MAIN FUNCTION ---

async function updateAll() {
    await Promise.all([
        fetchBitcoin(),
        fetchGoldSilver(),
        fetchUSDBRL(),
        fetchUSTreasuryYield(),
        fetchUUP()
    ]);
}

// Update every 60 seconds
updateAll();
setInterval(updateAll, 60000);
