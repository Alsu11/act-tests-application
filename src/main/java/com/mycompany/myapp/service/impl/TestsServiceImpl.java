package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Tests;
import com.mycompany.myapp.repository.TestsRepository;
import com.mycompany.myapp.service.TestsService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.Tests}.
 */
@Service
@Transactional
public class TestsServiceImpl implements TestsService {

    private final Logger log = LoggerFactory.getLogger(TestsServiceImpl.class);

    private final TestsRepository testsRepository;

    public TestsServiceImpl(TestsRepository testsRepository) {
        this.testsRepository = testsRepository;
    }

    @Override
    public Tests save(Tests tests) {
        log.debug("Request to save Tests : {}", tests);
        return testsRepository.save(tests);
    }

    @Override
    public Tests update(Tests tests) {
        log.debug("Request to update Tests : {}", tests);
        return testsRepository.save(tests);
    }

    @Override
    public Optional<Tests> partialUpdate(Tests tests) {
        log.debug("Request to partially update Tests : {}", tests);

        return testsRepository
            .findById(tests.getId())
            .map(existingTests -> {
                if (tests.getSubject() != null) {
                    existingTests.setSubject(tests.getSubject());
                }

                return existingTests;
            })
            .map(testsRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Tests> findAll() {
        log.debug("Request to get all Tests");
        return testsRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Tests> findOne(Long id) {
        log.debug("Request to get Tests : {}", id);
        return testsRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Tests : {}", id);
        testsRepository.deleteById(id);
    }
}
