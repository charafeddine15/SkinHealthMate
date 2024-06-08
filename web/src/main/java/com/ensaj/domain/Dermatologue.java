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
 * A Dermatologue.
 */
@Document(collection = "dermatologue")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Dermatologue implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("code_emp")
    private String codeEmp;

    @Field("genre")
    private String genre;

    @Field("telephone")
    private String telephone;

    @DBRef
    @Field("user")
    private User user;

    @DBRef
    @Field("dermatologuePatients")
    @JsonIgnoreProperties(value = { "dermatologues", "patients", "consultations" }, allowSetters = true)
    private Set<RendezVous> dermatologuePatients = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Dermatologue id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCodeEmp() {
        return this.codeEmp;
    }

    public Dermatologue codeEmp(String codeEmp) {
        this.setCodeEmp(codeEmp);
        return this;
    }

    public void setCodeEmp(String codeEmp) {
        this.codeEmp = codeEmp;
    }

    public String getGenre() {
        return this.genre;
    }

    public Dermatologue genre(String genre) {
        this.setGenre(genre);
        return this;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getTelephone() {
        return this.telephone;
    }

    public Dermatologue telephone(String telephone) {
        this.setTelephone(telephone);
        return this;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Dermatologue user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<RendezVous> getDermatologuePatients() {
        return this.dermatologuePatients;
    }

    public void setDermatologuePatients(Set<RendezVous> rendezVous) {
        if (this.dermatologuePatients != null) {
            this.dermatologuePatients.forEach(i -> i.setDermatologues(null));
        }
        if (rendezVous != null) {
            rendezVous.forEach(i -> i.setDermatologues(this));
        }
        this.dermatologuePatients = rendezVous;
    }

    public Dermatologue dermatologuePatients(Set<RendezVous> rendezVous) {
        this.setDermatologuePatients(rendezVous);
        return this;
    }

    public Dermatologue addDermatologuePatients(RendezVous rendezVous) {
        this.dermatologuePatients.add(rendezVous);
        rendezVous.setDermatologues(this);
        return this;
    }

    public Dermatologue removeDermatologuePatients(RendezVous rendezVous) {
        this.dermatologuePatients.remove(rendezVous);
        rendezVous.setDermatologues(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Dermatologue)) {
            return false;
        }
        return getId() != null && getId().equals(((Dermatologue) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Dermatologue{" +
            "id=" + getId() +
            ", codeEmp='" + getCodeEmp() + "'" +
            ", genre='" + getGenre() + "'" +
            ", telephone='" + getTelephone() + "'" +
            "}";
    }
}
