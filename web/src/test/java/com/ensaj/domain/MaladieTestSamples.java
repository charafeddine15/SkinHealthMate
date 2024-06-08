package com.ensaj.domain;

import java.util.UUID;

public class MaladieTestSamples {

    public static Maladie getMaladieSample1() {
        return new Maladie().id("id1").fullName("fullName1").abbr("abbr1");
    }

    public static Maladie getMaladieSample2() {
        return new Maladie().id("id2").fullName("fullName2").abbr("abbr2");
    }

    public static Maladie getMaladieRandomSampleGenerator() {
        return new Maladie().id(UUID.randomUUID().toString()).fullName(UUID.randomUUID().toString()).abbr(UUID.randomUUID().toString());
    }
}
