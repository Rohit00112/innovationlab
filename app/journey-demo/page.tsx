"use client";

import React from 'react';
import EnhancedJourneySection from '@/components/sections/EnhancedJourneySection';
import Layout from '@/components/layout/Layout';

export default function JourneyDemo() {
  return (
    <Layout>
      <div className="pt-20">
        <EnhancedJourneySection />
      </div>
    </Layout>
  );
}
