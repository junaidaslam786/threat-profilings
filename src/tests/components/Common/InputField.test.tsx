import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InputField from '../../../components/Common/InputField';

describe('InputField', () => {
  const defaultProps = {
    label: 'Test Label',
    type: 'text',
    name: 'testField',
    value: '',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with basic props', () => {
    render(<InputField {...defaultProps} />);
    
    const label = screen.getByText('Test Label');
    const input = screen.getByRole('textbox');
    
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'testField');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should connect label to input via htmlFor/id', () => {
    render(<InputField {...defaultProps} />);
    
    const label = screen.getByText('Test Label');
    const input = screen.getByRole('textbox');
    
    expect(label).toHaveAttribute('for', 'testField');
    expect(input).toHaveAttribute('id', 'testField');
  });

  it('should display the current value', () => {
    render(<InputField {...defaultProps} value="Current Value" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Current Value');
  });

  it('should call onChange when input value changes', () => {
    const onChange = vi.fn();
    render(<InputField {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(onChange).toHaveBeenCalledTimes(1);
    // Verify onChange was called with an event object
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
      type: 'change'
    }));
  });

  it('should render with placeholder text', () => {
    render(<InputField {...defaultProps} placeholder="Enter text here" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter text here');
  });

  it('should display error message when error prop is provided', () => {
    render(<InputField {...defaultProps} error="This field is required" />);
    
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-500', 'text-xs', 'italic');
  });

  it('should apply error styles when error is present', () => {
    render(<InputField {...defaultProps} error="Error message" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
  });

  it('should apply normal styles when no error', () => {
    render(<InputField {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-gray-600', 'bg-gray-700', 'text-white');
    expect(input).not.toHaveClass('border-red-500');
  });

  it('should handle different input types', () => {
    const { rerender } = render(<InputField {...defaultProps} type="email" />);
    let input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');

    rerender(<InputField {...defaultProps} type="password" />);
    input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('type', 'password');

    rerender(<InputField {...defaultProps} type="tel" />);
    input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'tel');
  });

  it('should handle pattern attribute', () => {
    render(<InputField {...defaultProps} pattern="[0-9]*" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('pattern', '[0-9]*');
  });

  it('should handle title attribute', () => {
    render(<InputField {...defaultProps} title="Please enter a valid value" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('title', 'Please enter a valid value');
  });

  it('should handle required attribute', () => {
    render(<InputField {...defaultProps} required />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('required');
    expect(input).toBeRequired();
  });

  it('should not have required attribute when not specified', () => {
    render(<InputField {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    expect(input).not.toHaveAttribute('required');
  });

  it('should accept custom className', () => {
    render(<InputField {...defaultProps} className="custom-input-class" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-input-class');
  });

  it('should have proper styling classes', () => {
    render(<InputField {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass(
      'shadow',
      'appearance-none',
      'border',
      'rounded-lg',
      'w-full',
      'py-3',
      'px-4',
      'text-gray-700',
      'leading-tight',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-600',
      'focus:border-transparent',
      'transition',
      'duration-300',
      'ease-in-out'
    );
  });

  it('should show both error message and normal styling in container', () => {
    render(<InputField {...defaultProps} error="Error occurred" />);
    
    const container = screen.getByText('Test Label').closest('div');
    expect(container).toHaveClass('mb-4');
    
    const errorMessage = screen.getByText('Error occurred');
    expect(errorMessage).toHaveClass('mt-1');
  });

  it('should handle focus and blur events', () => {
    render(<InputField {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    
    // Focus the input
    input.focus();
    expect(input).toHaveFocus();
    
    // Blur the input
    input.blur();
    expect(input).not.toHaveFocus();
  });

  it('should support all HTML input attributes', () => {
    render(
      <InputField 
        {...defaultProps} 
        pattern="[A-Za-z]*"
        title="Letters only"
        required
        placeholder="Type here"
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('pattern', '[A-Za-z]*');
    expect(input).toHaveAttribute('title', 'Letters only');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('placeholder', 'Type here');
  });
});
