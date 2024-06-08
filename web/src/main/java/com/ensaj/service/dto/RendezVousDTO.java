package com.ensaj.service.dto;

import com.ensaj.domain.Consultation;
import com.ensaj.domain.Dermatologue;
import com.ensaj.domain.Patient;
import com.ensaj.domain.User;
import io.mongock.utils.field.Field;
import java.time.Instant;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

public class RendezVousDTO {

    private String id;
    private Instant dateDebut;
    private Instant dateFin;
    private boolean statut;
    private TransformedDermatologueUserDTO dermatologue;
    private Patient patient;

    public RendezVousDTO() {}

    public RendezVousDTO(
        String id,
        Instant dateDebut,
        Instant dateFin,
        boolean statut,
        TransformedDermatologueUserDTO dermatologue,
        Patient patient
    ) {
        this.id = id;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.statut = statut;
        this.dermatologue = dermatologue;
        this.patient = patient;
    }

    public String getId() {
        return id;
    }

    public void setId(String string) {
        this.id = string;
    }

    public Instant getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(Instant dateDebut) {
        this.dateDebut = dateDebut;
    }

    public Instant getDateFin() {
        return dateFin;
    }

    public void setDateFin(Instant dateFin) {
        this.dateFin = dateFin;
    }

    public boolean isStatut() {
        return statut;
    }

    public void setStatut(boolean statut) {
        this.statut = statut;
    }

    public TransformedDermatologueUserDTO getDermatologue() {
        return dermatologue;
    }

    public void setDermatologue(TransformedDermatologueUserDTO transformedDermatologueUserDTO) {
        this.dermatologue = transformedDermatologueUserDTO;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient user) {
        this.patient = user;
    }
}
