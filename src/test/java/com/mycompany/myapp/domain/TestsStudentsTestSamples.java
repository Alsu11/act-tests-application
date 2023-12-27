package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class TestsStudentsTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static TestsStudents getTestsStudentsSample1() {
        return new TestsStudents().id(1L).result("result1");
    }

    public static TestsStudents getTestsStudentsSample2() {
        return new TestsStudents().id(2L).result("result2");
    }

    public static TestsStudents getTestsStudentsRandomSampleGenerator() {
        return new TestsStudents().id(longCount.incrementAndGet()).result(UUID.randomUUID().toString());
    }
}
