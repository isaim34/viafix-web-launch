
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/Layout';

const Terms = () => {
  return (
    <Layout>
      <Helmet>
        <title>Terms of Service | ViaFix</title>
        <meta name="description" content="ViaFix Terms of Service and guidelines for using our platform" />
      </Helmet>
      
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-primary">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none bg-white rounded-lg shadow-sm p-6 md:p-8">
          <p className="mb-4 text-lg">Welcome to ViaFix.</p>
          
          <p className="mb-6 text-gray-700">
            The following terms of service (these "Terms of Service"), govern your access to and use of the ViaFix website and mobile application, 
            including any content, functionality and services offered on or through www.tryviafix.com or the ViaFix mobile application (the "Site") by ViaFix. 
            ViaFix is referenced herein as "we" or "us". "You" or "user" means you as a user of the Site.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-md mb-6 border-l-4 border-primary">
            <p className="text-gray-700">
              ViaFix is an online platform that provides access to services by freelance mobile mechanics who post their services on the platform.
            </p>
          </div>
          
          <p className="mb-6 text-gray-700">
            Please read the Terms of Service carefully before you start to use the Site. By using the Site, opening an account or by clicking to accept or agree to the 
            Terms of Service when this option is made available to you, you accept and agree, on behalf of yourself or on behalf of your employer or any other entity 
            (if applicable), to be bound and abide by these Terms of Service. You further acknowledge that you have read and understood our Privacy Policy. 
            If you do not want to agree to these Terms of Service or the Privacy Policy, you must not access or use the Site. For more detailed policies surrounding 
            the activity and usage on the Site, please access the designated articles herein.
          </p>
          
          <p className="mb-8 text-gray-700">
            This Site is offered and available to users who are at least 18 years of age and of legal age to form a binding contract. The Service is not available 
            to anyone under 18 years of age, and you represent that you are at least 18 years old.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-primary">Key Terms</h2>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-md shadow-sm">
              <h3 className="font-semibold mb-2">Clients</h3>
              <p className="text-gray-700">Users who purchase services on ViaFix.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md shadow-sm">
              <h3 className="font-semibold mb-2">Services</h3>
              <p className="text-gray-700">Services offered by users registered on the site as Vendors through Gigs.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md shadow-sm">
              <h3 className="font-semibold mb-2">Vendors</h3>
              <p className="text-gray-700">Users who offer and perform services through Services listed on ViaFix.</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-primary">Role of ViaFix</h2>
          
          <div className="bg-gray-50 p-5 rounded-lg mb-8">
            <p className="text-gray-700">
              Client and Vendor understand and agree that ViaFix is not involved in or responsible for any work performed by Vendor(s), 
              is not involved in or responsible for any payment made under a contract for services and has no control over any Vendor or Client. 
              ViaFix does not guarantee that Client or Vendor will perform on the contract agreed between the two. ViaFix does not have any power 
              or authority to, and does not, determine any eligibility standards for any contract, does not select or contract any Vendor to provide 
              services to Client, determine or control any term or condition of the contract, or cause any Vendor to accept any contract or perform any services. 
              The Parties agree that Client will select the freelancer, that the scope of work will be set exclusively by agreement between Client and Vendor, 
              and that Client and Vendor will take up any issues with the work and/or its scope between each other.
            </p>
          </div>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-primary">Client Acknowledgements</h2>
          
          <div className="bg-gray-50 p-5 rounded-lg mb-8">
            <p className="text-gray-700">
              Other than as stated in these Terms, Client expressly acknowledges, agrees, and understands that: (i) except for the agent of services through 
              offering an online platform, ViaFix is not a party to the dealings between Client and Vendor, including the substantive terms of the agreement, 
              the selection of a Vendor, the decision to contract with a Vendor, and the performance or receipt of Services; (ii) ViaFix does not, in any way, 
              supervise, direct, or control the Vendor or Services; (iii) ViaFix makes no representations as to the quality, security, or legality of any Services, 
              and ViaFix disclaims any and all liability relating thereto; (iv) ViaFix does not set Vendor's work hours, work schedules, or location of work; 
              (vi) ViaFix will not provide Vendor with training or any equipment, tools, labor, or materials needed to complete their work; (vii) ViaFix does not 
              provide the premises at which the Vendor will perform the work; (viii) if there is a dispute between Client and Vendor, that dispute is solely between 
              Client and the Vendor and ViaFix will not be responsible or liable with respect to such dispute; (ix) neither ViaFix nor its Affiliates is an employer 
              of or joint employer or integrated or single enterprise with any Vendor or Client; and (x) unless otherwise agreed as part of the relevant contract, 
              Vendors may hire employees or engage contractors or subcontractors (at his or her sole expense) to assist with providing the Services. ViaFix makes no 
              representations about and does not guarantee the truth or accuracy of Vendor's listings on the Site; the ability of Vendors to deliver the Services; 
              or that Client or Vendor can or will actually complete a transaction.
            </p>
          </div>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-primary">Vendor Acknowledgements</h2>
          
          <div className="bg-gray-50 p-5 rounded-lg mb-8">
            <p className="text-gray-700">
              Other than as stated in these Terms, Vendor expressly acknowledges, agrees, and understands that: (i) except for the agent of record services through 
              providing the online platform, ViaFix is not a party to the dealings between Client and Vendor, including the substantive terms of the agreements, 
              the selection of a Vendor, the decision to contract with a Vendor, and the performance or receipt of Services; (ii) ViaFix does not, in any way, 
              supervise, direct, or control the Vendor or Vendor Services; (iii) ViaFix makes no representations as to the quality, security, or legality of any Services, 
              and ViaFix disclaims any and all liability relating thereto; (iv) ViaFix does not set Vendor's work hours, work schedules, or location of work; 
              (vi) ViaFix will not provide Vendor with training or any equipment, tools, labor, or materials needed to complete their work; (vii) ViaFix does not 
              provide the premises at which the Vendor will perform the work; (viii) if there is a dispute between Client and Vendor, that dispute is solely between 
              Client and the Vendor and ViaFix will not be responsible or liable with respect to such dispute; (ix) neither ViaFix nor its Affiliates is an employer 
              of or joint employer or integrated or single enterprise with any Vendor or Client; and (x) unless otherwise agreed as part of the relevant contract, 
              independent contractor Vendor(s) may hire employees or engage contractors or subcontractors (at his or her sole expense) to assist with providing the Services. 
              ViaFix makes no representations about and does not guarantee the truth or accuracy of Client's listings on the Site; the ability of Clients to pay for 
              the Services; or that Client or Vendor can or will actually complete a transaction.
            </p>
          </div>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-primary">General Terms</h2>
          
          <ul className="list-disc pl-6 mb-8 space-y-2 bg-gray-50 p-5 rounded-lg">
            <li className="mb-2">
              Orders and/or users may be removed by ViaFix from the Site for violations of these Terms of Service and/or our Community Standards, 
              which may include (but are not limited to) the following violations and/or materials:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Illegal or Fraudulent services</li>
                <li>Adult oriented services, Pornographic, Inappropriate/Obscene</li>
                <li>Spam, nonsense, or violent or deceptive Orders</li>
                <li>Orders misleading to Buyers or others</li>
                <li>Reselling of regulated goods</li>
                <li>Low quality services or deliveries</li>
                <li>Promoting ViaFix or ViaFix Orders through activities that are prohibited by any laws, regulations, and/or third parties' terms of service, 
                as well as through any marketing activity that negatively affects our relationships with our users or partners.</li>
              </ul>
            </li>
            <li>Orders that are removed for violations mentioned above, may result in the suspension of the Vendor's account.</li>
            <li>Orders that are removed for violations are not eligible to be restored or edited.</li>
            <li>Orders may be removed from our listings due to poor performance and/or user misconduct.</li>
            <li>Orders may include pre-approved website URLs contained within the Order description and requirements box. 
            Orders containing websites promoting content, which violates Our Terms of Service will be removed.</li>
            <li>Orders are required to have an appropriate Order image related to the service offered. 
            Recurring deliveries that don't match the quality indicated may lead to the Seller's account losing Vendor status or becoming permanently disabled.</li>
            <li>Statements on the Order page that undermine or circumvent these Terms of Service are prohibited.</li>
            <li>ViaFix reserves the right to put any account on hold or permanently disable accounts due to breach of these Terms of Service, 
            including low quality services or deliveries, or due to any illegal or inappropriate use of the Site or services.</li>
            <li>Violation of the Terms of Service may get your account disabled permanently.</li>
            <li>Users with disabled accounts will not be able to sell or buy on ViaFix.</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-primary">Non-Permitted Usage</h2>
          
          <ul className="list-disc pl-6 mb-8 space-y-3 bg-gray-50 p-5 rounded-lg">
            <li className="mb-2">
              <span className="font-semibold">Adult Services & Pornography</span> - ViaFix does not allow any exchange of adult oriented or pornographic materials and services.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Inappropriate Behavior & Language</span> - Communication on ViaFix should be friendly, constructive, and professional. 
              ViaFix condemns bullying, harassment, and hate speech towards others.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Phishing and Spam</span> - Members' security is a top priority. Any attempts to publish or send malicious content with the intent to 
              compromise another member's account or computer environment is strictly prohibited. Please respect our members' privacy by not contacting them 
              with offers, questions, suggestions, or anything which is not directly related to their services or orders.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Privacy & Identity</span> - You may not publish or post other people's private and confidential information. 
              Any exchange of personal information required for the completion of a service must be provided directly. Vendors further confirm that 
              whatever information they receive from the Client, which is not public domain, shall not be used for any purpose whatsoever other than 
              for the delivery of the work to the Client. Any users who engage and communicate off of ViaFix will not be protected by our Terms of Service.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Authentic ViaFix Profile</span> - You may not create a false identity on ViaFix, misrepresent your identity, 
              create a ViaFix profile for anyone other than yourself (a real person), or use or attempt to use another user's account or information; 
              Your profile information, including your description, skills, location, etc., must be accurate and complete and may not be misleading, 
              illegal, offensive, or otherwise harmful.
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
