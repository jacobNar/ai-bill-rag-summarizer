import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { tokens } from '../../styles/tokens';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const InputWrapper = styled.div<{ $fullWidth: boolean }>`
  display: ${props => props.$fullWidth ? 'block' : 'inline-block'};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  margin-bottom: ${tokens.spacing[4]};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${tokens.spacing[1]};
  font-size: ${tokens.typography.fontSize.small};
  font-weight: ${tokens.typography.fontWeight.medium};
  color: ${tokens.colors.text.primary};
`;

const InputContainer = styled.div<{ $hasError: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  
  ${props => props.$hasError && css`
    input {
      border-color: ${tokens.colors.error};
      
      &:focus {
        outline-color: ${tokens.colors.error};
      }
    }
  `}
`;

const StyledInput = styled.input<{ $hasLeftIcon: boolean; $hasRightIcon: boolean }>`
  width: 100%;
  height: 40px;
  padding: ${tokens.spacing[2]} ${props => props.$hasRightIcon ? tokens.spacing[10] : tokens.spacing[3]};
  padding-left: ${props => props.$hasLeftIcon ? tokens.spacing[10] : tokens.spacing[3]};
  font-family: ${tokens.typography.fontFamily.sans};
  font-size: ${tokens.typography.fontSize.body};
  line-height: ${tokens.typography.lineHeight.body};
  color: ${tokens.colors.text.primary};
  background: ${tokens.colors.surface.white};
  border: 1px solid ${tokens.colors.gray[300]};
  border-radius: ${tokens.radii.md};
  transition: all ${tokens.transitions.fast};
  
  &::placeholder {
    color: ${tokens.colors.text.muted};
  }
  
  &:hover:not(:disabled) {
    border-color: ${tokens.colors.gray[400]};
  }
  
  &:focus {
    outline: none;
    border-color: ${tokens.colors.gray[400]};
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  }
  
  &:disabled {
    background: ${tokens.colors.gray[50]};
    color: ${tokens.colors.text.muted};
    cursor: not-allowed;
  }
`;

const IconWrapper = styled.span<{ $position: 'left' | 'right' }>`
  position: absolute;
  ${props => props.$position}: ${tokens.spacing[3]};
  display: flex;
  align-items: center;
  pointer-events: none;
  color: ${tokens.colors.text.muted};
`;

const HelpText = styled.span`
  display: block;
  margin-top: ${tokens.spacing[1]};
  font-size: ${tokens.typography.fontSize.small};
  color: ${tokens.colors.text.muted};
`;

const ErrorText = styled.span`
  display: block;
  margin-top: ${tokens.spacing[1]};
  font-size: ${tokens.typography.fontSize.small};
  color: ${tokens.colors.error};
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helpText,
      fullWidth = true,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <InputWrapper $fullWidth={fullWidth}>
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <InputContainer $hasError={!!error}>
          {leftIcon && <IconWrapper $position="left">{leftIcon}</IconWrapper>}
          <StyledInput
            ref={ref}
            id={inputId}
            $hasLeftIcon={!!leftIcon}
            $hasRightIcon={!!rightIcon}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
            {...props}
          />
          {rightIcon && <IconWrapper $position="right">{rightIcon}</IconWrapper>}
        </InputContainer>
        {helpText && !error && <HelpText id={`${inputId}-help`}>{helpText}</HelpText>}
        {error && <ErrorText id={`${inputId}-error`}>{error}</ErrorText>}
      </InputWrapper>
    );
  }
);

Input.displayName = 'Input';