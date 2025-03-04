/**
 * Script MySQL pour User
 * 
**/

CREATE TABLE `sc_user` (
	`id` int NOT NULL AUTO_INCREMENT COMMENT 'Identifiant', 
	`name` varchar(255) NOT NULL COMMENT 'Nom', 
	`login` varchar(255) NOT NULL COMMENT 'Login', 
	`password` varchar(255) NOT NULL COMMENT 'Mot de passe', 
	`token` varchar(4000) COMMENT 'Token' ,
	PRIMARY KEY (id) 
);




