-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 19-02-2026 a las 12:38:24
-- Versión del servidor: 9.1.0
-- Versión de PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `agencia-viajes`
--

DELIMITER $$
--
-- Procedimientos
--
DROP PROCEDURE IF EXISTS `sp_comprar_paquete`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_comprar_paquete` (IN `p_user_id` INT, IN `p_package_id` VARCHAR(50))   BEGIN
    DECLARE v_precio DECIMAL(10, 2);
    DECLARE v_saldo_actual DECIMAL(10, 2);
    
    -- 1. Obtener el precio del paquete desde la tabla packages
    SELECT price_numeric INTO v_precio 
    FROM packages 
    WHERE id = p_package_id;
    
    -- 2. Obtener el saldo actual del usuario desde su wallet
    SELECT balance INTO v_saldo_actual 
    FROM wallets 
    WHERE user_id = p_user_id;
    
    -- 3. Iniciar la transacción (Todo o nada)
    START TRANSACTION;
    
    -- 4. Comprobar si hay saldo suficiente
    IF v_saldo_actual >= v_precio THEN
        
        -- A. Restar el dinero de la cartera
        UPDATE wallets 
        SET balance = balance - v_precio 
        WHERE user_id = p_user_id;
        
        -- B. Crear el registro en la tabla de reservas
        INSERT INTO bookings (user_id, package_id, status, total_paid)
        VALUES (p_user_id, p_package_id, 'confirmed', v_precio);
        
        -- Confirmar cambios
        COMMIT;
        SELECT 'Compra realizada con éxito' AS mensaje;
        
    ELSE
        -- Cancelar todo si no hay saldo
        ROLLBACK;
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Error: Saldo insuficiente en la cartera';
    END IF;

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bookings`
--

DROP TABLE IF EXISTS `bookings`;
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `package_id` varchar(50) DEFAULT NULL,
  `flight_id` int DEFAULT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `total_paid` decimal(10,2) DEFAULT NULL,
  `booking_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `package_id` (`package_id`),
  KEY `flight_id` (`flight_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `countries`
--

DROP TABLE IF EXISTS `countries`;
CREATE TABLE IF NOT EXISTS `countries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` char(3) NOT NULL,
  `name` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `best_time` varchar(255) DEFAULT NULL,
  `avg_price` varchar(50) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  PRIMARY KEY (`code`),
  UNIQUE KEY `id` (`id`)
) ;

--
-- Volcado de datos para la tabla `countries`
--

INSERT INTO `countries` (`id`, `code`, `name`, `image`, `description`, `price`, `image_url`, `best_time`, `avg_price`, `rating`) VALUES
(1, 'ARG', 'Crucero Caribe', '/images/paises/ARG.svg', '7 días de lujo visitando las mejores playas tropicales con todo incluido.', 1250.00, 'https://images.unsplash.com/photo-1548574505-5e239809ee19', 'Primavera y verano', 'Desde 60€/noche', 4.5),
(2, 'ESP', 'Safari Kenia', '/images/paises/ESP.svg', 'Aventura salvaje en el Masai Mara con guía experto y alojamiento de lujo.', 2100.00, 'https://images.unsplash.com/photo-1516426122078-c23e76319801', 'Primavera y otoño', 'Desde 70€/noche', 4.6),
(3, 'FRA', 'Noche en Dubái', '/images/paises/FRA.svg', 'Vive el futuro en la ciudad del oro. Incluye visita al Burj Khalifa.', 1800.00, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c', 'Primavera y verano', 'Desde 100€/noche', 4.7),
(4, 'GBR', 'Reino Unido', '/images/paises/GBR.svg', 'Historia, museos y ciudades con encanto.', NULL, NULL, 'Primavera y verano', 'Desde 95€/noche', 4.3),
(5, 'GRC', 'Grecia', '/images/paises/GRC.svg', 'Islas idílicas, historia antigua y gastronomía mediterránea.', NULL, NULL, 'Mayo, junio y septiembre', 'Desde 60€/noche', 4.5),
(6, 'JPN', 'Ruta Japón', '/images/paises/JPN.svg', 'De la tradición de Kioto a las luces de Tokio. Incluye pase de tren bala.', 2400.00, 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e', 'Primavera y otoño', 'Desde 120€/noche', 4.8),
(7, 'MEX', 'Noche Dubái', '/images/paises/MEX.svg', 'Rica gastronomía, patrimonio prehispánico y playas.', 1800.00, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c', 'Noviembre a abril', 'Desde 50€/noche', 4.4),
(8, 'PRT', 'Portugal', '/images/paises/PRT.svg', 'Lisboa, Oporto y playas del Algarve.', NULL, NULL, 'Primavera y otoño', 'Desde 65€/noche', 4.4),
(9, 'THA', 'Tailandia', '/images/paises/THA.svg', 'Playas tropicales, cultura budista y excelente relación calidad-precio.', NULL, NULL, 'Noviembre a febrero', 'Desde 40€/noche', 4.4),
(10, 'USA', 'Estados Unidos', '/images/paises/USA.svg', 'Ciudades icónicas y parques nacionales.', NULL, NULL, 'Primavera y otoño', 'Desde 90€/noche', 4.6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `country_attractions`
--

DROP TABLE IF EXISTS `country_attractions`;
CREATE TABLE IF NOT EXISTS `country_attractions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `country_code` char(3) DEFAULT NULL,
  `attraction` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `country_code` (`country_code`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `country_attractions`
--

INSERT INTO `country_attractions` (`id`, `country_code`, `attraction`) VALUES
(1, 'MEX', 'Chichén Itzá'),
(2, 'MEX', 'Tulum'),
(3, 'MEX', 'Museo de Antropología'),
(4, 'GRC', 'Acrópolis de Atenas'),
(5, 'GRC', 'Santorini'),
(6, 'GRC', 'Meteora'),
(7, 'PRT', 'Torre de Belém'),
(8, 'PRT', 'Sintra'),
(9, 'PRT', 'Puente Don Luis I');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `country_tips`
--

DROP TABLE IF EXISTS `country_tips`;
CREATE TABLE IF NOT EXISTS `country_tips` (
  `id` int NOT NULL AUTO_INCREMENT,
  `country_code` char(3) DEFAULT NULL,
  `tip` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `country_code` (`country_code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `country_tips`
--

INSERT INTO `country_tips` (`id`, `country_code`, `tip`) VALUES
(1, 'MEX', 'Usar siempre protector solar biodegradable en cenotes'),
(2, 'GRC', 'Llevar calzado cómodo para las ruinas arqueológicas'),
(3, 'PRT', 'Probar los pastéis de nata en Belém');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `flights`
--

DROP TABLE IF EXISTS `flights`;
CREATE TABLE IF NOT EXISTS `flights` (
  `id` int NOT NULL AUTO_INCREMENT,
  `origin` varchar(100) NOT NULL,
  `destination_code` char(3) NOT NULL,
  `departure_date` datetime NOT NULL,
  `return_date` datetime DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `seats_available` int DEFAULT '50',
  PRIMARY KEY (`id`),
  KEY `destination_code` (`destination_code`)
) ;

--
-- Volcado de datos para la tabla `flights`
--

INSERT INTO `flights` (`id`, `origin`, `destination_code`, `departure_date`, `return_date`, `price`, `seats_available`) VALUES
(1, 'Madrid', 'JPN', '2026-05-15 10:00:00', '2026-05-25 20:00:00', 850.00, 45),
(2, 'Barcelona', 'MEX', '2026-06-01 12:00:00', '2026-06-15 18:00:00', 720.00, 30),
(3, 'Sevilla', 'FRA', '2026-04-10 08:30:00', '2026-04-16 22:00:00', 120.00, 15),
(4, 'Madrid', 'ARG', '2026-11-20 23:00:00', '2026-12-05 10:00:00', 980.00, 50),
(5, 'Valencia', 'GRC', '2026-07-05 09:00:00', '2026-07-12 15:00:00', 210.00, 10),
(6, 'Madrid (MAD)', 'JPN', '2026-05-10 09:30:00', '2026-05-24 18:00:00', 850.00, 42),
(7, 'Barcelona (BCN)', 'MEX', '2026-06-01 12:00:00', '2026-06-15 11:30:00', 740.50, 28),
(8, 'Sevilla (SVQ)', 'FRA', '2026-04-12 08:00:00', '2026-04-18 20:45:00', 125.00, 15),
(9, 'Valencia (VLC)', 'GRC', '2026-07-05 10:15:00', '2026-07-12 14:00:00', 230.00, 10),
(10, 'Bilbao (BIO)', 'PRT', '2026-03-20 16:00:00', '2026-03-25 19:00:00', 95.00, 35);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `packages`
--

DROP TABLE IF EXISTS `packages`;
CREATE TABLE IF NOT EXISTS `packages` (
  `id` varchar(50) NOT NULL,
  `country_code` char(3) DEFAULT NULL,
  `title` varchar(150) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `short_desc` text,
  `price_label` varchar(50) DEFAULT NULL,
  `price_numeric` decimal(10,2) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  `details` text,
  PRIMARY KEY (`id`),
  KEY `country_code` (`country_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `packages`
--

INSERT INTO `packages` (`id`, `country_code`, `title`, `category`, `image`, `short_desc`, `price_label`, `price_numeric`, `rating`, `details`) VALUES
('ESP-01', 'ESP', 'Circuito Cultural España', 'Paquete', '/images/paises/ESP.svg', 'Recorrido por Madrid y Andalucía.', 'Desde 699€', 699.00, 4.7, 'Incluye alojamiento y excursiones.'),
('FRA-01', 'FRA', 'París y Valle del Loira', 'Cultural', '/images/paises/FRA.svg', 'Arte y ruta de castillos.', 'Desde 899€', 899.00, 4.8, 'Entradas al Louvre incluidas.'),
('GRC-01', 'GRC', 'Islas Griegas', 'Playas', '/images/paises/GRC.svg', 'Santorini y Mykonos.', 'Desde 549€', 549.00, 4.6, 'Ferry entre islas incluido.'),
('JPN-01', 'JPN', 'Japón Esencial', 'Paquete', '/images/paises/JPN.svg', 'Tokio, Kioto y Nara.', 'Desde 1.299€', 1299.00, 4.9, 'JR Pass incluido.'),
('MEX-01', 'MEX', 'Riviera Maya', 'Playas', '/images/paises/MEX.svg', 'Resorts todo incluido.', 'Desde 749€', 749.00, 4.4, 'Excursión a Chichén Itzá.'),
('PRT-01', 'PRT', 'Portugal Express', 'City Break', '/images/paises/PRT.svg', 'Lisboa y Oporto.', 'Desde 399€', 399.00, 4.5, 'Transporte en tren incluido.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','client') DEFAULT 'client',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Ana Viajera', 'ana@email.com', 'hash_ana', 'client', '2026-02-19 09:49:27'),
(2, 'Carlos Mundo', 'carlos@email.com', 'hash_carlos', 'client', '2026-02-19 09:49:27'),
(3, 'Admin Pro', 'admin@agencia.com', 'hash_admin', 'admin', '2026-02-19 09:49:27');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_estadisticas_paises`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `v_estadisticas_paises`;
CREATE TABLE IF NOT EXISTS `v_estadisticas_paises` (
`pais` varchar(100)
,`total_reservas` bigint
,`ingresos_totales` decimal(32,2)
,`rating_medio_paquetes` decimal(6,5)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_resumen_ventas`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `v_resumen_ventas`;
CREATE TABLE IF NOT EXISTS `v_resumen_ventas` (
`reserva_id` int
,`cliente` varchar(100)
,`email` varchar(150)
,`paquete` varchar(150)
,`pais` varchar(100)
,`importe` decimal(10,2)
,`fecha` timestamp
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `wallets`
--

DROP TABLE IF EXISTS `wallets`;
CREATE TABLE IF NOT EXISTS `wallets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `balance` decimal(10,2) DEFAULT '0.00',
  `last_update` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ;

--
-- Volcado de datos para la tabla `wallets`
--

INSERT INTO `wallets` (`id`, `user_id`, `balance`, `last_update`) VALUES
(4, 1, 2500.00, '2026-02-19 09:50:17'),
(5, 2, 450.00, '2026-02-19 09:50:17'),
(6, 3, 9999.99, '2026-02-19 09:50:18');

--
-- Disparadores `wallets`
--
DROP TRIGGER IF EXISTS `after_wallet_update`;
DELIMITER $$
CREATE TRIGGER `after_wallet_update` AFTER UPDATE ON `wallets` FOR EACH ROW BEGIN
    IF OLD.balance <> NEW.balance THEN
        INSERT INTO wallet_logs (wallet_id, old_balance, new_balance, amount_changed)
        VALUES (OLD.id, OLD.balance, NEW.balance, NEW.balance - OLD.balance);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `wallet_logs`
--

DROP TABLE IF EXISTS `wallet_logs`;
CREATE TABLE IF NOT EXISTS `wallet_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `wallet_id` int DEFAULT NULL,
  `old_balance` decimal(10,2) DEFAULT NULL,
  `new_balance` decimal(10,2) DEFAULT NULL,
  `amount_changed` decimal(10,2) DEFAULT NULL,
  `change_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `wallet_id` (`wallet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_estadisticas_paises`
--
DROP TABLE IF EXISTS `v_estadisticas_paises`;

DROP VIEW IF EXISTS `v_estadisticas_paises`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_estadisticas_paises`  AS SELECT `c`.`name` AS `pais`, count(`b`.`id`) AS `total_reservas`, ifnull(sum(`b`.`total_paid`),0) AS `ingresos_totales`, avg(`p`.`rating`) AS `rating_medio_paquetes` FROM ((`countries` `c` left join `packages` `p` on((`c`.`code` = `p`.`country_code`))) left join `bookings` `b` on((`p`.`id` = `b`.`package_id`))) GROUP BY `c`.`code` ORDER BY `ingresos_totales` DESC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_resumen_ventas`
--
DROP TABLE IF EXISTS `v_resumen_ventas`;

DROP VIEW IF EXISTS `v_resumen_ventas`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_resumen_ventas`  AS SELECT `b`.`id` AS `reserva_id`, `u`.`name` AS `cliente`, `u`.`email` AS `email`, `p`.`title` AS `paquete`, `c`.`name` AS `pais`, `b`.`total_paid` AS `importe`, `b`.`booking_date` AS `fecha` FROM (((`bookings` `b` join `users` `u` on((`b`.`user_id` = `u`.`id`))) join `packages` `p` on((`b`.`package_id` = `p`.`id`))) join `countries` `c` on((`p`.`country_code` = `c`.`code`))) ;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`),
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`flight_id`) REFERENCES `flights` (`id`);

--
-- Filtros para la tabla `country_attractions`
--
ALTER TABLE `country_attractions`
  ADD CONSTRAINT `country_attractions_ibfk_1` FOREIGN KEY (`country_code`) REFERENCES `countries` (`code`) ON DELETE CASCADE;

--
-- Filtros para la tabla `country_tips`
--
ALTER TABLE `country_tips`
  ADD CONSTRAINT `country_tips_ibfk_1` FOREIGN KEY (`country_code`) REFERENCES `countries` (`code`) ON DELETE CASCADE;

--
-- Filtros para la tabla `flights`
--
ALTER TABLE `flights`
  ADD CONSTRAINT `flights_ibfk_1` FOREIGN KEY (`destination_code`) REFERENCES `countries` (`code`);

--
-- Filtros para la tabla `packages`
--
ALTER TABLE `packages`
  ADD CONSTRAINT `packages_ibfk_1` FOREIGN KEY (`country_code`) REFERENCES `countries` (`code`) ON DELETE SET NULL;

--
-- Filtros para la tabla `wallets`
--
ALTER TABLE `wallets`
  ADD CONSTRAINT `wallets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `wallet_logs`
--
ALTER TABLE `wallet_logs`
  ADD CONSTRAINT `wallet_logs_ibfk_1` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

INSERT INTO `flights` (`origin`, `destination_code`, `departure_date`, `return_date`, `price`, `seats_available`) VALUES
('Madrid (MAD)', 'USA', '2026-09-10 10:00:00', '2026-09-24 20:00:00', 650.00, 45),
('Barcelona (BCN)', 'USA', '2026-10-05 12:30:00', '2026-10-15 18:00:00', 590.00, 20),
('Madrid (MAD)', 'THA', '2026-11-01 15:00:00', '2026-11-15 09:00:00', 820.00, 35),
('Valencia (VLC)', 'THA', '2026-12-05 08:00:00', '2026-12-20 22:30:00', 890.00, 15),
('Bilbao (BIO)', 'GBR', '2026-05-15 07:30:00', '2026-05-20 19:00:00', 85.00, 50),
('Sevilla (SVQ)', 'GBR', '2026-06-10 09:45:00', '2026-06-15 21:15:00', 110.00, 30),
('Madrid (MAD)', 'ESP', '2026-08-01 11:00:00', '2026-08-10 16:00:00', 45.00, 60);

INSERT INTO `countries` (`code`, `name`, `description`, `price`, `image_url`) VALUES
('EGY', 'Egipto Místico', 'Crucero por el Nilo y visita a las Pirámides de Giza. Un viaje a la cuna de la civilización.', 1150.00, 'https://images.unsplash.com/photo-1503177119275-0aa32b3a7447'),
('ISL', 'Islandia Glacial', 'Tierra de auroras boreales, géiseres y volcanes. Una aventura única en el Círculo Polar.', 1450.00, 'https://images.unsplash.com/photo-1476610182048-b716b8518aae'),
('AUS', 'Australia Salvaje', 'Explora la Gran Barrera de Coral y la moderna Sídney. Naturaleza y ciudad en armonía.', 2100.00, 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be'),
('PER', 'Perú Ancestral', 'Visita el Machu Picchu y disfruta de la mejor gastronomía del mundo en Lima.', 1300.00, 'https://images.unsplash.com/photo-1526392060635-9d6019884377'),
('JOR', 'Jordania Escondida', 'Descubre la ciudad rosa de Petra y duerme bajo las estrellas en el desierto de Wadi Rum.', 1200.00, 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4'),
('ITA', 'Italia Eterna', 'Un recorrido por la Toscana, los canales de Venecia y la historia imperial de Roma.', 890.00, 'https://images.unsplash.com/photo-1523906834658-6e24ef2346f3');






INSERT INTO `flights` (`origin`, `destination_code`, `departure_date`, `return_date`, `price`, `seats_available`) VALUES
('Madrid (MAD)', 'EGY', '2026-11-12 09:00:00', '2026-11-22 22:00:00', 320.00, 30),
('Madrid (MAD)', 'ISL', '2026-12-01 07:00:00', '2026-12-08 15:00:00', 180.00, 40),
('Barcelona (BCN)', 'AUS', '2026-10-20 23:00:00', '2026-11-10 10:00:00', 1150.00, 20),
('Madrid (MAD)', 'PER', '2026-09-05 13:00:00', '2026-09-20 21:00:00', 740.00, 30),
('Valencia (VLC)', 'JOR', '2026-10-10 10:00:00', '2026-10-20 20:00:00', 350.00, 25),
('Madrid (MAD)', 'ITA', '2026-06-15 09:00:00', '2026-06-22 21:00:00', 65.00, 40);
