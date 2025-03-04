/**
 * Script MySQL pour Session
 * 
**/

CREATE TABLE `sc_session` (
	`id` int NOT NULL AUTO_INCREMENT COMMENT 'Identifiant', 
	`name` varchar(255) NOT NULL COMMENT 'Nom', 
	`visual` varchar(4000) COMMENT 'Visuel' ,
	PRIMARY KEY (id) 
);




