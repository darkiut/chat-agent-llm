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

@Service
public class ChatService {

    private final ConversationRepository repository;
    private final OpenAiService openAiService;

    @Value("${openai.model}")
    private String model;

    public ChatService(ConversationRepository repository,
                       @Value("${openai.api.key}") String apiKey) {
        this.repository = repository;
        this.openAiService = new OpenAiService(apiKey);
    }

    public String sendMessage(String userId, String message) {
        try {
            // VERSIÓN DE PRUEBA - Simula respuestas sin API
            String response = "🤖 Respuesta simulada: Recibí tu mensaje '" + message + "'. " +
                    "Para usar GPT real, configura tu API Key de OpenAI en application.properties";

            // Guarda la conversación en la base de datos
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


    public List<Conversation> getHistory(String userId) {
        return repository.findByUserIdOrderByTimestampAsc(userId);
    }
}
