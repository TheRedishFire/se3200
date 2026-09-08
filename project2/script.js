let current_balance = 0;

function addBal(){
    const bal = document.getElementById("balance");
    current_balance = current_balance + 100;
    bal.textContent = "$" + current_balance;
}

function getStocks(){
    let coins;
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=3&page=1&sparkline=false').then(response => response.json()).then(data => {
        coins = data;
        console.log('Data is now stored!', coins);

        for(let i = 1; i <= 3; i++){
        const fullName = document.getElementById("fullname" + i);
        const btc = document.getElementById("stock" + i + "short");
        const price = document.getElementById("price" + i);

        fullName.textContent = "$" + coins[i - 1].name;
        btc.textContent = "$" + coins[i - 1].symbol
        price.textContent = "$" + coins[i - 1].current_price
        
    }
    });
}

async function getAllCoins() {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/list');
    const allCoins = await response.json();
    return allCoins;
}

async function getRandom() {
    const allCoins = await getAllCoins();
    const idx = Math.floor(Math.random() * allCoins.length);
    const coin = allCoins[idx];
    const fullName = document.getElementById("fullname4");
    const btc = document.getElementById("stock4short");
    const price = document.getElementById("price4");
    fullName.textContent = "$" + coin.name;
    btc.textContent = "$" + coin.symbol
    price.textContent = "$" + coin.current_price
    
    
}

const bal_btn = document.getElementById("addBalanceBtn");
bal_btn.addEventListener("click", addBal);

const sync_btn = document.getElementById("syncBtn");
sync_btn.addEventListener("click", getStocks);

const rand_btn = document.getElementById("randomCryptoBtn");
rand_btn.addEventListener("click", getRandom);

