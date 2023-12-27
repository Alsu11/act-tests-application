package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Tests;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Tests entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TestsRepository extends JpaRepository<Tests, Long> {}
