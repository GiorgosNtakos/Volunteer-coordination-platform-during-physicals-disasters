-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 17, 2024 at 03:43 PM
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
  PRIMARY KEY (`id`),
  KEY `item_id` (`item_id`),
  KEY `vehicle_id` (`vehicle_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `quantity`, `type`, `status`, `created_at`, `updated_at`, `item_id`, `vehicle_id`, `user_id`) VALUES
('601b3cc5-1290-4db7-b107-9e5d159cdc6d', 15, 'Request', 'pending', '2024-04-08 11:24:37', '2024-04-08 11:24:37', 16, '317408fd-e2d0-46a0-8abe-6b06458f52e7', '66e42249-a22c-4bb7-90f9-fda0eb51fd4a'),
('d2a578aa-9c25-4363-9c6d-df61003768f9', 25, 'Request', 'pending', '2024-04-08 11:24:37', '2024-04-08 11:24:37', 16, '317408fd-e2d0-46a0-8abe-6b06458f52e7', '6c57eb8b-3e71-4a70-b3c7-29a059f3b96b'),
('39739656-3f41-499c-a257-f23c7fa5034b', 35, 'Offer', 'pending', '2024-04-08 11:24:37', '2024-04-08 11:24:37', 16, '317408fd-e2d0-46a0-8abe-6b06458f52e7', '1054ef77-b245-421e-9652-20624cc487d2'),
('2b0ce878-f3f8-4adf-9b7f-ae0dc200b5c3', 45, 'Offer', 'pending', '2024-04-08 11:24:37', '2024-04-08 11:24:37', 16, '317408fd-e2d0-46a0-8abe-6b06458f52e7', 'b5540dfb-fee2-4982-9d4a-300617ba87b6');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
