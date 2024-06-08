package com.ensaj.domain;

import static com.ensaj.domain.DermatologueTestSamples.*;
import static com.ensaj.domain.RendezVousTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ensaj.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class DermatologueTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Dermatologue.class);
        Dermatologue dermatologue1 = getDermatologueSample1();
        Dermatologue dermatologue2 = new Dermatologue();
        assertThat(dermatologue1).isNotEqualTo(dermatologue2);

        dermatologue2.setId(dermatologue1.getId());
        assertThat(dermatologue1).isEqualTo(dermatologue2);

        dermatologue2 = getDermatologueSample2();
        assertThat(dermatologue1).isNotEqualTo(dermatologue2);
    }

    @Test
    void dermatologuePatientsTest() throws Exception {
        Dermatologue dermatologue = getDermatologueRandomSampleGenerator();
        RendezVous rendezVousBack = getRendezVousRandomSampleGenerator();

        dermatologue.addDermatologuePatients(rendezVousBack);
        assertThat(dermatologue.getDermatologuePatients()).containsOnly(rendezVousBack);
        assertThat(rendezVousBack.getDermatologues()).isEqualTo(dermatologue);

        dermatologue.removeDermatologuePatients(rendezVousBack);
        assertThat(dermatologue.getDermatologuePatients()).doesNotContain(rendezVousBack);
        assertThat(rendezVousBack.getDermatologues()).isNull();

        dermatologue.dermatologuePatients(new HashSet<>(Set.of(rendezVousBack)));
        assertThat(dermatologue.getDermatologuePatients()).containsOnly(rendezVousBack);
        assertThat(rendezVousBack.getDermatologues()).isEqualTo(dermatologue);

        dermatologue.setDermatologuePatients(new HashSet<>());
        assertThat(dermatologue.getDermatologuePatients()).doesNotContain(rendezVousBack);
        assertThat(rendezVousBack.getDermatologues()).isNull();
    }
}
