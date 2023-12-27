package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.StudentTestSamples.*;
import static com.mycompany.myapp.domain.TestsStudentsTestSamples.*;
import static com.mycompany.myapp.domain.TestsTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TestsStudentsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TestsStudents.class);
        TestsStudents testsStudents1 = getTestsStudentsSample1();
        TestsStudents testsStudents2 = new TestsStudents();
        assertThat(testsStudents1).isNotEqualTo(testsStudents2);

        testsStudents2.setId(testsStudents1.getId());
        assertThat(testsStudents1).isEqualTo(testsStudents2);

        testsStudents2 = getTestsStudentsSample2();
        assertThat(testsStudents1).isNotEqualTo(testsStudents2);
    }

    @Test
    void studentIdTest() throws Exception {
        TestsStudents testsStudents = getTestsStudentsRandomSampleGenerator();
        Student studentBack = getStudentRandomSampleGenerator();

        testsStudents.setStudentId(studentBack);
        assertThat(testsStudents.getStudentId()).isEqualTo(studentBack);

        testsStudents.studentId(null);
        assertThat(testsStudents.getStudentId()).isNull();
    }

    @Test
    void testIdTest() throws Exception {
        TestsStudents testsStudents = getTestsStudentsRandomSampleGenerator();
        Tests testsBack = getTestsRandomSampleGenerator();

        testsStudents.setTestId(testsBack);
        assertThat(testsStudents.getTestId()).isEqualTo(testsBack);

        testsStudents.testId(null);
        assertThat(testsStudents.getTestId()).isNull();
    }
}
