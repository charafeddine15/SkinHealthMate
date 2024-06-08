package com.ensaj.domain;

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
 * A Consultation.
 */
@Document(collection = "consultation")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Consultation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("date_consultation")
    private Instant dateConsultation;

    @DBRef
    @Field("rendezVous")
    @JsonIgnoreProperties(value = { "dermatologues", "patients", "consultations" }, allowSetters = true)
    private RendezVous rendezVous;

    @DBRef
    @Field("diagnostic")
    @JsonIgnoreProperties(value = { "consultations", "maladies" }, allowSetters = true)
    private Set<Diagnostic> diagnostics = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Consultation id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Instant getDateConsultation() {
        return this.dateConsultation;
    }

    public Consultation dateConsultation(Instant dateConsultation) {
        this.setDateConsultation(dateConsultation);
        return this;
    }

    public void setDateConsultation(Instant dateConsultation) {
        this.dateConsultation = dateConsultation;
    }

    public RendezVous getRendezVous() {
        return this.rendezVous;
    }

    public void setRendezVous(RendezVous rendezVous) {
        this.rendezVous = rendezVous;
    }

    public Consultation rendezVous(RendezVous rendezVous) {
        this.setRendezVous(rendezVous);
        return this;
    }

    public Set<Diagnostic> getDiagnostics() {
        return this.diagnostics;
    }

    public void setDiagnostics(Set<Diagnostic> diagnostics) {
        if (this.diagnostics != null) {
            this.diagnostics.forEach(i -> i.setConsultations(null));
        }
        if (diagnostics != null) {
            diagnostics.forEach(i -> i.setConsultations(this));
        }
        this.diagnostics = diagnostics;
    }

    public Consultation diagnostics(Set<Diagnostic> diagnostics) {
        this.setDiagnostics(diagnostics);
        return this;
    }

    public Consultation addDiagnostic(Diagnostic diagnostic) {
        this.diagnostics.add(diagnostic);
        diagnostic.setConsultations(this);
        return this;
    }

    public Consultation removeDiagnostic(Diagnostic diagnostic) {
        this.diagnostics.remove(diagnostic);
        diagnostic.setConsultations(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Consultation)) {
            return false;
        }
        return getId() != null && getId().equals(((Consultation) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Consultation{" +
            "id=" + getId() +
            ", dateConsultation='" + getDateConsultation() + "'" +
            "}";
    }
}
