package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Question;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.Question}.
 */
public interface QuestionService {
    /**
     * Save a question.
     *
     * @param question the entity to save.
     * @return the persisted entity.
     */
    Question save(Question question);

    /**
     * Updates a question.
     *
     * @param question the entity to update.
     * @return the persisted entity.
     */
    Question update(Question question);

    /**
     * Partially updates a question.
     *
     * @param question the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Question> partialUpdate(Question question);

    /**
     * Get all the questions.
     *
     * @return the list of entities.
     */
    List<Question> findAll();

    /**
     * Get the "id" question.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Question> findOne(Long id);

    /**
     * Delete the "id" question.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
