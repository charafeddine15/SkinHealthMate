package com.ensaj.service.dto;

import com.ensaj.domain.Dermatologue;
import com.ensaj.domain.Patient;
import com.ensaj.web.rest.vm.ManagedUserVM;
import java.util.Date;

public class NewPatientUserDTO {

    private Patient patient;

    private TransformedDermatologueUserDTO dermatologue;

    private ManagedUserVM user;

    public NewPatientUserDTO() {}

    public NewPatientUserDTO(Patient patient, TransformedDermatologueUserDTO dermatologue, ManagedUserVM user) {
        this.user = user;
        this.patient = patient;
        this.dermatologue = dermatologue;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public TransformedDermatologueUserDTO getDermatologue() {
        return dermatologue;
    }

    public void setDermatologue(TransformedDermatologueUserDTO dermatologue) {
        this.dermatologue = dermatologue;
    }

    public ManagedUserVM getUser() {
        return user;
    }

    public void setUser(ManagedUserVM user) {
        this.user = user;
    }
}
