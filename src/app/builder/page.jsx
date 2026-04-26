import { getAllTools } from '@/lib/sanity';
import BuilderWizard from './BuilderWizard';

export const revalidate = 3600;

export const metadata = {
  title: 'Stack Builder — Get Your Personalised Software Stack | Stackdom',
  description: 'Answer a few questions and get a tailored software stack matched to your business type, team size, budget, and goals. Free, instant recommendations.',
  openGraph: {
    title: 'Stack Builder — Get Your Personalised Software Stack | Stackdom',
    description: 'Answer a few questions and get a tailored software stack matched to your business.',
    url: 'https://stackdom.com/builder',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Stackdom Stack Builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stack Builder — Get Your Personalised Software Stack | Stackdom',
    description: 'Answer a few questions and get a tailored software stack matched to your business.',
  },
};

export default async function BuilderPage() {
  const tools = await getAllTools();
  return <BuilderWizard tools={tools} />;
}
