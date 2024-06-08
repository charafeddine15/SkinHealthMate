package com.ensaj.repository;

import com.ensaj.domain.Secretaire;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Secretaire entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SecretaireRepository extends MongoRepository<Secretaire, String> {}
