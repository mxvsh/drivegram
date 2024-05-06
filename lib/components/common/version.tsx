'use client';

import { useEffect, useState } from 'react';

import { Card } from '../ui/card';

function VersionCard() {
  const version = process.env.version;
  const [latestVersion, setLatestVersion] =
    useState('');

  useEffect(() => {
    const savedVersion =
      localStorage.getItem('version');
    const savedAt =
      localStorage.getItem('version_at');

    if (savedVersion && savedAt) {
      const elapsedSeconds = Math.floor(
        (new Date().getTime() -
          new Date(savedAt).getTime()) /
          1000,
      );
      setLatestVersion(savedVersion);

      if (elapsedSeconds < 3600) {
        return;
      }
    }

    fetch(
      'https://api.github.com/repos/mxvsh/drivegram/tags',
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const latest = data[0];
          setLatestVersion(latest.name);
          localStorage.setItem(
            'version',
            latest.name,
          );
          localStorage.setItem(
            'version_at',
            new Date().toISOString(),
          );
        }
      });
  }, []);

  return (
    <div>
      <Card className="p-4">
        <h1 className="font-semibold">
          v{version}
        </h1>
        <p className="text-sm text-gray-500">
          {latestVersion &&
          latestVersion !== version
            ? `New version available`
            : 'Up to date'}
        </p>
      </Card>
    </div>
  );
}

export default VersionCard;
