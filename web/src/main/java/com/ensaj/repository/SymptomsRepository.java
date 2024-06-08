package com.ensaj.repository;

import com.ensaj.domain.Symptoms;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Symptoms entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SymptomsRepository extends MongoRepository<Symptoms, String> {}
