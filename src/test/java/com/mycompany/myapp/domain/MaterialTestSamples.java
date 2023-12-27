package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class MaterialTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Material getMaterialSample1() {
        return new Material().id(1L).topic("topic1").link("link1");
    }

    public static Material getMaterialSample2() {
        return new Material().id(2L).topic("topic2").link("link2");
    }

    public static Material getMaterialRandomSampleGenerator() {
        return new Material().id(longCount.incrementAndGet()).topic(UUID.randomUUID().toString()).link(UUID.randomUUID().toString());
    }
}
