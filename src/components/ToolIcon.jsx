'use client';

import { useState } from 'react';

const TOOL_DOMAINS = {
  'hubspot': 'hubspot.com',
  'pipedrive': 'pipedrive.com',
  'mailchimp': 'mailchimp.com',
  'klaviyo': 'klaviyo.com',
  'wordpress': 'wordpress.org',
  'webflow': 'webflow.com',
  'zapier': 'zapier.com',
  'make': 'make.com',
  'google-analytics': 'google.com',
  'mixpanel': 'mixpanel.com',
  'stripe': 'stripe.com',
  'notion': 'notion.so',
  'slack': 'slack.com',
  'asana': 'asana.com',
  'trello': 'trello.com',
  'monday': 'monday.com',
  'airtable': 'airtable.com',
  'figma': 'figma.com',
  'canva': 'canva.com',
  'shopify': 'shopify.com',
  'woocommerce': 'woocommerce.com',
  'intercom': 'intercom.com',
  'zendesk': 'zendesk.com',
  'salesforce': 'salesforce.com',
  'activecampaign': 'activecampaign.com',
  'convertkit': 'convertkit.com',
  'typeform': 'typeform.com',
  'calendly': 'calendly.com',
  'cal-com': 'cal.com',
  'loops': 'loops.so',
  'loom': 'loom.com',
  'zoom': 'zoom.us',
  'google-workspace': 'workspace.google.com',
  'clickup': 'clickup.com',
  'linear': 'linear.app',
  'jira': 'atlassian.com',
  'github': 'github.com',
};

function extractDomain(url) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return null;
  }
}

export default function ToolIcon({ slug, name, size = 'md', websiteUrl }) {
  const [imgError, setImgError] = useState(false);
  const domain = TOOL_DOMAINS[slug] || extractDomain(websiteUrl);
  const sizeClasses = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
  const imgSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';

  return (
    <div className={`${sizeClasses} rounded-xl bg-primary/10 flex items-center justify-center shrink-0`}>
      {domain && !imgError ? (
        <img
          src={`https://img.logo.dev/${domain}?token=pk_TJRddIuaSD-SvqQpHcnFCA&size=64&format=png`}
          alt={name}
          className={`${imgSize} object-contain rounded`}
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-sm font-bold text-primary">{name?.charAt(0)}</span>
      )}
    </div>
  );
}