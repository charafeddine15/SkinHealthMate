package com.ensaj.repository;

import com.ensaj.domain.ImageStade;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the ImageStade entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ImageStadeRepository extends MongoRepository<ImageStade, String> {}
