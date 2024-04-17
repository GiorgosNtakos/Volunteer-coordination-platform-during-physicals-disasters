-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 17, 2024 at 03:42 PM
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
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`id`, `name`, `assigned_tasks`, `street`, `number`, `town`, `location_lat`, `location_lon`, `created_at`, `updated_at`, `assigned_rescuers`) VALUES
('317408fd-e2d0-46a0-8abe-6b06458f52e7', 'Ερμής', 0, 'Ζαΐμη', 14, 'Πάτρα', '38.24903950', '21.73950059', '2024-03-23 19:17:23', '2024-03-29 19:32:29', 1),
('9af32816-8521-421f-8842-c69381550d89', 'Τηλέμαχος', 0, 'Ρήγα Φεραίου', 113, 'Πάτρα', '38.24657885', '21.73368324', '2024-03-24 19:57:27', '2024-03-26 17:12:28', 2),
('950bf973-715f-4f1f-a91b-0dbf2bd3f3e6', 'Ανάργυρος', 0, 'Ρήγα Φεραίου', 115, 'Πάτρα', '38.24652305', '21.73364310', '2024-03-24 20:02:57', '2024-03-24 20:02:57', 0),
('bffea2b8-b4e2-478a-8950-6303a9a0db21', 'Όχημα_1', 0, 'Μαιζώνος', 11, 'Πάτρα', '38.24690020', '21.73502791', '2024-03-26 17:05:05', '2024-03-29 19:32:44', 1);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
