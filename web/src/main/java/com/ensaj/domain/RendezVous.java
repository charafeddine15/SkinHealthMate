package com.ensaj.domain;

import com.ensaj.service.dto.DermatologueUserDTO;
import com.ensaj.service.dto.PatientUserDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A RendezVous.
 */
@Document(collection = "rendez_vous")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class RendezVous implements Serializable {

    private static final long serialVersionUID = 1L;
    private DermatologueUserDTO dermatologueUserDTO;
    private PatientUserDTO patientUserDTO;

    public DermatologueUserDTO getDermatologueUserDTO() {
        return dermatologueUserDTO;
    }

    // Setter for dermatologueUserDTO
    public void setDermatologueUserDTO(DermatologueUserDTO dermatologueUserDTO) {
        this.dermatologueUserDTO = dermatologueUserDTO;
    }

    // Getter for patientUserDTO
    public PatientUserDTO getPatientUserDTO() {
        return patientUserDTO;
    }

    // Setter for patientUserDTO
    public void setPatientUserDTO(PatientUserDTO patientUserDTO) {
        this.patientUserDTO = patientUserDTO;
    }

    @Id
    private String id;

    @Field("date_debut")
    private Instant dateDebut;

    @Field("date_fin")
    private Instant dateFin;

    @Field("statut")
    private Boolean statut;

    @DBRef
    @Field("dermatologues")
    @JsonIgnoreProperties(value = { "user", "dermatologuePatients" }, allowSetters = true)
    private Dermatologue dermatologues;

    @DBRef
    @Field("patients")
    @JsonIgnoreProperties(value = { "user", "dermatologuePatients" }, allowSetters = true)
    private Patient patients;

    @DBRef
    @Field("consultation")
    @JsonIgnoreProperties(value = { "rendezVous", "diagnostics" }, allowSetters = true)
    private Set<Consultation> consultations = new HashSet<>();

    // private RendezVous rendezVous;
    // private Dermatologue dermatologue;
    // private Patient patient;

    // public RendezVous(RendezVous rendezVous, Dermatologue dermatologue, Patient patient) {
    //     this.rendezVous = rendezVous;
    //     this.dermatologue = dermatologue;
    //     this.patient = patient;
    // }

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public RendezVous id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Instant getDateDebut() {
        return this.dateDebut;
    }

    public RendezVous dateDebut(Instant dateDebut) {
        this.setDateDebut(dateDebut);
        return this;
    }

    public void setDateDebut(Instant dateDebut) {
        this.dateDebut = dateDebut;
    }

    public Instant getDateFin() {
        return this.dateFin;
    }

    public RendezVous dateFin(Instant dateFin) {
        this.setDateFin(dateFin);
        return this;
    }

    public void setDateFin(Instant dateFin) {
        this.dateFin = dateFin;
    }

    public Boolean getStatut() {
        return this.statut;
    }

    public RendezVous statut(Boolean statut) {
        this.setStatut(statut);
        return this;
    }

    public void setStatut(Boolean statut) {
        this.statut = statut;
    }

    public Dermatologue getDermatologues() {
        return this.dermatologues;
    }

    public void setDermatologues(Dermatologue dermatologue) {
        this.dermatologues = dermatologue;
    }

    public RendezVous dermatologues(Dermatologue dermatologue) {
        this.setDermatologues(dermatologue);
        return this;
    }

    public Patient getPatients() {
        return this.patients;
    }

    public void setPatients(Patient patient) {
        this.patients = patient;
    }

    public RendezVous patients(Patient patient) {
        this.setPatients(patient);
        return this;
    }

    public Set<Consultation> getConsultations() {
        return this.consultations;
    }

    public void setConsultations(Set<Consultation> consultations) {
        if (this.consultations != null) {
            this.consultations.forEach(i -> i.setRendezVous(null));
        }
        if (consultations != null) {
            consultations.forEach(i -> i.setRendezVous(this));
        }
        this.consultations = consultations;
    }

    public RendezVous consultations(Set<Consultation> consultations) {
        this.setConsultations(consultations);
        return this;
    }

    public RendezVous addConsultation(Consultation consultation) {
        this.consultations.add(consultation);
        consultation.setRendezVous(this);
        return this;
    }

    public RendezVous removeConsultation(Consultation consultation) {
        this.consultations.remove(consultation);
        consultation.setRendezVous(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RendezVous)) {
            return false;
        }
        return getId() != null && getId().equals(((RendezVous) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RendezVous{" +
            "id=" + getId() +
            ", dateDebut='" + getDateDebut() + "'" +
            ", dateFin='" + getDateFin() + "'" +
            ", statut='" + getStatut() + "'" +
            "}";
    }
}
