-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 09, 2024 at 06:09 PM
-- Server version: 5.7.31
-- PHP Version: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `my_sql_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcementitems`
--

DROP TABLE IF EXISTS `announcementitems`;
CREATE TABLE IF NOT EXISTS `announcementitems` (
  `announcement_id` varchar(36) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `covered_quantity` int(11) DEFAULT '0',
  PRIMARY KEY (`announcement_id`,`item_id`),
  KEY `item_id` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `announcementitems`
--

INSERT INTO `announcementitems` (`announcement_id`, `item_id`, `quantity`, `covered_quantity`) VALUES
('103577c3-5e47-4ceb-ab7d-4eb08652aaf4', 36, 3, 0),
('8dbeb748-cdd1-4432-84b9-c85dd9c9e1ac', 16, 15, 10),
('8e701606-9697-4bd3-ae6d-0a85a3fba719', 91, 3, 0),
('b1773285-3e55-41cc-9274-9d5c53aff450', 21, 15, 0),
('e377aa09-0db6-49f7-ab83-9fe15f3703cc', 16, 5, 0),
('e377aa09-0db6-49f7-ab83-9fe15f3703cc', 17, 7, 7),
('e377aa09-0db6-49f7-ab83-9fe15f3703cc', 18, 8, 8),
('fe1a3cf8-2693-4eba-81d9-0a56973e6138', 16, 25, 0),
('fe1a3cf8-2693-4eba-81d9-0a56973e6138', 25, 25, 0);

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
CREATE TABLE IF NOT EXISTS `announcements` (
  `id` varchar(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `expiry_date` timestamp NULL DEFAULT NULL,
  `is_hidden` tinyint(1) DEFAULT '0',
  `user_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `created_at`, `updated_at`, `expiry_date`, `is_hidden`, `user_id`) VALUES
('103577c3-5e47-4ceb-ab7d-4eb08652aaf4', '2024-06-17 18:21:44', '2024-06-17 18:21:44', NULL, 0, '5dadc711-2fe7-4907-a42a-9167779b9b94'),
('8dbeb748-cdd1-4432-84b9-c85dd9c9e1ac', '2024-06-17 18:21:09', '2024-06-17 18:21:09', NULL, 0, '5dadc711-2fe7-4907-a42a-9167779b9b94'),
('8e701606-9697-4bd3-ae6d-0a85a3fba719', '2024-06-17 18:21:53', '2024-06-17 18:21:53', NULL, 0, '5dadc711-2fe7-4907-a42a-9167779b9b94'),
('b1773285-3e55-41cc-9274-9d5c53aff450', '2024-06-17 18:21:36', '2024-06-17 18:21:36', NULL, 0, '5dadc711-2fe7-4907-a42a-9167779b9b94'),
('e377aa09-0db6-49f7-ab83-9fe15f3703cc', '2024-06-17 18:20:58', '2024-06-17 18:20:58', NULL, 0, '5dadc711-2fe7-4907-a42a-9167779b9b94'),
('fe1a3cf8-2693-4eba-81d9-0a56973e6138', '2024-06-17 18:21:28', '2024-06-17 18:21:28', NULL, 0, '5dadc711-2fe7-4907-a42a-9167779b9b94');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  `active` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_name` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `category_name`, `active`, `created_at`, `updated_at`) VALUES
(5, 'Food', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(6, 'Beverages', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(7, 'Clothing', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(14, 'Flood', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(16, 'Medical Supplies', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(19, 'Shoes', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(21, 'Personal Hygiene ', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(22, 'Cleaning Supplies', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(23, 'Tools', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(24, 'Kitchen Supplies', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(25, 'Baby Essentials', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(26, 'Insect Repellents', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(27, 'Electronic Devices', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(28, 'Cold weather', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(29, 'Animal Food', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(30, 'Financial support', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(33, 'Cleaning Supplies.', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(34, 'Hot Weather', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(35, 'First Aid ', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(40, 'test1', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(41, 'pet supplies', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(42, 'Μedicines', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(43, 'Energy Drinks', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(44, 'Disability and Assistance Items', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(45, 'Communication items', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(46, 'communications', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(47, 'Humanitarian Shelters', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(48, 'Water Purification', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(49, 'Animal Care', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(50, 'Earthquake Safety', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(51, 'Sleep Essentilals', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(52, 'Navigation Tools', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(53, 'Clothing and cover', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(54, 'Tools and Equipment', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(56, 'Special items', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(57, 'Household Items', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(59, 'Books', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11'),
(60, 'Fuel and Energy', 0, '2024-06-17 17:47:11', '2024-06-17 17:47:11');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
CREATE TABLE IF NOT EXISTS `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `category_id` int(11) DEFAULT NULL,
  `details` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=275 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `name`, `created_at`, `updated_at`, `category_id`, `details`) VALUES
(16, 'Water', '2024-06-17 18:10:43', '2024-07-09 18:08:45', 6, 'volume: 1.5l,\r\n pack size: 6'),
(17, 'Orange juice', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 6, 'volume: 250ml,\n pack size: 12'),
(18, 'Sardines', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'brand: Trata,\n weight: 200g'),
(19, 'Canned corn', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'weight: 500g'),
(20, 'Bread', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'weight: 1kg,\n type: white'),
(21, 'Chocolate', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'weight: 100g,\n type: milk chocolate,\n brand: ION'),
(22, 'Men Sneakers', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 7, 'size: 44'),
(24, 'Test Val', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 14, 'Details: 600ml'),
(25, 'Spaghetti', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'grams: 500'),
(26, 'Croissant', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'calories: 200'),
(29, 'Biscuits', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, ''),
(30, 'Bandages', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, ''),
(31, 'Disposable gloves', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, ''),
(32, 'Gauze', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, ''),
(33, 'Antiseptic', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, ''),
(34, 'First Aid Kit', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, ''),
(35, 'Painkillers', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, 'volume: 200mg'),
(36, 'Blanket', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 7, 'size: 50\" x 60\"'),
(37, 'Fakes', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, ''),
(38, 'Menstrual Pads', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 21, 'stock: 500,\n size: 3,\n '),
(39, 'Tampon', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 21, 'stock: 500,\n size: regular'),
(40, 'Toilet Paper', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 21, 'stock: 300,\n ply: 3'),
(41, 'Baby wipes', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 21, 'volume: 500gr,\n stock : 500,\n scent: aloe'),
(42, 'Toothbrush', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 21, 'stock: 500'),
(43, 'Toothpaste', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 21, 'stock: 250'),
(44, 'Vitamin C', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, 'stock: 200'),
(45, 'Multivitamines', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, 'stock: 200'),
(46, 'Paracetamol', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, 'stock: 2000,\n dosage: 500mg'),
(47, 'Ibuprofen', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, 'stock : 10,\n dosage: 200mg'),
(51, 'Cleaning rag', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 22, ''),
(52, 'Detergent', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 22, ''),
(53, 'Disinfectant', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 22, ''),
(54, 'Mop', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 22, ''),
(55, 'Plastic bucket', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 22, ''),
(56, 'Scrub brush', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 22, ''),
(57, 'Dust mask', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 22, ''),
(58, 'Broom', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 22, ''),
(59, 'Hammer', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 23, ''),
(60, 'Skillsaw', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 23, ''),
(61, 'Prybar', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 23, ''),
(62, 'Shovel', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 23, ''),
(63, 'Flashlight', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 23, ''),
(64, 'Duct tape', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 23, ''),
(65, 'Underwear', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 7, ''),
(66, 'Socks', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 7, ''),
(67, 'Warm Jacket', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 7, ''),
(68, 'Raincoat', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 7, ''),
(69, 'Gloves', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 7, ''),
(70, 'Pants', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 7, ''),
(71, 'Boots', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 7, ''),
(72, 'Dishes', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 24, ''),
(73, 'Pots', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 24, ''),
(74, 'Paring knives', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 24, ''),
(75, 'Pan', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 24, ''),
(76, 'Glass', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 24, ''),
(85, 'Coca Cola', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 6, 'Volume: 500ml'),
(86, 'spray', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 26, 'volume: 75ml'),
(87, 'Outdoor spiral', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 26, 'duration: 7 hours'),
(88, 'Baby bottle', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 25, 'volume: 250ml'),
(89, 'Pacifier', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 25, 'material: silicone'),
(90, 'Condensed milk', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'weight: 400gr'),
(91, 'Cereal bar', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'weight: 23,5gr'),
(92, 'Pocket Knife', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 23, 'Number of different tools: 3,\n Tool: Knife,\n Tool: Screwdriver,\n Tool: Spoon'),
(93, 'Water Disinfection Tablets', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, 'Basic Ingredients: Iodine,\n Suggested for: Everyone expept pregnant women'),
(94, 'Radio', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 27, 'Power: Batteries,\n Frequencies Range: 3 kHz - 3000 GHz'),
(95, 'Kitchen appliances', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 14, ''),
(96, 'Winter hat', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 28, ''),
(97, 'Winter gloves', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 28, ''),
(98, 'Scarf', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 28, ''),
(99, 'Thermos', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 28, ''),
(100, 'Tea', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 6, 'volume: 500ml'),
(101, 'Dog Food ', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 29, 'volume: 500g'),
(102, 'Cat Food', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 29, 'volume: 500g'),
(103, 'Canned', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, ''),
(104, 'Chlorine', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 22, 'volume: 500ml'),
(105, 'Medical gloves', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 22, 'volume: 20pieces'),
(106, 'T-Shirt', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 7, 'size: XL'),
(107, 'Cooling Fan', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 34, ''),
(108, 'Cool Scarf', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 34, ''),
(109, 'Whistle', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 23, ''),
(110, 'Blankets', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 28, ''),
(111, 'Sleeping Bag', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 28, ''),
(114, 'Thermometer', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, ''),
(115, 'Rice', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, ''),
(117, 'Towels', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 22, ''),
(118, 'Wet Wipes', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 22, ''),
(119, 'Fire Extinguisher', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 23, ''),
(120, 'Fruits', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, ''),
(123, 'Αθλητικά', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 19, ''),
(124, 'Πασατέμπος', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, ''),
(126, 'Betadine', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 35, 'Povidone iodine 10%: 240 ml'),
(127, 'cotton wool', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 35, '100% Hydrofile: 70gr'),
(128, 'Crackers', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'Quantity per package: 10,\n Packages: 2'),
(129, 'Sanitary Pads', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 21, 'piece: 10 pieces,\n '),
(130, 'Sanitary wipes', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 21, 'pank: 10 packs'),
(131, 'Electrolytes', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, 'packet of pills: 20 pills'),
(132, 'Pain killers', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, 'packet of pills: 20 pills'),
(134, 'Juice', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 6, 'volume: 500ml'),
(136, 'Sterilized Saline', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, 'volume: 100ml'),
(138, 'Antihistamines', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, 'pills: 10 pills'),
(139, 'Instant Pancake Mix', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, ''),
(140, 'Lacta', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'weight: 105g'),
(141, 'Canned Tuna', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, ''),
(142, 'Batteries', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 23, ''),
(144, 'Can Opener', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 23, ''),
(146, 'Πατατάκια', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'weight: 45g'),
(147, 'Σερβιέτες', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 21, 'pcs: 18'),
(148, 'Dry Cranberries', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'weight: 100'),
(149, 'Dry Apricots', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'weight: 100'),
(150, 'Dry Figs', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'weight: 100'),
(151, 'Παξιμάδια', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'weight: 200g'),
(155, 'Tampons', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, ''),
(156, 'plaster set', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 41, ''),
(157, 'elastic bandages', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 41, ''),
(158, 'traumaplast', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 41, ''),
(159, 'thermal blanket', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 41, ''),
(160, 'burn gel', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 41, 'ml: 500'),
(161, 'pet carrier', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 41, ''),
(162, 'pet dishes', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 41, ''),
(163, 'plastic bags', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 41, ''),
(164, 'toys', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 41, ''),
(165, 'burn pads', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 41, ''),
(166, 'cheese', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'grams: 1000'),
(167, 'lettuce', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'grams: 500'),
(168, 'eggs', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'pair: 10'),
(169, 'steaks', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'grams: 1000'),
(170, 'beef burgers', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'grams: 500'),
(171, 'tomatoes', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'grams: 1000'),
(172, 'onions', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'grams: 500'),
(173, 'flour', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'grams: 1000'),
(174, 'pastel', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, ''),
(175, 'nuts', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, 'grams: 500'),
(176, 'dramamines', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 42, ''),
(177, 'nurofen', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 42, ''),
(178, 'imodium', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 42, ''),
(179, 'emetostop', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 42, ''),
(180, 'xanax', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 42, ''),
(181, 'saflutan', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 42, ''),
(182, 'sadolin', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 42, ''),
(183, 'depon', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 42, ''),
(184, 'panadol', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 42, ''),
(185, 'ponstan ', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 42, ''),
(186, 'algofren', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 42, '10: 600ml,\n '),
(187, 'effervescent depon', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 42, '67: 1000mg'),
(188, 'cold coffee', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 6, '10: 330ml'),
(189, 'Hell', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 43, '22: 330'),
(190, 'Monster', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 43, '31: 500ml'),
(191, 'Redbull', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 43, '40: 330ml'),
(192, 'Powerade', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 43, '23: 500ml'),
(193, 'PRIME', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 43, '15: 500ml'),
(194, 'Lighter', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 23, '16: Mini'),
(195, 'isothermally shirts', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 28, '5: Medium,\n 6: Large,\n 10: Small,\n 2: XL'),
(198, 'Shorts', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 34, ''),
(199, 'Chicken', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, '5: 1.5kg'),
(202, 'sanitary napkins', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 21, '30: 500g'),
(203, 'COVID-19 Tests', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, ''),
(204, 'Club Soda', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 6, 'volume: 500ml'),
(205, 'Wheelchairs', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 44, 'quantity: 100'),
(206, 'mobile phones', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 45, 'iphone: 200'),
(207, 'spoon', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 24, ''),
(208, 'fork', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 24, ''),
(209, 'MOTOTRBO R7', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 45, 'band: UHF/VHF,\n Wi-Fi: 2,4/5,0 GHz,\n Bluetooth: 5.2,\n Οθόνη: 2,4” 320 x 240 px. QVGA,\n διάρκεια ζωής της μπαταρίας: 28 ώρες'),
(210, 'RM LA 250 (VHF Linear Ενισχυτής 140-150MHz)', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 45, 'Frequency: 140-150Mhz,\n Power Supply: 13VDC /- 1V 40A,\n Output RF Power (Nominal): 30 – 210W ; 230W max AM/FM/CW,\n Modulation Types: SSB,CW,AM, FM, data etc (All narrowband modes)'),
(211, 'Humanitarian General Purpose Tent System (HGPTS)', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 47, 'PART NUMBER: C14Y016X016-T,\n CONTRACTOR NAME:: CELINA Tent, Inc,\n COLOR: Tan,\n SET-UP TIME/NUMBER OF PERSONS: 4 People/30 Minutes'),
(212, 'CELINA Dynamic Small Shelter ', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 47, 'dimensions:  20’x32.5’,\n TYPE: Frame Structure, Expandable, Air-Transportable,\n WEIGHT: 1,200 lbs'),
(213, 'Multi-purpose Area Shelter System, Type-I', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 47, 'TYPE: Frame Structure, Expandable, Air- Transportable,\n DIMENSIONS: E I-40’x80’,\n WEIGHT: 24,000 lbs'),
(214, 'Trousers', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 7, ''),
(215, 'Shoes', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 7, ''),
(216, 'Hoodie', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 7, ''),
(220, 'macaroni', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, ''),
(225, 'Silver blanket', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 50, ''),
(226, 'Helmet', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 50, ''),
(227, 'Disposable toilet', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 50, ''),
(228, 'Self-generated flashlight', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 50, ''),
(229, 'Mattresses ', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 51, 'size: 1.90X60'),
(231, 'matches', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 51, 'pack: 60'),
(232, 'Heater', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 51, 'Volts: 208'),
(233, 'Earplugs', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 51, 'material: plastic'),
(234, 'Compass', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 52, 'Type: Digital'),
(235, 'Map', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 52, 'Material: Paper'),
(236, 'GPS', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 52, 'Type: Waterproof'),
(237, 'First Aid', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, '1: 1,\n '),
(238, 'Bandage', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, ''),
(239, 'Mask', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, ''),
(240, 'Medicines', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 16, ''),
(242, 'Canned Goods', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, '2: 80g'),
(243, 'Snacks', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, '3: 100g'),
(244, 'Cereals', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 5, '1: 800g'),
(246, 'Shirt', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 53, ''),
(250, 'Caps', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 53, ''),
(254, 'Repair Tools', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 54, ''),
(255, 'Soap and Shampoo', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 21, '1: 200ml'),
(256, 'Toothpastes and Toothbrushes', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 21, ''),
(258, 'Diapers', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 56, ''),
(259, 'Animal food', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 56, ''),
(261, 'Plates', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 57, ''),
(262, 'Cups', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 57, ''),
(263, 'Cutlery ', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 57, ''),
(264, 'Cleaning Supplies', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 57, ''),
(266, 'Home Repair Tools', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 57, ''),
(268, 'Lord of the Rings', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 59, 'pages: 230'),
(272, 'Gasoline', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 60, 'galons: 20'),
(273, 'Power Banks', '2024-06-17 18:10:43', '2024-06-17 18:10:43', 60, 'quantity: 5');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` varchar(36) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `type` enum('Offer','Request') DEFAULT NULL,
  `status` enum('pending','declined','accepted','completed') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `item_id` int(11) DEFAULT NULL,
  `vehicle_id` varchar(36) DEFAULT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `announcement_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vehicle_item_unique` (`user_id`,`item_id`,`announcement_id`),
  KEY `vehicle_id` (`vehicle_id`),
  KEY `item_id` (`item_id`),
  KEY `announcement_id` (`announcement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `quantity`, `type`, `status`, `created_at`, `updated_at`, `item_id`, `vehicle_id`, `user_id`, `announcement_id`) VALUES
('808577f5-510d-4f04-89bf-ecb42cb79a00', 7, 'Offer', 'pending', '2024-06-17 18:44:13', '2024-06-17 18:44:13', 17, NULL, '25b8a945-6540-4754-85e4-3b75a728deeb', 'e377aa09-0db6-49f7-ab83-9fe15f3703cc'),
('b6183b24-a0aa-43d5-83dd-98c4add6e999', 10, 'Offer', 'pending', '2024-06-17 18:43:19', '2024-06-17 18:43:19', 16, NULL, '25b8a945-6540-4754-85e4-3b75a728deeb', '8dbeb748-cdd1-4432-84b9-c85dd9c9e1ac'),
('c185f34f-738b-4f9a-9ef2-bd48faab7818', 14, 'Request', 'accepted', '2024-06-17 18:39:12', '2024-06-17 19:06:55', 16, '13b8de4a-529e-46e7-b14e-2dc22a5fe8d9', 'ea51055f-8b15-4aee-b206-fbbc101f3cf3', NULL),
('f28f3ce2-144d-499b-8320-3052c6a35484', 10, 'Request', 'pending', '2024-06-17 18:38:59', '2024-06-17 18:38:59', 16, NULL, 'ea51055f-8b15-4aee-b206-fbbc101f3cf3', NULL),
('f79db8c8-4b3f-42ce-977e-f85376506388', 30, 'Request', 'accepted', '2024-06-17 18:40:11', '2024-06-17 19:01:41', 17, '13431a0c-f8bf-46c9-b57e-2c8de1dca919', 'a99163df-5109-4d33-a666-f8d92856d8cd', NULL),
('fd1edee0-f483-4e2d-9ccb-305939f40689', 8, 'Offer', 'accepted', '2024-06-17 18:44:46', '2024-06-17 19:07:02', 18, '13b8de4a-529e-46e7-b14e-2dc22a5fe8d9', '4162ae84-3fa6-4490-b4c0-81e1f1d78755', 'e377aa09-0db6-49f7-ab83-9fe15f3703cc'),
('fe1f54b2-b657-4ebc-8f3e-e91a6fb8e4c2', 20, 'Request', 'pending', '2024-06-17 18:42:12', '2024-06-17 18:42:12', 18, NULL, 'e906aacb-7eba-4b78-8f10-d9fa000a31c0', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(36) NOT NULL,
  `username` varchar(85) NOT NULL,
  `password` varchar(85) NOT NULL,
  `email` varchar(85) NOT NULL,
  `full_name` varchar(85) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `number` int(11) DEFAULT NULL,
  `town` varchar(255) DEFAULT NULL,
  `type` enum('Admin','Rescuer','Citizen') DEFAULT NULL,
  `location_lat` decimal(10,8) DEFAULT NULL,
  `location_lon` decimal(11,8) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `img_path` varchar(255) DEFAULT '../../../upload_img/global/user.png',
  `formCompleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `full_name` (`full_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `full_name`, `phone`, `street`, `number`, `town`, `type`, `location_lat`, `location_lon`, `created_at`, `updated_at`, `img_path`, `formCompleted`) VALUES
('16ead8af-9861-45b0-9dc8-c6d3d8db085a', 'Giannis_Foysekis', '$2y$10$WHgy/ETVMCORPChfckEjEegVr4U8dF3G1L5ef/ETpVHRlGzg8LzEi', 'Giannis_Foysekis@VolunteersInAction.gr', 'Γιάννης Φουσέκης', '+30 6901451234', 'Ρήγα Φεραίου', 115, 'Πάτρα', 'Rescuer', '38.24652305', '21.73364310', '2024-06-17 21:15:56', '2024-06-17 21:47:55', '../../../upload_img/global/user.png', 0),
('25b8a945-6540-4754-85e4-3b75a728deeb', 'politis_3', '$2y$10$pK1upExp3.Bb/qQbmM9Tb.fUSwcVDKOJVv.6197uZNstQjvwLhwdm', 'politis_3@gmail.com', 'Ντίμης Χόφμαν', '+30 6931242441', 'Παντανάσσης', 27, 'Πάτρα', 'Citizen', '38.24571025', '21.73340706', '2024-06-17 21:24:00', '2024-06-17 21:31:56', '../../../upload_img/global/user.png', 1),
('4162ae84-3fa6-4490-b4c0-81e1f1d78755', 'politis_4', '$2y$10$1SqRbkijHxvfK64LSwY8cuNxrIoRIW7Q4.qPDLM9YuNSjW6BRt9a2', 'politis_4@gmail.com', 'Ζάχος Δόγκανος', '+30 6945218469', 'Μαιζώνος', 137, 'Πάτρα', 'Citizen', '38.24540970', '21.73352910', '2024-06-17 21:25:23', '2024-06-17 21:33:40', '../../../upload_img/global/user.png', 1),
('5dadc711-2fe7-4907-a42a-9167779b9b94', 'Giorgos_Ntakos', '$2y$10$aQYxvcG5TKV/k6oDDGgYV.k3aipxvMmMglun.fEYScMG4FwGfVOVy', 'giorgos-1001@VolunteersInAction.gr', 'Γιώργος Ντάκος', '+30 6948758669', 'Ζαΐμη', 14, 'Αγία Παρασκευή', 'Admin', '38.01503500', '23.84104500', '2024-06-17 20:26:18', '2024-06-17 20:29:00', '../../../upload_img/admin/5dadc711-2fe7-4907-a42a-9167779b9b94.jpg', 0),
('9ae9685b-67af-424e-8bff-fd8853e83dad', 'Maria_Ntai', '$2y$10$8UAAZs.7zgx/AKSfJwRtNuOCQxmpfc2NAkm8KC40I7Ae3dEC9TMra', 'Maria_Ntai@VolunteersInAction.gr', 'Μαρία Νταή', '+30 6941455678', 'Πατρέως', 87, 'Πάτρα', 'Rescuer', '38.24418420', '21.73599540', '2024-06-17 21:19:24', '2024-06-17 21:49:11', '../../../upload_img/global/user.png', 0),
('a99163df-5109-4d33-a666-f8d92856d8cd', 'politis_1', '$2y$10$6BfxetW0GE359gOc0YXXFe6MhXmQT0JS3DCyXfvrxyumP1thG0eEi', 'politis_1@gmail.com', 'Λάζαρος Μήτσος', '+30 6951312111', 'Ηφαίστου', 36, 'Πάτρα', 'Citizen', '38.24419615', '21.73690080', '2024-06-17 21:23:50', '2024-06-17 21:28:39', '../../../upload_img/global/user.png', 1),
('b62dd37f-a4b2-4e3c-82bc-077ec732c20e', 'Nikos_Koykos', '$2y$10$d5jOMu1AONaip6A/QegJTuvKBJrs10AB8OYRhQuw.HxuGpvSGL77G', 'Nikos_Koykos@VolunteersInAction.gr', 'Νίκος Κούκος', '+30 6901455555', 'Παντανάσσης', 47, 'Πάτρα', 'Rescuer', '38.24510040', '21.73411000', '2024-06-17 21:50:09', '2024-06-17 21:50:48', '../../../upload_img/global/user.png', 0),
('e906aacb-7eba-4b78-8f10-d9fa000a31c0', 'politis_2', '$2y$10$Ndj5xq6eGP3SmqogCbdU6uHRXlxluxwTUiEL055LNd31qSAS99xru', 'politis_2@gmail.com', 'Μάκης Κοτσάμπασης', '+30 6901234555', 'Δημητρίου Βότση', 58, 'Πάτρα', 'Citizen', '38.24400760', '21.73446870', '2024-06-17 21:23:57', '2024-06-17 21:30:00', '../../../upload_img/global/user.png', 1),
('ea51055f-8b15-4aee-b206-fbbc101f3cf3', 'politis_5', '$2y$10$/9IRmOl1XK.3y3XicH2VV.nXLsXKT/WkHm0LDKKsSlG6Na7NuYJa.', 'politis_5@gmail.com', 'Ντένη Μαρκορά', '+30 6934558669', 'Τσαμαδού', 83, 'Πάτρα', 'Citizen', '38.24222940', '21.73280290', '2024-06-17 21:25:28', '2024-06-17 21:38:14', '../../../upload_img/global/user.png', 1);

-- --------------------------------------------------------

--
-- Table structure for table `vehicleassignments`
--

DROP TABLE IF EXISTS `vehicleassignments`;
CREATE TABLE IF NOT EXISTS `vehicleassignments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vehicle_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `vehicle_id` (`vehicle_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `vehicleassignments`
--

INSERT INTO `vehicleassignments` (`id`, `vehicle_id`, `user_id`) VALUES
(1, '13431a0c-f8bf-46c9-b57e-2c8de1dca919', 'b62dd37f-a4b2-4e3c-82bc-077ec732c20e'),
(2, '13431a0c-f8bf-46c9-b57e-2c8de1dca919', '9ae9685b-67af-424e-8bff-fd8853e83dad'),
(4, '13b8de4a-529e-46e7-b14e-2dc22a5fe8d9', '16ead8af-9861-45b0-9dc8-c6d3d8db085a');

-- --------------------------------------------------------

--
-- Table structure for table `vehiclecargo`
--

DROP TABLE IF EXISTS `vehiclecargo`;
CREATE TABLE IF NOT EXISTS `vehiclecargo` (
  `id` varchar(36) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `item_id` int(11) DEFAULT NULL,
  `vehicle_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vehicle_item_unique` (`vehicle_id`,`item_id`),
  KEY `item_id` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `vehiclecargo`
--

INSERT INTO `vehiclecargo` (`id`, `quantity`, `created_at`, `updated_at`, `item_id`, `vehicle_id`) VALUES
('07419e47-dfca-42c6-ad06-46406bf8d4dd', 32, '2024-06-17 18:52:59', '2024-06-17 18:52:59', 19, '13431a0c-f8bf-46c9-b57e-2c8de1dca919'),
('0f1c81ed-a86c-4b8b-a1b3-0f8f45b67ae7', 50, '2024-06-17 18:52:40', '2024-06-17 18:55:32', 16, '13431a0c-f8bf-46c9-b57e-2c8de1dca919'),
('341b11c3-0ee9-4dc0-9ece-b5268e1617c5', 69, '2024-06-17 18:52:44', '2024-06-17 18:57:25', 17, '13431a0c-f8bf-46c9-b57e-2c8de1dca919'),
('3878aa93-3630-42c6-a277-887f6eaccde2', 37, '2024-06-17 19:05:48', '2024-06-17 19:05:48', 26, '13b8de4a-529e-46e7-b14e-2dc22a5fe8d9'),
('76d4ea79-9ac5-4343-8f8a-66a0a6f23606', 38, '2024-06-17 19:05:37', '2024-06-17 19:05:37', 21, '13b8de4a-529e-46e7-b14e-2dc22a5fe8d9'),
('7a8ac6d1-8760-43e9-bdc8-0595727cb1c4', 47, '2024-06-17 18:53:08', '2024-06-17 18:53:08', 20, '13431a0c-f8bf-46c9-b57e-2c8de1dca919'),
('914fc26f-7e58-4fd6-bdf2-352a37737a43', 105, '2024-06-17 19:05:20', '2024-06-17 19:05:20', 16, '13b8de4a-529e-46e7-b14e-2dc22a5fe8d9'),
('a40a7121-7246-4654-a3db-864055937f90', 100, '2024-06-17 19:05:31', '2024-06-17 19:05:31', 17, '13b8de4a-529e-46e7-b14e-2dc22a5fe8d9'),
('ab9b6358-5d21-488f-a7ad-2dbc9d7b46d6', 4, '2024-06-17 18:52:52', '2024-06-17 18:52:52', 18, '13431a0c-f8bf-46c9-b57e-2c8de1dca919'),
('c74c2e50-fe3c-4738-b6bf-7bcb0926df0a', 65, '2024-06-17 19:06:01', '2024-06-17 19:06:01', 36, '13b8de4a-529e-46e7-b14e-2dc22a5fe8d9');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `assigned_tasks` int(11) DEFAULT '0',
  `street` varchar(255) NOT NULL,
  `number` int(11) DEFAULT NULL,
  `town` varchar(255) NOT NULL,
  `location_lat` decimal(10,8) NOT NULL,
  `location_lon` decimal(11,8) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `assigned_rescuers` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`id`, `name`, `assigned_tasks`, `street`, `number`, `town`, `location_lat`, `location_lon`, `created_at`, `updated_at`, `assigned_rescuers`) VALUES
('13431a0c-f8bf-46c9-b57e-2c8de1dca919', 'Ερμής', 0, 'ÎœÎ±Î¹Î¶ÏŽÎ½Î¿Ï‚', 11, 'Municipal Unit of Patras', '38.24696119', '21.73496906', '2024-06-17 18:12:15', '2024-06-17 18:57:39', 2),
('13b8de4a-529e-46e7-b14e-2dc22a5fe8d9', 'Φροντίδα', 0, 'ÎœÎ±Î¹Î¶ÏŽÎ½Î¿Ï‚', 0, 'Municipal Unit of Patras', '38.24632420', '21.73428583', '2024-06-17 18:14:36', '2024-06-17 19:04:59', 1),
('fc2c88ad-28f2-406b-88ee-6fc608358b02', 'Σωτήρας', 0, 'Ζαΐμη', 14, 'Πάτρα', '38.24903950', '21.73950059', '2024-06-17 18:14:10', '2024-06-17 19:04:13', 0);

-- --------------------------------------------------------

--
-- Table structure for table `warehouse`
--

DROP TABLE IF EXISTS `warehouse`;
CREATE TABLE IF NOT EXISTS `warehouse` (
  `id` varchar(36) NOT NULL,
  `street` varchar(255) NOT NULL,
  `number` int(11) DEFAULT NULL,
  `town` varchar(255) NOT NULL,
  `location_lat` decimal(10,8) NOT NULL,
  `location_lon` decimal(11,8) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `warehouse`
--

INSERT INTO `warehouse` (`id`, `street`, `number`, `town`, `location_lat`, `location_lon`, `created_at`, `updated_at`) VALUES
('cdc4c156-a4e6-4fce-b72b-c147b2908d02', 'Πλ. Γεωρ. Α', 30, 'Πάτρα', '38.24632600', '21.73498400', '2024-06-17 18:07:34', '2024-06-17 18:07:34');

-- --------------------------------------------------------

--
-- Table structure for table `warehouse_stock`
--

DROP TABLE IF EXISTS `warehouse_stock`;
CREATE TABLE IF NOT EXISTS `warehouse_stock` (
  `id` varchar(36) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `item_id` int(11) DEFAULT NULL,
  `warehouse_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `item_id` (`item_id`),
  KEY `warehouse_id` (`warehouse_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `warehouse_stock`
--

INSERT INTO `warehouse_stock` (`id`, `quantity`, `created_at`, `updated_at`, `item_id`, `warehouse_id`) VALUES
('00300929-8742-4dad-9d5e-bcc6ef83c642', 277, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 243, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('0445d935-b6e9-4a65-b147-1dbbcfac2111', 861, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 214, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('058028c9-cfa6-45b9-b981-9964bdf09b59', 304, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 228, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('05974e65-a461-4291-9daa-45ea84f9026d', 759, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 75, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('05e822fd-4fef-443c-8b3c-aa0d9c2060b0', 325, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 188, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('05ec82db-514b-43b4-a89f-ab2edbbf514c', 372, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 268, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('0669d55a-e796-480d-8394-2def3bd3a9dc', 946, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 242, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('07624327-3705-444a-881c-48fc823c822b', 141, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 114, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('07de5349-dfb3-4977-b40c-9aef2105fe0d', 614, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 232, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('07f32d08-36b9-4a69-9912-06ae9aee1391', 644, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 255, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('080d33ef-acec-4a13-97b8-3e84e6cc6fe8', 125, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 115, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('0846f1a5-218e-4213-90b3-bff1ed3e7ef7', 275, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 53, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('08cbebd9-25fd-485b-8782-7af6dab9acd4', 581, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 30, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('0ba1c9d4-a1bb-4b76-b57e-53b84a63ec0c', 704, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 206, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('0c36defa-5a6c-454d-a55e-07bc39a67104', 330, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 44, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('0f9adf89-7fd1-4f72-9859-3d38a8951db9', 512, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 54, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('104edfd3-4501-49c4-92c7-8ce8774b278a', 814, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 104, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('10d50f33-6c74-406e-b093-f5a615d39756', 391, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 239, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('10dde180-2248-48d1-ba3c-42320cc671a2', 701, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 73, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('125b99c3-b6b7-4ff1-9951-1ae50ca9b3ba', 918, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 229, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('13b0beee-13bf-444b-8617-8f700ec7cbd3', 141, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 38, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('154711de-0623-4472-983a-ac6337fd2c3c', 520, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 175, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('15a78010-08e8-4e1d-8479-391854a13a5b', 885, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 76, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('18511166-fed4-4baa-bdb0-01f40aaa65c2', 291, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 52, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('1a4a50d4-357b-43e0-932f-125c9ca4b52d', 455, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 202, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('1e2336fd-07de-4b79-b45d-9dd2149abfc9', 329, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 158, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('1e9f55b4-8097-4331-b8f6-e64d529fe4ce', 320, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 118, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('1efe8687-a7ef-49ab-972f-7d8b30895d6b', 223, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 102, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('21903e51-4d14-4d07-9c2d-e0ce3a8b2382', 428, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 176, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('2255cdc9-688a-44d2-a470-aa3dcfdaf55d', 678, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 250, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('2641fce7-3ab0-473a-8f50-cf5a052fc7f4', 477, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 161, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('2668131d-9c41-4040-8b8e-3b7b68af7303', 388, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 110, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('278c75ee-7b4f-4f02-83ad-40863695694d', 901, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 163, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('28b6ee4e-f8eb-4831-ba72-906ac4247d56', 239, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 227, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('28d9fe51-64f9-44b9-a710-80bb0fa0e733', 454, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 180, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('29a4da0b-c3d5-4ffd-a5a4-0a355a247420', 309, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 238, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('29b31c51-15af-47f2-bf0e-97d24f351f9c', 740, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 140, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('2ae82dd7-2100-4cc8-beb3-24d1fb54567e', 976, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 92, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('2d5c672e-93eb-46ee-8277-cf5443bee6a6', 381, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 231, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('2e900b35-dcb5-4602-9936-45713efc0f32', 113, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 146, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('3415d4f8-bd06-436f-9d96-39a9ed77a4ce', 392, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 33, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('3674da5a-20e6-4cfa-95ee-2eeda1589b63', 861, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 90, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('3851d0e6-f9ed-4352-a8ce-dbf014b0ea74', 174, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 164, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('385c6550-4f09-4383-98cc-7ef5cb391df1', 960, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 156, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('3b03989d-3f1a-443f-a8a1-03a98f4f0b6b', 207, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 211, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('3c9bf846-beb6-4824-8f28-2aeb32fda6ed', 629, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 189, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('3e2d4031-5fe0-4f0e-aeed-c856102b95f8', 990, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 59, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('3f1eaab2-d485-4fee-89e2-b23f9eedda97', 947, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 205, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('430221bc-cdce-445d-a9d7-3c55387674d0', 626, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 108, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('43c7a847-af5c-4586-85b1-9c969c245341', 997, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 47, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('43e910cb-5dd4-452d-ab51-4619e84ac44b', 838, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 167, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('4471d35f-bef3-4438-9f4d-f2be5c4a7d78', 244, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 210, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('44d20631-b9d2-4b84-a81c-1863dd0e7969', 925, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 147, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('47f99429-dde9-4ed7-a2ac-997c8c2dc197', 272, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 169, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('481a4c0d-d04e-474e-bbb1-6548f9bbc2b3', 549, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 212, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('489b311e-c6b8-40de-8727-cea0cb8cfa23', 465, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 192, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('49a6d6c6-b4e3-49ff-8077-253cc7d5d396', 339, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 105, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('4a61761e-a842-4127-adb3-2aba6b86cd6a', 587, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 139, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('4cd37c73-d65e-44b4-ac2b-2657638a8a16', 665, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 226, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('501d8e07-f272-4aad-84d9-a1629363d9a8', 637, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 130, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('515a22a9-57ed-4169-a650-1ada8e13c176', 185, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 65, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('528f1286-ce4c-4384-acbd-628e0050b544', 305, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 171, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('5349b59f-0f75-41f5-8fce-119bfa5b0bd2', 387, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 63, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('537a6852-747d-4996-8035-8807b1fc7492', 138, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 198, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('53f9fafa-e000-4cbc-84a1-a3796b9a046d', 151, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 149, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('570afebd-0381-469b-91d2-c748398d886e', 623, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 96, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('57e1846f-4c04-43d6-923a-bff3932f4532', 238, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 46, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('5a0de37a-e17e-4333-bef3-6a9471f36bde', 617, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 93, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('5a4b42a2-0e86-4fce-b662-ffa7a22b5a2e', 158, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 126, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('5b758aad-6856-449a-a2a4-b77803b8bd3f', 416, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 159, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('5c733283-fecb-4cac-9370-41289019d7ab', 628, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 244, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('5de257d4-ea09-45a4-9fc3-688f9355d5ef', 239, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 157, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('5e55f00c-9522-4e26-9f80-581c792cef29', 299, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 166, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('5fea10eb-52fd-440d-ab96-ad71e8597ab9', 812, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 193, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('600a450f-c1da-42db-98ea-a3de53bfacd5', 273, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 165, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('624249f8-8a78-4831-a69a-e1cdbf5f4c88', 102, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 208, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('6638cfa8-0af7-4025-be79-4abd33223e8a', 445, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 106, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('66ca557e-cdd1-4358-a917-4ab214b5aa91', 878, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 88, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('694a2064-5f75-4fd0-af84-3e70e5442527', 745, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 129, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('696f98a5-a544-4df6-98e5-38f4fa7f923d', 713, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 101, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('6d2845f2-acf9-48a7-bcfa-a3b62cb20f89', 358, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 89, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('6e468579-31fa-46e2-bd83-db57ba254ee3', 873, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 256, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('7092e86d-8fb9-4c78-b839-6f55266aafc9', 535, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 127, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('70e17fc7-acdd-452c-9fae-93067a5916c1', 434, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 34, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('71c44212-e8f3-4a02-9109-b322aa81f976', 925, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 209, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('7258cf1f-ff0f-42e0-a626-7a8859f6c75f', 342, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 155, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('769b5f1a-660e-4d2c-ae24-d6ccf11bec90', 977, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 246, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('778a0041-2203-4ff8-aa8e-2d35c0a4435d', 885, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 184, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('78bbf8ab-b450-4187-8bf3-d7fa1f9e7010', 973, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 237, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('79bbb05b-fbbf-4b67-b0b8-491f4f5e3f79', 813, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 97, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('7a128b45-526c-4a85-a8f5-e47cb2e1c92e', 124, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 22, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('7aaee843-8f1e-4e75-a342-da04ef8dcdd7', 335, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 240, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('7abe2202-6b5e-4623-800f-f1cadec81023', 765, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 207, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('7b757bd7-9684-4bf1-a34e-cc1e58780f5e', 626, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 177, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('7bd36d1d-c747-4f63-b75a-8e7f00b917f2', 759, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 70, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('7e555ba6-1714-4650-8749-05bb32c1be1d', 489, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 178, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('7f32dfe1-83a9-4e0b-93a9-085a1718643b', 510, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 151, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('8098b4b2-bc54-42d8-b1f5-fecd034d13db', 842, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 18, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('8212eff7-d47c-4a1d-b1c3-f2f50de50ee8', 679, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 100, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('82282c2e-3375-4e18-ae2b-7d89de36d573', 596, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 107, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('8430ff75-dac3-45b6-a464-d315b7428223', 276, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 69, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('85cf0972-dd53-4b1c-94db-c1e086e0fefa', 895, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 31, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('885bd9e6-af6c-4fa3-8332-17dd83a0e0cf', 980, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 225, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('8c29aa49-5b43-4fba-808c-72fff13dac03', 773, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 26, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('8cee80af-3bdd-4087-8483-22889a419e16', 583, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 263, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('8d7afab1-32b7-4e1c-b270-0e422dbf9f5e', 252, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 45, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('8ec08642-294e-4a49-af25-a7210cbe1fd3', 727, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 170, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('8f1d4f48-e1d2-4fd4-b1bf-43b07d8872db', 761, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 272, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('8f4a4b31-371e-4eb3-b404-4f67bee5f62a', 547, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 262, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('90c6b332-1f92-4443-abed-6f491ead157a', 580, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 138, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('91c899d6-b51c-419e-90b7-6c85c312ada6', 967, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 19, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('9377023c-ab54-4fe9-9674-ac5f203b8eec', 791, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 58, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('947fd703-186b-48d2-8c86-55fdc3ee702c', 349, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 32, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('96f9e417-1622-4a89-ab2b-026b6d1d99fe', 432, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 55, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('9787222b-5287-4194-8183-211600eb3a05', 899, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 17, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('9b6eb955-76e9-4bdf-a45d-88e7b29fd5e5', 871, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 72, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('a122c340-edb5-4dde-9173-3972b00a3a78', 443, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 94, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('a1eca249-8e9d-4c48-9cf2-59f1b34a5ecb', 317, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 91, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('a654797c-3b5a-4868-8286-ed7886e02755', 433, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 264, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('a67f165e-9efb-449f-a284-e624f6201e94', 823, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 194, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('a68a9209-386e-4656-9df0-cb37f9d327ee', 905, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 233, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('a8f1ccec-4eb5-4ab3-a9d1-8b99dd861052', 811, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 185, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('a9674652-fb4a-4f74-a8de-f216cffcc282', 153, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 168, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('b009e169-d7ff-42e7-910d-e26118067a61', 183, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 195, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('b0d3e578-92b4-4efe-8571-57960b8d2107', 999, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 136, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('b280e00d-bce0-4bc4-8ccb-f94b2e151213', 475, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 160, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('b343b414-962c-48b9-9c02-4fcd9589a1ea', 669, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 220, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('b3b18cb9-af8d-467d-9e5e-d5cebf0b4c23', 857, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 86, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('b45c7790-c6ed-4dc9-a6b7-1e5a532d4ddd', 835, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 254, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('b64162c1-ea3a-4f13-91be-5514b914eed0', 677, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 117, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('b814a5b9-2cc2-4695-b5fc-a2735a10282e', 415, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 131, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('b88dd9d3-e4f2-45b4-9e40-a4f6adef8799', 686, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 85, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('b8fe1fe7-236a-486b-be8d-718574d7d7ce', 453, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 174, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('b920ba49-5e84-4efe-a219-590f684c1d92', 484, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 41, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('bb6588ea-de08-43b2-86fe-21716d98b26f', 869, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 234, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('bdccbfc3-78a2-4f8c-8b40-0de081733058', 591, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 51, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('be5c3fa2-bdaf-4d13-92de-d7100b500aad', 215, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 37, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('c0831745-edc1-42d3-8039-1fae119408b5', 742, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 216, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('c0e42ede-6085-4b04-a8c1-fedd280f92c8', 362, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 56, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('c12e0533-4158-4300-b21f-888c0372e7b9', 282, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 60, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('c1a89dfe-22b7-47f2-9fa5-6d913b374769', 435, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 99, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('c380f924-0329-4a02-a752-7d917aa01057', 784, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 172, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('c388b45f-04b5-4b76-aab2-09612702b412', 509, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 40, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('c57241f3-3288-4b33-8f08-d4ba44139af1', 976, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 119, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('c59195d3-d48c-45ac-aab8-f81579abe83a', 631, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 124, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('c6932fda-b1b5-48ae-beed-2d068dca8696', 296, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 87, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('c7805f37-1b5a-445b-849c-80f55dc5d85b', 256, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 71, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('cab63faa-40e0-4135-a15a-f194f87d3e02', 289, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 21, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('cad607f9-fb41-42fa-acd8-61c14fddd60d', 185, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 173, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('cc74742a-3412-4269-85b7-5edc9e9ea8ef', 306, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 20, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('cca761ec-eeb4-4d0e-b983-0b9cfc5c9e92', 458, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 111, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('cd9ab717-2fe2-41b5-8a9b-0450bc57b1ad', 349, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 24, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('cda3c905-11f1-4093-8b72-adbaa66ce16a', 408, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 29, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('ce032192-5996-4fd7-b1e9-06613696b093', 329, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 67, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('ce6a7fc3-085d-4287-a3e7-391b08237c0e', 670, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 61, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('ce8a954b-49b0-4315-9901-04f675081f77', 376, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 259, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('cebc4701-a849-4f0b-963b-b8e597d5ef65', 146, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 66, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('ced258bc-ae85-4e40-ba4c-9044e54936f6', 246, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 186, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('d1888cd6-42c2-47f6-949a-4c356a585530', 545, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 273, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('d1b553a0-94bb-4191-b020-3e8050459bc0', 591, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 236, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('d1ebe4cf-a4dd-4dcb-8a7f-e2e01167367a', 118, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 109, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('d2e44b26-722a-4229-b3d5-489939b7a6f2', 424, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 62, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('d490ceb9-9fdc-400f-bc65-c38f99029397', 784, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 25, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('d623c7be-d07f-4d33-a1a8-2b8f54b04c12', 284, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 42, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('d6e92782-3a13-45ab-9610-880c6c8866cf', 234, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 199, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('da08f350-d1c2-4557-b8b9-e1d90febbe0a', 343, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 213, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('da88db33-43e9-4d3a-9ead-a6884c8e51a7', 677, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 179, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('dc0c4f83-ca59-4ea9-95d4-306a2ad9d5ac', 422, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 261, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('ddeaf423-5e78-44d3-ab8e-a1a72ba170e9', 908, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 134, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('de1eedee-c927-4462-b155-077349bacdc4', 396, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 258, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('de9736d9-f60a-4262-8904-f5af433fd444', 214, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 95, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('df1c27d1-1c44-4378-b2b3-2b236df886fc', 436, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 182, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('e1a90869-2bef-4082-81fb-acaa0033fb49', 992, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 35, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('e26ba8ce-1601-4746-b0c7-ba1099024e6a', 363, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 162, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('e6ffe5f3-806d-47e8-9cb3-155dbda9023e', 230, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 142, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('e7d37485-79dd-421c-a920-3d90683d1086', 450, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 144, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('e94bb3b5-cabe-4f97-a81b-6f0e1e0ea8b9', 989, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 103, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('e9643d4c-4bfd-484a-ad57-c16c0a6e6f93', 221, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 120, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('eb201dbd-cc2c-4d3f-b4fd-30674e85cd6b', 329, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 132, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('ecc4d0e0-9e82-4463-bbc7-40b276423d5a', 894, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 64, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('ed05ff63-df72-4675-b0b2-190c175478c1', 934, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 43, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('ed431cd3-28d6-43ec-a4bd-ca129a398bc7', 813, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 183, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('ed467a64-3d39-47d8-8e19-ad9ff831dda9', 348, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 128, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('ee69a150-d3a3-47e3-9e35-0a3e573f2ee9', 580, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 68, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('eef2c78c-3458-4986-a90e-35bd6d92838a', 778, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 141, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('ef1c427a-48ba-44e7-b288-11e6c7373e05', 914, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 57, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('ef45caf2-4a47-4f84-b0fe-8be87d21ec63', 870, '2024-06-17 18:10:45', '2024-07-09 18:08:45', 16, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('f1213d11-b58e-4434-8aed-94d644538b35', 602, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 203, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('f26f7e15-6797-4240-b2eb-4d3acca539ec', 329, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 215, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('f3ebccd0-e540-47f1-9995-c4efb1b2edef', 885, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 266, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('f40070aa-ac57-419e-a71b-756b13ea7603', 725, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 39, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('f4287dec-615c-4726-b00c-6e52e8bb0eef', 290, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 36, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('f6bf145f-2817-44ed-bda3-5d1bbc53aee6', 626, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 190, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('f7e706a9-cc6f-4452-88bd-c5b22295dc40', 436, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 123, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('f8c653fb-1850-415c-9deb-1fb8cfe22495', 380, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 191, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('f94895bd-f622-47bc-9f7b-eb061cf05bd9', 360, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 181, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('f9698a76-c2cb-481c-ae09-8640922d79e3', 654, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 74, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('f9a9f35f-3fcf-43f2-8327-eec4360e66e0', 774, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 187, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('fa02f789-2547-4518-938b-f10faa0e0dbb', 571, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 148, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('fa2c303a-3aa9-437a-9ed3-4338322af276', 303, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 98, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('fa3d2993-4f5d-44b0-86f5-63f1f4b13a46', 243, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 150, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('fb9da504-a7cb-48b7-821a-ab14cda21196', 786, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 235, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02'),
('fe7d9359-f8e0-402d-933c-a6aaebd21cc2', 839, '2024-06-17 18:10:45', '2024-07-09 18:08:16', 204, 'cdc4c156-a4e6-4fce-b72b-c147b2908d02');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
