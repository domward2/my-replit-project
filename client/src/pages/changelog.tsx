import { Link } from 'wouter';
import { ArrowLeft, Calendar, Star, Bug, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const releases = [
  {
    version: '2.1.0',
    date: '2025-01-13',
    type: 'major',
    changes: [
      { type: 'feature', text: 'GDPR-compliant Google Analytics 4 integration with Spanish compliance' },
      { type: 'feature', text: 'Cookie consent management with persistent user preferences' },
      { type: 'feature', text: 'Enhanced user event tracking for login, signup, and exchange connections' },
      { type: 'improvement', text: 'Fixed logout redirect flow to properly route to homepage' },
      { type: 'improvement', text: 'Comprehensive authentication system with proper API validation' },
    ]
  },
  {
    version: '2.0.0',
    date: '2025-01-12',
    type: 'major',
    changes: [
      { type: 'feature', text: 'Dual header layout system with marketing and dashboard modes' },
      { type: 'feature', text: 'Professional Coinbase-style navigation and design' },
      { type: 'feature', text: 'Complete company pages suite (About, Mission, Privacy, Terms)' },
      { type: 'feature', text: 'OAuth integration for Coinbase (pending approval)' },
      { type: 'feature', text: 'Streamlined Kraken API integration with guided setup' },
    ]
  },
  {
    version: '1.5.0',
    date: '2025-01-10',
    type: 'minor',
    changes: [
      { type: 'improvement', text: 'Platform rebranding from SentimentTrader to PnL AI' },
      { type: 'improvement', text: 'Updated logo, colors, and messaging throughout application' },
      { type: 'bug', text: 'Fixed authentication persistence issues on deployment' },
    ]
  }
];

const getIcon = (type: string) => {
  switch (type) {
    case 'feature': return <Star className="w-4 h-4 text-green-400" />;
    case 'improvement': return <Zap className="w-4 h-4 text-blue-400" />;
    case 'bug': return <Bug className="w-4 h-4 text-orange-400" />;
    default: return <Calendar className="w-4 h-4 text-gray-400" />;
  }
};

export default function Changelog() {
  return (
    <div className="min-h-screen bg-gray-900 text-white" data-testid="page-changelog">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Changelog</h1>
            <p className="text-gray-400">Track our latest updates and improvements</p>
          </div>
        </div>

        <div className="space-y-8">
          {releases.map((release) => (
            <div 
              key={release.version} 
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              data-testid={`release-${release.version}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">v{release.version}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    release.type === 'major' ? 'bg-green-900 text-green-300' :
                    release.type === 'minor' ? 'bg-blue-900 text-blue-300' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {release.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  {release.date}
                </div>
              </div>
              
              <ul className="space-y-2">
                {release.changes.map((change, index) => (
                  <li key={index} className="flex items-start gap-3">
                    {getIcon(change.type)}
                    <span className="text-gray-300">{change.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-400">
          <p>For technical support or feature requests, contact us at{' '}
            <a href="mailto:support@pnl-ai.com" className="text-blue-400 hover:underline">
              support@pnl-ai.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}