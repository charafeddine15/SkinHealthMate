package com.ensaj.service.dto;

import com.ensaj.domain.RendezVous;
import com.ensaj.web.rest.vm.ManagedUserVM;
import java.util.List;

public class TransformedSecretaireUserDTO {

    private ManagedUserVM user;
    private String id;
    private String codeEmp;
    private String genre;
    private String telephone;

    // Getters et Setters

    public TransformedSecretaireUserDTO(SecretaireUserDTO original) {
        this.user = original.getUser();
        this.id = original.getSecretaire().getId();
        this.codeEmp = original.getSecretaire().getCodeEmp();
        this.genre = original.getSecretaire().getGenre();
        this.telephone = original.getSecretaire().getTelephone();
    }

    public TransformedSecretaireUserDTO() {}

    public ManagedUserVM getUser() {
        return user;
    }

    public void setUser(ManagedUserVM user) {
        this.user = user;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCodeEmp() {
        return codeEmp;
    }

    public void setCodeEmp(String codeEmp) {
        this.codeEmp = codeEmp;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
}
