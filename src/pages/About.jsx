import { Link } from 'react-router-dom';
import { ArrowRight, Target, Users, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="text-center mb-16">
        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary bg-accent rounded-full mb-4">About</span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">We help businesses pick the right tools</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Stackdom was built by operators who got tired of wasting time and money on the wrong software. We built the tool we wished existed.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {[
          { icon: Target, title: 'Our Mission', desc: "Help every business find the right stack — without the guesswork, the sales calls, or the regret of choosing wrong." },
          { icon: Users, title: 'Who We Serve', desc: "Small to medium businesses, founders, marketers, and operators who want clear, practical software recommendations." },
          { icon: Zap, title: 'How We Do It', desc: "A combination of expert curation and guided recommendations that turn tool choices into real business results." },
          { icon: Heart, title: 'Our Values', desc: "Honest recommendations. No pay-to-play. No affiliate bias. Every tool we recommend is one we'd use ourselves." },
        ].map(item => (
          <div key={item.title} className="p-6 rounded-2xl border border-border bg-card">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-4">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to find your stack?</h2>
        <p className="text-muted-foreground mb-6">It takes less than 2 minutes to get a personalized recommendation.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/builder">
            <Button className="rounded-full px-6">Build your stack <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="rounded-full px-6">Get in touch</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}