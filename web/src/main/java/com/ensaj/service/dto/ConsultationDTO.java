package com.ensaj.service.dto;

import java.time.Instant;
import java.util.List;

public class ConsultationDTO {

    private String id;
    private Instant dateConsultation;
    private RendezVousDTO rendezVous;
    private List<String> diagnostics;

    public ConsultationDTO() {}

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

    public RendezVousDTO getRendezVous() {
        return rendezVous;
    }

    public void setRendezVous(RendezVousDTO rendezVous) {
        this.rendezVous = rendezVous;
    }

    public List<String> getDiagnostics() {
        return diagnostics;
    }

    public void setDiagnostics(List<String> diagnostics) {
        this.diagnostics = diagnostics;
    }
}
