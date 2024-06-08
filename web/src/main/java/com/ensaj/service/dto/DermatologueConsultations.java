package com.ensaj.service.dto;

import com.ensaj.domain.Patient;
import java.time.Instant;

public class DermatologueConsultations {

    private String id;
    private Instant dateDebut;
    private Instant dateFin;
    private boolean statut;
    private Patient patient;

    public DermatologueConsultations() {}

    public DermatologueConsultations(String id, Instant dateDebut, Instant dateFin, boolean statut, Patient patient) {
        this.id = id;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.statut = statut;
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

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient user) {
        this.patient = user;
    }
}
