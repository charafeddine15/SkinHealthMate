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
 * A Stade.
 */
@Document(collection = "stade")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Stade implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("stade")
    private String stade;

    @Field("description")
    private String description;

    @DBRef
    @Field("imageStade")
    @JsonIgnoreProperties(value = { "composition" }, allowSetters = true)
    private Set<ImageStade> imageStades = new HashSet<>();

    @DBRef
    @Field("composition")
    @JsonIgnoreProperties(value = { "stades", "diagnostics" }, allowSetters = true)
    private Maladie composition;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Stade id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStade() {
        return this.stade;
    }

    public Stade stade(String stade) {
        this.setStade(stade);
        return this;
    }

    public void setStade(String stade) {
        this.stade = stade;
    }

    public String getDescription() {
        return this.description;
    }

    public Stade description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<ImageStade> getImageStades() {
        return this.imageStades;
    }

    public void setImageStades(Set<ImageStade> imageStades) {
        if (this.imageStades != null) {
            this.imageStades.forEach(i -> i.setComposition(null));
        }
        if (imageStades != null) {
            imageStades.forEach(i -> i.setComposition(this));
        }
        this.imageStades = imageStades;
    }

    public Stade imageStades(Set<ImageStade> imageStades) {
        this.setImageStades(imageStades);
        return this;
    }

    public Stade addImageStade(ImageStade imageStade) {
        this.imageStades.add(imageStade);
        imageStade.setComposition(this);
        return this;
    }

    public Stade removeImageStade(ImageStade imageStade) {
        this.imageStades.remove(imageStade);
        imageStade.setComposition(null);
        return this;
    }

    public Maladie getComposition() {
        return this.composition;
    }

    public void setComposition(Maladie maladie) {
        this.composition = maladie;
    }

    public Stade composition(Maladie maladie) {
        this.setComposition(maladie);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Stade)) {
            return false;
        }
        return getId() != null && getId().equals(((Stade) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Stade{" +
            "id=" + getId() +
            ", stade='" + getStade() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
