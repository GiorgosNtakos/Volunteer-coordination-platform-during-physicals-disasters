// * Header call function in HTML pages where need it

$(document).ready(function () {
  // Load common.html content into #commonContent div
  $("#Header").load("../../Html/Global/Header.html", function() {
    updateHeaderTitle(); // Εκτελέστε μετά την φόρτωση του Header
  });
});

function updateHeaderTitle() {
  const pageTitles = {
    'index.html': 'Αρχική Σελίδα',
    'map.html': 'Χάρτης',
    'upload_products.html': 'Διαχείριση Ειδών',
    'form_completion.html': 'Δημιουργία Διασώστη/Οχήματος',
    'user_profile_settings.html': 'Επεξεργασία Προφίλ',
    'admin_announcements.html': 'Διαχείριση Ανακοινώσεων',
    'cargo_page.html': 'Διαχείριση Φορτίου Οχήματος',
    'offers_page.html': 'Διαχείριση Προσφορών',
    'personal_info_form.html': 'Υποχρεωτική Φόρμα Προσωπικών στοιχείων',
    'request_page.html': 'Διαχείριση Αιτήσεων',
    'choose_vehicle.html': 'Επιλογή Οχήματος',
    'choose_vehicle.html': 'Επιλογή Οχήματος',

  };

  const pathname = window.location.pathname.split("/").pop();
  const headerTitle = pageTitles[pathname] || 'Προεπιλεγμένος Τίτλος';
  $('.header-center h1').text(headerTitle);
}
