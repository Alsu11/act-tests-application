package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.TestsStudents;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TestsStudents entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TestsStudentsRepository extends JpaRepository<TestsStudents, Long> {}
