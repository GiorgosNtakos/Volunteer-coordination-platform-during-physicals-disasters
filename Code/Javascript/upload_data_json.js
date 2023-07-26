// Στον φορτωμένο από την HTML κώδικα, προσθέτουμε έναν listener στο κουμπί.
document.addEventListener('DOMContentLoaded', () => {
    const loadDataBtn = document.getElementById('loadDataBtn');
    loadDataBtn.addEventListener('click', () => {
      loadDataFromPHP();
    });
  });
  
  // Η συνάρτηση loadDataFromPHP() καλεί το PHP script που επιστρέφει τα δεδομένα από τη βάση.
  // Αν πάρουμε επιτυχώς τα δεδομένα σε JSON μορφή, τότε καλούμε την insertDataToDatabase().
  function loadDataFromPHP() {
    fetch('../PHP/upload_call_data_base.php')
      .then((response) => response.json())
      .then((data) => {
        insertDataToDatabase(data);
      })
      .catch((error) => {
        console.error('Σφάλμα κατά τη φόρτωση δεδομένων:', error);
      });
  }
  
  // Η συνάρτηση insertDataToDatabase(data) υλοποιεί την εισαγωγή δεδομένων στη βάση δεδομένων.
  // Επίσης, εδώ πρέπει να χρησιμοποιήσουμε κατάλληλα indexes στους πίνακες για να επιταχύνουμε
  // τα queries και bulk inserts για να εισάγουμε πολλά δεδομένα μαζί και όχι ένα-ένα.
  function insertDataToDatabase(data) {
    // Εδώ πρέπει να υλοποιήσουμε τον κώδικα για την εισαγωγή δεδομένων στη βάση δεδομένων.
    // Ο κώδικας εξαρτάται από τις απαιτήσεις και τη δομή της βάσης δεδομένων μας.
    // Χρησιμοποιούμε κατάλληλα indexes και bulk inserts για να βελτιστοποιήσουμε τις επιδόσεις.
  }
  