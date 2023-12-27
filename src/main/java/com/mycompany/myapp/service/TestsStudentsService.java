package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.TestsStudents;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.TestsStudents}.
 */
public interface TestsStudentsService {
    /**
     * Save a testsStudents.
     *
     * @param testsStudents the entity to save.
     * @return the persisted entity.
     */
    TestsStudents save(TestsStudents testsStudents);

    /**
     * Updates a testsStudents.
     *
     * @param testsStudents the entity to update.
     * @return the persisted entity.
     */
    TestsStudents update(TestsStudents testsStudents);

    /**
     * Partially updates a testsStudents.
     *
     * @param testsStudents the entity to update partially.
     * @return the persisted entity.
     */
    Optional<TestsStudents> partialUpdate(TestsStudents testsStudents);

    /**
     * Get all the testsStudents.
     *
     * @return the list of entities.
     */
    List<TestsStudents> findAll();

    /**
     * Get the "id" testsStudents.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<TestsStudents> findOne(Long id);

    /**
     * Delete the "id" testsStudents.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
