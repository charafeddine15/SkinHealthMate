package com.ensaj.domain;

import static com.ensaj.domain.SecretaireTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ensaj.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SecretaireTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Secretaire.class);
        Secretaire secretaire1 = getSecretaireSample1();
        Secretaire secretaire2 = new Secretaire();
        assertThat(secretaire1).isNotEqualTo(secretaire2);

        secretaire2.setId(secretaire1.getId());
        assertThat(secretaire1).isEqualTo(secretaire2);

        secretaire2 = getSecretaireSample2();
        assertThat(secretaire1).isNotEqualTo(secretaire2);
    }
}
