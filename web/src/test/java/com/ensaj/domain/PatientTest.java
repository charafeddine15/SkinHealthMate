package com.ensaj.domain;

import static com.ensaj.domain.PatientTestSamples.*;
import static com.ensaj.domain.RendezVousTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ensaj.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class PatientTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Patient.class);
        Patient patient1 = getPatientSample1();
        Patient patient2 = new Patient();
        assertThat(patient1).isNotEqualTo(patient2);

        patient2.setId(patient1.getId());
        assertThat(patient1).isEqualTo(patient2);

        patient2 = getPatientSample2();
        assertThat(patient1).isNotEqualTo(patient2);
    }

    @Test
    void dermatologuePatientsTest() throws Exception {
        Patient patient = getPatientRandomSampleGenerator();
        RendezVous rendezVousBack = getRendezVousRandomSampleGenerator();

        patient.addDermatologuePatients(rendezVousBack);
        assertThat(patient.getDermatologuePatients()).containsOnly(rendezVousBack);
        assertThat(rendezVousBack.getPatients()).isEqualTo(patient);

        patient.removeDermatologuePatients(rendezVousBack);
        assertThat(patient.getDermatologuePatients()).doesNotContain(rendezVousBack);
        assertThat(rendezVousBack.getPatients()).isNull();

        patient.dermatologuePatients(new HashSet<>(Set.of(rendezVousBack)));
        assertThat(patient.getDermatologuePatients()).containsOnly(rendezVousBack);
        assertThat(rendezVousBack.getPatients()).isEqualTo(patient);

        patient.setDermatologuePatients(new HashSet<>());
        assertThat(patient.getDermatologuePatients()).doesNotContain(rendezVousBack);
        assertThat(rendezVousBack.getPatients()).isNull();
    }
}
