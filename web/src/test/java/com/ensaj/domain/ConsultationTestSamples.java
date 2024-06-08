package com.ensaj.domain;

import java.util.UUID;

public class ConsultationTestSamples {

    public static Consultation getConsultationSample1() {
        return new Consultation().id("id1");
    }

    public static Consultation getConsultationSample2() {
        return new Consultation().id("id2");
    }

    public static Consultation getConsultationRandomSampleGenerator() {
        return new Consultation().id(UUID.randomUUID().toString());
    }
}
