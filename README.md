# Volunteer Coordination Platform

🔗 **GR Ελληνική έκδοση:** [README_GR.md](README_GR.md)

A web-based platform for coordinating volunteers, rescuers, and citizens during natural disasters.  
The system supports real-time request and offer management, warehouse inventory handling, task assignment, and map-based visualization.

This project was developed as a semester assignment for the course  
**Programming & Systems on the World Wide Web**.

---

## ✨ Features

### 👥 User Roles

#### 🛠️ Admin
- Manage warehouse inventory and item categories  
- Create announcements  
- Monitor requests, offers, vehicles, and tasks via interactive maps  
- View system statistics using charts  

#### 🚑 Rescuer
- Join and manage vehicles  
- Load and unload supplies from the warehouse  
- Accept, complete, or cancel assigned tasks  
- View nearby tasks and vehicles on the map  

#### 🧑‍🤝‍🧑 Citizen
- Submit requests for supplies  
- Create offers in response to announcements  
- View request and offer history  

---

## 🧰 Technologies Used

- **Backend:** PHP  
- **Frontend:** HTML, CSS, JavaScript  
- **Database:** MySQL  
- **Maps:** Leaflet with OpenStreetMap  
- **Charts:** Chart.js  
- **Dependency Management:** Composer (Ramsey UUID)  
- **Server Environment:** WAMP (Apache & MySQL)

---

## 📁 Project Structure

```text
.
├── Code/
│   ├── CSS/
│   ├── HTML/
│   ├── JavaScript/
│   ├── PHP/
│   └── .htaccess
│
├── database/
│   ├── Schema.sql
│   ├── seeds/
│   │   └── seed_demo.sql
│   └── sample-data/
│
├── docs/
│   ├── ER-diagram.png
│   └── Report.pdf
│
├── upload_img/
└── README.md
```

---

## ⚙️ Setup Instructions (Local)

1. Install **WAMP** (or any Apache + MySQL environment)

2. Clone the repository into the web root directory:

```text
wamp64/www/volunteer-coordination-platform
```
3. Create a MySQL database

4. Import the database files:
- database/Schema.sql
- database/seeds/seed_demo.sql


5. Copy the database configuration file:
```text
db_connect.example.php → db_connect.php

Edit db_connect.php and update your database credentials (host, database name, username, password).
The db_connect.example.php file is provided as a template and does not contain real credentials.
```

6. Start Apache and MySQL

7. Open the application in a browser:
```text
http://localhost/volunteer-coordination-platform/Code
```
---

## 👤 Demo Accounts

ℹ️ Note:
User passwords in seed_demo.sql are provided as hashed values or dummy placeholders.
For security reasons, plaintext passwords are not included in the repository.

After importing the database, you may:

- register a new user of any role, or
- manually update a user's password in the database with a value of your choice.

This approach ensures secure handling of credentials while allowing full testing of all user roles.

---

## 📚 Documentation

- Database ER Diagram available in docs/ER-diagram.png
- Full project report available in docs/Report.pdf

---

## ⚠️ Disclaimer

This project was developed **for educational purposes only**.  
All data used are dummy and the platform is **not intended for real-world emergency deployment**.

---

## 👥 Authors
- Giorgos Ntakos
- Katerina Papanikolaou
- Jonida Metaj

---

## 🔐 License

MIT License
