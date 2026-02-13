package com.projecthub.repository;

import com.projecthub.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByTenantId(String tenantId);
}
