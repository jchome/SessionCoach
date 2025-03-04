/**
 * Script MySQL pour Access
 * Depend de :
	- cretab_user.sql
	- cretab_session.sql
**/

CREATE TABLE `sc_access` (
	`id` int NOT NULL AUTO_INCREMENT COMMENT 'Identifiant', 
	`user_id` int NOT NULL COMMENT 'Utilisateur', 
	`session_id` int NOT NULL COMMENT 'Séance' ,
	PRIMARY KEY (id) 
);


ALTER TABLE sc_access ADD CONSTRAINT FK_sc_access_user_id_sc_user_id FOREIGN KEY (`user_id`) REFERENCES sc_user (`id`);
ALTER TABLE sc_access ADD CONSTRAINT FK_sc_access_session_id_sc_session_id FOREIGN KEY (`session_id`) REFERENCES sc_session (`id`);


