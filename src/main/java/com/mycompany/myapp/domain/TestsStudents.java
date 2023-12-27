package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TestsStudents.
 */
@Entity
@Table(name = "tests_students")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TestsStudents implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "result")
    private String result;

    @ManyToOne(fetch = FetchType.LAZY)
    private Student studentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "materialId" }, allowSetters = true)
    private Tests testId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TestsStudents id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getResult() {
        return this.result;
    }

    public TestsStudents result(String result) {
        this.setResult(result);
        return this;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public Student getStudentId() {
        return this.studentId;
    }

    public void setStudentId(Student student) {
        this.studentId = student;
    }

    public TestsStudents studentId(Student student) {
        this.setStudentId(student);
        return this;
    }

    public Tests getTestId() {
        return this.testId;
    }

    public void setTestId(Tests tests) {
        this.testId = tests;
    }

    public TestsStudents testId(Tests tests) {
        this.setTestId(tests);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TestsStudents)) {
            return false;
        }
        return getId() != null && getId().equals(((TestsStudents) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TestsStudents{" +
            "id=" + getId() +
            ", result='" + getResult() + "'" +
            "}";
    }
}
