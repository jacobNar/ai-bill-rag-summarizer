import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { tokens } from '../../styles/tokens';
import { Button } from '../atoms/Button';
import type { ChatMessage, DocumentSource } from '../../types/index';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onRegenerateMessage?: (messageId: string) => void;
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${tokens.colors.surface.white};
`;

const MessageList = styled.div<{ 'aria-live': 'polite' | 'off' }>`
  flex: 1;
  overflow-y: auto;
  padding: ${tokens.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing[4]};
  scroll-behavior: smooth;
`;

const MessageBubble = styled.div<{ $role: 'user' | 'assistant' }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$role === 'user' ? 'flex-end' : 'flex-start'};
  max-width: 75%;
  align-self: ${props => props.$role === 'user' ? 'flex-end' : 'flex-start'};
`;

const MessageContent = styled.div<{ $role: 'user' | 'assistant' }>`
  background: ${props => props.$role === 'user' ? tokens.colors.primary : tokens.colors.surface.alt};
  color: ${props => props.$role === 'user' ? tokens.colors.surface.white : tokens.colors.text.primary};
  padding: ${tokens.spacing[3]} ${tokens.spacing[4]};
  border-radius: ${tokens.radii.lg};
  font-size: ${tokens.typography.fontSize.body};
  line-height: ${tokens.typography.lineHeight.body};
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const MessageTimestamp = styled.span`
  font-size: ${tokens.typography.fontSize.xs};
  color: ${tokens.colors.text.muted};
  margin-top: ${tokens.spacing[1]};
`;

const SourcesContainer = styled.div`
  margin-top: ${tokens.spacing[2]};
  padding: ${tokens.spacing[2]};
  background: ${tokens.colors.surface.base};
  border-radius: ${tokens.radii.md};
  border-left: 3px solid ${tokens.colors.info};
`;

const SourcesTitle = styled.h4`
  font-size: ${tokens.typography.fontSize.small};
  font-weight: ${tokens.typography.fontWeight.semibold};
  color: ${tokens.colors.text.secondary};
  margin-bottom: ${tokens.spacing[2]};
`;

const SourceLink = styled.a`
  display: block;
  font-size: ${tokens.typography.fontSize.small};
  color: ${tokens.colors.info};
  text-decoration: none;
  margin-bottom: ${tokens.spacing[1]};
  
  &:hover {
    text-decoration: underline;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InputContainer = styled.div`
  padding: ${tokens.spacing[4]};
  border-top: 1px solid ${tokens.colors.gray[200]};
  background: ${tokens.colors.surface.white};
`;

const InputForm = styled.form`
  display: flex;
  gap: ${tokens.spacing[2]};
  align-items: flex-end;
`;

const TextareaWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 44px;
  max-height: 120px;
  padding: ${tokens.spacing[2]} ${tokens.spacing[3]};
  border: 1px solid ${tokens.colors.gray[300]};
  border-radius: ${tokens.radii.lg};
  font-family: ${tokens.typography.fontFamily.sans};
  font-size: ${tokens.typography.fontSize.body};
  line-height: ${tokens.typography.lineHeight.body};
  resize: none;
  transition: all ${tokens.transitions.fast};
  
  &:focus {
    outline: 2px solid ${tokens.colors.info};
    outline-offset: 1px;
    border-color: ${tokens.colors.info};
  }
  
  &::placeholder {
    color: ${tokens.colors.text.muted};
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing[2]};
  color: ${tokens.colors.text.muted};
  font-size: ${tokens.typography.fontSize.small};
  
  &::after {
    content: '';
    width: 16px;
    height: 16px;
    border: 2px solid ${tokens.colors.gray[300]};
    border-top-color: ${tokens.colors.info};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onRegenerateMessage
}) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [inputValue]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !isLoading) {
      onSendMessage(trimmedValue);
      setInputValue('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };
  
  return (
    <ChatContainer>
      <MessageList
        aria-live={isLoading ? 'polite' : 'off'}
        aria-busy={isLoading}
        role="log"
        aria-label="Chat messages"
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} $role={message.role}>
            <MessageContent $role={message.role}>
              {message.content}
              {message.isStreaming && (
                <span aria-label="Message is being generated">|</span>
              )}
            </MessageContent>
            <MessageTimestamp>
              {formatTimestamp(message.timestamp)}
            </MessageTimestamp>
            {message.sources && message.sources.length > 0 && (
              <SourcesContainer>
                <SourcesTitle>Sources:</SourcesTitle>
                {message.sources.map((source) => (
                  <SourceLink
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.title}
                  </SourceLink>
                ))}
              </SourcesContainer>
            )}
          </MessageBubble>
        ))}
        {isLoading && (
          <MessageBubble $role="assistant">
            <LoadingIndicator>
              Thinking...
            </LoadingIndicator>
          </MessageBubble>
        )}
        <div ref={messagesEndRef} />
      </MessageList>
      
      <InputContainer>
        <InputForm onSubmit={handleSubmit}>
          <TextareaWrapper>
            <label htmlFor="chat-input" className="sr-only">
              Type your question about Congress bills
            </label>
            <Textarea
              id="chat-input"
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about a bill, law, or Congress topic..."
              disabled={isLoading}
            />
          </TextareaWrapper>
          <Button
            type="submit"
            variant="primary"
            disabled={!inputValue.trim() || isLoading}
            loading={isLoading}
          >
            Send
          </Button>
        </InputForm>
      </InputContainer>
    </ChatContainer>
  );
};