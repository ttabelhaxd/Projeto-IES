package ies.vamsbackend.utils;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

  private Map<String, List<WebSocketSession>> sessionMap = new ConcurrentHashMap<>();

  @Override
  public void afterConnectionEstablished(WebSocketSession session) throws Exception {
    String path = session.getUri().getPath();
    String address = extractAddress(path);

    if (address != null) {
      sessionMap.computeIfAbsent(address, k -> new CopyOnWriteArrayList<>()).add(session);
      System.out.println(
          "Connection established with address: " + address + ", Total sessions: " + sessionMap.get(address).size());
    } else {
      System.out.println("Invalid address: " + path);
      session.close(CloseStatus.NOT_ACCEPTABLE);
    }
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
    for (String address : sessionMap.keySet()) {
      List<WebSocketSession> sessions = sessionMap.get(address);
      if (sessions != null) {
        sessions.remove(session);
        System.out.println("Session removed for address: " + address);
        if (sessions.isEmpty()) {
          sessionMap.remove(address); // Clean up empty lists
        } else {
          sessionMap.put(address, sessions);
        }
        break;
      }
    }
  }

  public void sendMessageToAddress(String uuid, String topic, String message) throws IOException {
    String address = uuid + "/" + topic; // Formulate the key
    List<WebSocketSession> sessions = sessionMap.get(address);

    if (sessions != null && !sessions.isEmpty()) {
      for (WebSocketSession session : sessions) {
        if (session.isOpen()) {
          session.sendMessage(new TextMessage(message));
          System.out.println("Message sent to address: " + address);
        }
      }
    } else {
      System.out.println("No open sessions found for address: " + address);
    }
  }

  private String extractAddress(String path) {
    String[] parts = path.split("/");
    if (parts.length >= 4) {
      return parts[2] + "/" + parts[3];
    }
    return null;
  }
}
