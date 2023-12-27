package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Question;
import com.mycompany.myapp.repository.QuestionRepository;
import com.mycompany.myapp.service.QuestionService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.Question}.
 */
@Service
@Transactional
public class QuestionServiceImpl implements QuestionService {

    private final Logger log = LoggerFactory.getLogger(QuestionServiceImpl.class);

    private final QuestionRepository questionRepository;

    public QuestionServiceImpl(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Override
    public Question save(Question question) {
        log.debug("Request to save Question : {}", question);
        return questionRepository.save(question);
    }

    @Override
    public Question update(Question question) {
        log.debug("Request to update Question : {}", question);
        return questionRepository.save(question);
    }

    @Override
    public Optional<Question> partialUpdate(Question question) {
        log.debug("Request to partially update Question : {}", question);

        return questionRepository
            .findById(question.getId())
            .map(existingQuestion -> {
                if (question.getQuestion() != null) {
                    existingQuestion.setQuestion(question.getQuestion());
                }
                if (question.getAnswers() != null) {
                    existingQuestion.setAnswers(question.getAnswers());
                }
                if (question.getPoints() != null) {
                    existingQuestion.setPoints(question.getPoints());
                }

                return existingQuestion;
            })
            .map(questionRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Question> findAll() {
        log.debug("Request to get all Questions");
        return questionRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Question> findOne(Long id) {
        log.debug("Request to get Question : {}", id);
        return questionRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Question : {}", id);
        questionRepository.deleteById(id);
    }
}
