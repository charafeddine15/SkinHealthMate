package com.ensaj.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A ImageStade.
 */
@Document(collection = "image_stade")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ImageStade implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("picture")
    private byte[] picture;

    @Field("picture_content_type")
    private String pictureContentType;

    @DBRef
    @Field("composition")
    @JsonIgnoreProperties(value = { "imageStades", "composition" }, allowSetters = true)
    private Stade composition;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public ImageStade id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public byte[] getPicture() {
        return this.picture;
    }

    public ImageStade picture(byte[] picture) {
        this.setPicture(picture);
        return this;
    }

    public void setPicture(byte[] picture) {
        this.picture = picture;
    }

    public String getPictureContentType() {
        return this.pictureContentType;
    }

    public ImageStade pictureContentType(String pictureContentType) {
        this.pictureContentType = pictureContentType;
        return this;
    }

    public void setPictureContentType(String pictureContentType) {
        this.pictureContentType = pictureContentType;
    }

    public Stade getComposition() {
        return this.composition;
    }

    public void setComposition(Stade stade) {
        this.composition = stade;
    }

    public ImageStade composition(Stade stade) {
        this.setComposition(stade);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ImageStade)) {
            return false;
        }
        return getId() != null && getId().equals(((ImageStade) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ImageStade{" +
            "id=" + getId() +
            ", picture='" + getPicture() + "'" +
            ", pictureContentType='" + getPictureContentType() + "'" +
            "}";
    }
}
