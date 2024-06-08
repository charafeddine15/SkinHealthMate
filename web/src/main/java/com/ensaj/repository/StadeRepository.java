package com.ensaj.repository;

import com.ensaj.domain.Stade;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Stade entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StadeRepository extends MongoRepository<Stade, String> {}
