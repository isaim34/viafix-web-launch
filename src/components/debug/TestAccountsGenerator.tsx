
import React from 'react';
import { TestCustomerAccount } from './TestCustomerAccount';
import { TestMechanicAccount } from './TestMechanicAccount';
import { TestVendorCreator } from './TestVendorCreator';

export const TestAccountsGenerator = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TestCustomerAccount />
        <TestMechanicAccount />
      </div>
      <TestVendorCreator />
    </div>
  );
};
