package com.ensaj.domain;

import java.util.UUID;

public class ImageStadeTestSamples {

    public static ImageStade getImageStadeSample1() {
        return new ImageStade().id("id1");
    }

    public static ImageStade getImageStadeSample2() {
        return new ImageStade().id("id2");
    }

    public static ImageStade getImageStadeRandomSampleGenerator() {
        return new ImageStade().id(UUID.randomUUID().toString());
    }
}
