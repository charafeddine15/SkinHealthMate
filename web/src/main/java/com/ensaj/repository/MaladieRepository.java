package com.ensaj.repository;

import com.ensaj.domain.Maladie;
import com.ensaj.domain.User;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Maladie entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MaladieRepository extends MongoRepository<Maladie, String> {
    Optional<Maladie> findOneByAbbr(String abbr);
}
