import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { tokens } from '../../styles/tokens';
import { Input } from '../atoms/Input';

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchValue?: string;
}

const HeaderContainer = styled.header`
  background: ${tokens.colors.surface.white};
  border-bottom: 1px solid ${tokens.colors.gray[200]};
  padding: ${tokens.spacing[4]} ${tokens.spacing[6]};
  position: sticky;
  top: 0;
  z-index: ${tokens.zIndex.header};
  box-shadow: ${tokens.shadows.e1};
`;

const HeaderContent = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: ${tokens.spacing[6]};
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: ${tokens.breakpoints.md}) {
    grid-template-columns: auto 1fr;
    gap: ${tokens.spacing[4]};
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing[2]};
`;

const LogoText = styled.h1`
  font-size: ${tokens.typography.fontSize.h4};
  font-weight: ${tokens.typography.fontWeight.bold};
  color: ${tokens.colors.primary};
  margin: 0;
  
  @media (max-width: ${tokens.breakpoints.sm}) {
    font-size: ${tokens.typography.fontSize.body};
  }
`;

const SearchSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.spacing[3]};
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  
  @media (max-width: ${tokens.breakpoints.sm}) {
    max-width: none;
  }
`;

const ScopeToggle = styled.div`
  display: flex;
  align-items: center;
  background: ${tokens.colors.surface.alt};
  border-radius: ${tokens.radii.md};
  padding: ${tokens.spacing[1]};
  height: fit-content;
  
  @media (max-width: ${tokens.breakpoints.sm}) {
    display: none;
  }
`;

const ScopeButton = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? tokens.colors.gray[200] : 'transparent'};
  color: ${props => props.$active ? tokens.colors.text.primary : tokens.colors.text.muted};
  border: none;
  padding: ${tokens.spacing[1]} ${tokens.spacing[3]};
  border-radius: ${tokens.radii.sm};
  font-size: ${tokens.typography.fontSize.small};
  font-weight: ${tokens.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${tokens.transitions.fast};
  
  &:hover {
    background: ${props => props.$active ? tokens.colors.gray[200] : tokens.colors.gray[100]};
  }
  
  &:focus-visible {
    outline: 2px solid ${tokens.colors.info};
    outline-offset: 1px;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing[3]};
  
  @media (max-width: ${tokens.breakpoints.sm}) {
    display: none;
  }
`;

const ThemeToggle = styled.button`
  background: transparent;
  border: 1px solid ${tokens.colors.gray[300]};
  border-radius: ${tokens.radii.md};
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${tokens.colors.text.secondary};
  transition: all ${tokens.transitions.fast};
  
  &:hover {
    background: ${tokens.colors.gray[50]};
    border-color: ${tokens.colors.gray[400]};
  }
  
  &:focus-visible {
    outline: 2px solid ${tokens.colors.info};
    outline-offset: 1px;
  }
`;

export const Header: React.FC<HeaderProps> = ({ onSearch, searchValue = '' }) => {
  const [searchQuery, setSearchQuery] = useState(searchValue);
  const [activeScope, setActiveScope] = useState<'house' | 'senate' | 'all'>('all');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) {
      const isDark = JSON.parse(saved);
      setIsDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, []);
  
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    // Toggle dark class on document
    document.documentElement.classList.toggle('dark', newMode);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch?.(searchQuery);
    }
  };
  
  return (
    <HeaderContainer role="banner">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      
      <HeaderContent>
        <Logo>
          <LogoText 
            as="a" 
            href="/" 
            onClick={() => window.location.reload()}
            style={{ textDecoration: 'none', cursor: 'pointer' }}
          >
            Congress Chat
          </LogoText>
        </Logo>
        
        <SearchSection>
          <form onSubmit={handleSearchSubmit} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: tokens.spacing[2] }}>
            <div style={{ flex: 1, marginBottom: 0, marginTop: '12px' }}>
              <Input
                type="search"
                placeholder="Search bills, topics, or ask a question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                fullWidth
                aria-label="Search Congress bills"
                style={{ marginBottom: 0 }}
              />
            </div>
          </form>
          
          <ScopeToggle role="group" aria-label="Search scope">
            <ScopeButton
              type="button"
              $active={activeScope === 'all'}
              onClick={() => setActiveScope('all')}
              aria-pressed={activeScope === 'all'}
            >
              All
            </ScopeButton>
            <ScopeButton
              type="button"
              $active={activeScope === 'house'}
              onClick={() => setActiveScope('house')}
              aria-pressed={activeScope === 'house'}
            >
              H.R.
            </ScopeButton>
            <ScopeButton
              type="button"
              $active={activeScope === 'senate'}
              onClick={() => setActiveScope('senate')}
              aria-pressed={activeScope === 'senate'}
            >
              S.
            </ScopeButton>
          </ScopeToggle>
        </SearchSection>
        
        <NavActions>
          <ThemeToggle
            type="button"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </ThemeToggle>
        </NavActions>
      </HeaderContent>
    </HeaderContainer>
  );
};