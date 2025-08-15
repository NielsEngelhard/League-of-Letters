import React from 'react';
import { FileText, User, Shield, Gamepad2, Users, AlertTriangle, Scale, Ban, RefreshCw, Mail } from 'lucide-react';

export default function TermsOfService() {
  const lastUpdated = "January 15, 2025";
  const effectiveDate = "January 15, 2025";
  
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
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Terms of Service
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Last updated: {lastUpdated} | Effective: {effectiveDate}
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                By accessing or using our multiplayer Wordle game, you agree to be bound by these Terms of Service. 
                Please read them carefully before using our service.
              </p>
            </div>
          </div>

          {/* Agreement to Terms */}
          <Section icon={Scale} title="Agreement to Terms">
            <p>
              By creating an account, accessing, or using our multiplayer Wordle game ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use our Service.
            </p>
            <p>
              These Terms constitute a legally binding agreement between you and us. Your use of the Service confirms your acceptance of these Terms and our Privacy Policy.
            </p>
          </Section>

          {/* Service Description */}
          <Section icon={Gamepad2} title="Description of Service">
            <p>Our Service provides:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>A multiplayer word-guessing game based on Wordle mechanics</li>
              <li>Single-player and multiplayer game modes</li>
              <li>User accounts with statistics tracking and customizable settings</li>
              <li>Social features including leaderboards and competitive gameplay</li>
              <li>Guest accounts for temporary play without registration</li>
              <li>Various themes and accessibility options</li>
            </ul>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mt-4">
              <p className="text-sm">
                <strong>Service Availability:</strong> We strive to provide continuous service but cannot guarantee 100% uptime. 
                Maintenance, updates, or technical issues may temporarily interrupt service.
              </p>
            </div>
          </Section>

          {/* User Accounts */}
          <Section icon={User} title="User Accounts & Registration">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Account Types</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Guest Accounts:</strong> Temporary accounts with local data storage</li>
                  <li><strong>Registered Accounts:</strong> Permanent accounts with cloud data synchronization</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Account Responsibilities</h3>
                <p className="text-sm mb-2">When creating an account, you agree to:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Choose an appropriate username (no offensive or misleading names)</li>
                  <li>Notify us immediately of any unauthorized account access</li>
                  <li>Take responsibility for all activities under your account</li>
                  <li>Not share your account with others</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Age Requirements</h3>
                <p className="text-sm">
                  You must be at least 13 years old to create an account. Users under 18 must have parental consent to use our Service.
                </p>
              </div>
            </div>
          </Section>

          {/* Acceptable Use */}
          <Section icon={Shield} title="Acceptable Use Policy">
            <p>While using our Service, you agree NOT to:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Use offensive, discriminatory, or inappropriate language</li>
              <li>Harass, bully, or abuse other players</li>
              <li>Cheat, exploit bugs, or use unauthorized third-party software</li>
              <li>Create multiple accounts to gain unfair advantages</li>
              <li>Share or distribute inappropriate content</li>
              <li>Attempt to hack, disrupt, or damage our systems</li>
              <li>Impersonate other users or provide false information</li>
              <li>Use automated bots or scripts to play games</li>
              <li>Engage in any activity that violates applicable laws</li>
              <li>Reverse engineer or attempt to extract our source code</li>
            </ul>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mt-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  <strong>Fair Play:</strong> We use automated systems to detect cheating and unusual gameplay patterns. 
                  Suspicious activity may result in account restrictions or permanent bans.
                </p>
              </div>
            </div>
          </Section>

          {/* Multiplayer Conduct */}
          <Section icon={Users} title="Multiplayer & Community Guidelines">
            <p>In multiplayer games and community interactions:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Treat all players with respect and courtesy</li>
              <li>Use appropriate language suitable for all ages</li>
              <li>Do not share personal information with other players</li>
              <li>Report inappropriate behavior or cheating to moderators</li>
              <li>Follow good sportsmanship practices</li>
              <li>Do not spam or flood chat with repetitive messages</li>
            </ul>
            
            <p className="mt-3 text-sm">
              <strong>Moderation:</strong> We reserve the right to monitor, moderate, and take action on user-generated content and behavior. 
              This includes temporary restrictions, warnings, or permanent account suspension.
            </p>
          </Section>

          {/* Intellectual Property */}
          <Section icon={FileText} title="Intellectual Property Rights">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Our Rights</h3>
                <p className="text-sm">
                  All content, features, functionality, and intellectual property rights in our Service are owned by us, 
                  our licensors, or other providers. This includes but is not limited to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                  <li>Game mechanics, algorithms, and scoring systems</li>
                  <li>User interface design, graphics, and visual elements</li>
                  <li>Software code, databases, and technical infrastructure</li>
                  <li>Trademarks, logos, and branding materials</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Your Content</h3>
                <p className="text-sm">
                  You retain ownership of any content you create (usernames, game statistics, etc.). 
                  By using our Service, you grant us a non-exclusive, royalty-free license to use, 
                  display, and store your content as necessary to provide the Service.
                </p>
              </div>
            </div>
          </Section>

          {/* Privacy & Data */}
          <Section icon={Shield} title="Privacy & Data Protection">
            <p>
              Your privacy is important to us. Our collection, use, and protection of your personal information 
              is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
            <p className="mt-3">
              By using our Service, you acknowledge that you have read and understood our Privacy Policy 
              and consent to the collection and use of your information as described therein.
            </p>
          </Section>

          {/* Account Termination */}
          <Section icon={Ban} title="Account Termination">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Termination by You</h3>
                <p className="text-sm">
                  You may delete your account at any time through your account settings. 
                  Upon deletion, your personal data will be removed according to our Privacy Policy.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Termination by Us</h3>
                <p className="text-sm">We may suspend or terminate your account if you:</p>
                <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                  <li>Violate these Terms of Service</li>
                  <li>Engage in prohibited activities or misconduct</li>
                  <li>Use our Service in ways that could harm other users or our systems</li>
                  <li>Fail to respond to inquiries about suspicious account activity</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Effect of Termination</h3>
                <p className="text-sm">
                  Upon termination, your access to the Service will cease immediately. 
                  We may retain certain information as required by law or for legitimate business purposes.
                </p>
              </div>
            </div>
          </Section>

          {/* Disclaimers */}
          <Section icon={AlertTriangle} title="Disclaimers & Limitation of Liability">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Service Disclaimers</h3>
                <p className="text-sm">
                  Our Service is provided "as is" and "as available" without warranties of any kind. 
                  We do not guarantee that the Service will be error-free, secure, or continuously available.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Limitation of Liability</h3>
                <p className="text-sm">
                  To the maximum extent permitted by law, we shall not be liable for any indirect, 
                  incidental, special, consequential, or punitive damages arising from your use of the Service.
                </p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3">
                <p className="text-red-800 dark:text-red-200 text-sm">
                  <strong>Important:</strong> Some jurisdictions do not allow limitation of liability. 
                  In such cases, our liability is limited to the maximum extent permitted by law.
                </p>
              </div>
            </div>
          </Section>

          {/* Changes to Terms */}
          <Section icon={RefreshCw} title="Changes to Terms">
            <p>
              We may update these Terms from time to time to reflect changes in our Service or legal requirements. 
              We will notify users of material changes by:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm mt-2">
              <li>Posting the updated Terms on our website</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending email notifications for significant changes</li>
              <li>Displaying in-app notifications</li>
            </ul>
            
            <p className="mt-3 text-sm">
              Continued use of the Service after changes become effective constitutes acceptance of the new Terms.
            </p>
          </Section>

          {/* Governing Law */}
          <Section icon={Scale} title="Governing Law & Disputes">
            <p className="text-sm">
              These Terms are governed by and construed in accordance with applicable laws. 
              Any disputes arising from these Terms or your use of the Service will be resolved through 
              binding arbitration or in courts of competent jurisdiction.
            </p>
            
            <p className="mt-3 text-sm">
              <strong>Class Action Waiver:</strong> You agree to resolve disputes individually and waive the right 
              to participate in class actions or collective proceedings.
            </p>
          </Section>

          {/* Contact Information */}
          <Section icon={Mail} title="Contact Information">
            <p>If you have questions about these Terms of Service, please contact us:</p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm">legal@wordlegame.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm">support@wordlegame.com</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We will respond to legal and terms-related inquiries within 7 business days.
              </p>
            </div>
          </Section>

          {/* Miscellaneous */}
          <Section icon={FileText} title="Miscellaneous">
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Severability:</strong> If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force.</li>
              <li><strong>Entire Agreement:</strong> These Terms and our Privacy Policy constitute the entire agreement between you and us.</li>
              <li><strong>No Waiver:</strong> Our failure to enforce any provision does not constitute a waiver of that provision.</li>
              <li><strong>Assignment:</strong> You may not assign your rights under these Terms. We may assign our rights without restriction.</li>
            </ul>
          </Section>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              These Terms of Service are effective as of {effectiveDate} and apply to all users of our multiplayer Wordle game.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Thank you for playing our game responsibly and helping us maintain a positive community!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}