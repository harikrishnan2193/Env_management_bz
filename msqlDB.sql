-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 27, 2024 at 12:53 PM
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
-- Database: `envproject_bz`
--

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_role_id` int(11) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `organization_id` char(36) DEFAULT NULL,
  `project_id` char(36) DEFAULT NULL,
  `assigned_by` char(36) DEFAULT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`user_role_id`, `user_id`, `role_id`, `organization_id`, `project_id`, `assigned_by`, `assigned_at`) VALUES
(58, '469d113803', 1, '14ea9f1c-8f6b-11ef-92f8-a3372a2d6675', NULL, NULL, '2024-11-21 11:27:32'),
(228, '306ec8a987', 3, '14ea9f1c-8f6b-11ef-92f8-a3372a2d6675', 'b480f23d-e86f-4c01-ba9c-1b96412d8abf', '306ec8a987', '2024-12-27 11:31:03'),
(229, '8ac367c5c7', 3, '14ea9f1c-8f6b-11ef-92f8-a3372a2d6675', 'def1698c-208c-4512-ae38-7111358c1c20', '8ac367c5c7', '2024-12-27 11:36:08'),
(230, '306ec8a987', 4, '14ea9f1c-8f6b-11ef-92f8-a3372a2d6675', 'def1698c-208c-4512-ae38-7111358c1c20', '8ac367c5c7', '2024-12-27 11:37:48'),
(231, 'ecd755bb0d', 3, '14ea9f1c-8f6b-11ef-92f8-a3372a2d6675', 'c4574525-ed55-4b0c-974d-47f3a66d743e', 'ecd755bb0d', '2024-12-27 11:41:27'),
(232, '8ac367c5c7', 31, '14ea9f1c-8f6b-11ef-92f8-a3372a2d6675', 'c4574525-ed55-4b0c-974d-47f3a66d743e', 'ecd755bb0d', '2024-12-27 11:43:10'),
(233, 'd0b8f4a5f4', 3, '14ea9f1c-8f6b-11ef-92f8-a3372a2d6675', '6b884cfc-e6f8-46d2-86a4-c2914fd4c8a1', 'd0b8f4a5f4', '2024-12-27 11:44:52'),
(234, 'ecd755bb0d', 4, '14ea9f1c-8f6b-11ef-92f8-a3372a2d6675', '6b884cfc-e6f8-46d2-86a4-c2914fd4c8a1', '469d113803', '2024-12-27 11:49:52');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_role_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `organization_id` (`organization_id`),
  ADD KEY `project_id` (`project_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `user_role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=235;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_3` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_4` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
