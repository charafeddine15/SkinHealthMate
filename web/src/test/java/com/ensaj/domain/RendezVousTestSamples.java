package com.ensaj.domain;

import java.util.UUID;

public class RendezVousTestSamples {

    public static RendezVous getRendezVousSample1() {
        return new RendezVous().id("id1");
    }

    public static RendezVous getRendezVousSample2() {
        return new RendezVous().id("id2");
    }

    public static RendezVous getRendezVousRandomSampleGenerator() {
        return new RendezVous().id(UUID.randomUUID().toString());
    }
}
