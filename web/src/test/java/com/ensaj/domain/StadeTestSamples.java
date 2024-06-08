package com.ensaj.domain;

import java.util.UUID;

public class StadeTestSamples {

    public static Stade getStadeSample1() {
        return new Stade().id("id1").stade("stade1").description("description1");
    }

    public static Stade getStadeSample2() {
        return new Stade().id("id2").stade("stade2").description("description2");
    }

    public static Stade getStadeRandomSampleGenerator() {
        return new Stade().id(UUID.randomUUID().toString()).stade(UUID.randomUUID().toString()).description(UUID.randomUUID().toString());
    }
}
