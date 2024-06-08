package com.ensaj.service.dto;

import com.ensaj.domain.Patient;
import com.ensaj.web.rest.vm.ManagedUserVM;
import java.util.Date;

public class PatientUserDTO {

    private Patient patient;

    private ManagedUserVM user;

    public PatientUserDTO() {}

    public PatientUserDTO(Patient patient, ManagedUserVM user) {
        this.patient = patient;
        this.user = user;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public ManagedUserVM getUser() {
        return user;
    }

    public void setUser(ManagedUserVM user) {
        this.user = user;
    }
}
