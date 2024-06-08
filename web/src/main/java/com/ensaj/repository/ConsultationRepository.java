package com.ensaj.repository;

import com.ensaj.domain.Consultation;
import com.ensaj.domain.RendezVous;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Consultation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConsultationRepository extends MongoRepository<Consultation, String> {
    @Query("{ 'dateConsultation' : { $gte: ?0, $lt: ?1 } }")
    List<Consultation> findConsultationsForToday(Instant debutAujourdhui, Instant debutDemain);

    Consultation findByRendezVous(RendezVous v);

    default long countByDateConsultation(LocalDate localDate) {
        Instant debutDuJour = localDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant finDuJour = localDate.atStartOfDay(ZoneId.systemDefault()).plusDays(1).toInstant();
        return countByDateConsultation(debutDuJour, finDuJour);
    }

    long countByDateConsultation(Instant debutDuJour, Instant finDuJour);
}
