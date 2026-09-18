let current_balance = 0;
let balance_history = [current_balance];
function addBal(){
    const bal = document.getElementById("balance");
    const idx = balance_history.length - 1;
    if(balance_history[idx] < 1000){
        current_balance = current_balance + 100;
        balance_history.push(current_balance);
        bal.textContent = "$" + current_balance;
    } else {
        console.log("User attempted to exceed add limit");
    }
}

function getStocks(){
    let coins;
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=3&page=1&sparkline=false').then(response => response.json()).then(data => {
        coins = data; //let data = [] or i guess {}
        console.log('Data is now stored!', coins);
        console.log(data.length);
        for(let i = 1; i <= 3; i++){
        const fullName = document.getElementById("fullname" + i);
        const btc = document.getElementById("stock" + i + "short");
        const price = document.getElementById("price" + i);

        fullName.textContent = coins[i - 1].name;
        btc.textContent = coins[i - 1].symbol
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
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false');
    const coins = await response.json();

    const idx = Math.floor(Math.random() * coins.length);
    const coin = coins[idx];

    const fullName = document.getElementById("fullname4");
    const btc = document.getElementById("stock4short");
    const price = document.getElementById("price4");

    fullName.textContent = coin.name;
    btc.textContent = coin.symbol.toUpperCase();
    price.textContent = "$" + coin.current_price;
}

const bal_btn = document.getElementById("addBalanceBtn");
bal_btn.addEventListener("click", addBal);

const sync_btn = document.getElementById("syncBtn");
sync_btn.addEventListener("click", getStocks);

const rand_btn = document.getElementById("randomCryptoBtn");
rand_btn.addEventListener("click", getRandom);

const themeBtn = document.getElementById("themeToggleBtn");
themeBtn.addEventListener("click", function() {
    document.body.classList.toggle("light-mode");
});