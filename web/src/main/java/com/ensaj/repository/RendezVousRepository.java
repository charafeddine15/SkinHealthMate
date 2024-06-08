package com.ensaj.repository;

import com.ensaj.domain.Dermatologue;
import com.ensaj.domain.Patient;
import com.ensaj.domain.RendezVous;
import java.time.Instant;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the RendezVous entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RendezVousRepository extends MongoRepository<RendezVous, String> {
    List<RendezVous> findByDermatologues(Dermatologue dermatologue);

    List<RendezVous> findByPatients(Patient patient);

    @Query("{ 'dermatologues.id': ?0, 'statut': true, 'dateDebut': { $gte: ?1, $lt: ?2 } }")
    List<RendezVous> findTodayTrueStatusByDermatologues(String dermatologistId, Instant todayStart, Instant todayEnd);

    @Query(value = "{ 'dermatologues.id': ?0, 'statut': true}")
    List<RendezVous> findDistinctPatientsByDermatologueId(String dermatologistId);
}
