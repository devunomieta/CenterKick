'use client';

import dynamic from 'next/dynamic';

const EditManagedAccountClient = dynamic(() => import('./EditManagedAccountClient'), { ssr: false });

export default function EditManagedAccountWrapper(props: { targetProfile: any, role: string }) {
  return <EditManagedAccountClient {...props} />;
}
