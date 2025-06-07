
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, Users, Zap, Heart, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const QRWelcome = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('qr_leads')
        .insert({
          email,
          is_founding_member: true,
          source: 'qr_scan',
          user_agent: navigator.userAgent
        });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("Welcome to the ViaFix founding community! 🎉");
    } catch (error) {
      console.error('Error submitting email:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExploreNow = () => {
    window.location.href = '/mechanics';
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center">
          <CardContent className="pt-8 pb-8">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              You're In! 🚀
            </h2>
            <p className="text-gray-600 mb-6">
              Welcome to the ViaFix founding community! You'll be the first to know about:
            </p>
            <div className="space-y-2 text-left mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Exclusive early access features</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Founding member pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Behind-the-scenes founder updates</span>
              </div>
            </div>
            <Button onClick={handleExploreNow} className="w-full">
              Explore Mechanics Now <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="pt-12 pb-8 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 text-white p-4 rounded-full">
              <Zap className="h-8 w-8" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to ViaFix! 
          </h1>
          
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-5 w-5 text-yellow-700" />
              <span className="font-semibold text-yellow-800">You're Early!</span>
            </div>
            <p className="text-sm text-yellow-700">
              You're among our first users. Help us build the future of mobile mechanics!
            </p>
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">
            We're a startup on a mission to revolutionize how you find trusted mechanics. 
            As a founding community member, you'll get exclusive access to features and pricing 
            while helping shape our platform.
          </p>
        </div>
      </div>

      {/* Email Capture Card */}
      <div className="px-4 pb-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Join Our Founding Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !email}
              >
                {isSubmitting ? 'Joining...' : 'Become a Founding Member'}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <p className="text-xs text-gray-500 text-center font-medium">
                Founding members get:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Early access to new features</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Exclusive founding member pricing</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Direct line to our founder team</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Beta testing opportunities</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Browse Option */}
      <div className="px-4 pb-12">
        <div className="max-w-md mx-auto text-center">
          <p className="text-sm text-gray-500 mb-3">
            Or explore now without joining (you can always join later!)
          </p>
          <Button 
            variant="outline" 
            onClick={handleExploreNow}
            className="w-full"
          >
            Browse Mechanics
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRWelcome;
