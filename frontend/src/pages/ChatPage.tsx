import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { tokens } from '../styles/tokens';
import { ChatInterface } from '../components/organisms/ChatInterface';
import type { ChatMessage } from '../types/index';
import { useChatStore } from '../store/chatStore';
import { api } from '../services/api';

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
  background: ${tokens.colors.surface.base};
`;

const WelcomeTitle = styled.h2`
  color: ${tokens.colors.primary};
  margin-bottom: ${tokens.spacing[4]};
`;

const WelcomeText = styled.p`
  color: ${tokens.colors.text.muted};
  max-width: 500px;
  margin: 0 auto ${tokens.spacing[6]} auto;
  line-height: ${tokens.typography.lineHeight.bodyL};
`;

const BillsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${tokens.spacing[3]};
  max-width: 800px;
  margin: 0 auto;
`;

const BillItem = styled.button`
  background: ${tokens.colors.surface.alt};
  border: 1px solid ${tokens.colors.primary};
  border-radius: ${tokens.radii.lg};
  padding: ${tokens.spacing[3]} ${tokens.spacing[4]};
  text-align: left;
  font-size: ${tokens.typography.fontSize.small};
  color: ${tokens.colors.primary};
  cursor: pointer;
  transition: all ${tokens.transitions.fast};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${tokens.shadows.e2};
    background: ${tokens.colors.surface.white};
    color: ${tokens.colors.text.primary};
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
  const [bills, setBills] = useState<string[]>([]);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  useEffect(() => {
    // Generate session ID on mount if not exists
    if (!currentSessionId) {
      generateSessionId();
    }
  }, [currentSessionId, generateSessionId]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await api.searchBills();
        setBills(response.bills);
      } catch (error) {
        console.error('Failed to fetch bills:', error);
      }
    };

    fetchBills();
  }, []);

  const handleBillSelect = async (billName: string) => {
    try {
      setLoading(true);
      const bill = await api.getBill(billName);
      setSelectedBill(bill);

      // Add system message to chat
      addMessage({
        role: 'assistant',
        content: `I'm ready to answer questions about ${bill.title}. What would you like to know?`,
      });

    } catch (error) {
      console.error('Failed to load bill:', error);
      setError('Failed to load bill information');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    addMessage({
      role: 'user',
      content: message,
    });

    try {
      const response = await api.sendChatMessage({
        message,
        sessionId: currentSessionId || '',
        context: selectedBill ? [selectedBill.id] : undefined,
      });

      addMessage({
        role: 'assistant',
        content: response.content,
        sources: response.sources,
      });
    } catch (error) {
      setError('Failed to get response. Please try again.');
    }
  };

  return (
    <PageContainer>
      <MainContent id="main" role="main">
        <ChatSection>
          {messages.length === 0 ? (
            <WelcomeMessage>
              <WelcomeTitle>Welcome to Congress Chat</WelcomeTitle>
              <WelcomeText>
                I'm here to help you understand U.S. Congressional legislation.
                Select a bill below to get started.
              </WelcomeText>
              <BillsList>
                {bills.map((bill, index) => (
                  <BillItem
                    key={index}
                    onClick={() => handleBillSelect(bill)}
                    type="button"
                  >
                    {bill}
                  </BillItem>
                ))}
              </BillsList>
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