
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';

const Debug = () => {
  const [authInfo, setAuthInfo] = useState<any>({});
  const [localStorageData, setLocalStorageData] = useState<Record<string, string>>({});
  const [supabaseStatus, setSupabaseStatus] = useState<string>("Checking...");

  useEffect(() => {
    // Collect auth data
    const collectAuthData = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        setAuthInfo({
          hasSession: !!data.session,
          error: error?.message || null,
          user: data.session?.user ? {
            id: data.session.user.id,
            email: data.session.user.email,
            metadata: data.session.user.user_metadata
          } : null
        });
      } catch (e) {
        setAuthInfo({ error: `Error checking auth: ${e}` });
      }
    };
    
    // Check Supabase connection
    const checkSupabase = async () => {
      try {
        const start = Date.now();
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        const end = Date.now();
        
        if (error) {
          setSupabaseStatus(`Error: ${error.message}`);
        } else {
          setSupabaseStatus(`Connected (response time: ${end-start}ms)`);
        }
      } catch (e) {
        setSupabaseStatus(`Connection error: ${e}`);
      }
    };
    
    // Collect localStorage data
    const collectLocalStorage = () => {
      const data: Record<string, string> = {};
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key) || '';
          data[key] = value.length > 100 ? `${value.substring(0, 100)}...` : value;
        }
      }
      
      setLocalStorageData(data);
    };
    
    collectAuthData();
    checkSupabase();
    collectLocalStorage();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Debug Information</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Authentication Status</h2>
          <div className="bg-gray-50 p-4 rounded-md">
            <pre className="whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(authInfo, null, 2)}
            </pre>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Supabase Connection</h2>
          <div className={`p-4 rounded-md ${
            supabaseStatus.includes('Error') ? 'bg-red-50' : 'bg-green-50'
          }`}>
            <p>{supabaseStatus}</p>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">LocalStorage Data</h2>
          <div className="bg-gray-50 p-4 rounded-md">
            <pre className="whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(localStorageData, null, 2)}
            </pre>
          </div>
        </div>
        
        <div className="mt-6">
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Debug;
