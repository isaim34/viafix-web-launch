
import React from 'react';
import { useAdvertisingAccess } from './hooks/useAdvertisingAccess';
import { AdvertisingLoadingState } from './AdvertisingLoadingState';
import { AdvertisingErrorState } from './AdvertisingErrorState';
import { AdvertisingContent } from './AdvertisingContent';

export default function AdvertisingTab() {
  const { error, isLoading, hasAccess, handleRefresh } = useAdvertisingAccess();

  if (isLoading) {
    return <AdvertisingLoadingState />;
  }

  if (error || !hasAccess) {
    return <AdvertisingErrorState error={error || "Access denied"} onRefresh={handleRefresh} />;
  }

  return <AdvertisingContent />;
}
