package com.projecthub.controller;

import com.projecthub.entity.Project;
import com.projecthub.service.ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public List<Project> list(JwtAuthenticationToken auth) {
        return projectService.getProjects(auth);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, String> body, JwtAuthenticationToken auth) {
        // PROJECT_USER cannot create
        if (projectService.hasRole(auth, "PROJECT_USER") &&
                !projectService.isAdmin(auth) &&
                !projectService.hasRole(auth, "PROJECT_MANAGER")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "PROJECT_USER cannot create projects"));
        }

        String name = body.get("name");
        String description = body.get("description");
        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "name is required"));
        }

        Project project = projectService.createProject(name, description, auth);
        return ResponseEntity.status(HttpStatus.CREATED).body(project);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, JwtAuthenticationToken auth) {
        // PROJECT_USER cannot delete
        if (projectService.hasRole(auth, "PROJECT_USER") &&
                !projectService.isAdmin(auth) &&
                !projectService.hasRole(auth, "PROJECT_MANAGER")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "PROJECT_USER cannot delete projects"));
        }

        boolean deleted = projectService.deleteProject(id, auth);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Project not found or access denied"));
        }
        return ResponseEntity.noContent().build();
    }
}
