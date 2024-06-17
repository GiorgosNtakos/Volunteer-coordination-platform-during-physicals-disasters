-- Πίνακας Κατηγοριών
CREATE TABLE Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Πίνακας Αποθήκης
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

-- Πίνακας Ειδών
CREATE TABLE Items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    category_id INT,
    details TEXT,
    FOREIGN KEY (category_id) REFERENCES Categories(id)
);

-- Ποσότητα των Items στην αποθήκη
CREATE TABLE Warehouse_Stock (
    id INT VARCHAR(36) PRIMARY KEY NOT NULL,
    quantity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    item_id INT,
    warehouse_id VARCHAR(36),
    FOREIGN KEY (item_id) REFERENCES Items(id),
    FOREIGN KEY (warehouse_id) REFERENCES Warehouse(id)
);

-- Πίνακας Οχημάτων
CREATE TABLE Vehicles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    assigned_tasks INT DEFAULT 0,
    street VARCHAR(255) NOT NULL,
    number INT,
    town   VARCHAR(255) NOT NULL,
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lon DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT max_tasks CHECK (assigned_tasks <= 4)
    CONSTRAINT max_rescuers CHECK (assigned_rescuers <= 2)
);

CREATE TABLE VehicleAssignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    UNIQUE (user_id)  -- Εξασφαλίζει ότι κάθε διασώστης μπορεί να ανατεθεί μόνο σε ένα όχημα
);

-- Ποσότητα των Items στα οχήματα
CREATE TABLE VehicleCargo (
    id VARCHAR(36) PRIMARY KEY,
    quantity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    item_id INT,
    vehicle_id VARCHAR(36),
    FOREIGN KEY (item_id) REFERENCES Items(id),
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(id),
    UNIQUE INDEX vehicle_item_unique (vehicle_id, item_id)
);

-- Πίνακας Χρηστών
CREATE TABLE Users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(85) NOT NULL UNIQUE,
    password VARCHAR(85) NOT NULL,
    full_name VARCHAR(85) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(85) NOT NULL UNIQUE,
    type ENUM('Admin', 'Rescuer', 'Citizen'),
    street VARCHAR(255) NOT NULL,
    number INT,
    town   VARCHAR(255) NOT NULL,
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lon DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    formCompleted BOOLEAN DEFAULT false,
    img_path VARCHAR(255) DEFAULT '../../../upload_img/global/user.png'
);

-- Πίνακας Εργασιών
CREATE TABLE Tasks (
    id VARCHAR(36) PRIMARY KEY,
    quantity INT,
    type ENUM('Offer', 'Request'),
    status ENUM('pending', 'declined', 'accepted', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    item_id INT,
    vehicle_id VARCHAR(36),
    user_id VARCHAR(36),
    announcement_id VARCHAR(36),
    FOREIGN KEY (item_id) REFERENCES Items(id),
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (announcement_id) REFERENCES Announcements(id),
    UNIQUE INDEX vehicle_item_unique (user_id, item_id, announcement_id)
);

-- Πίνακας Ανακοινώσεων
CREATE TABLE Announcements (
    id VARCHAR(36) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP,
    is_hidden BOOLEAN DEFAULT FALSE,
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Ενδιάμεσος Πίνακας γιατί τα Items μπορεί να είναι πολλά
CREATE TABLE AnnouncementItems (
    announcement_id VARCHAR(36),
    item_id INT,
    quantity INT,
    covered_quantity INT DEFAULT 0,
    PRIMARY KEY (announcement_id, item_id),
    FOREIGN KEY (announcement_id) REFERENCES Announcements(id),
    FOREIGN KEY (item_id) REFERENCES Items(id)
);