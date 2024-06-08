package com.ensaj.domain;

import static com.ensaj.domain.ImageStadeTestSamples.*;
import static com.ensaj.domain.StadeTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ensaj.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ImageStadeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ImageStade.class);
        ImageStade imageStade1 = getImageStadeSample1();
        ImageStade imageStade2 = new ImageStade();
        assertThat(imageStade1).isNotEqualTo(imageStade2);

        imageStade2.setId(imageStade1.getId());
        assertThat(imageStade1).isEqualTo(imageStade2);

        imageStade2 = getImageStadeSample2();
        assertThat(imageStade1).isNotEqualTo(imageStade2);
    }

    @Test
    void compositionTest() throws Exception {
        ImageStade imageStade = getImageStadeRandomSampleGenerator();
        Stade stadeBack = getStadeRandomSampleGenerator();

        imageStade.setComposition(stadeBack);
        assertThat(imageStade.getComposition()).isEqualTo(stadeBack);

        imageStade.composition(null);
        assertThat(imageStade.getComposition()).isNull();
    }
}
