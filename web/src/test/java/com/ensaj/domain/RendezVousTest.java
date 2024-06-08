package com.ensaj.domain;

import static com.ensaj.domain.ConsultationTestSamples.*;
import static com.ensaj.domain.DermatologueTestSamples.*;
import static com.ensaj.domain.PatientTestSamples.*;
import static com.ensaj.domain.RendezVousTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ensaj.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class RendezVousTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RendezVous.class);
        RendezVous rendezVous1 = getRendezVousSample1();
        RendezVous rendezVous2 = new RendezVous();
        assertThat(rendezVous1).isNotEqualTo(rendezVous2);

        rendezVous2.setId(rendezVous1.getId());
        assertThat(rendezVous1).isEqualTo(rendezVous2);

        rendezVous2 = getRendezVousSample2();
        assertThat(rendezVous1).isNotEqualTo(rendezVous2);
    }

    @Test
    void dermatologuesTest() throws Exception {
        RendezVous rendezVous = getRendezVousRandomSampleGenerator();
        Dermatologue dermatologueBack = getDermatologueRandomSampleGenerator();

        rendezVous.setDermatologues(dermatologueBack);
        assertThat(rendezVous.getDermatologues()).isEqualTo(dermatologueBack);

        rendezVous.dermatologues(null);
        assertThat(rendezVous.getDermatologues()).isNull();
    }

    @Test
    void patientsTest() throws Exception {
        RendezVous rendezVous = getRendezVousRandomSampleGenerator();
        Patient patientBack = getPatientRandomSampleGenerator();

        rendezVous.setPatients(patientBack);
        assertThat(rendezVous.getPatients()).isEqualTo(patientBack);

        rendezVous.patients(null);
        assertThat(rendezVous.getPatients()).isNull();
    }

    @Test
    void consultationTest() throws Exception {
        RendezVous rendezVous = getRendezVousRandomSampleGenerator();
        Consultation consultationBack = getConsultationRandomSampleGenerator();

        rendezVous.addConsultation(consultationBack);
        assertThat(rendezVous.getConsultations()).containsOnly(consultationBack);
        assertThat(consultationBack.getRendezVous()).isEqualTo(rendezVous);

        rendezVous.removeConsultation(consultationBack);
        assertThat(rendezVous.getConsultations()).doesNotContain(consultationBack);
        assertThat(consultationBack.getRendezVous()).isNull();

        rendezVous.consultations(new HashSet<>(Set.of(consultationBack)));
        assertThat(rendezVous.getConsultations()).containsOnly(consultationBack);
        assertThat(consultationBack.getRendezVous()).isEqualTo(rendezVous);

        rendezVous.setConsultations(new HashSet<>());
        assertThat(rendezVous.getConsultations()).doesNotContain(consultationBack);
        assertThat(consultationBack.getRendezVous()).isNull();
    }
}
