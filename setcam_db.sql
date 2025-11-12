-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 02, 2025 at 03:30 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `setcam_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` int(11) NOT NULL,
  `time` varchar(20) NOT NULL,
  `description` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`id`, `time`, `description`, `createdAt`) VALUES
(1, '10:30 AM', 'New test completed for Vehicle XYZ', '2025-10-23 17:07:53'),
(2, '09:45 AM', 'New user registration', '2025-10-23 17:07:53'),
(3, '09:15 AM', 'Test schedule updated', '2025-10-23 17:07:53'),
(4, '07:16 PM', 'New appointment scheduled: HONDA click 125i', '2025-10-23 17:16:27'),
(5, '07:18 PM', 'New appointment scheduled: HONDA click 125i', '2025-10-23 17:18:31');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` varchar(50) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `ownerName` varchar(255) NOT NULL,
  `contactNumber` varchar(20) NOT NULL,
  `plateNumber` varchar(20) NOT NULL,
  `vehicleMake` varchar(100) NOT NULL,
  `vehicleModel` varchar(100) NOT NULL,
  `year` int(11) NOT NULL,
  `vehicleType` varchar(50) NOT NULL,
  `preferredDate` date NOT NULL,
  `preferredTime` varchar(20) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','verified','completed') DEFAULT 'pending',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `userId`, `ownerName`, `contactNumber`, `plateNumber`, `vehicleMake`, `vehicleModel`, `year`, `vehicleType`, `preferredDate`, `preferredTime`, `amount`, `status`, `createdAt`) VALUES
('SET-1761239787', 2, 'LabRats', '09123456789', 'ABCD1234', 'HONDA', 'click 125i', 2024, 'motorcycles', '2025-10-24', '11:00 AM', 60.00, 'pending', '2025-10-23 17:16:27'),
('SET-1761239911', 2, 'LabRats', '09123456789', 'ABCD1234', 'HONDA', 'click 125i', 2024, '4-wheels', '2025-10-24', '08:00 AM', 80.00, 'pending', '2025-10-23 17:18:31');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullName`, `email`, `password`, `role`, `createdAt`) VALUES
(1, 'Admin User', 'admin@setcam.com', 'admin123', 'admin', '2025-10-23 17:07:37'),
(2, 'John Doe', 'john@example.com', 'password123', 'user', '2025-10-23 17:07:37');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
