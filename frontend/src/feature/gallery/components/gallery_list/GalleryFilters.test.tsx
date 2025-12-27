import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GalleryFilters from '../gallery_list/GalleryFilters';
import '@testing-library/jest-dom';

const pushMock = jest.fn();
const dispatchMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: pushMock })),
  useSearchParams: jest.fn(
    () =>
      new URLSearchParams({
        search: 'cats',
        sortBy: 'title',
        orderBy: 'asc',
        minImages: '2',
      })
  ),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(() => dispatchMock),
}));

jest.mock('@/store/slices/paginationSlice', () => ({
  setPage: (page: number) => ({ type: 'setPage', payload: page }),
}));

jest.mock('@/shared/ui/Input', () => ({
  Input: ({ value, onChange, id }: any) => (
    <input data-testid={id} value={value} onChange={onChange} />
  ),
}));

jest.mock('@/shared/ui/Select', () => ({
  Select: ({ value, onChange, options }: any) => (
    <select
      data-testid="select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o: any) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock('@/shared/ui/IconDatePicker', () => ({
  IconDatePicker: ({ onChange }: any) => (
    <button onClick={() => onChange(new Date('2024-01-01'))}>
      Pick date
    </button>
  ),
}));

jest.mock('@/shared/ui/Buton', () => ({
  __esModule: true,
  default: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

describe('GalleryFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes state from search params', () => {
    render(<GalleryFilters />);

    expect(screen.getByTestId('search')).toHaveValue('cats');
  });

  it('updates search input value', () => {
    render(<GalleryFilters />);

    fireEvent.change(screen.getByTestId('search'), {
      target: { value: 'dogs' },
    });

    expect(screen.getByTestId('search')).toHaveValue('dogs');
  });

  it('applies filters and resets page', () => {
    render(<GalleryFilters />);

    fireEvent.click(screen.getByTestId('apply-filters'));

    expect(pushMock).toHaveBeenCalled();
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'setPage',
      payload: 1,
    });
  });

  it('resets filters and pagination', () => {
    render(<GalleryFilters />);

    fireEvent.click(screen.getByTestId('reset-filters'));

    expect(pushMock).toHaveBeenCalledWith('?');
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'setPage',
      payload: 1,
    });
  });
});
