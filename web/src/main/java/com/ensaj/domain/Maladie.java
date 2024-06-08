package com.ensaj.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Maladie.
 */
@Document(collection = "maladie")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Maladie implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("full_name")
    private String fullName;

    @Field("abbr")
    private String abbr;

    @DBRef
    @Field("stade")
    @JsonIgnoreProperties(value = { "imageStades", "composition" }, allowSetters = true)
    private Set<Stade> stades = new HashSet<>();

    @DBRef
    @Field("diagnostics")
    @JsonIgnoreProperties(value = { "consultations", "maladies" }, allowSetters = true)
    private Diagnostic diagnostics;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Maladie id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullName() {
        return this.fullName;
    }

    public Maladie fullName(String fullName) {
        this.setFullName(fullName);
        return this;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAbbr() {
        return this.abbr;
    }

    public Maladie abbr(String abbr) {
        this.setAbbr(abbr);
        return this;
    }

    public void setAbbr(String abbr) {
        this.abbr = abbr;
    }

    public Set<Stade> getStades() {
        return this.stades;
    }

    public void setStades(Set<Stade> stades) {
        if (this.stades != null) {
            this.stades.forEach(i -> i.setComposition(null));
        }
        if (stades != null) {
            stades.forEach(i -> i.setComposition(this));
        }
        this.stades = stades;
    }

    public Maladie stades(Set<Stade> stades) {
        this.setStades(stades);
        return this;
    }

    public Maladie addStade(Stade stade) {
        this.stades.add(stade);
        stade.setComposition(this);
        return this;
    }

    public Maladie removeStade(Stade stade) {
        this.stades.remove(stade);
        stade.setComposition(null);
        return this;
    }

    public Diagnostic getDiagnostics() {
        return this.diagnostics;
    }

    public void setDiagnostics(Diagnostic diagnostic) {
        this.diagnostics = diagnostic;
    }

    public Maladie diagnostics(Diagnostic diagnostic) {
        this.setDiagnostics(diagnostic);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Maladie)) {
            return false;
        }
        return getId() != null && getId().equals(((Maladie) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Maladie{" +
            "id=" + getId() +
            ", fullName='" + getFullName() + "'" +
            ", abbr='" + getAbbr() + "'" +
            "}";
    }
}
