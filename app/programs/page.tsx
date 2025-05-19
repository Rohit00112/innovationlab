import ProgramsPage from "@/components/pages/ProgramsPage";
import Layout from "@/components/layout/Layout";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Programs | Innovation Lab',
  description: 'Discover our specialized programs designed to accelerate innovation across different domains and stages.',
  openGraph: {
    title: 'Programs | Innovation Lab',
    description: 'Discover our specialized programs designed to accelerate innovation across different domains and stages.',
    url: 'https://innovationlab.com/programs',
    siteName: 'Innovation Lab',
    images: [
      {
        url: 'https://innovationlab.com/images/og-programs.jpg',
        width: 1200,
        height: 630,
        alt: 'Innovation Lab Programs',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function Programs() {
  return (
    <Layout>
      <ProgramsPage />
    </Layout>
  );
}
