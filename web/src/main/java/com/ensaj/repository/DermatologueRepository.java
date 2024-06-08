package com.ensaj.repository;

import com.ensaj.domain.Dermatologue;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Dermatologue entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DermatologueRepository extends MongoRepository<Dermatologue, String> {}
