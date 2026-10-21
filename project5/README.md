CREATE TABLE cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    trim TEXT,
    year INTEGER NOT NULL,
    price REAL NOT NULL
);

## REST API Endpoints

The server implements the following RESTful routes for the `cars` resource:

| Name | HTTP Method | Path | Description |
| :--- | :--- | :--- | :--- |
| **List car collection** | `GET` | `/cars` | Returns a JSON array of all cars in the inventory. |
| **Retrieve car member** | `GET` | `/cars/<id>` | Returns a JSON object of a single car specified by its ID. |
| **Create car member** | `POST` | `/cars` | Creates a new car record using JSON data provided in the request body. |
| **Update car member** | `PUT` | `/cars/<id>` | Replaces the data of an existing car with the JSON data provided in the request body. |
| **Delete car member** | `DELETE` | `/cars/<id>` | Removes the specified car record from the database. |

Resource: CarAttributeData TypeDescriptionidIntegerThe unique identifier (Primary Key).makeStringThe manufacturer (e.g., Toyota, Ford).modelStringThe specific model (e.g., Camry, Mustang).trimStringThe package level (e.g., SE, GT, XLE).yearIntegerThe manufacturing year (e.g., 2021).priceReal (Float)The listing price of the vehicle.