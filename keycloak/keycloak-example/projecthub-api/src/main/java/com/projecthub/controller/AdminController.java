package com.projecthub.controller;

import com.projecthub.repository.ProjectRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ProjectRepository projectRepository;

    public AdminController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @GetMapping("/metrics")
    public Map<String, Object> metrics() {
        return Map.of(
                "totalProjects", projectRepository.count(),
                "status", "healthy");
    }
}
