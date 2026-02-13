package com.projecthub.service;

import com.projecthub.entity.Project;
import com.projecthub.repository.ProjectRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public boolean isAdmin(JwtAuthenticationToken auth) {
        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_ADMIN"));
    }

    public boolean hasRole(JwtAuthenticationToken auth, String role) {
        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_" + role));
    }

    public String getTenantId(JwtAuthenticationToken auth) {
        Jwt jwt = auth.getToken();
        return jwt.getClaimAsString("tenantId");
    }

    public String getUsername(JwtAuthenticationToken auth) {
        Jwt jwt = auth.getToken();
        String preferred = jwt.getClaimAsString("preferred_username");
        return preferred != null ? preferred : jwt.getSubject();
    }

    public List<Project> getProjects(JwtAuthenticationToken auth) {
        if (isAdmin(auth)) {
            return projectRepository.findAll();
        }
        String tenantId = getTenantId(auth);
        return projectRepository.findByTenantId(tenantId);
    }

    public Project createProject(String name, String description, JwtAuthenticationToken auth) {
        String tenantId = getTenantId(auth);
        String username = getUsername(auth);
        Project project = new Project(name, description, tenantId, username);
        return projectRepository.save(project);
    }

    public boolean deleteProject(Long id, JwtAuthenticationToken auth) {
        var projectOpt = projectRepository.findById(id);
        if (projectOpt.isEmpty()) return false;

        Project project = projectOpt.get();
        if (!isAdmin(auth)) {
            String tenantId = getTenantId(auth);
            if (!project.getTenantId().equals(tenantId)) return false;
        }

        projectRepository.deleteById(id);
        return true;
    }
}
