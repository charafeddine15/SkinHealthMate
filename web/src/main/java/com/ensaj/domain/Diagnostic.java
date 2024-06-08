package com.ensaj.domain;

import com.ensaj.service.dto.NewPatientUserDTO;
import com.ensaj.service.dto.PatientUserDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Diagnostic.
 */
@Document(collection = "diagnostic")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Diagnostic implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("date_diagnostic")
    private Instant dateDiagnostic;

    @Field("picture")
    private byte[] picture;

    @Field("picture_content_type")
    private String pictureContentType;

    @Field("description")
    private String description;

    @Field("prescription")
    private String prescription;

    @Field("probability")
    private Float probability;

    @Field("probabilities")
    private List<Float> probabilities;

    @Field("symptoms")
    private List<String> symptoms;

    @DBRef
    @Field("consultations")
    @JsonIgnoreProperties(value = { "rendezVous", "diagnostics" }, allowSetters = true)
    private Consultation consultations;

    @DBRef
    @Field("maladie")
    @JsonIgnoreProperties(value = { "stades", "diagnostics" }, allowSetters = true)
    private Set<Maladie> maladies = new HashSet<>();

    @DBRef
    @Field("maladieDetected")
    @JsonIgnoreProperties(value = { "stades", "diagnostics" }, allowSetters = true)
    private Set<Maladie> maladiesDetected = new HashSet<>();

    private PatientUserDTO patientUserDTO;

    public PatientUserDTO getPatientUserDTO() {
        return patientUserDTO;
    }

    // Setter for patientUserDTO
    public void setPatientUserDTO(PatientUserDTO patientUserDTO) {
        this.patientUserDTO = patientUserDTO;
    }

    private NewPatientUserDTO newPatientUserDTO;

    public NewPatientUserDTO getNewPatientUserDTO() {
        return newPatientUserDTO;
    }

    // Setter for patientUserDTO
    public void setNewPatientUserDTO(NewPatientUserDTO newPatientUserDTO) {
        this.newPatientUserDTO = newPatientUserDTO;
    }

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Diagnostic id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Instant getDateDiagnostic() {
        return this.dateDiagnostic;
    }

    public Diagnostic dateDiagnostic(Instant dateDiagnostic) {
        this.setDateDiagnostic(dateDiagnostic);
        return this;
    }

    public void setDateDiagnostic(Instant dateDiagnostic) {
        this.dateDiagnostic = dateDiagnostic;
    }

    public byte[] getPicture() {
        return this.picture;
    }

    public Diagnostic picture(byte[] picture) {
        this.setPicture(picture);
        return this;
    }

    public void setPicture(byte[] picture) {
        this.picture = picture;
    }

    public String getPictureContentType() {
        return this.pictureContentType;
    }

    public Diagnostic pictureContentType(String pictureContentType) {
        this.pictureContentType = pictureContentType;
        return this;
    }

    public void setPictureContentType(String pictureContentType) {
        this.pictureContentType = pictureContentType;
    }

    public String getDescription() {
        return this.description;
    }

    public Diagnostic description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPrescription() {
        return this.prescription;
    }

    public Diagnostic prescription(String prescription) {
        this.setPrescription(prescription);
        return this;
    }

    public void setPrescription(String prescription) {
        this.prescription = prescription;
    }

    public Float getProbability() {
        return this.probability;
    }

    public Diagnostic probability(Float probability) {
        this.setProbability(probability);
        return this;
    }

    public void setProbability(Float probability) {
        this.probability = probability;
    }

    public List<Float> getProbabilities() {
        return this.probabilities;
    }

    public Diagnostic probabilities(List<Float> probabilities) {
        this.setProbabilities(probabilities);
        return this;
    }

    public void setProbabilities(List<Float> probabilities) {
        this.probabilities = probabilities;
    }

    //debut
    public List<String> getSymptoms() {
        return this.symptoms;
    }

    public Diagnostic symptoms(List<String> symptoms) {
        this.setSymptoms(symptoms);
        return this;
    }

    public void setSymptoms(List<String> symptoms) {
        this.symptoms = symptoms;
    }

    //fin

    public Consultation getConsultations() {
        return this.consultations;
    }

    public void setConsultations(Consultation consultation) {
        this.consultations = consultation;
    }

    public Diagnostic consultations(Consultation consultation) {
        this.setConsultations(consultation);
        return this;
    }

    public Set<Maladie> getMaladies() {
        return this.maladies;
    }

    public void setMaladies(Set<Maladie> maladies) {
        if (this.maladies != null) {
            this.maladies.forEach(i -> i.setDiagnostics(null));
        }
        if (maladies != null) {
            maladies.forEach(i -> i.setDiagnostics(this));
        }
        this.maladies = maladies;
    }

    public Diagnostic maladies(Set<Maladie> maladies) {
        this.setMaladies(maladies);
        return this;
    }

    public Diagnostic addMaladie(Maladie maladie) {
        this.maladies.add(maladie);
        maladie.setDiagnostics(this);
        return this;
    }

    public Diagnostic removeMaladie(Maladie maladie) {
        this.maladies.remove(maladie);
        maladie.setDiagnostics(null);
        return this;
    }

    public Set<Maladie> getMaladiesDetected() {
        return this.maladiesDetected;
    }

    public void setMaladiesDetected(Set<Maladie> maladiesDetected) {
        if (this.maladiesDetected != null) {
            this.maladiesDetected.forEach(i -> i.setDiagnostics(null));
        }
        if (maladiesDetected != null) {
            maladiesDetected.forEach(i -> i.setDiagnostics(this));
        }
        this.maladiesDetected = maladiesDetected;
    }

    public Diagnostic maladiesDetected(Set<Maladie> maladiesDetected) {
        this.setMaladiesDetected(maladiesDetected);
        return this;
    }

    public Diagnostic addMaladiesDetected(Maladie maladie) {
        this.maladiesDetected.add(maladie);
        maladie.setDiagnostics(this);
        return this;
    }

    public Diagnostic removeMaladieDetected(Maladie maladie) {
        this.maladiesDetected.remove(maladie);
        maladie.setDiagnostics(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Diagnostic)) {
            return false;
        }
        return getId() != null && getId().equals(((Diagnostic) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Diagnostic{" +
            "id=" + getId() +
            ", dateDiagnostic='" + getDateDiagnostic() + "'" +
            ", picture='" + getPicture() + "'" +
            ", pictureContentType='" + getPictureContentType() + "'" +
            ", description='" + getDescription() + "'" +
            ", prescription='" + getPrescription() + "'" +
            ", probability=" + getProbability() +
            "}";
    }
}
