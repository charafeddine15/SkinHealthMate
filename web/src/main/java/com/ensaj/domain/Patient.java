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
 * A Patient.
 */
@Document(collection = "patient")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Patient implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("birthdate")
    private Instant birthdate;

    @Field("adress")
    private String adress;

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

    public Patient id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Instant getBirthdate() {
        return this.birthdate;
    }

    public Patient birthdate(Instant birthdate) {
        this.setBirthdate(birthdate);
        return this;
    }

    public void setBirthdate(Instant birthdate) {
        this.birthdate = birthdate;
    }

    public String getAdress() {
        return this.adress;
    }

    public Patient adress(String adress) {
        this.setAdress(adress);
        return this;
    }

    public void setAdress(String adress) {
        this.adress = adress;
    }

    public String getGenre() {
        return this.genre;
    }

    public Patient genre(String genre) {
        this.setGenre(genre);
        return this;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getTelephone() {
        return this.telephone;
    }

    public Patient telephone(String telephone) {
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

    public Patient user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<RendezVous> getDermatologuePatients() {
        return this.dermatologuePatients;
    }

    public void setDermatologuePatients(Set<RendezVous> rendezVous) {
        if (this.dermatologuePatients != null) {
            this.dermatologuePatients.forEach(i -> i.setPatients(null));
        }
        if (rendezVous != null) {
            rendezVous.forEach(i -> i.setPatients(this));
        }
        this.dermatologuePatients = rendezVous;
    }

    public Patient dermatologuePatients(Set<RendezVous> rendezVous) {
        this.setDermatologuePatients(rendezVous);
        return this;
    }

    public Patient addDermatologuePatients(RendezVous rendezVous) {
        this.dermatologuePatients.add(rendezVous);
        rendezVous.setPatients(this);
        return this;
    }

    public Patient removeDermatologuePatients(RendezVous rendezVous) {
        this.dermatologuePatients.remove(rendezVous);
        rendezVous.setPatients(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Patient)) {
            return false;
        }
        return getId() != null && getId().equals(((Patient) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Patient{" +
            "id=" + getId() +
            ", birthdate='" + getBirthdate() + "'" +
            ", adress='" + getAdress() + "'" +
            ", genre='" + getGenre() + "'" +
            ", telephone='" + getTelephone() + "'" +
            "}";
    }
}
