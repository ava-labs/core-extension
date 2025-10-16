import { CustomRpcHeaders } from '@core/types';
import {
  getKeyValueHeaderList,
  updateKeyValueList,
  prepToStoreCustomRpcHeaders,
  isReadyToStore,
  KeyValueHeader,
} from './customRpcHeaders';

describe('customRpcHeaders utilities', () => {
  describe('getKeyValueHeaderList', () => {
    it('should convert empty headers object to list with one empty header', () => {
      const headers: CustomRpcHeaders = {};
      const result = getKeyValueHeaderList(headers);

      expect(result).toEqual([{ key: '', value: '' }]);
    });

    it('should convert headers object to list and add empty header at end', () => {
      const headers: CustomRpcHeaders = {
        Authorization: 'Bearer token123',
        'Content-Type': 'application/json',
      };
      const result = getKeyValueHeaderList(headers);

      expect(result).toEqual([
        { key: 'Authorization', value: 'Bearer token123' },
        { key: 'Content-Type', value: 'application/json' },
        { key: '', value: '' },
      ]);
    });

    it('should handle single header', () => {
      const headers: CustomRpcHeaders = {
        'X-API-Key': 'secret123',
      };
      const result = getKeyValueHeaderList(headers);

      expect(result).toEqual([
        { key: 'X-API-Key', value: 'secret123' },
        { key: '', value: '' },
      ]);
    });
  });

  describe('updateKeyValueList', () => {
    const originalList: KeyValueHeader[] = [
      { key: 'Authorization', value: 'Bearer token' },
      { key: 'Content-Type', value: 'application/json' },
      { key: '', value: '' },
    ];

    it('should update existing header at given index', () => {
      const newKeyValue = { key: 'Authorization', value: 'Bearer newtoken' };
      const result = updateKeyValueList(originalList, newKeyValue, 0);

      expect(result).toEqual([
        { key: 'Authorization', value: 'Bearer newtoken' },
        { key: 'Content-Type', value: 'application/json' },
        { key: '', value: '' },
      ]);
    });

    it('should delete header when both key and value are empty', () => {
      const newKeyValue = { key: '', value: '' };
      const result = updateKeyValueList(originalList, newKeyValue, 1);

      expect(result).toEqual([
        { key: 'Authorization', value: 'Bearer token' },
        { key: '', value: '' },
      ]);
    });

    it('should add new header and ensure empty header at end', () => {
      const newKeyValue = { key: 'X-Custom', value: 'custom-value' };
      const result = updateKeyValueList(originalList, newKeyValue, 2);

      expect(result).toEqual([
        { key: 'Authorization', value: 'Bearer token' },
        { key: 'Content-Type', value: 'application/json' },
        { key: 'X-Custom', value: 'custom-value' },
        { key: '', value: '' },
      ]);
    });

    it('should not add duplicate empty header if last item is already empty', () => {
      const listWithEmpty: KeyValueHeader[] = [
        { key: 'Test', value: 'value' },
        { key: '', value: '' },
      ];
      const newKeyValue = { key: 'New', value: 'new-value' };
      const result = updateKeyValueList(listWithEmpty, newKeyValue, 0);

      expect(result).toEqual([
        { key: 'New', value: 'new-value' },
        { key: '', value: '' },
      ]);
      expect(result.filter((h) => h.key === '' && h.value === '')).toHaveLength(
        1,
      );
    });

    it('should handle updating empty header to filled header', () => {
      const listWithEmpty: KeyValueHeader[] = [{ key: '', value: '' }];
      const newKeyValue = { key: 'First', value: 'first-value' };
      const result = updateKeyValueList(listWithEmpty, newKeyValue, 0);

      expect(result).toEqual([
        { key: 'First', value: 'first-value' },
        { key: '', value: '' },
      ]);
    });
  });

  describe('prepToStoreCustomRpcHeaders', () => {
    it('should convert valid headers list to CustomRpcHeaders object', () => {
      const headers: KeyValueHeader[] = [
        { key: 'Authorization', value: 'Bearer token123' },
        { key: 'Content-Type', value: 'application/json' },
        { key: '', value: '' },
      ];
      const result = prepToStoreCustomRpcHeaders(headers);

      expect(result).toEqual({
        Authorization: 'Bearer token123',
        'Content-Type': 'application/json',
      });
    });

    it('should filter out empty headers', () => {
      const headers: KeyValueHeader[] = [
        { key: 'Valid', value: 'valid-value' },
        { key: '', value: 'value-without-key' },
        { key: 'key-without-value', value: '' },
        { key: '', value: '' },
      ];
      const result = prepToStoreCustomRpcHeaders(headers);

      expect(result).toEqual({
        '': 'value-without-key',
        Valid: 'valid-value',
        'key-without-value': '',
      });
    });

    it('should handle empty list', () => {
      const headers: KeyValueHeader[] = [];
      const result = prepToStoreCustomRpcHeaders(headers);

      expect(result).toEqual({});
    });

    it('should handle list with only empty headers', () => {
      const headers: KeyValueHeader[] = [
        { key: '', value: '' },
        { key: '', value: '' },
      ];
      const result = prepToStoreCustomRpcHeaders(headers);

      expect(result).toEqual({});
    });

    it('should preserve headers with empty values but valid keys', () => {
      const headers: KeyValueHeader[] = [
        { key: 'X-Empty-Header', value: '' },
        { key: 'X-Valid-Header', value: 'some-value' },
      ];
      const result = prepToStoreCustomRpcHeaders(headers);

      expect(result).toEqual({
        'X-Empty-Header': '',
        'X-Valid-Header': 'some-value',
      });
    });
  });

  describe('isReadyToStore', () => {
    it('should return true for valid headers with empty trailing header', () => {
      const headers: KeyValueHeader[] = [
        { key: 'Authorization', value: 'Bearer token' },
        { key: 'Content-Type', value: 'application/json' },
        { key: '', value: '' },
      ];
      const result = isReadyToStore(headers);

      expect(result).toBe(true);
    });

    it('should return true for valid headers without trailing empty header', () => {
      const headers: KeyValueHeader[] = [
        { key: 'Authorization', value: 'Bearer token' },
        { key: 'Content-Type', value: 'application/json' },
      ];
      const result = isReadyToStore(headers);

      expect(result).toBe(true);
    });

    it('should return false if any header has empty key', () => {
      const headers: KeyValueHeader[] = [
        { key: 'Authorization', value: 'Bearer token' },
        { key: '', value: 'value-without-key' },
        { key: '', value: '' },
      ];
      const result = isReadyToStore(headers);

      expect(result).toBe(false);
    });

    it('should return false if any header has empty value', () => {
      const headers: KeyValueHeader[] = [
        { key: 'Authorization', value: 'Bearer token' },
        { key: 'Empty-Value', value: '' },
        { key: '', value: '' },
      ];
      const result = isReadyToStore(headers);

      expect(result).toBe(false);
    });

    it('should return true for empty list', () => {
      const headers: KeyValueHeader[] = [];
      const result = isReadyToStore(headers);

      expect(result).toBe(true);
    });

    it('should return true for list with only empty trailing header', () => {
      const headers: KeyValueHeader[] = [{ key: '', value: '' }];
      const result = isReadyToStore(headers);

      expect(result).toBe(true);
    });

    it('should handle multiple trailing empty headers correctly', () => {
      const headers: KeyValueHeader[] = [
        { key: 'Valid', value: 'header' },
        { key: '', value: '' },
        { key: '', value: '' },
      ];
      const result = isReadyToStore(headers);

      expect(result).toBe(false);
    });

    it('should return false when headers have duplicate keys', () => {
      const headers: KeyValueHeader[] = [
        { key: 'Authorization', value: 'Bearer token1' },
        { key: 'Content-Type', value: 'application/json' },
        { key: 'Authorization', value: 'Bearer token2' },
        { key: '', value: '' },
      ];
      const result = isReadyToStore(headers);

      expect(result).toBe(false);
    });

    it('should return false for multiple duplicate keys', () => {
      const headers: KeyValueHeader[] = [
        { key: 'X-Header', value: 'value1' },
        { key: 'Authorization', value: 'Bearer token1' },
        { key: 'X-Header', value: 'value2' },
        { key: 'Authorization', value: 'Bearer token2' },
        { key: '', value: '' },
      ];
      const result = isReadyToStore(headers);

      expect(result).toBe(false);
    });

    it('should return true when headers have unique keys', () => {
      const headers: KeyValueHeader[] = [
        { key: 'Authorization', value: 'Bearer token' },
        { key: 'Content-Type', value: 'application/json' },
        { key: 'X-Custom-Header', value: 'custom-value' },
        { key: '', value: '' },
      ];
      const result = isReadyToStore(headers);

      expect(result).toBe(true);
    });

    it('should ignore empty keys when checking for duplicates', () => {
      const headers: KeyValueHeader[] = [
        { key: 'Valid-Header', value: 'valid-value' },
        { key: '', value: 'empty-key-1' },
        { key: '', value: 'empty-key-2' },
        { key: '', value: '' },
      ];
      const result = isReadyToStore(headers);

      // Should be false because of empty keys in non-trailing positions, not because of duplicates
      expect(result).toBe(false);
    });

    it('should handle single header with no duplicates', () => {
      const headers: KeyValueHeader[] = [
        { key: 'Single-Header', value: 'single-value' },
        { key: '', value: '' },
      ];
      const result = isReadyToStore(headers);

      expect(result).toBe(true);
    });

    it('should handle single header with duplicates', () => {
      const headers: KeyValueHeader[] = [
        { key: 'Single-Header', value: 'single-value' },
        { key: 'Single-Header', value: 'single-value2' },
        { key: '', value: '' },
      ];
      const result = isReadyToStore(headers);

      expect(result).toBe(false);
    });
  });

  describe('integration tests', () => {
    it('should handle complete flow: headers -> list -> update -> store', () => {
      // Start with some headers
      const originalHeaders: CustomRpcHeaders = {
        Authorization: 'Bearer old-token',
        'Content-Type': 'application/json',
      };

      // Convert to list
      let headerList = getKeyValueHeaderList(originalHeaders);
      expect(headerList).toHaveLength(3); // 2 headers + 1 empty

      // Update authorization header
      headerList = updateKeyValueList(
        headerList,
        { key: 'Authorization', value: 'Bearer new-token' },
        0,
      );

      // Add new header
      headerList = updateKeyValueList(
        headerList,
        { key: 'X-Custom', value: 'custom-value' },
        2,
      );

      // Verify ready to store
      expect(isReadyToStore(headerList)).toBe(true);

      // Convert back to storage format
      const finalHeaders = prepToStoreCustomRpcHeaders(headerList);
      expect(finalHeaders).toEqual({
        Authorization: 'Bearer new-token',
        'Content-Type': 'application/json',
        'X-Custom': 'custom-value',
      });
    });

    it('should handle deleting all headers', () => {
      const originalHeaders: CustomRpcHeaders = {
        Header1: 'value1',
        Header2: 'value2',
      };

      let headerList = getKeyValueHeaderList(originalHeaders);

      // Delete first header
      headerList = updateKeyValueList(headerList, { key: '', value: '' }, 0);

      // Delete second header (now at index 0)
      headerList = updateKeyValueList(headerList, { key: '', value: '' }, 0);

      expect(headerList).toEqual([{ key: '', value: '' }]);
      expect(isReadyToStore(headerList)).toBe(true);
      expect(prepToStoreCustomRpcHeaders(headerList)).toEqual({});
    });

    it('should handle duplicate key prevention in workflow', () => {
      // Start with some headers
      const originalHeaders: CustomRpcHeaders = {
        Authorization: 'Bearer old-token',
      };

      let headerList = getKeyValueHeaderList(originalHeaders);

      // Try to add a duplicate Authorization header
      headerList = updateKeyValueList(
        headerList,
        { key: 'Authorization', value: 'Bearer new-token' },
        1, // Add at the empty field position
      );

      // Should now have duplicate Authorization headers
      expect(headerList).toEqual([
        { key: 'Authorization', value: 'Bearer old-token' },
        { key: 'Authorization', value: 'Bearer new-token' },
        { key: '', value: '' },
      ]);

      // Should not be ready to store due to duplicate keys
      expect(isReadyToStore(headerList)).toBe(false);

      // But prepToStoreCustomRpcHeaders should still work (last value wins)
      const finalHeaders = prepToStoreCustomRpcHeaders(headerList);
      expect(finalHeaders).toEqual({
        Authorization: 'Bearer new-token', // Last value wins
      });
    });
  });
});
