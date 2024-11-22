import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/joy';
import { Message } from '../model/common';

interface MessageListProps {
  messages: Message[] | undefined;
}

export function MessageList({ messages }: MessageListProps) {
  const loggedUserId = sessionStorage.getItem('user_id');
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
      {messages && messages.length > 0 ? (
        messages.map((message) => {
          const isSentByLoggedUser = String(message.sender_id) === String(loggedUserId);

          return (
            <Box
              key={message.message_id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isSentByLoggedUser ? 'flex-end' : 'flex-start',
                marginBottom: 2,
              }}
            >
              {/* Affichage de l'émetteur */}
              <Typography
                sx={{ color: 'neutral.600', marginBottom: 0.5 }}
              >
                {isSentByLoggedUser ? 'You' : message.sender_name}
              </Typography>

              {/* Message */}
              <Box
                sx={{
                  padding: 1,
                  borderRadius: '12px',
                  backgroundColor: isSentByLoggedUser ? 'primary.500' : 'neutral.200',
                  color: isSentByLoggedUser ? 'white' : 'black',
                  maxWidth: '75%',
                  wordBreak: 'break-word',
                }}
              >
                <Typography>{message.content}</Typography>
              </Box>

              {/* Affichage de la date */}
              <Typography
                sx={{ color: 'neutral.500', marginTop: 0.5 }}
              >
                {new Date(message.created_at).toLocaleString()}
              </Typography>
            </Box>
          );
        })
      ) : (
        <Typography sx={{ textAlign: 'center', color: 'neutral.500' }}>
          No messages yet.
        </Typography>
      )}

      {/* Référence pour l'auto-scroll */}
      <div ref={messageEndRef} />
    </Box>
  );
}
