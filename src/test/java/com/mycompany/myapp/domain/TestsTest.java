package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.MaterialTestSamples.*;
import static com.mycompany.myapp.domain.TestsTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TestsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Tests.class);
        Tests tests1 = getTestsSample1();
        Tests tests2 = new Tests();
        assertThat(tests1).isNotEqualTo(tests2);

        tests2.setId(tests1.getId());
        assertThat(tests1).isEqualTo(tests2);

        tests2 = getTestsSample2();
        assertThat(tests1).isNotEqualTo(tests2);
    }

    @Test
    void materialIdTest() throws Exception {
        Tests tests = getTestsRandomSampleGenerator();
        Material materialBack = getMaterialRandomSampleGenerator();

        tests.setMaterialId(materialBack);
        assertThat(tests.getMaterialId()).isEqualTo(materialBack);

        tests.materialId(null);
        assertThat(tests.getMaterialId()).isNull();
    }
}
