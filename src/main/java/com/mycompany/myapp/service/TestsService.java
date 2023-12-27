package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Tests;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.Tests}.
 */
public interface TestsService {
    /**
     * Save a tests.
     *
     * @param tests the entity to save.
     * @return the persisted entity.
     */
    Tests save(Tests tests);

    /**
     * Updates a tests.
     *
     * @param tests the entity to update.
     * @return the persisted entity.
     */
    Tests update(Tests tests);

    /**
     * Partially updates a tests.
     *
     * @param tests the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Tests> partialUpdate(Tests tests);

    /**
     * Get all the tests.
     *
     * @return the list of entities.
     */
    List<Tests> findAll();

    /**
     * Get the "id" tests.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Tests> findOne(Long id);

    /**
     * Delete the "id" tests.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
