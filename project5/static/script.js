const API = "/cars";
const carContainer = document.getElementById('carList');
const carForm = document.getElementById('carForm');


const idInput = document.getElementById('carId'); 
const makeInput = document.getElementById('make');
const modelInput = document.getElementById('model');
const trimInput = document.getElementById('trim');
const yearInput = document.getElementById('year');
const priceInput = document.getElementById('price');

// The UI state buttons (for editing vs adding)
const formTitle = document.getElementById('formTitle');
const btnCancel = document.getElementById('btnCancel');

// register
const registerForm = document.getElementById("registerForm");
const firstName = document.getElementById("firstName");
const lastName  = document.getElementById("lastName");
const regEmail  = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const registerFeedback = document.getElementById("registerFeedback");

// login
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginFeedback = document.getElementById("loginFeedback");

// gating
const authSection = document.getElementById("authSection");
const inventorySection = document.getElementById("inventorySection");
const formSection = document.getElementById("formSection");
const userBar = document.getElementById("userBar");
const userBadge = document.getElementById("userBadge");
const btnLogout = document.getElementById("btnLogout");

async function api(path, options = {}) {
    const res = await fetch(path, {
        credentials: "same-origin",            //remember
        ...options,
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
        const err = new Error(body.error || `Request failed (${res.status})`);
        err.status = res.status;
        throw err;
    }
    return body;
}

let currentUser = null;

async function refreshAuthState() {
    try {
        currentUser = await api("/sessions/current");
    } catch {
        currentUser = null;
    }

    const authed = currentUser !== null;
    authSection.hidden = authed;
    inventorySection.hidden = !authed;
    formSection.hidden = !authed;
    userBar.hidden = !authed;
    userBadge.textContent = authed ? `${currentUser.first_name} ${currentUser.last_name}` : "";

    if (authed) {
        await loadCars();
    } else {
        carContainer.innerHTML = "";
    }
}


function resetForm() {
    carForm.reset(); 
    idInput.value = ""; 
    
    formTitle.textContent = "Add New Car";
    btnCancel.classList.add("hidden");
}

async function loadCars() {
    try {
        const cars = await api(API);
        carContainer.innerHTML = "";
        for (const car of cars) {
            const carHTML = `
                <div class="car-card">
                    <div class="car-info">
                        <h3>${car.year} ${car.make} ${car.model}</h3>
                        <p class="car-trim">Trim: ${car.trim || 'N/A'}</p>
                        <p class="car-price">$${car.price.toFixed(2)}</p>
                    </div>
                    <div class="car-actions">
                        <button class="btn btn-secondary" onclick='showEditCarForm(${JSON.stringify(car)})'>Edit</button>
                        <button class="btn btn-danger" onclick="deleteCar(${car.id})">Delete</button>
                    </div>
                </div>`;
            carContainer.innerHTML += carHTML;
        }
    } catch (err) {
        if (err.status === 401) {
            await refreshAuthState();     
        } else {
            carContainer.innerHTML = `<p class="feedback error">${err.message}</p>`;
        }
    }
}


async function saveCar(e) {
    e.preventDefault();

    const carData = {
        make: makeInput.value,
        model: modelInput.value,
        trim: trimInput.value,
        year: parseInt(yearInput.value),
        price: parseFloat(priceInput.value),
    };

    let method = "POST";
    let url = API;
    if (idInput.value) {
        method = "PUT";
        url = `${API}/${idInput.value}`;
    }

    try {
        await api(url, { method, body: JSON.stringify(carData) });
        resetForm();
        await loadCars();
    } catch (err) {
        if (err.status === 401) await refreshAuthState();
        else alert(err.message);
    }
}
async function deleteCar(id) {
    if (!confirm("Are you sure you want to delete this car?")) return;
    try {
        await api(`${API}/${id}`, { method: "DELETE" });
        await loadCars();
    } catch (err) {
        if (err.status === 401) await refreshAuthState();
        else alert(err.message);
    }
}

function showEditCarForm(car) {
    idInput.value = car.id;
    makeInput.value = car.make;
    modelInput.value = car.model;
    trimInput.value = car.trim;
    yearInput.value = car.year;
    priceInput.value = car.price;
    formTitle.textContent = "Edit Car";
    btnCancel.classList.remove("hidden");
}



carForm.addEventListener('submit', saveCar);
btnCancel.addEventListener('click', resetForm);
document.getElementById('btnAddNew').addEventListener('click', resetForm);


// register

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    registerFeedback.textContent = "";
    registerFeedback.className = "feedback";

    try {
        await api("/users", {
            method: "POST",
            body: JSON.stringify({
                first_name: firstName.value.trim(),
                last_name: lastName.value.trim(),
                email: regEmail.value.trim(),
                password: regPassword.value,
            }),
        });
        registerForm.reset();
        registerFeedback.textContent = "Registration successful — you can now sign in.";
        registerFeedback.classList.add("success");
    } catch (err) {
        // 409 → duplicate email, 422 → missing fields; server message is user-ready
        registerFeedback.textContent = err.message;
        registerFeedback.classList.add("error");
    }
});

// login

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginFeedback.textContent = "";
    loginFeedback.className = "feedback";

    try {
        await api("/sessions", {
            method: "POST",
            body: JSON.stringify({
                email: loginEmail.value.trim(),
                password: loginPassword.value,
            }),
        });
        loginForm.reset();
        await refreshAuthState();
    } catch (err) {
        loginFeedback.textContent = err.message;      // "Invalid email or password"
        loginFeedback.classList.add("error");
    }
});

// logout

btnLogout.addEventListener("click", async () => {
    try {
        await api("/sessions", { method: "DELETE" });
    } catch { /* cookie already gone — fine */ }
    resetForm();
    await refreshAuthState();
});


refreshAuthState();


