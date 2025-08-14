import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../../../components/Common/Modal';

describe('Modal', () => {
  const defaultProps = {
    show: true,
    onClose: vi.fn(),
    children: <div>Modal Content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render when show is true', () => {
    render(<Modal {...defaultProps} />);
    
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should not render when show is false', () => {
    render(<Modal {...defaultProps} show={false} />);
    
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('should render children content', () => {
    render(
      <Modal {...defaultProps}>
        <h2>Test Title</h2>
        <p>Test Content</p>
      </Modal>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render close button', () => {
    render(<Modal {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveTextContent('✕');
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should have default size of lg', () => {
    render(<Modal {...defaultProps} />);
    
    // Get the inner modal div that contains the content
    const modalWrapper = screen.getByText('Modal Content').parentElement;
    expect(modalWrapper).toHaveClass('max-w-lg');
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<Modal {...defaultProps} size="sm" />);
    let modalWrapper = screen.getByText('Modal Content').parentElement;
    expect(modalWrapper).toHaveClass('max-w-sm');

    rerender(<Modal {...defaultProps} size="md" />);
    modalWrapper = screen.getByText('Modal Content').parentElement;
    expect(modalWrapper).toHaveClass('max-w-md');

    rerender(<Modal {...defaultProps} size="xl" />);
    modalWrapper = screen.getByText('Modal Content').parentElement;
    expect(modalWrapper).toHaveClass('max-w-xl');

    rerender(<Modal {...defaultProps} size="2xl" />);
    modalWrapper = screen.getByText('Modal Content').parentElement;
    expect(modalWrapper).toHaveClass('max-w-2xl');
  });

  it('should accept custom className', () => {
    render(<Modal {...defaultProps} className="custom-modal-class" />);
    
    const modalWrapper = screen.getByText('Modal Content').parentElement;
    expect(modalWrapper).toHaveClass('custom-modal-class');
  });

  it('should have proper modal structure and styling', () => {
    render(<Modal {...defaultProps} />);
    
    // Get modal content wrapper (inner div)
    const modalWrapper = screen.getByText('Modal Content').parentElement;
    // Get backdrop (outer div)
    const backdrop = modalWrapper?.parentElement;
    
    // Check backdrop classes
    expect(backdrop).toHaveClass(
      'fixed',
      'inset-0',
      'bg-black',
      'bg-opacity-50',
      'flex',
      'items-center',
      'justify-center',
      'z-50',
      'p-4'
    );

    // Check modal wrapper classes
    expect(modalWrapper).toHaveClass(
      'bg-gray-800',
      'rounded-lg',
      'shadow-xl',
      'p-6',
      'w-full',
      'mx-auto',
      'border',
      'border-blue-700',
      'relative'
    );
  });

  it('should have proper close button styling', () => {
    render(<Modal {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    expect(closeButton).toHaveClass(
      'absolute',
      'top-3',
      'right-3',
      'text-gray-400',
      'hover:text-gray-200',
      'text-2xl'
    );
  });

  it('should have proper accessibility attributes', () => {
    render(<Modal {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
  });

  it('should handle complex children', () => {
    render(
      <Modal {...defaultProps}>
        <div data-testid="header">Header</div>
        <div data-testid="body">
          <input type="text" placeholder="Input field" />
          <button>Action Button</button>
        </div>
        <div data-testid="footer">Footer</div>
      </Modal>
    );
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('body')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
  });

  it('should maintain z-index for proper layering', () => {
    render(<Modal {...defaultProps} />);
    
    const modalWrapper = screen.getByText('Modal Content').parentElement;
    const backdrop = modalWrapper?.parentElement;
    expect(backdrop).toHaveClass('z-50');
  });

  it('should render with backdrop overlay', () => {
    render(<Modal {...defaultProps} />);
    
    const modalWrapper = screen.getByText('Modal Content').parentElement;
    const backdrop = modalWrapper?.parentElement;
    expect(backdrop).toHaveClass('bg-black', 'bg-opacity-50');
  });

  it('should center modal content', () => {
    render(<Modal {...defaultProps} />);
    
    const modalWrapper = screen.getByText('Modal Content').parentElement;
    const backdrop = modalWrapper?.parentElement;
    expect(backdrop).toHaveClass('flex', 'items-center', 'justify-center');
  });

  it('should handle empty children', () => {
    render(<Modal {...defaultProps} children={null} />);
    
    // Modal should still render but without content
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('should combine default and custom classes correctly', () => {
    render(<Modal {...defaultProps} className="extra-spacing custom-border" size="md" />);
    
    const modalWrapper = screen.getByText('Modal Content').parentElement;
    expect(modalWrapper).toHaveClass('max-w-md'); // size class
    expect(modalWrapper).toHaveClass('extra-spacing'); // custom class
    expect(modalWrapper).toHaveClass('custom-border'); // custom class
    expect(modalWrapper).toHaveClass('bg-gray-800'); // default class
  });
});
