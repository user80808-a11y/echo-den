import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Globe, Sun, Moon } from 'lucide-react';

interface TimeZone {
  name: string;
  timezone: string;
  city: string;
  country: string;
  emoji: string;
}

const timeZones: TimeZone[] = [
  { name: 'Local', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, city: 'Your Location', country: '', emoji: '🏠' },
  { name: 'New York', timezone: 'America/New_York', city: 'New York', country: 'USA', emoji: '🗽' },
  { name: 'London', timezone: 'Europe/London', city: 'London', country: 'UK', emoji: '🇬🇧' },
  { name: 'Tokyo', timezone: 'Asia/Tokyo', city: 'Tokyo', country: 'Japan', emoji: '🗾' },
  { name: 'Sydney', timezone: 'Australia/Sydney', city: 'Sydney', country: 'Australia', emoji: '🇦🇺' },
  { name: 'Dubai', timezone: 'Asia/Dubai', city: 'Dubai', country: 'UAE', emoji: '🇦🇪' },
  { name: 'Los Angeles', timezone: 'America/Los_Angeles', city: 'Los Angeles', country: 'USA', emoji: '🌴' },
  { name: 'Singapore', timezone: 'Asia/Singapore', city: 'Singapore', country: 'Singapore', emoji: '🇸🇬' }
];

interface WorldClockProps {
  compact?: boolean;
  showSeconds?: boolean;
  maxZones?: number;
  className?: string;
}

export function WorldClock({ 
  compact = false, 
  showSeconds = false, 
  maxZones = 4,
  className = ""
}: WorldClockProps) {
  const [times, setTimes] = useState<{ [key: string]: Date }>({});

  useEffect(() => {
    const updateTimes = () => {
      const newTimes: { [key: string]: Date } = {};
      timeZones.slice(0, maxZones).forEach(tz => {
        newTimes[tz.timezone] = new Date();
      });
      setTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, showSeconds ? 1000 : 60000);

    return () => clearInterval(interval);
  }, [maxZones, showSeconds]);

  const formatTime = (date: Date, timezone: string) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      ...(showSeconds && { second: '2-digit' }),
      hour12: true
    };
    return date.toLocaleTimeString('en-US', options);
  };

  const getTimeOfDay = (timezone: string) => {
    const hour = new Date().toLocaleString('en', { 
      timeZone: timezone, 
      hour: 'numeric', 
      hour12: false 
    });
    const hourNum = parseInt(hour);
    
    if (hourNum >= 6 && hourNum < 12) return 'morning';
    if (hourNum >= 12 && hourNum < 18) return 'afternoon';
    if (hourNum >= 18 && hourNum < 22) return 'evening';
    return 'night';
  };

  const getTimeIcon = (timeOfDay: string) => {
    switch (timeOfDay) {
      case 'morning':
      case 'afternoon':
        return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'evening':
        return <Sun className="w-4 h-4 text-orange-500" />;
      case 'night':
        return <Moon className="w-4 h-4 text-blue-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  if (compact) {
    return (
      <Card className={`bg-white/10 backdrop-blur-lg border-white/20 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">World Clock</span>
          </div>
          <div className="space-y-2">
            {timeZones.slice(0, maxZones).map((tz) => {
              const timeOfDay = getTimeOfDay(tz.timezone);
              return (
                <div key={tz.timezone} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{tz.emoji}</span>
                    <span className="text-sm text-gray-400">{tz.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTimeIcon(timeOfDay)}
                    <span className="text-sm font-mono text-white">
                      {times[tz.timezone] && formatTime(times[tz.timezone], tz.timezone)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-br from-slate-800 to-blue-900 border-blue-700/30 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white">
          <Globe className="w-5 h-5 text-blue-400" />
          World Clock
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {timeZones.slice(0, maxZones).map((tz) => {
            const timeOfDay = getTimeOfDay(tz.timezone);
            return (
              <div 
                key={tz.timezone} 
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{tz.emoji}</span>
                    <div>
                      <div className="font-semibold text-white text-sm">{tz.city}</div>
                      {tz.country && (
                        <div className="text-xs text-gray-400">{tz.country}</div>
                      )}
                    </div>
                  </div>
                  {getTimeIcon(timeOfDay)}
                </div>
                <div className="font-mono text-lg text-blue-300">
                  {times[tz.timezone] && formatTime(times[tz.timezone], tz.timezone)}
                </div>
                <div className="text-xs text-gray-400 capitalize mt-1">
                  {timeOfDay}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
