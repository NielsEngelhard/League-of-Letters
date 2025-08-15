import React from 'react';
import { Shield, Eye, Lock, Users, Database, Mail, Calendar, AlertCircle } from 'lucide-react';

export default function PrivacyPolicy() {
  const lastUpdated = "January 15, 2025";
  
  const Section = ({ icon: Icon, title, children }: { 
    icon: React.ElementType; 
    title: string; 
    children: React.ReactNode; 
  }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      </div>
      <div className="pl-8 space-y-3 text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Privacy Policy
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Last updated: {lastUpdated}
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                We are committed to protecting your privacy and ensuring transparency about how we collect, use, and protect your information while you enjoy our multiplayer Wordle game.
              </p>
            </div>
          </div>

          {/* Information We Collect */}
          <Section icon={Database} title="Information We Collect">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Account Information</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Username and account creation date</li>
                  <li>Account type (registered user or guest)</li>
                  <li>Email address (for registered accounts only)</li>
                  <li>Password (encrypted and never stored in plain text)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Game Data</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Game statistics (games played, best scores, favorite words)</li>
                  <li>Game preferences and settings</li>
                  <li>Gameplay history and performance metrics</li>
                  <li>Multiplayer game interactions and communications</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Technical Information</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Device type, browser information, and operating system</li>
                  <li>IP address and general location information</li>
                  <li>Session data and usage analytics</li>
                  <li>Error logs and performance data</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* How We Use Your Information */}
          <Section icon={Eye} title="How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Provide and maintain our multiplayer Wordle gaming service</li>
              <li>Create and manage your user account</li>
              <li>Track your game progress and statistics</li>
              <li>Enable multiplayer features and matchmaking</li>
              <li>Customize your gaming experience based on your preferences</li>
              <li>Improve our game features and user interface</li>
              <li>Provide customer support and respond to your inquiries</li>
              <li>Ensure fair play and prevent cheating or abuse</li>
              <li>Analyze usage patterns to enhance game performance</li>
            </ul>
          </Section>

          {/* Data Protection */}
          <Section icon={Lock} title="Data Protection & Security">
            <p>We implement industry-standard security measures to protect your data:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>All passwords are encrypted using secure hashing algorithms</li>
              <li>Data transmission is protected using SSL/TLS encryption</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls limiting who can view your personal information</li>
              <li>Secure data storage with regular backups and disaster recovery plans</li>
              <li>Monitoring systems to detect and prevent unauthorized access</li>
            </ul>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mt-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  <strong>Guest Accounts:</strong> Data for guest accounts is stored locally on your device and may be lost if you clear your browser data.
                </p>
              </div>
            </div>
          </Section>

          {/* Multiplayer & Social Features */}
          <Section icon={Users} title="Multiplayer & Social Features">
            <p>When participating in multiplayer games:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Your username may be visible to other players in the same game</li>
              <li>Game interactions and chat messages may be temporarily stored</li>
              <li>Performance statistics may be shared with other players in competitive modes</li>
              <li>We may display leaderboards and achievement information publicly</li>
            </ul>
            
            <p className="mt-3">
              You can control your visibility and participation in social features through your account settings.
            </p>
          </Section>

          {/* Data Sharing */}
          <Section icon={Users} title="Data Sharing & Third Parties">
            <p>We do not sell, trade, or rent your personal information. We may share data only in these limited circumstances:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations or valid legal requests</li>
              <li>To protect our rights, property, or safety, or that of our users</li>
              <li>With service providers who help us operate our platform (under strict confidentiality agreements)</li>
              <li>In connection with a business transfer or acquisition</li>
            </ul>
          </Section>

          {/* Your Rights */}
          <Section icon={Shield} title="Your Rights & Choices">
            <p>You have the following rights regarding your personal information:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Update or correct inaccurate personal information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
              <li><strong>Portability:</strong> Export your game data and statistics</li>
              <li><strong>Opt-out:</strong> Disable certain features or data collection practices</li>
            </ul>
            
            <p className="mt-3">
              To exercise these rights, visit your account settings or contact us using the information provided below.
            </p>
          </Section>

          {/* Data Retention */}
          <Section icon={Calendar} title="Data Retention">
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Account data is retained as long as your account remains active</li>
              <li>Game statistics and history are preserved to maintain your progress</li>
              <li>Inactive accounts may be deleted after 2 years of inactivity</li>
              <li>Guest account data is stored locally and controlled by your browser settings</li>
              <li>Technical logs are typically retained for 90 days for security purposes</li>
              <li>You can request immediate deletion of your data at any time</li>
            </ul>
          </Section>

          {/* Cookies & Tracking */}
          <Section icon={Eye} title="Cookies & Local Storage">
            <p>We use cookies and local storage to:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Remember your login status and preferences</li>
              <li>Store game settings and progress</li>
              <li>Analyze usage patterns and improve our service</li>
              <li>Ensure proper functionality of interactive features</li>
            </ul>
            
            <p className="mt-3">
              You can control cookie settings through your browser preferences, though this may affect some game functionality.
            </p>
          </Section>

          {/* Children's Privacy */}
          <Section icon={Shield} title="Children's Privacy">
            <p>
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.
            </p>
            
            <p className="mt-3">
              If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
          </Section>

          {/* Changes to Policy */}
          <Section icon={AlertCircle} title="Changes to This Privacy Policy">
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify users of any material changes by:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm mt-2">
              <li>Posting the updated policy on our website</li>
              <li>Updating the "Last Updated" date at the top of this policy</li>
              <li>Sending email notifications for significant changes (to registered users)</li>
              <li>Displaying in-app notifications when you next log in</li>
            </ul>
          </Section>

          {/* Contact Information */}
          <Section icon={Mail} title="Contact Us">
            <p>If you have any questions about this Privacy Policy or our privacy practices, please contact us:</p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm">privacy@wordlegame.com</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We will respond to privacy-related inquiries within 30 days.
              </p>
            </div>
          </Section>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This privacy policy is effective as of {lastUpdated} and applies to all users of our multiplayer Wordle game.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}