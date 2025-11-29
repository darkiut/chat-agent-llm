package com.example.chatagent.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;

@Service
public class LLMToyService {

    @Value("${llm.toy.url}")
    private String llmToyUrl;

    @Value("${llm.toy.enabled}")
    private boolean llmToyEnabled;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public LLMToyService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public Map<String, Object> generateWithProbabilities(String prompt) {
        if (!llmToyEnabled) {
            throw new RuntimeException("LLM Toy Service is disabled");
        }

        try {
            String url = llmToyUrl + "/generate";

            // Crear el request body
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("prompt", prompt);

            // Configurar headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

            // Hacer la llamada POST
            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            return response.getBody();

        } catch (Exception e) {
            throw new RuntimeException("Error calling LLM Toy Service: " + e.getMessage(), e);
        }
    }

    public boolean isHealthy() {
        try {
            String url = llmToyUrl + "/health";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            return false;
        }
    }
}
