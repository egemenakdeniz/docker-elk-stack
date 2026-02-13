package com.projecthub.controller;

import com.projecthub.service.ProjectService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class MeController {

    private final ProjectService projectService;

    public MeController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/me")
    public Map<String, Object> me(JwtAuthenticationToken auth) {
        return Map.of(
            "username", projectService.getUsername(auth),
            "tenantId", String.valueOf(projectService.getTenantId(auth)),
            "authorities", auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList())
        );
    }
}
