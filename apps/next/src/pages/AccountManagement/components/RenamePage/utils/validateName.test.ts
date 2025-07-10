import { TFunction } from 'react-i18next';
import { validateName } from './validateName';

// Mock the translation function
const mockT = jest.fn((key) => key) satisfies TFunction;

describe('RenameAccount utils', () => {
  beforeEach(() => {
    mockT.mockClear();
  });

  describe('validateName', () => {
    const currentAccountName = 'Current Account';

    it('should translate the error messages', () => {
      validateName('', currentAccountName, mockT);
      expect(mockT).toHaveBeenCalled();
    });

    it('should validate a valid new name', () => {
      const result = validateName(
        'New Account Name',
        currentAccountName,
        mockT,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe('New Account Name');
    });

    it('should fail validation when new name is empty', () => {
      const result = validateName('', currentAccountName, mockT);

      expect(result.success).toBe(false);
      expect(result.error!.issues[0]?.message).toBe(
        'Account name must be at least 1 character long',
      );
    });

    it('should fail validation when new name is only whitespace', () => {
      const result = validateName('   ', currentAccountName, mockT);
      expect(result.success).toBe(false);
    });

    it('should fail validation when new name is the same as current name', () => {
      const result = validateName(
        currentAccountName,
        currentAccountName,
        mockT,
      );

      expect(result.success).toBe(false);
      expect(result.error!.issues[0]?.message).toBe(
        'Account name must be different from the current name',
      );
    });

    it('should pass validation when new name is the same as current name but different case', () => {
      const result = validateName('CURRENT ACCOUNT', currentAccountName, mockT);

      expect(result.success).toBe(true);
      expect(result.data).toBe('CURRENT ACCOUNT');
    });

    it('should trim whitespace from valid names', () => {
      const result = validateName('  Valid Name  ', currentAccountName, mockT);

      expect(result.success).toBe(true);
      expect(result.data).toBe('Valid Name');
    });

    it('should fail when trimmed name becomes same as current name', () => {
      const result = validateName(
        '  Current Account  ',
        currentAccountName,
        mockT,
      );

      expect(result.success).toBe(false);
      expect(result.error!.issues[0]?.message).toBe(
        'Account name must be different from the current name',
      );
    });
  });
});
