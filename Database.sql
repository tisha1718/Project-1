CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    password VARCHAR(200),
    role VARCHAR(50)
);

CREATE TABLE components (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    stock INT,
    monthly_required INT
);

CREATE TABLE pcb_models (
    id SERIAL PRIMARY KEY,
    pcb_name VARCHAR(100)
);

CREATE TABLE bom_mapping (
    id SERIAL PRIMARY KEY,
    pcb_id INT REFERENCES pcb_models(id),
    component_id INT REFERENCES components(id),
    quantity_required INT
);

CREATE TABLE production_logs (
    id SERIAL PRIMARY KEY,
    pcb_id INT REFERENCES pcb_models(id),
    pcb_quantity INT,
    produced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE consumption_logs (
    id SERIAL PRIMARY KEY,
    component_id INT REFERENCES components(id),
    consumed_qty INT,
    consumed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
