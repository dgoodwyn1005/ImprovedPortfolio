// /pages/checkout-success.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function CheckoutSuccess() {
  const router = useRouter();
  const { session_id } = router.query;
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (!session_id) return;
    async function fetchSession() {
      const res = await fetch(`/api/get-checkout-session?session_id=${session_id}`);
      const data = await res.json();
      setSession(data);
    }
    fetchSession();
  }, [session_id]);

  if (!session) return <p>Loading confirmation...</p>;

  return (
    <div className="confirmation">
      <h1>✅ Thank you for your order!</h1>
      <p>We’ve received your payment.</p>
      <p><strong>Email receipt:</strong> {session.customer_details?.email}</p>
      <p>
        <strong>Shipping to:</strong> {session.shipping?.address?.line1},{' '}
        {session.shipping?.address?.city}
      </p>
    </div>
  );
}
