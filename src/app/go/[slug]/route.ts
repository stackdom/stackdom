import { NextRequest, NextResponse } from 'next/server';
import { getToolByGoSlug } from '@/lib/sanity';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const tool = await getToolByGoSlug(slug);

  const destination =
    tool?.affiliateUrl || tool?.website_url || '/tools';

  return NextResponse.redirect(destination, {
    status: 301,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
