
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import EmailField from '@/components/auth/EmailField';
import PasswordField from '@/components/auth/PasswordField';
import { useCustomerSignin } from '@/hooks/useCustomerSignin';

const CustomerSigninForm = () => {
  const navigate = useNavigate();
  const { form, onSubmit, redirectAction } = useCustomerSignin();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <EmailField form={form} />
        <PasswordField form={form} />

        <Button 
          type="submit" 
          className="w-full bg-[#6E59A5] hover:bg-[#7E69AB] text-white py-2 font-medium"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
        
        {redirectAction && (
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
            <p className="font-medium">Sign in required</p>
            <p>You need to sign in as a customer to {redirectAction === 'book' ? 'book services' : 'chat with mechanics'}.</p>
          </div>
        )}
        
        <div className="text-center text-sm pt-2">
          Don't have an account?{" "}
          <button 
            type="button" 
            className="text-[#6E59A5] hover:text-[#7E69AB] hover:underline font-medium transition-colors"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </button>
        </div>
      </form>
    </Form>
  );
};

export default CustomerSigninForm;
