package com.ensaj.domain;

import java.util.UUID;

public class PatientTestSamples {

    public static Patient getPatientSample1() {
        return new Patient().id("id1").adress("adress1").genre("genre1").telephone("telephone1");
    }

    public static Patient getPatientSample2() {
        return new Patient().id("id2").adress("adress2").genre("genre2").telephone("telephone2");
    }

    public static Patient getPatientRandomSampleGenerator() {
        return new Patient()
            .id(UUID.randomUUID().toString())
            .adress(UUID.randomUUID().toString())
            .genre(UUID.randomUUID().toString())
            .telephone(UUID.randomUUID().toString());
    }
}
