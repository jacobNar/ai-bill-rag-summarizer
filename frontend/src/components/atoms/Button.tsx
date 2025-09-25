import React from 'react';
import styled, { css } from 'styled-components';
import { tokens } from '../../styles/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

const buttonVariants = {
  primary: css`
    background: ${tokens.colors.primary};
    color: ${tokens.colors.surface.white};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background: #123766; /* Navy 700 hover */
      transform: translateY(-1px);
      box-shadow: ${tokens.shadows.e1};
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,
  
  secondary: css`
    background: transparent;
    color: ${tokens.colors.text.primary};
    border: 1px solid ${tokens.colors.gray[700]};

    &:hover:not(:disabled) {
      background: ${tokens.colors.gray[50]};
      border-color: ${tokens.colors.gray[800]};
    }
  `,
  
  tertiary: css`
    background: transparent;
    color: ${tokens.colors.info};
    border: 1px solid transparent;
    text-decoration: none;

    &:hover:not(:disabled) {
      text-decoration: underline;
      background: rgba(10, 74, 166, 0.05);
    }
  `,
};

const buttonSizes = {
  small: css`
    padding: ${tokens.spacing[1]} ${tokens.spacing[3]};
    font-size: ${tokens.typography.fontSize.small};
    line-height: ${tokens.typography.lineHeight.small};
  `,
  
  medium: css`
    padding: ${tokens.spacing[2]} ${tokens.spacing[4]};
    font-size: ${tokens.typography.fontSize.body};
    line-height: ${tokens.typography.lineHeight.body};
  `,
  
  large: css`
    padding: ${tokens.spacing[3]} ${tokens.spacing[6]};
    font-size: ${tokens.typography.fontSize.bodyL};
    line-height: ${tokens.typography.lineHeight.bodyL};
  `,
};

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $loading: boolean;
}>`
  font-family: ${tokens.typography.fontFamily.sans};
  font-weight: ${tokens.typography.fontWeight.semibold};
  border-radius: ${tokens.radii.md};
  cursor: pointer;
  transition: all ${tokens.transitions.fast};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.spacing[2]};
  min-height: 44px; /* WCAG touch target */
  position: relative;
  
  ${props => buttonVariants[props.$variant]}
  ${props => buttonSizes[props.$size]}
  
  ${props => props.$fullWidth && css`
    width: 100%;
  `}
  
  &:focus-visible {
    outline: ${tokens.shadows.focus};
    outline-offset: 2px;
  }
  
  &:disabled,
  &[aria-busy="true"] {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${props => props.$loading && css`
    color: transparent;
    pointer-events: none;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      color: ${props.$variant === 'primary' ? tokens.colors.surface.white : tokens.colors.primary};
    }
  `}
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <IconWrapper>{icon}</IconWrapper>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <IconWrapper>{icon}</IconWrapper>
      )}
    </StyledButton>
  );
};