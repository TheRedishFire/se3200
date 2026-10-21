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

function resetForm() {
    carForm.reset(); 
    idInput.value = ""; 
    
    formTitle.textContent = "Add New Car";
    btnCancel.classList.add("hidden");
}

async function loadCars() {
    const response = await fetch(API);
    const cars = await response.json();
    carContainer.innerHTML = "";
    // the onclick calling js function is crazy
    for (const car of cars) {
        const carHTML = `
            <div class="car-card">
                <div class="car-info">
                    <h3>${car.year} ${car.make} ${car.model}</h3>
                    <p class="car-trim">Trim: ${car.trim || 'N/A'}</p>
                    <p class="car-price">$${car.price.toFixed(2)}</p>
                </div>
                <div class="car-actions">
                    <!-- Pass the whole car object as JSON to the edit function -->
                    <button class="btn btn-secondary" onclick='editCar(${JSON.stringify(car)})'>Edit</button>
                    <!-- Pass just the ID to the delete function -->
                    <button class="btn btn-danger" onclick="deleteCar(${car.id})">Delete</button>
                </div>
            </div>
        `;
        carContainer.innerHTML += carHTML;
    }
}

async function saveCar(e) {
    e.preventDefault();

    const carData = {
        make: makeInput.value,
        model: modelInput.value,
        trim: trimInput.value,
        year: parseInt(yearInput.value),
        price: parseFloat(priceInput.value)
    };
    const http = "POST";
    const carID = idInput.value;
    let url = API;
    //updating existing car
    if(carID){
        http = "PUT";
        url = `${API}/${carId}`;
    }

    await fetch(url, {
        method: http,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carData)
    });

    resetForm();
    await loadCars();
}

async function deleteCar(id) {
    const consent = confirm("Are you sure you want to delete this car?");

    if (consent) {
        await fetch(`${API}/${id}`, {
            method: "DELETE"
        });
        await loadCars();
    }
}

function editCar(car) {

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

loadCars();


