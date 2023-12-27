package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.TestsStudents;
import com.mycompany.myapp.repository.TestsStudentsRepository;
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
 * Integration tests for the {@link TestsStudentsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TestsStudentsResourceIT {

    private static final String DEFAULT_RESULT = "AAAAAAAAAA";
    private static final String UPDATED_RESULT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/tests-students";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TestsStudentsRepository testsStudentsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTestsStudentsMockMvc;

    private TestsStudents testsStudents;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TestsStudents createEntity(EntityManager em) {
        TestsStudents testsStudents = new TestsStudents().result(DEFAULT_RESULT);
        return testsStudents;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TestsStudents createUpdatedEntity(EntityManager em) {
        TestsStudents testsStudents = new TestsStudents().result(UPDATED_RESULT);
        return testsStudents;
    }

    @BeforeEach
    public void initTest() {
        testsStudents = createEntity(em);
    }

    @Test
    @Transactional
    void createTestsStudents() throws Exception {
        int databaseSizeBeforeCreate = testsStudentsRepository.findAll().size();
        // Create the TestsStudents
        restTestsStudentsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(testsStudents)))
            .andExpect(status().isCreated());

        // Validate the TestsStudents in the database
        List<TestsStudents> testsStudentsList = testsStudentsRepository.findAll();
        assertThat(testsStudentsList).hasSize(databaseSizeBeforeCreate + 1);
        TestsStudents testTestsStudents = testsStudentsList.get(testsStudentsList.size() - 1);
        assertThat(testTestsStudents.getResult()).isEqualTo(DEFAULT_RESULT);
    }

    @Test
    @Transactional
    void createTestsStudentsWithExistingId() throws Exception {
        // Create the TestsStudents with an existing ID
        testsStudents.setId(1L);

        int databaseSizeBeforeCreate = testsStudentsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTestsStudentsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(testsStudents)))
            .andExpect(status().isBadRequest());

        // Validate the TestsStudents in the database
        List<TestsStudents> testsStudentsList = testsStudentsRepository.findAll();
        assertThat(testsStudentsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTestsStudents() throws Exception {
        // Initialize the database
        testsStudentsRepository.saveAndFlush(testsStudents);

        // Get all the testsStudentsList
        restTestsStudentsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(testsStudents.getId().intValue())))
            .andExpect(jsonPath("$.[*].result").value(hasItem(DEFAULT_RESULT)));
    }

    @Test
    @Transactional
    void getTestsStudents() throws Exception {
        // Initialize the database
        testsStudentsRepository.saveAndFlush(testsStudents);

        // Get the testsStudents
        restTestsStudentsMockMvc
            .perform(get(ENTITY_API_URL_ID, testsStudents.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(testsStudents.getId().intValue()))
            .andExpect(jsonPath("$.result").value(DEFAULT_RESULT));
    }

    @Test
    @Transactional
    void getNonExistingTestsStudents() throws Exception {
        // Get the testsStudents
        restTestsStudentsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTestsStudents() throws Exception {
        // Initialize the database
        testsStudentsRepository.saveAndFlush(testsStudents);

        int databaseSizeBeforeUpdate = testsStudentsRepository.findAll().size();

        // Update the testsStudents
        TestsStudents updatedTestsStudents = testsStudentsRepository.findById(testsStudents.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTestsStudents are not directly saved in db
        em.detach(updatedTestsStudents);
        updatedTestsStudents.result(UPDATED_RESULT);

        restTestsStudentsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTestsStudents.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTestsStudents))
            )
            .andExpect(status().isOk());

        // Validate the TestsStudents in the database
        List<TestsStudents> testsStudentsList = testsStudentsRepository.findAll();
        assertThat(testsStudentsList).hasSize(databaseSizeBeforeUpdate);
        TestsStudents testTestsStudents = testsStudentsList.get(testsStudentsList.size() - 1);
        assertThat(testTestsStudents.getResult()).isEqualTo(UPDATED_RESULT);
    }

    @Test
    @Transactional
    void putNonExistingTestsStudents() throws Exception {
        int databaseSizeBeforeUpdate = testsStudentsRepository.findAll().size();
        testsStudents.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTestsStudentsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, testsStudents.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(testsStudents))
            )
            .andExpect(status().isBadRequest());

        // Validate the TestsStudents in the database
        List<TestsStudents> testsStudentsList = testsStudentsRepository.findAll();
        assertThat(testsStudentsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTestsStudents() throws Exception {
        int databaseSizeBeforeUpdate = testsStudentsRepository.findAll().size();
        testsStudents.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTestsStudentsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(testsStudents))
            )
            .andExpect(status().isBadRequest());

        // Validate the TestsStudents in the database
        List<TestsStudents> testsStudentsList = testsStudentsRepository.findAll();
        assertThat(testsStudentsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTestsStudents() throws Exception {
        int databaseSizeBeforeUpdate = testsStudentsRepository.findAll().size();
        testsStudents.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTestsStudentsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(testsStudents)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TestsStudents in the database
        List<TestsStudents> testsStudentsList = testsStudentsRepository.findAll();
        assertThat(testsStudentsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTestsStudentsWithPatch() throws Exception {
        // Initialize the database
        testsStudentsRepository.saveAndFlush(testsStudents);

        int databaseSizeBeforeUpdate = testsStudentsRepository.findAll().size();

        // Update the testsStudents using partial update
        TestsStudents partialUpdatedTestsStudents = new TestsStudents();
        partialUpdatedTestsStudents.setId(testsStudents.getId());

        restTestsStudentsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTestsStudents.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTestsStudents))
            )
            .andExpect(status().isOk());

        // Validate the TestsStudents in the database
        List<TestsStudents> testsStudentsList = testsStudentsRepository.findAll();
        assertThat(testsStudentsList).hasSize(databaseSizeBeforeUpdate);
        TestsStudents testTestsStudents = testsStudentsList.get(testsStudentsList.size() - 1);
        assertThat(testTestsStudents.getResult()).isEqualTo(DEFAULT_RESULT);
    }

    @Test
    @Transactional
    void fullUpdateTestsStudentsWithPatch() throws Exception {
        // Initialize the database
        testsStudentsRepository.saveAndFlush(testsStudents);

        int databaseSizeBeforeUpdate = testsStudentsRepository.findAll().size();

        // Update the testsStudents using partial update
        TestsStudents partialUpdatedTestsStudents = new TestsStudents();
        partialUpdatedTestsStudents.setId(testsStudents.getId());

        partialUpdatedTestsStudents.result(UPDATED_RESULT);

        restTestsStudentsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTestsStudents.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTestsStudents))
            )
            .andExpect(status().isOk());

        // Validate the TestsStudents in the database
        List<TestsStudents> testsStudentsList = testsStudentsRepository.findAll();
        assertThat(testsStudentsList).hasSize(databaseSizeBeforeUpdate);
        TestsStudents testTestsStudents = testsStudentsList.get(testsStudentsList.size() - 1);
        assertThat(testTestsStudents.getResult()).isEqualTo(UPDATED_RESULT);
    }

    @Test
    @Transactional
    void patchNonExistingTestsStudents() throws Exception {
        int databaseSizeBeforeUpdate = testsStudentsRepository.findAll().size();
        testsStudents.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTestsStudentsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, testsStudents.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(testsStudents))
            )
            .andExpect(status().isBadRequest());

        // Validate the TestsStudents in the database
        List<TestsStudents> testsStudentsList = testsStudentsRepository.findAll();
        assertThat(testsStudentsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTestsStudents() throws Exception {
        int databaseSizeBeforeUpdate = testsStudentsRepository.findAll().size();
        testsStudents.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTestsStudentsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(testsStudents))
            )
            .andExpect(status().isBadRequest());

        // Validate the TestsStudents in the database
        List<TestsStudents> testsStudentsList = testsStudentsRepository.findAll();
        assertThat(testsStudentsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTestsStudents() throws Exception {
        int databaseSizeBeforeUpdate = testsStudentsRepository.findAll().size();
        testsStudents.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTestsStudentsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(testsStudents))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TestsStudents in the database
        List<TestsStudents> testsStudentsList = testsStudentsRepository.findAll();
        assertThat(testsStudentsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTestsStudents() throws Exception {
        // Initialize the database
        testsStudentsRepository.saveAndFlush(testsStudents);

        int databaseSizeBeforeDelete = testsStudentsRepository.findAll().size();

        // Delete the testsStudents
        restTestsStudentsMockMvc
            .perform(delete(ENTITY_API_URL_ID, testsStudents.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TestsStudents> testsStudentsList = testsStudentsRepository.findAll();
        assertThat(testsStudentsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
