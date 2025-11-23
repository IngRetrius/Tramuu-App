/**
 * useUser Hook Tests
 * Pruebas para el hook useUser
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook, waitFor } from '@testing-library/react-native';
import { useUser } from '../useUser';

describe('useUser Hook', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useUser());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.userType).toBeNull();
  });

  it('should load company user from storage', async () => {
    const companyUser = {
      id: 'company-uuid',
      email: 'company@test.com',
      userType: 'company',
      name: 'Test Company',
    };

    await AsyncStorage.setItem('@tramuu_user', JSON.stringify(companyUser));

    const { result } = renderHook(() => useUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(companyUser);
    expect(result.current.userType).toBe('company');
    expect(result.current.isCompany).toBe(true);
    expect(result.current.isEmployee).toBe(false);
  });

  it('should load employee user from storage', async () => {
    const employeeUser = {
      id: 'employee-uuid',
      email: 'employee@test.com',
      userType: 'employee',
      name: 'Test Employee',
    };

    await AsyncStorage.setItem('@tramuu_user', JSON.stringify(employeeUser));

    const { result } = renderHook(() => useUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(employeeUser);
    expect(result.current.userType).toBe('employee');
    expect(result.current.isCompany).toBe(false);
    expect(result.current.isEmployee).toBe(true);
  });

  it('should handle no user in storage', async () => {
    const { result } = renderHook(() => useUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.userType).toBeNull();
    expect(result.current.isCompany).toBe(false);
    expect(result.current.isEmployee).toBe(false);
  });

  it('should handle storage errors gracefully', async () => {
    // Simular error en AsyncStorage
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Storage error'));

    const { result } = renderHook(() => useUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.user).toBeNull();
  });

  it('should refresh user data when refreshUser is called', async () => {
    const initialUser = {
      id: 'user-1',
      email: 'user1@test.com',
      userType: 'company',
      name: 'Initial User',
    };

    await AsyncStorage.setItem('@tramuu_user', JSON.stringify(initialUser));

    const { result } = renderHook(() => useUser());

    await waitFor(() => {
      expect(result.current.user).toEqual(initialUser);
    });

    // Actualizar usuario en storage
    const updatedUser = {
      ...initialUser,
      name: 'Updated User',
    };

    await AsyncStorage.setItem('@tramuu_user', JSON.stringify(updatedUser));

    // Llamar refreshUser
    result.current.refreshUser();

    await waitFor(() => {
      expect(result.current.user.name).toBe('Updated User');
    });
  });

  it('should parse user data correctly from JSON', async () => {
    const userData = {
      id: 'test-id',
      email: 'test@test.com',
      userType: 'company',
      name: 'Test Name',
      phone: '1234567890',
      companyData: {
        nit_id: '123456',
        address: 'Test Address',
      },
    };

    await AsyncStorage.setItem('@tramuu_user', JSON.stringify(userData));

    const { result } = renderHook(() => useUser());

    await waitFor(() => {
      expect(result.current.user).toEqual(userData);
    });

    expect(result.current.user.companyData).toBeDefined();
    expect(result.current.user.companyData.nit_id).toBe('123456');
  });
});
