package com.ensaj.domain;

import static com.ensaj.domain.SymptomsTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ensaj.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SymptomsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Symptoms.class);
        Symptoms symptoms1 = getSymptomsSample1();
        Symptoms symptoms2 = new Symptoms();
        assertThat(symptoms1).isNotEqualTo(symptoms2);

        symptoms2.setId(symptoms1.getId());
        assertThat(symptoms1).isEqualTo(symptoms2);

        symptoms2 = getSymptomsSample2();
        assertThat(symptoms1).isNotEqualTo(symptoms2);
    }
}
