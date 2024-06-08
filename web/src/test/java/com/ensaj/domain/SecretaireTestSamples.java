package com.ensaj.domain;

import java.util.UUID;

public class SecretaireTestSamples {

    public static Secretaire getSecretaireSample1() {
        return new Secretaire().id("id1").codeEmp("codeEmp1").genre("genre1").telephone("telephone1");
    }

    public static Secretaire getSecretaireSample2() {
        return new Secretaire().id("id2").codeEmp("codeEmp2").genre("genre2").telephone("telephone2");
    }

    public static Secretaire getSecretaireRandomSampleGenerator() {
        return new Secretaire()
            .id(UUID.randomUUID().toString())
            .codeEmp(UUID.randomUUID().toString())
            .genre(UUID.randomUUID().toString())
            .telephone(UUID.randomUUID().toString());
    }
}
