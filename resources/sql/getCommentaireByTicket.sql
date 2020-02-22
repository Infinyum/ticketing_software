SELECT t.titre, c_t.id_ticket, c_t.commentaire, c_t.id_auteur FROM commentaire_ticket c_t
INNER JOIN ticket t ON ? = t.id;