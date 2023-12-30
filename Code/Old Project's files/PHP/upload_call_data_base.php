<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500'); 
header('Content-Type: application/json');
require 'db_connect.php';
$conn->set_charset("utf8");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_FILES["data-file"]) && $_FILES["data-file"]["error"] === UPLOAD_ERR_OK) {
        $uploadedFile = $_FILES["data-file"]["tmp_name"];
        $jsonData = file_get_contents($uploadedFile);
        $data = json_decode($jsonData, true); // Convert JSON to array


        $Final_Response = array();
        $missingSubcategories = array();
        
        // Δημιουργία πίνακα μηνυμάτων απόκρισης για κάθε κατάσταση
        $responseMessages = array(
            "exists_category" => array(),
            "exists_subcategory" => array(),
            "exists_product" => array(),
            "missing_200" => array(),
            "server_error" => array()
        );

        $existsData = array();
        $existsCategories = array();
        $existsSubcategories = array();
        $existsProducts = array();

        $missingSubcategories = array();

         // Αποθηκεύστε τα δεδομένα κατηγοριών
         foreach ($data["categories"] as $category) {
            $category_id = $conn->real_escape_string($category["id"]);
            $category_name = $conn->real_escape_string($category["name"]);

            $CategoryExists = "SELECT * FROM categories WHERE category_id= ?";
            $stmt_check_categories = $conn->prepare($CategoryExists);
            $stmt_check_categories->bind_param("s", $category_id );
            $stmt_check_categories->execute();
            $result_categories = $stmt_check_categories->get_result();

            if($result_categories->num_rows > 0){

                $responseMessages["exists_category"][] = "Η κατηγορία '" . $category_name . "' που εισάγεται υπάρχει ήδη.";
                $existsCategories[] = array($category_name);

            } else{

            // Υλοποίηση της προσθήκης στον πίνακα categories εδώ
            $sql = "INSERT INTO categories (category_id, name) VALUES (? , ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ss", $category_id, $category_name);

            if ($stmt->execute()) {

                $responseMessages["created_category"][] = "Η κατηγορία '" . $category_name . "' εισήχθη επιτυχώς";

            } else{
                
                $responseMessages["server_error"][] = "Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.";

            }
          }
        }
            // Αποθηκεύστε τα δεδομένα υποκατηγοριών για αυτήν την κατηγορία
            foreach ($data["categories"] as $category) {
                if (isset($category["subcategories"])) {
                    foreach ($category["subcategories"] as $subcategory) {
                        $subcategory_name = $conn->real_escape_string($subcategory["name"]);
                        $subcategory_id = $conn->real_escape_string($subcategory["uuid"]);
    
                        $SubcategoryExists = "SELECT * FROM subcategories WHERE subcategory_id= ?";
                        $stmt_check_Subcategories = $conn->prepare($SubcategoryExists);
                        $stmt_check_Subcategories->bind_param("s", $subcategory_id);
                        $stmt_check_Subcategories->execute();
                        $result_Subcategories = $stmt_check_Subcategories->get_result();
    
                        if ($result_Subcategories->num_rows > 0) {
                            // Η υποκατηγορία υπάρχει
                            $responseMessages["exists_subcategory"][] = "Η υποκατηγορία '" . $subcategory_name . "' που εισάγεται υπάρχει ήδη.";
                            $existsSubcategories[] = array($subcategory_name);

                        } else {
                            // Προσθήκη στον πίνακα subcategories
                            $sql = "INSERT INTO subcategories (subcategory_id, name, category_id) VALUES (?, ?, ?)";
                            $stmt = $conn->prepare($sql);
                            $stmt->bind_param("sss", $subcategory_id, $subcategory_name, $category_id);
    
                            if ($stmt->execute()) {
                                $responseMessages["created_subcategory"][] = "Η υποκατηγορία '" . $subcategory_name . "' εισήχθη επιτυχώς";

                            } else {
                                $responseMessages["server_error"][] = "Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.";
                            }
                        }
                    }
                } else {

                    $responseMessages["missing_200"][] = "Η κατηγορία '" . $category["name"] . "' δεν περιέχει κάποια υποκατηγορία";
                    $missingSubcategories[] = $category["name"];
                    
                }
            }
    

        foreach ($data["products"] as $products) {
            $id = $conn->real_escape_string($products["id"] + 1);
            $name = $conn->real_escape_string($products["name"]);
            $name = stripslashes($name);
            $category_id = $conn->real_escape_string($products["category"]);
            $subcategory_id = $conn->real_escape_string($products["subcategory"]);
            $price = "ενα";

            // Έλεγχος αν το προϊόν υπάρχει ήδη (με βάση το ID)
            $ProductExists = "SELECT * FROM products WHERE product_id= ?";
            $stmt_check_product = $conn->prepare($ProductExists);
            $stmt_check_product->bind_param("s", $id);
            $stmt_check_product->execute();
            $result_product = $stmt_check_product->get_result();

            if ($result_product->num_rows > 0) {
                // Το προϊόν υπάρχει
                $responseMessages["exists_product"][] = "Το προϊόν με ID '" . $id . "' υπάρχει ήδη.";
                $existsProducts[] = array($name);

            } else {
                // Προσθήκη στον πίνακα products
                $sql = "INSERT INTO products (product_id, name, category_id, subcategory_id, price) VALUES (?, ?, ?, ?, ?)";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("issss", $id, $name, $category_id, $subcategory_id, $price);
            
                if ($stmt->execute()) {

                    $responseMessages["created_product"][] = "Το προϊόν με ID '" . $id . "' εισήχθη επιτυχώς";

                } else {

                    $responseMessages["server_error"][] = "Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.";
                    
                }
            }
        }
        

        
        if (!empty($responseMessages["server_error"])) {
            $Final_Response = array(
                "status" => "server_error",
                "message" => "Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά."
            );
            http_response_code(500);
        } elseif (!empty($responseMessages["exists_category"]) || !empty($responseMessages["exists_subcategory"]) || !empty($responseMessages["exists_product"])) {
            $categoriesQuery = "SELECT * FROM categories";
            $subcategoriesQuery = "SELECT * FROM subcategories";
            $productsQuery = "SELECT * FROM products";

            $categoriesResult = $conn->query($categoriesQuery);
            $subcategoriesResult = $conn->query($subcategoriesQuery);
            $productsResult = $conn->query($productsQuery);

            $dataCreated = array(
                "categories" => $categoriesResult->fetch_all(MYSQLI_ASSOC),
                "subcategories" => $subcategoriesResult->fetch_all(MYSQLI_ASSOC),
                "products" => $productsResult->fetch_all(MYSQLI_ASSOC)
            );

            $existsData = array(
                "Κατηγορίες" => $existsCategories,
                "Υποκατηγορίες" => $existsSubcategories,
                "Προϊόντα" => $existsProducts
            );

            $Final_Response = array(
                "status" => "exists",
                "message" => "Τα δεδομενα ανέβηκαν επιτυχώς πέρα από την/τις κατηγορία/ες, το/τα προϊον/όντα, την/τις υποκατηγορία/ες που υπήρχαν ήδη",
                "data_created" => $dataCreated,
                "data_exists" => $existsData
            );
        } elseif (!empty($responseMessages["missing_204"])) {
            $Final_Response = array(
                "status" => "missing_200",
                "message" => "Κάποια/ες κατηγορία/ες δεν περιέχει/ουν κάποια/ες υποκατηγορία/ες",
                "missing_data" => $missingSubcategories
            );
            http_response_code(200);
        } else {
            $categoriesQuery = "SELECT * FROM categories";
            $subcategoriesQuery = "SELECT * FROM subcategories";
            $productsQuery = "SELECT * FROM products";

            $categoriesResult = $conn->query($categoriesQuery);
            $subcategoriesResult = $conn->query($subcategoriesQuery);
            $productsResult = $conn->query($productsQuery);

            $allData = array(
                "categories" => $categoriesResult->fetch_all(MYSQLI_ASSOC),
                "subcategories" => $subcategoriesResult->fetch_all(MYSQLI_ASSOC),
                "products" => $productsResult->fetch_all(MYSQLI_ASSOC)
            );

            http_response_code(201);
            $Final_Response = array(
                "status" => "data_created",
                "message" => "Τα δεδομένα ανέβηκαν επιτυχώς !",
                "data" => $allData
            );
        }
    } else {
        $Final_Response = array(
            "status" => "missing_400",
            "message" => "Σφάλμα κατά το ανέβασμα του αρχείου ή λείπει από το αίτημα POST."
        );
        http_response_code(400); // Κωδικός HTTP 400 - Λανθασμένο αίτημα
        
    }
} else {
    $Final_Response = array(
        "status" => "wrong_method_405",
        "message" => "Μη έγκυρη αίτηση."
    );
    http_response_code(405); // Κωδικός HTTP 400 - Λανθασμένο αίτημα
    
}

$conn->close();
echo json_encode($Final_Response);
?>