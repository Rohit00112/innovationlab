import PastEventsPage from "@/components/pages/PastEventsPage";
import Layout from "@/components/layout/Layout";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Past Events | Innovation Lab',
  description: 'Explore our previous events, access recordings, presentations, and resources from our past innovation gatherings.',
  openGraph: {
    title: 'Past Events | Innovation Lab',
    description: 'Explore our previous events, access recordings, presentations, and resources from our past innovation gatherings.',
    url: 'https://innovationlab.com/events/past',
    siteName: 'Innovation Lab',
    images: [
      {
        url: 'https://innovationlab.com/images/og-past-events.jpg',
        width: 1200,
        height: 630,
        alt: 'Innovation Lab Past Events',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function PastEvents() {
  return (
    <Layout>
      <PastEventsPage />
    </Layout>
  );
}
