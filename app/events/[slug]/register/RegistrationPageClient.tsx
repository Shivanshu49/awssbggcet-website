'use client';

import React, { useState } from 'react';
import { RegistrationForm } from '@/components/registration/RegistrationForm';
import { SuccessScreen } from '@/components/registration/SuccessScreen';

interface RegistrationPageClientProps {
  eventSlug: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
}

export const RegistrationPageClient: React.FC<RegistrationPageClientProps> = ({
  eventSlug,
  eventTitle,
  eventDate,
  eventTime,
  venue,
}) => {
  const [successData, setSuccessData] = useState<{
    registrationId: string;
    qrDataUrl: string;
    verifyUrl: string;
    firstName: string;
  } | null>(null);

  if (successData) {
    return (
      <SuccessScreen
        registrationId={successData.registrationId}
        qrDataUrl={successData.qrDataUrl}
        verifyUrl={successData.verifyUrl}
        firstName={successData.firstName}
        eventTitle={eventTitle}
        eventDate={eventDate}
        eventTime={eventTime}
        venue={venue}
      />
    );
  }

  return (
    <div className="space-y-12">
      <RegistrationForm
        eventSlug={eventSlug}
        eventTitle={eventTitle}
        onSuccess={(data) => setSuccessData(data)}
      />
    </div>
  );
};

