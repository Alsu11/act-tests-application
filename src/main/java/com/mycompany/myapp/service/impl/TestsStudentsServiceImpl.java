package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.TestsStudents;
import com.mycompany.myapp.repository.TestsStudentsRepository;
import com.mycompany.myapp.service.TestsStudentsService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.TestsStudents}.
 */
@Service
@Transactional
public class TestsStudentsServiceImpl implements TestsStudentsService {

    private final Logger log = LoggerFactory.getLogger(TestsStudentsServiceImpl.class);

    private final TestsStudentsRepository testsStudentsRepository;

    public TestsStudentsServiceImpl(TestsStudentsRepository testsStudentsRepository) {
        this.testsStudentsRepository = testsStudentsRepository;
    }

    @Override
    public TestsStudents save(TestsStudents testsStudents) {
        log.debug("Request to save TestsStudents : {}", testsStudents);
        return testsStudentsRepository.save(testsStudents);
    }

    @Override
    public TestsStudents update(TestsStudents testsStudents) {
        log.debug("Request to update TestsStudents : {}", testsStudents);
        return testsStudentsRepository.save(testsStudents);
    }

    @Override
    public Optional<TestsStudents> partialUpdate(TestsStudents testsStudents) {
        log.debug("Request to partially update TestsStudents : {}", testsStudents);

        return testsStudentsRepository
            .findById(testsStudents.getId())
            .map(existingTestsStudents -> {
                if (testsStudents.getResult() != null) {
                    existingTestsStudents.setResult(testsStudents.getResult());
                }

                return existingTestsStudents;
            })
            .map(testsStudentsRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TestsStudents> findAll() {
        log.debug("Request to get all TestsStudents");
        return testsStudentsRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TestsStudents> findOne(Long id) {
        log.debug("Request to get TestsStudents : {}", id);
        return testsStudentsRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete TestsStudents : {}", id);
        testsStudentsRepository.deleteById(id);
    }
}
