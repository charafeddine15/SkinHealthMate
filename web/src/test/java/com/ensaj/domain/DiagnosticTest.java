package com.ensaj.domain;

import static com.ensaj.domain.ConsultationTestSamples.*;
import static com.ensaj.domain.DiagnosticTestSamples.*;
import static com.ensaj.domain.MaladieTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ensaj.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class DiagnosticTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Diagnostic.class);
        Diagnostic diagnostic1 = getDiagnosticSample1();
        Diagnostic diagnostic2 = new Diagnostic();
        assertThat(diagnostic1).isNotEqualTo(diagnostic2);

        diagnostic2.setId(diagnostic1.getId());
        assertThat(diagnostic1).isEqualTo(diagnostic2);

        diagnostic2 = getDiagnosticSample2();
        assertThat(diagnostic1).isNotEqualTo(diagnostic2);
    }

    @Test
    void consultationsTest() throws Exception {
        Diagnostic diagnostic = getDiagnosticRandomSampleGenerator();
        Consultation consultationBack = getConsultationRandomSampleGenerator();

        diagnostic.setConsultations(consultationBack);
        assertThat(diagnostic.getConsultations()).isEqualTo(consultationBack);

        diagnostic.consultations(null);
        assertThat(diagnostic.getConsultations()).isNull();
    }

    @Test
    void maladieTest() throws Exception {
        Diagnostic diagnostic = getDiagnosticRandomSampleGenerator();
        Maladie maladieBack = getMaladieRandomSampleGenerator();

        diagnostic.addMaladie(maladieBack);
        assertThat(diagnostic.getMaladies()).containsOnly(maladieBack);
        assertThat(maladieBack.getDiagnostics()).isEqualTo(diagnostic);

        diagnostic.removeMaladie(maladieBack);
        assertThat(diagnostic.getMaladies()).doesNotContain(maladieBack);
        assertThat(maladieBack.getDiagnostics()).isNull();

        diagnostic.maladies(new HashSet<>(Set.of(maladieBack)));
        assertThat(diagnostic.getMaladies()).containsOnly(maladieBack);
        assertThat(maladieBack.getDiagnostics()).isEqualTo(diagnostic);

        diagnostic.setMaladies(new HashSet<>());
        assertThat(diagnostic.getMaladies()).doesNotContain(maladieBack);
        assertThat(maladieBack.getDiagnostics()).isNull();
    }
}
