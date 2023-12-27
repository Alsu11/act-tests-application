package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class QuestionTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Question getQuestionSample1() {
        return new Question().id(1L).question("question1").answers("answers1").points("points1");
    }

    public static Question getQuestionSample2() {
        return new Question().id(2L).question("question2").answers("answers2").points("points2");
    }

    public static Question getQuestionRandomSampleGenerator() {
        return new Question()
            .id(longCount.incrementAndGet())
            .question(UUID.randomUUID().toString())
            .answers(UUID.randomUUID().toString())
            .points(UUID.randomUUID().toString());
    }
}
