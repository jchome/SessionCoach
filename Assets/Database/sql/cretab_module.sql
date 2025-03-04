/**
 * Script MySQL pour Module
 * Depend de :
	- cretab_session.sql
**/

CREATE TABLE `sc_module` (
	`id` int NOT NULL AUTO_INCREMENT COMMENT 'Identifiant', 
	`name` varchar(255) NOT NULL COMMENT 'Nom', 
	`visual` varchar(4000) COMMENT 'Visuel', 
	`order` int NOT NULL COMMENT 'Ordre', 
	`session_id` int NOT NULL COMMENT 'Séance' ,
	PRIMARY KEY (id) 
);


ALTER TABLE sc_module ADD CONSTRAINT FK_sc_module_session_id_sc_session_id FOREIGN KEY (`session_id`) REFERENCES sc_session (`id`);


