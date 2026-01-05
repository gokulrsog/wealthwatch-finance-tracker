import React from 'react';
import { TrendingUp, Shield, BarChart3, Target, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = React.memo<HeroSectionProps>(({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-accent-50/30">
      {/* Hero Header */}
      <div className="container mx-auto px-4 pt-16 pb-24">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-accent-600 to-accent-500 rounded-3xl flex items-center justify-center shadow-glow">
              <TrendingUp className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 tracking-tight">
            <span className="gradient-text">WealthWatch</span>
            <br />
            <span className="text-neutral-700">Financial Intelligence</span>
          </h1>
          
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Transform your financial future with enterprise-grade analytics, intelligent insights, 
            and personalized wealth management tools trusted by financial professionals worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="group px-8 py-4 text-lg"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="secondary"
              size="lg"
              className="px-8 py-4 text-lg"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-neutral-500">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-success-500" />
              <span>Bank-level Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-accent-500" />
              <span>Real-time Analytics</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-warning-500" />
              <span>Goal Tracking</span>
            </div>
          </div>
        </div>
        
        {/* Features Grid */}
        <div id="features" className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-8 animate-slide-up" hover gradient>
            <div className="w-16 h-16 bg-gradient-to-r from-accent-100 to-accent-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="h-8 w-8 text-accent-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Advanced Analytics</h3>
            <p className="text-neutral-600 leading-relaxed">
              Comprehensive financial insights with predictive analytics, cash flow projections, 
              and intelligent spending pattern recognition.
            </p>
          </Card>
          
          <Card className="text-center p-8 animate-slide-up" hover gradient style={{ animationDelay: '0.1s' }}>
            <div className="w-16 h-16 bg-gradient-to-r from-success-100 to-success-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-success-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Financial Health Score</h3>
            <p className="text-neutral-600 leading-relaxed">
              Real-time assessment of your financial wellness with personalized recommendations 
              and actionable insights for improvement.
            </p>
          </Card>
          
          <Card className="text-center p-8 animate-slide-up" hover gradient style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-gradient-to-r from-warning-100 to-warning-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target className="h-8 w-8 text-warning-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Smart Goal Planning</h3>
            <p className="text-neutral-600 leading-relaxed">
              Set, track, and achieve your financial goals with AI-powered recommendations 
              and milestone-based progress tracking.
            </p>
          </Card>
        </div>
        
        {/* Company Trust Section */}
        <div className="text-center animate-fade-in">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
            Trusted by Financial Professionals
          </h2>
          <p className="text-neutral-600 mb-8 max-w-2xl mx-auto">
            WealthWatch combines institutional-grade financial analysis with user-friendly design, 
            delivering the sophisticated tools you need to make informed financial decisions and 
            build lasting wealth.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            <div className="h-12 w-24 bg-neutral-200 rounded-lg flex items-center justify-center">
              <span className="text-sm font-medium text-neutral-500">FinTech</span>
            </div>
            <div className="h-12 w-24 bg-neutral-200 rounded-lg flex items-center justify-center">
              <span className="text-sm font-medium text-neutral-500">Secure</span>
            </div>
            <div className="h-12 w-24 bg-neutral-200 rounded-lg flex items-center justify-center">
              <span className="text-sm font-medium text-neutral-500">Analytics</span>
            </div>
            <div className="h-12 w-24 bg-neutral-200 rounded-lg flex items-center justify-center">
              <span className="text-sm font-medium text-neutral-500">AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

HeroSection.displayName = 'HeroSection';