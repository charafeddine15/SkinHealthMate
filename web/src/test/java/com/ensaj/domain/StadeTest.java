package com.ensaj.domain;

import static com.ensaj.domain.ImageStadeTestSamples.*;
import static com.ensaj.domain.MaladieTestSamples.*;
import static com.ensaj.domain.StadeTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ensaj.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class StadeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Stade.class);
        Stade stade1 = getStadeSample1();
        Stade stade2 = new Stade();
        assertThat(stade1).isNotEqualTo(stade2);

        stade2.setId(stade1.getId());
        assertThat(stade1).isEqualTo(stade2);

        stade2 = getStadeSample2();
        assertThat(stade1).isNotEqualTo(stade2);
    }

    @Test
    void imageStadeTest() throws Exception {
        Stade stade = getStadeRandomSampleGenerator();
        ImageStade imageStadeBack = getImageStadeRandomSampleGenerator();

        stade.addImageStade(imageStadeBack);
        assertThat(stade.getImageStades()).containsOnly(imageStadeBack);
        assertThat(imageStadeBack.getComposition()).isEqualTo(stade);

        stade.removeImageStade(imageStadeBack);
        assertThat(stade.getImageStades()).doesNotContain(imageStadeBack);
        assertThat(imageStadeBack.getComposition()).isNull();

        stade.imageStades(new HashSet<>(Set.of(imageStadeBack)));
        assertThat(stade.getImageStades()).containsOnly(imageStadeBack);
        assertThat(imageStadeBack.getComposition()).isEqualTo(stade);

        stade.setImageStades(new HashSet<>());
        assertThat(stade.getImageStades()).doesNotContain(imageStadeBack);
        assertThat(imageStadeBack.getComposition()).isNull();
    }

    @Test
    void compositionTest() throws Exception {
        Stade stade = getStadeRandomSampleGenerator();
        Maladie maladieBack = getMaladieRandomSampleGenerator();

        stade.setComposition(maladieBack);
        assertThat(stade.getComposition()).isEqualTo(maladieBack);

        stade.composition(null);
        assertThat(stade.getComposition()).isNull();
    }
}
