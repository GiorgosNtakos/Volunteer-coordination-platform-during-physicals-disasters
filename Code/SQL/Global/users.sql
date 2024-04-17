-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 17, 2024 at 03:44 PM
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
  `img_path` varchar(255) DEFAULT NULL,
  `formCompleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `full_name` (`full_name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `full_name`, `phone`, `street`, `number`, `town`, `type`, `location_lat`, `location_lon`, `created_at`, `updated_at`, `img_path`, `formCompleted`) VALUES
('5642fda0-799a-4c5a-9f4f-f2053d6386b9', 'Giorgos_Ntakos', '$2y$10$IjjttnZWkI8dHwXcfFGwiOlpT04zEttMEvPDjOFMWL928yYF7vQ/e', 'giorgos-1001@hotmail.com', 'Γιώργος Ντάκος', '', 'asd', 23, 'asd', 'Admin', '12.00000000', '12.00000000', '2023-12-24 21:53:17', '2023-12-24 21:53:17', NULL, 0),
('6c57eb8b-3e71-4a70-b3c7-29a059f3b96b', 'Citizen_4', 'citizen_Password_4', 'citizen_4@example.com', 'Citizen_4', '5647382910', 'Μεσολογγίου', 50, 'Πάτρα', 'Citizen', '38.23802274', '21.73270620', '2024-04-08 11:17:05', '2024-04-08 11:17:05', 'NULL', 1),
('3bab5915-8278-4a47-89e7-de737ba5f206', 'Giorgos_Ntali', '$2y$10$tXIOfMzdZ/3cVvTdauG.U.jd7hcSShApmRj7GeeY0pxIpuEIKHD3O', 'Giorgos_Ntali@VolunteersInAction.gr', 'Γιώργος Νταλι', '+30 6948758669', 'Ζαΐμη', 14, 'Πάτρα', 'Rescuer', '38.24903950', '21.73950059', '2024-03-27 21:48:16', '2024-03-27 21:48:16', NULL, 0),
('66e42249-a22c-4bb7-90f9-fda0eb51fd4a', 'Citizen_3', 'citizen_Password_3', 'citizen_3@example.com', 'Citizen_3', '1029384756', 'Σουλίου', 16, 'Πάτρα', 'Citizen', '38.23807745', '21.73621239', '2024-04-08 11:17:05', '2024-04-08 11:17:05', 'NULL', 1),
('1054ef77-b245-421e-9652-20624cc487d2', 'Citizen_1', 'citizen_Password_1', 'citizen_1@example.com', 'Citizen_1', '1234567890', 'Κερύνειας', 7, 'Πάτρα', 'Citizen', '38.26155900', '21.74055500', '2024-04-08 11:17:05', '2024-04-08 11:17:05', 'NULL', 1),
('b5540dfb-fee2-4982-9d4a-300617ba87b6', 'Citizen_2', 'citizen_Password_2', 'citizen_2@example.com', 'Citizen_2', '0987654321', 'Ν.Ε.Ο. Πατρών - Αθηνών', 31, 'Πάτρα', 'Citizen', '38.26405500', '21.75175400', '2024-04-08 11:17:05', '2024-04-08 11:17:05', 'NULL', 1),
('a97eeb63-cfdb-4e04-a839-87cac40706c6', 'Nikolaos_Matzaflokos', '$2y$10$Ry0VBdnxpwnNU5zL8uIwFOz55bzADcnXeKqUfaPZZl.JfHT6Yjp4C', 'Nikolaos_Matzaflokos@VolunteersInAction.gr', 'Νίκολαος Ματζαφλόκος', '+30 6951312111', 'Ζαΐμη', 14, 'Πάτρα', 'Rescuer', '38.24903950', '21.73950059', '2024-03-23 14:31:01', '2024-03-23 14:31:01', NULL, 0),
('fb8824a6-5679-46e0-8809-0d1a14ccab88', 'Kateria_Nikolaoy', '$2y$10$gsRnybNsLi5Qf3Ik87t8..aho2Y.cNxDO50Cc/iZsE4YsVQ1i9mdm', 'Kateria_Nikolaoy@VolunteersInAction.gr', 'Κατερια Νικολαου', '+30 6901455532', 'Μαιζώνος', 11, 'Πάτρα', 'Rescuer', '38.24690020', '21.73502791', '2024-03-23 19:18:11', '2024-03-23 19:18:11', NULL, 0),
('a8bc6598-dafd-464e-b5f6-1ce8c8acb4a9', 'Alkis_Ntakos', '$2y$10$fxPtRFUBx72a3WLLuaaqregiRX9jVy7ogA0.ytGv2wBGfxf9epkv.', 'Alkis_Ntakos@VolunteersInAction.gr', 'Αλκης Ντακος', '+30 6912345678', 'Ζαΐμη', 14, 'Πάτρα', 'Rescuer', '38.24903950', '21.73950059', '2024-03-25 21:45:06', '2024-03-25 21:45:06', NULL, 0),
('ee494b45-90b5-47ad-97dc-10c8e6b73d48', 'Nikos_Foysekis', '$2y$10$/3l9W.YOerLLdNPidus72ulR0lM7bvSlBBPtiNqMLHUcGGZ2VYkdK', 'Nikos_Foysekis@VolunteersInAction.gr', 'Νικος Φουσεκης', '+30 6911123415', 'Ζαΐμη', 14, 'Πάτρα', 'Rescuer', '38.24903950', '21.73950059', '2024-03-26 17:09:23', '2024-03-26 17:09:23', NULL, 0),
('2662b2d3-b793-4684-9fb5-ca165021b000', 'Nikos_Foysaikis', '$2y$10$bvYC9zpEQh0jrG4YCTtuhu3TfmrBKZYmfDZRiCEpYlcT.KvLOObwO', 'Nikos_Foysaikis@VolunteersInAction.gr', 'Νικος Φουσαικης', '+30 6911123411', 'Ζαΐμη', 14, 'Πάτρα', 'Rescuer', '38.24903950', '21.73950059', '2024-03-26 17:11:25', '2024-03-26 17:11:25', NULL, 0),
('9c3ce7e3-c189-438c-86a0-57f6260e65ef', 'Giorgos_Ntalis', '&FR3PG31', 'Giorgos_Ntalis@VolunteersInAction.gr', 'Γιώργος Νταλης', '+30 6901423455', 'Ζαΐμη', 14, 'Πάτρα', 'Rescuer', '38.24903950', '21.73950059', '2024-03-28 10:58:41', '2024-03-29 14:33:38', NULL, 0),
('aae63035-05c3-4e0f-920e-2f2869a99972', 'Giorgos_Pikaso', '$2y$10$YDnHbwPKn.4QDl1YqBx39ODNvCtdXexp6zKPa2bxnjqhiksT.sgri', 'Giorgos_Pikaso@VolunteersInAction.gr', 'Γιωργος Πικασο', '+30 6912345679', 'Μαιζώνος', 11, 'Πάτρα', 'Rescuer', '38.24690020', '21.73502791', '2024-03-29 14:38:57', '2024-03-29 14:38:57', NULL, 0),
('1ad1b2f4-3445-4922-b98e-4c46a586a7b5', 'Giorgos_Ntakosta', '$2y$10$pfxJc1ca4s0R3dvuidAMvOb4xfA2dQmgolxzYfvB1q6EmCMfkbyQu', 'Giorgos_Ntakosta@VolunteersInAction.gr', 'Γιώργος Ντάκοστα', '+30 6948123678', 'Ζαΐμη', 14, 'Πάτρα', 'Rescuer', '38.24903950', '21.73950059', '2024-03-28 11:02:57', '2024-03-28 11:02:57', NULL, 0);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
