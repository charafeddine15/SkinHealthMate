package com.ensaj.domain;

import java.util.UUID;

public class DermatologueTestSamples {

    public static Dermatologue getDermatologueSample1() {
        return new Dermatologue().id("id1").codeEmp("codeEmp1").genre("genre1").telephone("telephone1");
    }

    public static Dermatologue getDermatologueSample2() {
        return new Dermatologue().id("id2").codeEmp("codeEmp2").genre("genre2").telephone("telephone2");
    }

    public static Dermatologue getDermatologueRandomSampleGenerator() {
        return new Dermatologue()
            .id(UUID.randomUUID().toString())
            .codeEmp(UUID.randomUUID().toString())
            .genre(UUID.randomUUID().toString())
            .telephone(UUID.randomUUID().toString());
    }
}
