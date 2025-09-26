import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { tokens } from '../styles/tokens';
import { api } from '../services/api';
import type { Bill } from '../types/index';

const PageContainer = styled.div`
  min-height: calc(100vh - 80px);
  padding: ${tokens.spacing[6]};
  background: ${tokens.colors.surface.white};
`;

const BillContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: ${tokens.colors.surface.base};
  border: 1px solid ${tokens.colors.primary};
  border-radius: ${tokens.radii.lg};
  padding: ${tokens.spacing[6]};
  box-shadow: ${tokens.shadows.e1};
`;

const BillHeader = styled.div`
  margin-bottom: ${tokens.spacing[6]};
`;

const BillNumber = styled.span`
  background: ${tokens.colors.surface.alt};
  color: ${tokens.colors.primary};
  padding: ${tokens.spacing[1]} ${tokens.spacing[2]};
  border-radius: ${tokens.radii.sm};
  font-size: ${tokens.typography.fontSize.small};
  font-weight: ${tokens.typography.fontWeight.semibold};
  margin-bottom: ${tokens.spacing[3]};
  display: inline-block;
`;

const BillTitle = styled.h1`
  color: #344054;
  margin-bottom: ${tokens.spacing[4]};
  font-size: ${tokens.typography.fontSize.h2};
  line-height: ${tokens.typography.lineHeight.h2};
  
  .dark & {
    color: #FFFFFF;
  }
`;

const BillMeta = styled.div`
  display: flex;
  gap: ${tokens.spacing[4]};
  margin-bottom: ${tokens.spacing[4]};
  color: #344054;
  font-size: ${tokens.typography.fontSize.small};
  
  .dark & {
    color: #FFFFFF;
  }
  
  @media (max-width: ${tokens.breakpoints.sm}) {
    flex-direction: column;
    gap: ${tokens.spacing[2]};
  }
`;

const StatusChip = styled.span`
  background: ${tokens.colors.info};
  color: ${tokens.colors.surface.white};
  padding: ${tokens.spacing[1]} ${tokens.spacing[2]};
  border-radius: ${tokens.radii.full};
  font-size: ${tokens.typography.fontSize.xs};
  font-weight: ${tokens.typography.fontWeight.medium};
`;

const Summary = styled.div`
  background: ${tokens.colors.surface.alt};
  padding: ${tokens.spacing[4]};
  border-radius: ${tokens.radii.md};
  border-left: 3px solid ${tokens.colors.info};
  margin-bottom: ${tokens.spacing[6]};
`;

const SummaryTitle = styled.h3`
  color: #344054;
  margin-bottom: ${tokens.spacing[2]};
  font-size: ${tokens.typography.fontSize.h4};
  
  .dark & {
    color: #111827;
  }
`;

const SummaryText = styled.p`
  color: #344054;
  line-height: ${tokens.typography.lineHeight.bodyL};
  
  .dark & {
    color: #111827;
  }
`;

const SubjectsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.spacing[2]};
  margin-top: ${tokens.spacing[4]};
`;

const SubjectChip = styled.span`
  background: ${tokens.colors.surface.alt};
  color: #344054;
  padding: ${tokens.spacing[1]} ${tokens.spacing[2]};
  border-radius: ${tokens.radii.full};
  font-size: ${tokens.typography.fontSize.small};
  border: 1px solid ${tokens.colors.gray[200]};
  
  .dark & {
    color: #111827;
  }
`;

const SubjectsTitle = styled.h3`
  margin-bottom: ${tokens.spacing[3]};
  color: #344054;
  
  .dark & {
    color: #FFFFFF;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${tokens.spacing[8]};
  color: #667085;
  
  .dark & {
    color: #E5E7EB;
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${tokens.spacing[8]};
  color: #7A1F1F;
  background: ${tokens.colors.surface.alt};
  border-radius: ${tokens.radii.md};
  border-left: 3px solid #7A1F1F;
  
  .dark & {
    color: #FF9B9B;
    border-left-color: #FF9B9B;
  }
`;

export const BillPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBill = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const billData = await api.getBill(id);
        setBill(billData);
      } catch (err) {
        setError('Bill not found or failed to load');
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <LoadingMessage>Loading bill details...</LoadingMessage>
      </PageContainer>
    );
  }

  if (error || !bill) {
    return (
      <PageContainer>
        <ErrorMessage>{error || 'Bill not found'}</ErrorMessage>
      </PageContainer>
    );
  }

  const chamberPrefix = bill.chamber === 'house' ? 'H.R.' : 'S.';

  return (
    <PageContainer>
      <BillContainer>
        <BillHeader>
          <BillNumber>{chamberPrefix} {bill.number}</BillNumber>
          <BillTitle>{bill.title}</BillTitle>
          <BillMeta>
            <div>
              <strong>Sponsor:</strong> {bill.sponsor.name} ({bill.sponsor.party}-{bill.sponsor.state})
            </div>
            <div>
              <strong>Introduced:</strong> {new Date(bill.introducedDate).toLocaleDateString()}
            </div>
            <div>
              <strong>Status:</strong> <StatusChip>{bill.status}</StatusChip>
            </div>
          </BillMeta>
        </BillHeader>

        {bill.summary && (
          <Summary>
            <SummaryTitle>Summary</SummaryTitle>
            <SummaryText>{bill.summary}</SummaryText>
          </Summary>
        )}

        {bill.subjects && bill.subjects.length > 0 && (
          <div>
            <SubjectsTitle>Subjects</SubjectsTitle>
            <SubjectsList>
              {bill.subjects.map((subject, index) => (
                <SubjectChip key={index}>{subject}</SubjectChip>
              ))}
            </SubjectsList>
          </div>
        )}
      </BillContainer>
    </PageContainer>
  );
};