package ies.vamsbackend.services;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class VolcanoWebsockethandler extends TextWebSocketHandler {
  private List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

  @Override
  public void afterConnectionEstablished(WebSocketSession session) {
    System.out.println("Connection Established: " + session);
    sessions.add(session);
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) {
    sessions.remove(session);
  }

  public void sendMessageToAll(String message) throws IOException {
    for (WebSocketSession session : sessions) {
      if (session.isOpen()) {
        System.out.println("message Sent - " + message);
        session.sendMessage(new TextMessage(message));
      }
    }
  }

}
