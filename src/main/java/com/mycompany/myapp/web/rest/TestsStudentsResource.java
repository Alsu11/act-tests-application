package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.TestsStudents;
import com.mycompany.myapp.repository.TestsStudentsRepository;
import com.mycompany.myapp.service.TestsStudentsService;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.TestsStudents}.
 */
@RestController
@RequestMapping("/api/tests-students")
public class TestsStudentsResource {

    private final Logger log = LoggerFactory.getLogger(TestsStudentsResource.class);

    private static final String ENTITY_NAME = "actTestsApplicationTestsStudents";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TestsStudentsService testsStudentsService;

    private final TestsStudentsRepository testsStudentsRepository;

    public TestsStudentsResource(TestsStudentsService testsStudentsService, TestsStudentsRepository testsStudentsRepository) {
        this.testsStudentsService = testsStudentsService;
        this.testsStudentsRepository = testsStudentsRepository;
    }

    /**
     * {@code POST  /tests-students} : Create a new testsStudents.
     *
     * @param testsStudents the testsStudents to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new testsStudents, or with status {@code 400 (Bad Request)} if the testsStudents has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<TestsStudents> createTestsStudents(@RequestBody TestsStudents testsStudents) throws URISyntaxException {
        log.debug("REST request to save TestsStudents : {}", testsStudents);
        if (testsStudents.getId() != null) {
            throw new BadRequestAlertException("A new testsStudents cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TestsStudents result = testsStudentsService.save(testsStudents);
        return ResponseEntity
            .created(new URI("/api/tests-students/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tests-students/:id} : Updates an existing testsStudents.
     *
     * @param id the id of the testsStudents to save.
     * @param testsStudents the testsStudents to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated testsStudents,
     * or with status {@code 400 (Bad Request)} if the testsStudents is not valid,
     * or with status {@code 500 (Internal Server Error)} if the testsStudents couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TestsStudents> updateTestsStudents(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TestsStudents testsStudents
    ) throws URISyntaxException {
        log.debug("REST request to update TestsStudents : {}, {}", id, testsStudents);
        if (testsStudents.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, testsStudents.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!testsStudentsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TestsStudents result = testsStudentsService.update(testsStudents);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, testsStudents.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /tests-students/:id} : Partial updates given fields of an existing testsStudents, field will ignore if it is null
     *
     * @param id the id of the testsStudents to save.
     * @param testsStudents the testsStudents to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated testsStudents,
     * or with status {@code 400 (Bad Request)} if the testsStudents is not valid,
     * or with status {@code 404 (Not Found)} if the testsStudents is not found,
     * or with status {@code 500 (Internal Server Error)} if the testsStudents couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TestsStudents> partialUpdateTestsStudents(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TestsStudents testsStudents
    ) throws URISyntaxException {
        log.debug("REST request to partial update TestsStudents partially : {}, {}", id, testsStudents);
        if (testsStudents.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, testsStudents.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!testsStudentsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TestsStudents> result = testsStudentsService.partialUpdate(testsStudents);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, testsStudents.getId().toString())
        );
    }

    /**
     * {@code GET  /tests-students} : get all the testsStudents.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of testsStudents in body.
     */
    @GetMapping("")
    public List<TestsStudents> getAllTestsStudents() {
        log.debug("REST request to get all TestsStudents");
        return testsStudentsService.findAll();
    }

    /**
     * {@code GET  /tests-students/:id} : get the "id" testsStudents.
     *
     * @param id the id of the testsStudents to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the testsStudents, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TestsStudents> getTestsStudents(@PathVariable("id") Long id) {
        log.debug("REST request to get TestsStudents : {}", id);
        Optional<TestsStudents> testsStudents = testsStudentsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(testsStudents);
    }

    /**
     * {@code DELETE  /tests-students/:id} : delete the "id" testsStudents.
     *
     * @param id the id of the testsStudents to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestsStudents(@PathVariable("id") Long id) {
        log.debug("REST request to delete TestsStudents : {}", id);
        testsStudentsService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
