package com.ensaj.service.dto;

import com.ensaj.domain.Consultation;
import com.ensaj.domain.Dermatologue;
import com.ensaj.domain.Patient;
import com.ensaj.domain.User;
import io.mongock.utils.field.Field;
import java.time.Instant;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

public class DermatologuePatientsDTO {

    private Patient patient;

    public DermatologuePatientsDTO() {}

    public DermatologuePatientsDTO(Patient patient) {
        this.patient = patient;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient user) {
        this.patient = user;
    }
}
