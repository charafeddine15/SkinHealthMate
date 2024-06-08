package com.ensaj.domain;

import static com.ensaj.domain.ConsultationTestSamples.*;
import static com.ensaj.domain.DiagnosticTestSamples.*;
import static com.ensaj.domain.RendezVousTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ensaj.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ConsultationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Consultation.class);
        Consultation consultation1 = getConsultationSample1();
        Consultation consultation2 = new Consultation();
        assertThat(consultation1).isNotEqualTo(consultation2);

        consultation2.setId(consultation1.getId());
        assertThat(consultation1).isEqualTo(consultation2);

        consultation2 = getConsultationSample2();
        assertThat(consultation1).isNotEqualTo(consultation2);
    }

    @Test
    void rendezVousTest() throws Exception {
        Consultation consultation = getConsultationRandomSampleGenerator();
        RendezVous rendezVousBack = getRendezVousRandomSampleGenerator();

        consultation.setRendezVous(rendezVousBack);
        assertThat(consultation.getRendezVous()).isEqualTo(rendezVousBack);

        consultation.rendezVous(null);
        assertThat(consultation.getRendezVous()).isNull();
    }

    @Test
    void diagnosticTest() throws Exception {
        Consultation consultation = getConsultationRandomSampleGenerator();
        Diagnostic diagnosticBack = getDiagnosticRandomSampleGenerator();

        consultation.addDiagnostic(diagnosticBack);
        assertThat(consultation.getDiagnostics()).containsOnly(diagnosticBack);
        assertThat(diagnosticBack.getConsultations()).isEqualTo(consultation);

        consultation.removeDiagnostic(diagnosticBack);
        assertThat(consultation.getDiagnostics()).doesNotContain(diagnosticBack);
        assertThat(diagnosticBack.getConsultations()).isNull();

        consultation.diagnostics(new HashSet<>(Set.of(diagnosticBack)));
        assertThat(consultation.getDiagnostics()).containsOnly(diagnosticBack);
        assertThat(diagnosticBack.getConsultations()).isEqualTo(consultation);

        consultation.setDiagnostics(new HashSet<>());
        assertThat(consultation.getDiagnostics()).doesNotContain(diagnosticBack);
        assertThat(diagnosticBack.getConsultations()).isNull();
    }
}
