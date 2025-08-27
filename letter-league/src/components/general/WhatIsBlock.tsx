import React from 'react';
import { Users, Globe, Zap } from 'lucide-react';

export default function GameDescription() {
  return (
    <div className="">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Challenge Your Mind, Connect with Others
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
          Test your vocabulary skills in our fast-paced word guessing game. Play solo to sharpen your mind, 
          or compete with friends and players worldwide in real-time multiplayer matches.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Instant Play</h3>
          <p className="text-gray-600 text-sm">
            No registration required. Jump in and start playing immediately as a guest.
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Multiplayer Fun</h3>
          <p className="text-gray-600 text-sm">
            Challenge friends or match with players online for competitive word battles.
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Globe className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Multi-Language</h3>
          <p className="text-gray-600 text-sm">
            Play in your preferred language with extensive word databases.
          </p>
        </div>
      </div>
    </div>
  );
}