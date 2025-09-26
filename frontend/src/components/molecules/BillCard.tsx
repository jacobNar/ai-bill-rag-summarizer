import React from 'react';
import styled from 'styled-components';
import { tokens } from '../../styles/tokens';
import { Button } from '../atoms/Button';
import type { Bill } from '../../types/index';

interface BillCardProps {
  bill: Bill;
  onViewBill?: (bill: Bill) => void;
  onAskAbout?: (bill: Bill) => void;
}

const Card = styled.article`
  background: ${tokens.colors.surface.white};
  border: 1px solid #EAECF0;
  border-radius: ${tokens.radii.lg};
  padding: ${tokens.spacing[4]};
  box-shadow: ${tokens.shadows.e1};
  transition: all ${tokens.transitions.fast};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${tokens.shadows.e2};
  }
  
  &:focus-within {
    outline: 3px solid ${tokens.colors.info};
    outline-offset: 4px;
  }
`;

const Header = styled.header`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${tokens.spacing[2]};
  align-items: start;
  margin-bottom: ${tokens.spacing[3]};
`;

const Badge = styled.span<{ $chamber: 'house' | 'senate' }>`
  background: ${props => props.$chamber === 'house' ? tokens.colors.primary : tokens.colors.secondary};
  color: ${tokens.colors.surface.white};
  border-radius: ${tokens.radii.sm};
  padding: ${tokens.spacing[1]} ${tokens.spacing[2]};
  font-size: ${tokens.typography.fontSize.small};
  font-weight: ${tokens.typography.fontWeight.semibold};
  display: inline-block;
`;

const Title = styled.h3`
  font-size: ${tokens.typography.fontSize.h4};
  line-height: ${tokens.typography.lineHeight.h4};
  font-weight: ${tokens.typography.fontWeight.semibold};
  color: ${tokens.colors.text.primary};
  margin: 0;
`;

const Meta = styled.p`
  font-size: ${tokens.typography.fontSize.small};
  color: ${tokens.colors.text.secondary};
  margin-bottom: ${tokens.spacing[3]};
`;

const TagList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.spacing[2]};
  margin-bottom: ${tokens.spacing[3]};
`;

const Chip = styled.span<{ $type?: 'subject' | 'status' }>`
  background: ${props => props.$type === 'status' ? tokens.colors.info : '#EEF2F6'};
  color: ${props => props.$type === 'status' ? tokens.colors.surface.white : tokens.colors.gray[700]};
  border-radius: ${tokens.radii.full};
  padding: ${tokens.spacing[0]} ${tokens.spacing[2]};
  font-size: ${tokens.typography.fontSize.xs};
  line-height: 18px;
  font-weight: ${tokens.typography.fontWeight.medium};
`;

const StatusSection = styled.div`
  margin-bottom: ${tokens.spacing[3]};
`;

const Actions = styled.footer`
  display: flex;
  gap: ${tokens.spacing[2]};
  flex-wrap: wrap;
`;

export const BillCard: React.FC<BillCardProps> = ({ bill, onViewBill, onAskAbout }) => {
  const chamberLabel = bill.chamber === 'house' ? 'H.R.' : 'S.';
  const formattedDate = new Date(bill.introducedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  return (
    <Card aria-labelledby={`bill-${bill.id}-title`}>
      <Header>
        <Badge $chamber={bill.chamber} aria-label={bill.chamber === 'house' ? 'House Bill' : 'Senate Bill'}>
          {chamberLabel}
        </Badge>
        <Title id={`bill-${bill.id}-title`}>
          {chamberLabel} {bill.number} — {bill.title}
        </Title>
      </Header>
      
      <Meta>
        Sponsor: {bill.sponsor.name} ({bill.sponsor.party}-{bill.sponsor.state}) · Introduced: {formattedDate}
      </Meta>
      
      {bill.subjects.length > 0 && (
        <TagList aria-label="Top subjects">
          {bill.subjects.slice(0, 3).map((subject, index) => (
            <li key={index}>
              <Chip $type="subject">{subject}</Chip>
            </li>
          ))}
        </TagList>
      )}
      
      <StatusSection>
        <Chip $type="status">{bill.status}</Chip>
      </StatusSection>
      
      <Actions>
        <Button
          variant="primary"
          size="small"
          onClick={() => onViewBill?.(bill)}
        >
          View bill
        </Button>
        <Button
          variant="secondary"
          size="small"
          onClick={() => onAskAbout?.(bill)}
        >
          Ask about this bill
        </Button>
      </Actions>
    </Card>
  );
};