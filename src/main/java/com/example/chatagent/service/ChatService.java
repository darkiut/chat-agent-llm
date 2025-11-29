package com.example.chatagent.service;

import com.example.chatagent.entity.Conversation;
import com.example.chatagent.repository.ConversationRepository;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    private final ConversationRepository repository;
    private final OpenAiService openAiService;
    private final LLMToyService llmToyService;

    @Value("${openai.model}")
    private String model;

    public ChatService(ConversationRepository repository,
                       @Value("${openai.api.key}") String apiKey,
                       LLMToyService llmToyService) {
        this.repository = repository;
        this.openAiService = new OpenAiService(apiKey);
        this.llmToyService = llmToyService;
    }

    public String sendMessage(String userId, String message) {
        try {
            // Usar OpenAI GPT
            ChatCompletionRequest request = ChatCompletionRequest.builder()
                    .model(model)
                    .messages(List.of(
                            new ChatMessage(ChatMessageRole.USER.value(), message)
                    ))
                    .build();

            String response = openAiService.createChatCompletion(request)
                    .getChoices()
                    .get(0)
                    .getMessage()
                    .getContent();

            Conversation conv = new Conversation(userId, message, response);
            repository.save(conv);

            return response;

        } catch (Exception e) {
            String errorResponse = "Error al procesar el mensaje: " + e.getMessage();
            Conversation conv = new Conversation(userId, message, errorResponse);
            repository.save(conv);
            return errorResponse;
        }
    }

    public Map<String, Object> sendMessageToToy(String userId, String message) {
        try {
            // Usar LLM Toy Service
            Map<String, Object> result = llmToyService.generateWithProbabilities(message);

            // Extraer los tokens generados
            List<String> tokens = (List<String>) result.get("tokens");
            String response = String.join(" ", tokens);

            // Guardar en la base de datos
            Conversation conv = new Conversation(userId, message, response);
            repository.save(conv);

            // Retornar la respuesta completa con probabilidades
            return result;

        } catch (Exception e) {
            throw new RuntimeException("Error al procesar con LLM Toy: " + e.getMessage(), e);
        }
    }

    public List<Conversation> getHistory(String userId) {
        return repository.findByUserIdOrderByTimestampAsc(userId);
    }

    public boolean isToyServiceHealthy() {
        return llmToyService.isHealthy();
    }
}
