package com.ensaj.domain;

import java.util.UUID;

public class DiagnosticTestSamples {

    public static Diagnostic getDiagnosticSample1() {
        return new Diagnostic().id("id1").description("description1").prescription("prescription1");
    }

    public static Diagnostic getDiagnosticSample2() {
        return new Diagnostic().id("id2").description("description2").prescription("prescription2");
    }

    public static Diagnostic getDiagnosticRandomSampleGenerator() {
        return new Diagnostic()
            .id(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString())
            .prescription(UUID.randomUUID().toString());
    }
}
