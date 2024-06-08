package com.ensaj.domain;

import java.util.UUID;

public class SymptomsTestSamples {

    public static Symptoms getSymptomsSample1() {
        return new Symptoms().id("id1").nom("nom1");
    }

    public static Symptoms getSymptomsSample2() {
        return new Symptoms().id("id2").nom("nom2");
    }

    public static Symptoms getSymptomsRandomSampleGenerator() {
        return new Symptoms().id(UUID.randomUUID().toString()).nom(UUID.randomUUID().toString());
    }
}
