import { useNavigate } from 'react-router-dom'
import Navbar from '../Components/shared/Navbar'
import '../styles/Pricing.css'

const PLANS = [
    {
        name: 'Free',
        price: 'R0',
        period: 'forever',
        description: 'Get started and try the platform.',
        features: [
            '2 AI-powered interview sessions',
            'Voice recording + transcription',
            'Basic feedback and scoring',
            'Session history',
        ],
        cta: 'Current plan',
        disabled: true,
        highlight: false,
    },
    {
        name: 'Pro',
        price: 'R200',
        period: 'per month',
        description: 'For serious job seekers who practice regularly.',
        features: [
            'Unlimited interview sessions',
            'Advanced AI feedback',
            'STAR method analysis',
            'Filler word detection',
            'Full session history',
            'Priority support',
        ],
        cta: 'Coming soon',
        disabled: true,
        highlight: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: 'contact us',
        description: 'For teams, bootcamps, and universities.',
        features: [
            'Everything in Pro',
            'Team management dashboard',
            'Custom question banks',
            'Analytics and reporting',
            'Dedicated support',
            'SLA guarantee',
        ],
        cta: 'Contact us',
        disabled: true,
        highlight: false,
    },
]

export default function Pricing() {
    const navigate = useNavigate()

    return (
        <div className="pricing-page">
            <Navbar />
            <div className="pricing-mesh" aria-hidden />

            <div className="pricing-body">
                <div className="pricing-construction">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span>Payments are under construction — plans shown are for preview only</span>
                </div>

                <div className="pricing-header">
                    <h1>Simple, transparent pricing</h1>
                    <p>Start free. Upgrade when you need more sessions.</p>
                </div>

                <div className="pricing-grid">
                    {PLANS.map(plan => (
                        <div key={plan.name} className={`pricing-card${plan.highlight ? ' pricing-card--highlight' : ''}`}>
                            {plan.highlight && <div className="pricing-card__popular">Most Popular</div>}

                            <div className="pricing-card__header">
                                <h2>{plan.name}</h2>
                                <div className="pricing-card__price">
                                    <span className="pricing-card__amount">{plan.price}</span>
                                    <span className="pricing-card__period">{plan.period}</span>
                                </div>
                                <p className="pricing-card__desc">{plan.description}</p>
                            </div>

                            <ul className="pricing-card__features">
                                {plan.features.map(f => (
                                    <li key={f}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`pricing-card__cta${plan.highlight ? ' pricing-card__cta--primary' : ''}`}
                                disabled={plan.disabled}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="pricing-byok">
                    <h3>Have your own API key?</h3>
                    <p>
                        Add your own Gemini, OpenAI, or Anthropic key in API Providers and get unlimited sessions
                        using your personal quota — no subscription needed.
                    </p>
                    <button className="pricing-byok__btn" onClick={() => navigate('/api-providers')}>
                        Add API Key
                    </button>
                </div>
            </div>
        </div>
    )
}
