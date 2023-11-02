-- Πίνακας "users": Αποθηκεύει πληροφορίες για τους χρήστες
CREATE TABLE users (
  user_id VARCHAR(36) PRIMARY KEY,  -- Πρωτεύον κλειδί
  username VARCHAR(255) NOT NULL,  -- Όνομα χρήστη, χωρίς να επιτρέπονται κενά
  password VARCHAR(255) NOT NULL,  -- Κωδικός πρόσβασης, χωρίς να επιτρέπονται κενά
  email VARCHAR(255) NOT NULL,  -- Email χρήστη, χωρίς να επιτρέπονται κενά
  total_score INT DEFAULT 0,  -- Συνολικός βαθμός, προεπιλεγμένη τιμή 0
  monthly_score INT DEFAULT 0  -- Μηνιαίος βαθμός, προεπιλεγμένη τιμή 0
);

CREATE TABLE admins (
  admin_id VARCHAR(36) PRIMARY KEY,  -- Πρωτεύον κλειδί
  admin_name VARCHAR(255) NOT NULL,  -- Όνομα χρήστη, χωρίς να επιτρέπονται κενά
  password VARCHAR(255) NOT NULL,  -- Κωδικός πρόσβασης, χωρίς να επιτρέπονται κενά
  email VARCHAR(255) NOT NULL,  -- Email χρήστη, χωρίς να επιτρέπονται κενά
  img_path VARCHAR(255)
);

-- Πίνακας "products": Αποθηκεύει πληροφορίες για τα προϊόντα
CREATE TABLE products (
  product_id INT PRIMARY KEY AUTO_INCREMENT,  -- Πρωτεύον κλειδί, αυτόματο αύξοντας
  name VARCHAR(255) NOT NULL,  -- Όνομα προϊόντος, χωρίς να επιτρέπονται κενά
  category_id VARCHAR(255),  -- Εξωτερικό κλειδί που αναφέρεται στην κατηγορία του προϊόντος
  subcategory_id VARCHAR(255),  -- Εξωτερικό κλειδί που αναφέρεται στην υποκατηγορία του προϊόντος
  FOREIGN KEY (category_id) REFERENCES categories(id),  -- Σύνδεση του category_id με το πρωτεύον κλειδί του πίνακα categories
  FOREIGN KEY (subcategory_id) REFERENCES subcategories(id), -- Σύνδεση του subcategory_id με το πρωτεύον κλειδί του πίνακα subcategories
  price DECIMAL(10, 2) NOT NULL  -- Τιμή προϊόντος, χωρίς να επιτρέπονται κενά
);

-- Πίνακας "categories": Αποθηκεύει πληροφορίες για τις κατηγορίες προϊόντων
CREATE TABLE categories (
  category_id VARCHAR(255) PRIMARY KEY ,  -- Πρωτεύον κλειδί, αυτόματο αύξοντας
  name VARCHAR(255) NOT NULL  -- Όνομα κατηγορίας, χωρίς να επιτρέπονται κενά
);

-- Πίνακας "subcategories": Αποθηκεύει πληροφορίες για τις υποκατηγορίες προϊόντων
CREATE TABLE subcategories (
  subcategory_id VARCHAR(255) PRIMARY KEY ,  -- Πρωτεύον κλειδί, αυτόματο αύξοντας
  name VARCHAR(255) NOT NULL,  -- Όνομα υποκατηγορίας, χωρίς να επιτρέπονται κενά
  category_id VARCHAR(255),  -- Εξωτερικό κλειδί που αναφέρεται στην κατηγορία της υποκατηγορίας
  FOREIGN KEY (category_id) REFERENCES categories(id)  -- Σύνδεση του category_id με το πρωτεύον κλειδί του πίνακα categories
);

-- Πίνακας "offers": Αποθηκεύει πληροφορίες για τις προσφορές
CREATE TABLE offers (
  offer_id INT PRIMARY KEY AUTO_INCREMENT,  -- Πρωτεύον κλειδί, αυτόματο αύξοντας
  user_id INT,  -- Εξωτερικό κλειδί που αναφέρεται στον χρήστη που καταχώρησε την προσφορά
  product_id INT,  -- Εξωτερικό κλειδί που αναφέρεται στο προϊόν της προσφοράς
  discount DECIMAL(5, 2) NOT NULL,  -- Έκπτωση της προσφοράς, χωρίς να επιτρέπονται κενά
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Χρονική σήμανση της προσφοράς
  FOREIGN KEY (user_id) REFERENCES users(user_id),  -- Σύνδεση με τον πίνακα "users"
  FOREIGN KEY (product_id) REFERENCES products(product_id)  -- Σύνδεση με τον πίνακα "products"
);

-- Πίνακας "likes": Αποθηκεύει πληροφορίες για τα "likes" σε προσφορές
CREATE TABLE likes (
  like_id INT PRIMARY KEY AUTO_INCREMENT,  -- Πρωτεύον κλειδί, αυτόματο αύξοντας
  user_id INT,  -- Εξωτερικό κλειδί που αναφέρεται στον χρήστη που έκανε το "like"
  offer_id INT,  -- Εξωτερικό κλειδί που αναφέρεται στην προσφορά που έγινε "like"
  FOREIGN KEY (user_id) REFERENCES users(user_id),  -- Σύνδεση με τον πίνακα "users"
  FOREIGN KEY (offer_id) REFERENCES offers(offer_id)  -- Σύνδεση με τον πίνακα "offers"
);
