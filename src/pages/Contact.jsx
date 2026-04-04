import { useState } from 'react';
import { Send, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await base44.entities.ContactMessage.create(form);
    setSending(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Message sent</h1>
        <p className="text-muted-foreground">Thanks for reaching out. We'll get back to you as soon as possible.</p>
      </div>
    );
  }

  const contactLinks = [
    { label: 'General enquiries', email: 'hello@stackdom.com' },
    { label: 'Partnership enquiries', email: 'partners@stackdom.com' },
    { label: 'Press', email: 'press@stackdom.com' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Header */}
      <div className="text-center mb-14">
        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary bg-accent rounded-full mb-4">Contact</span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Get in touch</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">Have a question or suggestion? We'd love to hear from you.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* Form card */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Your name" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="you@company.com" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="What's this about?" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required placeholder="Tell us how we can help..." rows={5} className="mt-1.5" />
            </div>
            <Button type="submit" disabled={sending} className="w-full rounded-full h-11">
              {sending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" /> Send message
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Other ways to reach us */}
        <div>
          <h2 className="text-xl font-bold mb-6">Other ways to reach us</h2>
          <div className="space-y-4">
            {contactLinks.map(link => (
              <a
                key={link.email}
                href={`mailto:${link.email}`}
                className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/20 hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{link.label}</p>
                  <p className="text-sm text-primary">{link.email}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}