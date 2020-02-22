SELECT t.id, c_t.competence FROM competence_ticket c_t
INNER JOIN ticket t ON ? = c_t.id_ticket;