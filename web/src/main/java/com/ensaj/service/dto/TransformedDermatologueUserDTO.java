package com.ensaj.service.dto;

import com.ensaj.domain.RendezVous;
import com.ensaj.web.rest.vm.ManagedUserVM;
import java.util.List;

public class TransformedDermatologueUserDTO {

    private ManagedUserVM user;
    private String id;
    private String codeEmp;
    private String genre;
    private String telephone;
    private List<RendezVous> dermatologuePatients;

    // Getters et Setters

    public TransformedDermatologueUserDTO(DermatologueUserDTO original) {
        this.user = original.getUser();
        this.id = original.getDermatologue().getId();
        this.codeEmp = original.getDermatologue().getCodeEmp();
        this.genre = original.getDermatologue().getGenre();
        this.telephone = original.getDermatologue().getTelephone();
    }

    public TransformedDermatologueUserDTO() {}

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

    public List<RendezVous> getDermatologuePatients() {
        return dermatologuePatients;
    }

    public void setDermatologuePatients(List<RendezVous> dermatologuePatients) {
        this.dermatologuePatients = dermatologuePatients;
    }
}
