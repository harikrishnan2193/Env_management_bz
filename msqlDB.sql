-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 31, 2025 at 11:26 AM
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
-- Table structure for table `environments`
--

CREATE TABLE `environments` (
  `env_id` int(11) NOT NULL,
  `env_type` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `environments`
--

INSERT INTO `environments` (`env_id`, `env_type`, `description`) VALUES
(1, 'local', 'Local development environment'),
(2, 'development', 'Development environment'),
(3, 'u8', 'U8 testing environment'),
(4, 'production', 'Production environment');

-- --------------------------------------------------------

--
-- Table structure for table `env_history`
--

CREATE TABLE `env_history` (
  `history_id` bigint(20) UNSIGNED NOT NULL,
  `project_id` char(36) NOT NULL,
  `history_view` text NOT NULL,
  `time_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `env_history`
--

INSERT INTO `env_history` (`history_id`, `project_id`, `history_view`, `time_at`) VALUES
(57, 'ad75f333-4169-47ab-a35c-64af5bea0d29', 'Environment local was created by watson.', '2025-05-31 09:00:08'),
(58, 'ad75f333-4169-47ab-a35c-64af5bea0d29', 'Environment development was created by watson.', '2025-05-31 09:01:14'),
(59, '4dc790fa-f282-4c49-900b-ac94859ca7d7', 'Environment local was created by max.', '2025-05-31 09:03:15'),
(60, '4dc790fa-f282-4c49-900b-ac94859ca7d7', 'Environment development was created by max.', '2025-05-31 09:03:35'),
(61, '4dc790fa-f282-4c49-900b-ac94859ca7d7', 'Environment u8 was created by max.', '2025-05-31 09:04:49'),
(66, '4837eeb1-b9ae-412e-bc51-432b1fb26156', 'Environment production was created by smith.', '2025-05-31 09:18:04'),
(67, '4837eeb1-b9ae-412e-bc51-432b1fb26156', 'Environment local was created by smith.', '2025-05-31 09:18:48'),
(68, '4837eeb1-b9ae-412e-bc51-432b1fb26156', 'Environment development was created by smith.', '2025-05-31 09:19:35'),
(69, '4837eeb1-b9ae-412e-bc51-432b1fb26156', 'User max is asigned to new role User.', '2025-05-31 09:20:04');

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE `organizations` (
  `organization_id` char(36) NOT NULL,
  `organization_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organizations`
--

INSERT INTO `organizations` (`organization_id`, `organization_name`, `description`, `created_at`) VALUES
('14ea9f1c-8f6b-11ef-92f8-a3372a2d6675', 'bz', 'bzanalytics', '2024-10-21 05:12:34');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `permission_id` int(11) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `env_id` int(11) DEFAULT NULL,
  `can_view` tinyint(1) DEFAULT 0,
  `can_edit` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`permission_id`, `role_id`, `env_id`, `can_view`, `can_edit`) VALUES
(183, 3, 1, 1, 1),
(184, 3, 2, 1, 1),
(185, 3, 3, 1, 1),
(186, 3, 4, 1, 1),
(187, 1, 1, 1, 1),
(188, 1, 2, 1, 1),
(189, 1, 3, 1, 1),
(190, 1, 4, 1, 1),
(191, 31, 1, 1, 0),
(192, 31, 4, 1, 0),
(193, 2, 1, 1, 1),
(194, 2, 3, 1, 0),
(195, 2, 4, 1, 1),
(196, 2, 2, 1, 0),
(197, 4, 1, 1, 0),
(198, 4, 2, 1, 1),
(199, 4, 3, 0, 0),
(200, 4, 4, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `project_id` char(36) NOT NULL,
  `organization_id` char(36) DEFAULT NULL,
  `project_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `technology` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`project_id`, `organization_id`, `project_name`, `description`, `status_id`, `technology`, `created_at`) VALUES
('4837eeb1-b9ae-412e-bc51-432b1fb26156', '14ea9f1c-8f6b-11ef-92f8-a3372a2d6675', 'EcoShop', 'An e-commerce site promoting sustainable and eco-friendly products, complete with a carbon footprint calculator.', 1, 'Django, PostgreSQL', '2025-05-31 09:17:35'),
('4dc790fa-f282-4c49-900b-ac94859ca7d7', '14ea9f1c-8f6b-11ef-92f8-a3372a2d6675', 'TravelEase', 'A travel itinerary planner that allows users to book accommodations and create personalized trip schedules.', 3, 'Laravel, MySQL', '2025-05-31 08:46:59'),
('ad75f333-4169-47ab-a35c-64af5bea0d29', '14ea9f1c-8f6b-11ef-92f8-a3372a2d6675', 'TaskMate', 'A task management platform to organize daily activities and track progress. Includes reminders and collaboration features.', 3, 'React.js, Node.js', '2025-05-31 08:57:45');

-- --------------------------------------------------------

--
-- Table structure for table `project_envs`
--

CREATE TABLE `project_envs` (
  `project_env_id` char(36) NOT NULL,
  `project_id` char(36) DEFAULT NULL,
  `env_id` int(11) DEFAULT NULL,
  `env_content` text DEFAULT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_envs`
--

INSERT INTO `project_envs` (`project_env_id`, `project_id`, `env_id`, `env_content`, `last_updated`, `updated_by`) VALUES
('054f792e-54c3-470a-aeb2-96b0813cbfc4', '4837eeb1-b9ae-412e-bc51-432b1fb26156', 4, 'NODE_ENV=production\r\nAPP_ENV=production\r\nPORT=80\r\n\r\nDB_HOST=prod-db.example.com\r\nDB_PORT=27017\r\nDB_NAME=myapp_prod\r\nDB_USER=produser\r\nDB_PASS=prodstrongpass\r\n\r\nJWT_SECRET=prodsecretkey\r\nAPI_BASE_URL=https://api.example.com\r\n\r\nSTRIPE_API_KEY=sk_live_abcdef123456\r\nSENDGRID_API_KEY=live-sendgrid-key\r\n', '2025-05-31 09:18:04', '10e3b18ef1'),
('314ff751-3efe-424f-9c30-ace153193b52', 'ad75f333-4169-47ab-a35c-64af5bea0d29', 1, 'DB_HOST=localhost\r\nDB_PORT=27017\r\nDB_NAME=myapp_local\r\nDB_USER=devuser\r\nDB_PASS=devpass\r\n\r\nNODE_ENV=development\r\nAPP_ENV=local\r\nPORT=3000\r\n\r\nJWT_SECRET=localdevsecret\r\nAPI_BASE_URL=http://localhost:3000/api', '2025-05-31 09:00:08', '0d4d31fced'),
('7c52407a-a36d-4d28-9c39-c0932f620814', '4dc790fa-f282-4c49-900b-ac94859ca7d7', 3, 'fn main() {\r\n    let byte_value: u8 = 200; // values: 0 to 255\r\n    println!(\"The value is: {}\", byte_value);\r\n}\r\n', '2025-05-31 09:04:49', '3dc156c4b3'),
('a3c08006-c02a-4d29-87dc-9e631d41e749', '4dc790fa-f282-4c49-900b-ac94859ca7d7', 1, '# App Settings\r\nNODE_ENV=development\r\nAPP_ENV=local\r\nPORT=3000\r\n\r\n# Local Database\r\nDB_HOST=127.0.0.1\r\nDB_PORT=5432\r\nDB_NAME=app_local\r\nDB_USER=localuser\r\nDB_PASS=localpass\r\n\r\n# Security\r\nJWT_SECRET=local-secret-key\r\nTOKEN_EXPIRES_IN=1d\r\n\r\n# API\r\nAPI_URL=http://localhost:3000/api\r\n', '2025-05-31 09:03:15', '3dc156c4b3'),
('a449ef6b-bf98-44c0-8dc9-d684731f6d11', '4837eeb1-b9ae-412e-bc51-432b1fb26156', 2, '# Shared Development Environment\r\n\r\nAPP_ENV=development\r\nNODE_ENV=development\r\nPORT=4000\r\n\r\nDB_HOST=dev-db.internal\r\nDB_PORT=3306\r\nDB_NAME=project_dev\r\nDB_USER=devuser\r\nDB_PASS=devpass456\r\n\r\nJWT_SECRET=devsecretkey456\r\nTOKEN_EXPIRES_IN=2d\r\n\r\nEMAIL_HOST=smtp.devmail.com\r\nEMAIL_PORT=587\r\nEMAIL_USER=teamdev@example.com  # <-- 🔹 Add your team dev email here\r\nEMAIL_PASS=dev-email-pass\r\n\r\nAPI_BASE_URL=https://dev-api.myproject.com\r\n', '2025-05-31 09:19:35', '10e3b18ef1'),
('aa808c32-4131-4781-a141-d974f2053d0e', '4dc790fa-f282-4c49-900b-ac94859ca7d7', 2, '# App Settings\r\nNODE_ENV=development\r\nAPP_ENV=development\r\nPORT=4000\r\n\r\n# Dev Database\r\nDB_HOST=dev-db.myapp.com\r\nDB_PORT=5432\r\nDB_NAME=app_dev\r\nDB_USER=devuser\r\nDB_PASS=devpass\r\n\r\n# Security\r\nJWT_SECRET=development-secret-key\r\nTOKEN_EXPIRES_IN=2d\r\n\r\n# API\r\nAPI_URL=https://dev.myapp.com/api\r\n', '2025-05-31 09:03:35', '3dc156c4b3'),
('cf1d64ba-b4a6-4a49-8ea9-9e45a8aa1df2', '4837eeb1-b9ae-412e-bc51-432b1fb26156', 1, '# Local Development Environment\r\n\r\nAPP_ENV=local\r\nNODE_ENV=development\r\nPORT=3001\r\n\r\nDB_HOST=localhost\r\nDB_PORT=3306\r\nDB_NAME=project_local\r\nDB_USER=root\r\nDB_PASS=root123\r\n\r\nJWT_SECRET=localsecretkey123\r\nTOKEN_EXPIRES_IN=1d\r\n\r\nEMAIL_HOST=localhost\r\nEMAIL_PORT=1025\r\nEMAIL_USER=dev@example.com  # <-- 🔹 Add your email here\r\nEMAIL_PASS=devpass\r\n\r\nAPI_BASE_URL=http://localhost:3001/api\r\n', '2025-05-31 09:18:48', '10e3b18ef1'),
('e9cb04ac-fcea-4134-927b-9dc527b4dbae', 'ad75f333-4169-47ab-a35c-64af5bea0d29', 2, 'NODE_ENV=development\r\nAPP_ENV=development\r\nPORT=4000\r\n\r\nDB_HOST=dev-db.example.com\r\nDB_PORT=27017\r\nDB_NAME=myapp_dev\r\nDB_USER=devuser\r\nDB_PASS=devpass\r\n\r\nJWT_SECRET=devsecretkey\r\nAPI_BASE_URL=https://dev.example.com/api\r\n', '2025-05-31 09:01:14', '0d4d31fced');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(100) NOT NULL,
  `role_scope` enum('organization','project') NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`, `role_scope`, `description`) VALUES
(1, 'Admin', 'organization', 'Organization administrator with full access'),
(2, 'Normal', 'organization', 'Regular organization user'),
(3, 'Project_admin', 'project', 'Project administrator with full access'),
(4, 'Author', 'project', 'Project author with edit permissions'),
(31, 'User', 'project', 'Project user/client with limited access');

-- --------------------------------------------------------

--
-- Table structure for table `statuses`
--

CREATE TABLE `statuses` (
  `status_id` int(11) NOT NULL,
  `status_name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `statuses`
--

INSERT INTO `statuses` (`status_id`, `status_name`, `description`) VALUES
(1, 'active', 'Active project'),
(2, 'inactive', 'Inactive project'),
(3, 'completed', 'Completed project');

-- --------------------------------------------------------

--
-- Table structure for table `status_model`
--

CREATE TABLE `status_model` (
  `status_id` int(11) NOT NULL,
  `status_name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `CreateAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` char(36) NOT NULL,
  `organization_id` char(36) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `organization_id`, `username`, `email`, `password_hash`, `created_at`, `reset_token`, `reset_token_expires`) VALUES
('0d4d31fced', '14ea9f1c-8f6b-11ef-92f8-a3372a2d6675', 'watson', 'watson@gmail.com', '$2a$10$g72UhrIlkkxoWZEmRrekI.Io/C0dzkF1fTjmp1QjzC/7lCgWSXmlm', '2025-05-31 08:56:57', NULL, NULL),
('10e3b18ef1', '14ea9f1c-8f6b-11ef-92f8-a3372a2d6675', 'smith', 'smith@gmail.com', '$2a$10$HaUYXlG.1kGYnrTNeDNPxeoy5/6YmZ9xpOzOVQpzJZnp6CYXw0tNq', '2025-05-31 09:16:49', NULL, NULL),
('3dc156c4b3', '14ea9f1c-8f6b-11ef-92f8-a3372a2d6675', 'max', 'max@gmail.com', '$2a$10$60AcZUjhnJVNblmC0vMs/eqN3greR6oVZBg8wE0G7zv7HlRizgiaq', '2025-05-31 08:45:58', NULL, NULL),
('469d113803', '14ea9f1c-8f6b-11ef-92f8-a3372a2d6675', 'super admin', 'superadmin@gmail.com', '$2a$10$kEale5nuMmh5u2KBlVxyPe.bYysOo/5r3JR46n8f0IHTK.mPAQVqe', '2024-11-21 11:23:23', NULL, NULL);

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
(236, '3dc156c4b3', 3, '14ea9f1c-8f6b-11ef-92f8-a3372a2d6675', '4dc790fa-f282-4c49-900b-ac94859ca7d7', '3dc156c4b3', '2025-05-31 08:46:59'),
(237, '0d4d31fced', 3, '14ea9f1c-8f6b-11ef-92f8-a3372a2d6675', 'ad75f333-4169-47ab-a35c-64af5bea0d29', '0d4d31fced', '2025-05-31 08:57:45'),
(240, '10e3b18ef1', 3, '14ea9f1c-8f6b-11ef-92f8-a3372a2d6675', '4837eeb1-b9ae-412e-bc51-432b1fb26156', '10e3b18ef1', '2025-05-31 09:17:35'),
(241, '3dc156c4b3', 31, '14ea9f1c-8f6b-11ef-92f8-a3372a2d6675', '4837eeb1-b9ae-412e-bc51-432b1fb26156', '10e3b18ef1', '2025-05-31 09:20:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `environments`
--
ALTER TABLE `environments`
  ADD PRIMARY KEY (`env_id`),
  ADD UNIQUE KEY `env_type` (`env_type`);

--
-- Indexes for table `env_history`
--
ALTER TABLE `env_history`
  ADD PRIMARY KEY (`history_id`);

--
-- Indexes for table `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`organization_id`),
  ADD UNIQUE KEY `organization_name` (`organization_name`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`permission_id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `env_id` (`env_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `organization_id` (`organization_id`),
  ADD KEY `status_id` (`status_id`);

--
-- Indexes for table `project_envs`
--
ALTER TABLE `project_envs`
  ADD PRIMARY KEY (`project_env_id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `env_id` (`env_id`),
  ADD KEY `updated_by` (`updated_by`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `statuses`
--
ALTER TABLE `statuses`
  ADD PRIMARY KEY (`status_id`),
  ADD UNIQUE KEY `status_name` (`status_name`);

--
-- Indexes for table `status_model`
--
ALTER TABLE `status_model`
  ADD PRIMARY KEY (`status_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `organization_id` (`organization_id`);

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
-- AUTO_INCREMENT for table `environments`
--
ALTER TABLE `environments`
  MODIFY `env_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `env_history`
--
ALTER TABLE `env_history`
  MODIFY `history_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `permission_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=201;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `statuses`
--
ALTER TABLE `statuses`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `status_model`
--
ALTER TABLE `status_model`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `user_role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=242;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `permissions`
--
ALTER TABLE `permissions`
  ADD CONSTRAINT `permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_2` FOREIGN KEY (`env_id`) REFERENCES `environments` (`env_id`);

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`status_id`);

--
-- Constraints for table `project_envs`
--
ALTER TABLE `project_envs`
  ADD CONSTRAINT `project_envs_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_envs_ibfk_2` FOREIGN KEY (`env_id`) REFERENCES `environments` (`env_id`),
  ADD CONSTRAINT `project_envs_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE;

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
