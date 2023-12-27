package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Tests;
import com.mycompany.myapp.repository.TestsRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TestsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TestsResourceIT {

    private static final String DEFAULT_SUBJECT = "AAAAAAAAAA";
    private static final String UPDATED_SUBJECT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/tests";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TestsRepository testsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTestsMockMvc;

    private Tests tests;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tests createEntity(EntityManager em) {
        Tests tests = new Tests().subject(DEFAULT_SUBJECT);
        return tests;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tests createUpdatedEntity(EntityManager em) {
        Tests tests = new Tests().subject(UPDATED_SUBJECT);
        return tests;
    }

    @BeforeEach
    public void initTest() {
        tests = createEntity(em);
    }

    @Test
    @Transactional
    void createTests() throws Exception {
        int databaseSizeBeforeCreate = testsRepository.findAll().size();
        // Create the Tests
        restTestsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tests)))
            .andExpect(status().isCreated());

        // Validate the Tests in the database
        List<Tests> testsList = testsRepository.findAll();
        assertThat(testsList).hasSize(databaseSizeBeforeCreate + 1);
        Tests testTests = testsList.get(testsList.size() - 1);
        assertThat(testTests.getSubject()).isEqualTo(DEFAULT_SUBJECT);
    }

    @Test
    @Transactional
    void createTestsWithExistingId() throws Exception {
        // Create the Tests with an existing ID
        tests.setId(1L);

        int databaseSizeBeforeCreate = testsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTestsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tests)))
            .andExpect(status().isBadRequest());

        // Validate the Tests in the database
        List<Tests> testsList = testsRepository.findAll();
        assertThat(testsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTests() throws Exception {
        // Initialize the database
        testsRepository.saveAndFlush(tests);

        // Get all the testsList
        restTestsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tests.getId().intValue())))
            .andExpect(jsonPath("$.[*].subject").value(hasItem(DEFAULT_SUBJECT)));
    }

    @Test
    @Transactional
    void getTests() throws Exception {
        // Initialize the database
        testsRepository.saveAndFlush(tests);

        // Get the tests
        restTestsMockMvc
            .perform(get(ENTITY_API_URL_ID, tests.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tests.getId().intValue()))
            .andExpect(jsonPath("$.subject").value(DEFAULT_SUBJECT));
    }

    @Test
    @Transactional
    void getNonExistingTests() throws Exception {
        // Get the tests
        restTestsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTests() throws Exception {
        // Initialize the database
        testsRepository.saveAndFlush(tests);

        int databaseSizeBeforeUpdate = testsRepository.findAll().size();

        // Update the tests
        Tests updatedTests = testsRepository.findById(tests.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTests are not directly saved in db
        em.detach(updatedTests);
        updatedTests.subject(UPDATED_SUBJECT);

        restTestsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTests.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTests))
            )
            .andExpect(status().isOk());

        // Validate the Tests in the database
        List<Tests> testsList = testsRepository.findAll();
        assertThat(testsList).hasSize(databaseSizeBeforeUpdate);
        Tests testTests = testsList.get(testsList.size() - 1);
        assertThat(testTests.getSubject()).isEqualTo(UPDATED_SUBJECT);
    }

    @Test
    @Transactional
    void putNonExistingTests() throws Exception {
        int databaseSizeBeforeUpdate = testsRepository.findAll().size();
        tests.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTestsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, tests.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tests))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tests in the database
        List<Tests> testsList = testsRepository.findAll();
        assertThat(testsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTests() throws Exception {
        int databaseSizeBeforeUpdate = testsRepository.findAll().size();
        tests.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTestsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tests))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tests in the database
        List<Tests> testsList = testsRepository.findAll();
        assertThat(testsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTests() throws Exception {
        int databaseSizeBeforeUpdate = testsRepository.findAll().size();
        tests.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTestsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tests)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Tests in the database
        List<Tests> testsList = testsRepository.findAll();
        assertThat(testsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTestsWithPatch() throws Exception {
        // Initialize the database
        testsRepository.saveAndFlush(tests);

        int databaseSizeBeforeUpdate = testsRepository.findAll().size();

        // Update the tests using partial update
        Tests partialUpdatedTests = new Tests();
        partialUpdatedTests.setId(tests.getId());

        partialUpdatedTests.subject(UPDATED_SUBJECT);

        restTestsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTests.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTests))
            )
            .andExpect(status().isOk());

        // Validate the Tests in the database
        List<Tests> testsList = testsRepository.findAll();
        assertThat(testsList).hasSize(databaseSizeBeforeUpdate);
        Tests testTests = testsList.get(testsList.size() - 1);
        assertThat(testTests.getSubject()).isEqualTo(UPDATED_SUBJECT);
    }

    @Test
    @Transactional
    void fullUpdateTestsWithPatch() throws Exception {
        // Initialize the database
        testsRepository.saveAndFlush(tests);

        int databaseSizeBeforeUpdate = testsRepository.findAll().size();

        // Update the tests using partial update
        Tests partialUpdatedTests = new Tests();
        partialUpdatedTests.setId(tests.getId());

        partialUpdatedTests.subject(UPDATED_SUBJECT);

        restTestsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTests.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTests))
            )
            .andExpect(status().isOk());

        // Validate the Tests in the database
        List<Tests> testsList = testsRepository.findAll();
        assertThat(testsList).hasSize(databaseSizeBeforeUpdate);
        Tests testTests = testsList.get(testsList.size() - 1);
        assertThat(testTests.getSubject()).isEqualTo(UPDATED_SUBJECT);
    }

    @Test
    @Transactional
    void patchNonExistingTests() throws Exception {
        int databaseSizeBeforeUpdate = testsRepository.findAll().size();
        tests.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTestsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, tests.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tests))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tests in the database
        List<Tests> testsList = testsRepository.findAll();
        assertThat(testsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTests() throws Exception {
        int databaseSizeBeforeUpdate = testsRepository.findAll().size();
        tests.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTestsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tests))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tests in the database
        List<Tests> testsList = testsRepository.findAll();
        assertThat(testsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTests() throws Exception {
        int databaseSizeBeforeUpdate = testsRepository.findAll().size();
        tests.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTestsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(tests)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Tests in the database
        List<Tests> testsList = testsRepository.findAll();
        assertThat(testsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTests() throws Exception {
        // Initialize the database
        testsRepository.saveAndFlush(tests);

        int databaseSizeBeforeDelete = testsRepository.findAll().size();

        // Delete the tests
        restTestsMockMvc
            .perform(delete(ENTITY_API_URL_ID, tests.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Tests> testsList = testsRepository.findAll();
        assertThat(testsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
