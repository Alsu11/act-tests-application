package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Tests;
import com.mycompany.myapp.repository.TestsRepository;
import com.mycompany.myapp.service.TestsService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Tests}.
 */
@RestController
@RequestMapping("/api/tests")
public class TestsResource {

    private final Logger log = LoggerFactory.getLogger(TestsResource.class);

    private static final String ENTITY_NAME = "actTestsApplicationTests";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TestsService testsService;

    private final TestsRepository testsRepository;

    public TestsResource(TestsService testsService, TestsRepository testsRepository) {
        this.testsService = testsService;
        this.testsRepository = testsRepository;
    }

    /**
     * {@code POST  /tests} : Create a new tests.
     *
     * @param tests the tests to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tests, or with status {@code 400 (Bad Request)} if the tests has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Tests> createTests(@RequestBody Tests tests) throws URISyntaxException {
        log.debug("REST request to save Tests : {}", tests);
        if (tests.getId() != null) {
            throw new BadRequestAlertException("A new tests cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Tests result = testsService.save(tests);
        return ResponseEntity
            .created(new URI("/api/tests/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tests/:id} : Updates an existing tests.
     *
     * @param id the id of the tests to save.
     * @param tests the tests to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tests,
     * or with status {@code 400 (Bad Request)} if the tests is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tests couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Tests> updateTests(@PathVariable(value = "id", required = false) final Long id, @RequestBody Tests tests)
        throws URISyntaxException {
        log.debug("REST request to update Tests : {}, {}", id, tests);
        if (tests.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tests.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!testsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Tests result = testsService.update(tests);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tests.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /tests/:id} : Partial updates given fields of an existing tests, field will ignore if it is null
     *
     * @param id the id of the tests to save.
     * @param tests the tests to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tests,
     * or with status {@code 400 (Bad Request)} if the tests is not valid,
     * or with status {@code 404 (Not Found)} if the tests is not found,
     * or with status {@code 500 (Internal Server Error)} if the tests couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Tests> partialUpdateTests(@PathVariable(value = "id", required = false) final Long id, @RequestBody Tests tests)
        throws URISyntaxException {
        log.debug("REST request to partial update Tests partially : {}, {}", id, tests);
        if (tests.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tests.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!testsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Tests> result = testsService.partialUpdate(tests);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tests.getId().toString())
        );
    }

    /**
     * {@code GET  /tests} : get all the tests.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tests in body.
     */
    @GetMapping("")
    public List<Tests> getAllTests() {
        log.debug("REST request to get all Tests");
        return testsService.findAll();
    }

    /**
     * {@code GET  /tests/:id} : get the "id" tests.
     *
     * @param id the id of the tests to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tests, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Tests> getTests(@PathVariable("id") Long id) {
        log.debug("REST request to get Tests : {}", id);
        Optional<Tests> tests = testsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(tests);
    }

    /**
     * {@code DELETE  /tests/:id} : delete the "id" tests.
     *
     * @param id the id of the tests to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTests(@PathVariable("id") Long id) {
        log.debug("REST request to delete Tests : {}", id);
        testsService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
