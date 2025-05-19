"use client";

import React from 'react';
import EnhancedCoreValuesSection from '@/components/sections/EnhancedCoreValuesSection';
import Layout from '@/components/layout/Layout';

export default function CoreValuesDemo() {
  return (
    <Layout>
      <div className="pt-20">
        <EnhancedCoreValuesSection />
      </div>
    </Layout>
  );
}
