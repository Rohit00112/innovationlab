import TeamPage from "@/components/pages/TeamPage";
import Layout from "@/components/layout/Layout";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Team | Innovation Lab',
  description: 'Meet the passionate innovators, mentors, and experts behind Innovation Lab\'s success.',
  openGraph: {
    title: 'Our Team | Innovation Lab',
    description: 'Meet the passionate innovators, mentors, and experts behind Innovation Lab\'s success.',
    url: 'https://innovationlab.com/team',
    siteName: 'Innovation Lab',
    images: [
      {
        url: 'https://innovationlab.com/images/og-team.jpg',
        width: 1200,
        height: 630,
        alt: 'Innovation Lab Team',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function Team() {
  return (
    <Layout>
      <TeamPage />
    </Layout>
  );
}
