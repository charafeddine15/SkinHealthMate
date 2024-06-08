package com.ensaj.service.dto;

import java.time.Instant;
import java.util.List;

public class ConsultationDTOSimplifie {

    private String id;
    private Instant dateConsultation;
    private DermatologueConsultations rendezVous;
    private List<String> diagnostics;

    public ConsultationDTOSimplifie() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Instant getDateConsultation() {
        return dateConsultation;
    }

    public void setDateConsultation(Instant dateConsultation) {
        this.dateConsultation = dateConsultation;
    }

    public DermatologueConsultations getRendezVous() {
        return rendezVous;
    }

    public void setRendezVous(DermatologueConsultations rendezVous) {
        this.rendezVous = rendezVous;
    }

    public List<String> getDiagnostics() {
        return diagnostics;
    }

    public void setDiagnostics(List<String> diagnostics) {
        this.diagnostics = diagnostics;
    }
}
