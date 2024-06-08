package com.ensaj.domain;

import static com.ensaj.domain.DiagnosticTestSamples.*;
import static com.ensaj.domain.MaladieTestSamples.*;
import static com.ensaj.domain.StadeTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ensaj.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class MaladieTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Maladie.class);
        Maladie maladie1 = getMaladieSample1();
        Maladie maladie2 = new Maladie();
        assertThat(maladie1).isNotEqualTo(maladie2);

        maladie2.setId(maladie1.getId());
        assertThat(maladie1).isEqualTo(maladie2);

        maladie2 = getMaladieSample2();
        assertThat(maladie1).isNotEqualTo(maladie2);
    }

    @Test
    void stadeTest() throws Exception {
        Maladie maladie = getMaladieRandomSampleGenerator();
        Stade stadeBack = getStadeRandomSampleGenerator();

        maladie.addStade(stadeBack);
        assertThat(maladie.getStades()).containsOnly(stadeBack);
        assertThat(stadeBack.getComposition()).isEqualTo(maladie);

        maladie.removeStade(stadeBack);
        assertThat(maladie.getStades()).doesNotContain(stadeBack);
        assertThat(stadeBack.getComposition()).isNull();

        maladie.stades(new HashSet<>(Set.of(stadeBack)));
        assertThat(maladie.getStades()).containsOnly(stadeBack);
        assertThat(stadeBack.getComposition()).isEqualTo(maladie);

        maladie.setStades(new HashSet<>());
        assertThat(maladie.getStades()).doesNotContain(stadeBack);
        assertThat(stadeBack.getComposition()).isNull();
    }

    @Test
    void diagnosticsTest() throws Exception {
        Maladie maladie = getMaladieRandomSampleGenerator();
        Diagnostic diagnosticBack = getDiagnosticRandomSampleGenerator();

        maladie.setDiagnostics(diagnosticBack);
        assertThat(maladie.getDiagnostics()).isEqualTo(diagnosticBack);

        maladie.diagnostics(null);
        assertThat(maladie.getDiagnostics()).isNull();
    }
}
