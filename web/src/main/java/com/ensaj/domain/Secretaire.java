package com.ensaj.domain;

import java.io.Serializable;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Secretaire.
 */
@Document(collection = "secretaire")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Secretaire implements Serializable {

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

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Secretaire id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCodeEmp() {
        return this.codeEmp;
    }

    public Secretaire codeEmp(String codeEmp) {
        this.setCodeEmp(codeEmp);
        return this;
    }

    public void setCodeEmp(String codeEmp) {
        this.codeEmp = codeEmp;
    }

    public String getGenre() {
        return this.genre;
    }

    public Secretaire genre(String genre) {
        this.setGenre(genre);
        return this;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getTelephone() {
        return this.telephone;
    }

    public Secretaire telephone(String telephone) {
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

    public Secretaire user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Secretaire)) {
            return false;
        }
        return getId() != null && getId().equals(((Secretaire) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Secretaire{" +
            "id=" + getId() +
            ", codeEmp='" + getCodeEmp() + "'" +
            ", genre='" + getGenre() + "'" +
            ", telephone='" + getTelephone() + "'" +
            "}";
    }
}
