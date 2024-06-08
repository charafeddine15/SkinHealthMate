package com.ensaj.domain;

import java.io.Serializable;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Symptoms.
 */
@Document(collection = "symptoms")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Symptoms implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("nom")
    private String nom;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Symptoms id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Symptoms nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Symptoms)) {
            return false;
        }
        return getId() != null && getId().equals(((Symptoms) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Symptoms{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            "}";
    }
}
