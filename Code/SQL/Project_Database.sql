-- Πίνακας Κατηγοριών
CREATE TABLE Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--Πίνακας Αποθήκης
CREATE TABLE Warehouse (
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    street VARCHAR(255) NOT NULL,
    number INT,
    town   VARCHAR(255) NOT NULL,
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lon DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--Ποσότητα των Items στην αποθήκη
CREATE TABLE Items_Stock (
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    quantity INT,
    item_id INT AUTO_INCREMENT,
    warehouse_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES Items(id),
    FOREIGN KEY (warehouse_id) REFERENCES Warehouse(id)
);

-- Πίνακας Ειδών
CREATE TABLE Items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INT AUTO_INCREMENT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Categories(id),
);

-- Πίνακας Οχημάτων
CREATE TABLE Vehicles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    number INT,
    town   VARCHAR(255) NOT NULL,
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lon DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE VehicleCargo (
    id VARCHAR(36) PRIMARY KEY,
    vehicle_id VARCHAR(36),
    item_id INT AUTO_INCREMENT,
    quantity INT,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(id),
    FOREIGN KEY (item_id) REFERENCES Items(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Πίνακας Αιτημάτων
CREATE TABLE Requests (
    request_id VARCHAR(36) PRIMARY KEY,
    citizen_id VARCHAR(36),
    item_id INT AUTO_INCREMENT,
    vehicle_id VARCHAR(36),
    quantity INT,
    status ENUM('pending', 'declined', 'accepted', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES Citizens(citizen_id),
    FOREIGN KEY (item_id) REFERENCES Items(item_id),
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id)
);

-- Πίνακας Προσφορών
CREATE TABLE Offers (
    offer_id VARCHAR(36) PRIMARY KEY,
    citizen_id VARCHAR(36),
    quantity INT,
    vehicle_id VARCHAR(36),
    status ENUM('pending', 'declined', 'accepted', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES Citizens(id),
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(id)
);

-- Πίνακας Πολιτών
CREATE TABLE Citizens (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    street VARCHAR(255) NOT NULL,
    number INT,
    town   VARCHAR(255) NOT NULL,
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lon DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Citizens_Items(
    citizen_cargo_id VARCHAR(36) PRIMARY KEY,
    citizen_id VARCHAR(36),
    item_id INT AUTO_INCREMENT,
    quantity INT,
    FOREIGN KEY (citizen_id) REFERENCES Citizens(id),
    FOREIGN KEY (item_id) REFERENCES Items(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--Πίνακας Διαχειριστών
CREATE TABLE admins (
  admin_id VARCHAR(36) PRIMARY KEY,  -- Πρωτεύον κλειδί
  admin_name VARCHAR(255) NOT NULL,  -- Όνομα χρήστη, χωρίς να επιτρέπονται κενά
  password VARCHAR(255) NOT NULL,  -- Κωδικός πρόσβασης, χωρίς να επιτρέπονται κενά
  email VARCHAR(255) NOT NULL,  -- Email χρήστη, χωρίς να επιτρέπονται κενά
  img_path VARCHAR(255)
);

-- Πίνακας Διασωστών
CREATE TABLE Rescuers (
    rescuer_id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    street VARCHAR(255) NOT NULL,
    number INT,
    town   VARCHAR(255) NOT NULL,
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lon DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Πίνακας Ανακοινώσεων
CREATE TABLE Announcements (
    announcement_id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    is_hidden BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (item_id) REFERENCES Items(item_id)
);
