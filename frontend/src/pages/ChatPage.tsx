import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { tokens } from '../styles/tokens';
import { ChatInterface } from '../components/organisms/ChatInterface';
import type { ChatMessage } from '../types/index';
import { useChatStore } from '../store/chatStore';
import { api, mockData } from '../services/api';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const ChatSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const SourcesPanel = styled.aside<{ $isOpen: boolean }>`
  width: ${props => props.$isOpen ? '300px' : '0'};
  background: ${tokens.colors.surface.alt};
  border-left: 1px solid ${tokens.colors.gray[200]};
  transition: width ${tokens.transitions.base};
  overflow: hidden;
  
  @media (max-width: ${tokens.breakpoints.md}) {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: ${props => props.$isOpen ? '100%' : '0'};
    z-index: ${tokens.zIndex.overlay};
  }
`;

const WelcomeMessage = styled.div`
  padding: ${tokens.spacing[8]};
  text-align: center;
  background: linear-gradient(135deg, ${tokens.colors.surface.white} 0%, ${tokens.colors.surface.alt} 100%);
`;

const WelcomeTitle = styled.h2`
  color: ${tokens.colors.primary};
  margin-bottom: ${tokens.spacing[4]};
`;

const WelcomeText = styled.p`
  color: ${tokens.colors.text.secondary};
  max-width: 500px;
  margin: 0 auto ${tokens.spacing[6]} auto;
  line-height: ${tokens.typography.lineHeight.bodyL};
`;

const SampleQuestions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${tokens.spacing[3]};
  max-width: 600px;
  margin: 0 auto;
`;

const SampleQuestion = styled.button`
  background: ${tokens.colors.surface.white};
  border: 1px solid ${tokens.colors.gray[200]};
  border-radius: ${tokens.radii.lg};
  padding: ${tokens.spacing[3]} ${tokens.spacing[4]};
  text-align: left;
  font-size: ${tokens.typography.fontSize.small};
  color: ${tokens.colors.text.primary};
  cursor: pointer;
  transition: all ${tokens.transitions.fast};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${tokens.shadows.e2};
    border-color: ${tokens.colors.primary};
  }
  
  &:focus-visible {
    outline: 2px solid ${tokens.colors.info};
    outline-offset: 2px;
  }
`;

export const ChatPage: React.FC = () => {
  const {
    messages,
    isLoading,
    addMessage,
    setLoading,
    setError,
    currentSessionId,
    generateSessionId,
  } = useChatStore();
  
  const [sourcesOpen, setSourcesOpen] = useState(false);
  
  useEffect(() => {
    // Generate session ID on mount if not exists
    if (!currentSessionId) {
      generateSessionId();
    }
  }, [currentSessionId, generateSessionId]);
  
  // Simulate streaming chat responses
  const simulateStreamingResponse = async (userMessage: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock response based on question
      let response = 'I understand you\'re asking about Congress legislation. ';
      let sources = [];
      
      if (userMessage.toLowerCase().includes('infrastructure')) {
        response = 'The Infrastructure Investment and Jobs Act (H.R. 1234) is a comprehensive piece of legislation that invests in America\'s infrastructure. Key highlights include:\n\n• $550 billion in new federal investment over 5 years\n• Road and bridge repairs and improvements\n• Broadband expansion to underserved communities\n• Clean energy infrastructure development\n• Public transit system enhancements\n\nThis bill has passed the House and is currently being considered in the Senate.';
        sources = [mockData.bills[0]];
      } else if (userMessage.toLowerCase().includes('energy')) {
        response = 'The Clean Energy Innovation Act (S. 5678) focuses on promoting research and development in clean energy technologies. The bill includes provisions for:\n\n• Increased funding for renewable energy research\n• Tax incentives for clean energy adoption\n• Support for energy storage technologies\n• Grid modernization initiatives\n\nThis Senate bill is currently in committee review.';
        sources = [mockData.bills[1]];
      } else {
        response += 'I can help you understand bills, their status, sponsors, and key provisions. You can ask me about specific legislation, policy topics, or search for bills by subject matter.';
      }
      
      // Add streaming message
      const assistantMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
        role: 'assistant',
        content: '',
        sources: sources.map(bill => ({
          id: `src-${bill.id}`,
          billId: bill.id,
          title: `${bill.chamber === 'house' ? 'H.R.' : 'S.'} ${bill.number} - ${bill.title}`,
          excerpt: bill.summary || 'Bill summary not available.',
          relevanceScore: 0.9,
          url: `/bills/${bill.id}`,
        })),
        isStreaming: true,
      };
      
      addMessage(assistantMessage);
      
      // Simulate streaming by updating content character by character
      let currentContent = '';
      const words = response.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        currentContent += (i > 0 ? ' ' : '') + words[i];
        
        // Update the last message with new content
        const lastMessage = useChatStore.getState().messages[useChatStore.getState().messages.length - 1];
        if (lastMessage) {
          useChatStore.getState().updateMessage(lastMessage.id, {
            content: currentContent,
            isStreaming: i < words.length - 1,
          });
        }
        
        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
      }
      
    } catch (error) {
      setError('Failed to get response. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendMessage = async (message: string) => {
    // Add user message
    addMessage({
      role: 'user',
      content: message,
    });
    
    // Simulate assistant response
    await simulateStreamingResponse(message);
  };
  
  const handleSampleQuestion = (question: string) => {
    handleSendMessage(question);
  };
  
  const sampleQuestions = [
    'What is the Infrastructure Investment and Jobs Act?',
    'Show me recent energy bills',
    'What bills has Congress passed this year?',
    'How does the legislative process work?',
  ];
  
  return (
    <PageContainer>
      <MainContent id="main" role="main">
        <ChatSection>
          {messages.length === 0 ? (
            <WelcomeMessage>
              <WelcomeTitle>Welcome to Congress Chat</WelcomeTitle>
              <WelcomeText>
                I'm here to help you understand U.S. Congressional legislation. Ask me about specific bills, 
                search by topic, or get explanations about the legislative process.
              </WelcomeText>
              <SampleQuestions>
                {sampleQuestions.map((question, index) => (
                  <SampleQuestion
                    key={index}
                    onClick={() => handleSampleQuestion(question)}
                    type="button"
                  >
                    {question}
                  </SampleQuestion>
                ))}
              </SampleQuestions>
            </WelcomeMessage>
          ) : (
            <ChatInterface
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
            />
          )}
        </ChatSection>
        
        <SourcesPanel $isOpen={sourcesOpen}>
          {/* Sources panel content would go here */}
        </SourcesPanel>
      </MainContent>
    </PageContainer>
  );
};