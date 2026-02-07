import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

interface ManualTillPaymentProps {
  loanId?: string | number;
  amount: number;
  onSuccess?: () => void;
}

export const ManualTillPayment: React.FC<ManualTillPaymentProps> = ({ loanId, amount, onSuccess }) => {
  const till = '3145659';
  const business = 'PRIME TECHNOLOGIES';
  const { user, addNotification } = useAuth();

  const [pastedMessage, setPastedMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
  setError('');
  // Validate pasted message contains business, today's date in d/m/yy format and the expected amount
  const biz = business.toUpperCase();
  const pasted = (pastedMessage || '').toUpperCase();
  if (!pasted) return setError('Please paste mpesa payment message');

  // Validate presence of business and today's date, but do not reveal specifics to the user.
  const now = new Date();
  const d = now.getDate();
  const m = now.getMonth() + 1;
  const yy = String(now.getFullYear() % 100);
  const dStr = String(d);
  const mStr = String(m);
  const dayPattern = `(?:${dStr}|0${dStr})`;
  const monPattern = `(?:${mStr}|0${mStr})`;
  const dateRegex = new RegExp(`\\b${dayPattern}\\/${monPattern}\\/${yy}\\b`);
  if (!pasted.includes(biz) || !dateRegex.test(pasted)) return setError('Pasted message could not be validated; please double-check and try again.');

  // Validate amount exists in the pasted message. Accept numbers with commas or decimals.
  const extractNumbers = (txt: string) => {
    const matches = txt.match(/\d{1,3}(?:[,\s]\d{3})*(?:\.\d+)?/g) || [];
    return matches.map((s) => parseFloat(s.replace(/[,\s]/g, ''))).filter((n) => !Number.isNaN(n));
  };
  const foundAmounts = extractNumbers(pastedMessage);
  const expected = Number(amount || 0);
  const amountMatch = foundAmounts.some((n) => Math.abs(n - expected) < 0.5);
  if (!amountMatch) return setError('Pasted message could not be validated; please double-check and try again.');

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/payments/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loanId,
          amount,
          till,
          business,
          pastedMessage,
        }),
      });

      const body = await res.json();
      if (!res.ok) {
        setError(body?.error || 'Failed to record payment');
        addNotification(body?.error || 'Failed to record payment', 'error');
      } else {
        const payment = body?.payment;
        if (payment && payment.status === 'verified') {
          addNotification('Payment recorded and verified.', 'success');
          onSuccess?.();
        } else {
          addNotification('Payment recorded. Pending verification.', 'success');
        }
      }
    } catch (err) {
          setError((err as Error).message || 'Network error');
          addNotification((err as Error).message || 'Network error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-card w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Pay via M-Pesa (Lipa na Till)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted rounded-lg p-4 mb-4">
          {/* <p className="text-sm mb-2">Business: <strong>{business}</strong></p> */}
          <p className="text-sm mb-2">Till number: <strong>{till}</strong>
            <button
              onClick={() => navigator.clipboard.writeText(till)}
              className="ml-3 text-primary underline"
            >Copy</button>
          </p>
          <ol className="text-sm list-decimal pl-5">
            <li>Open M-Pesa on your phone</li>
            <li>Select Lipa na M-Pesa → Buy Goods and Services</li>
            <li>Enter Till Number: {till}</li>
            <li>Enter Amount: Ksh {amount}</li>
            <li>Enter your M-Pesa PIN and confirm</li>
            <li>After confirmation, copy the M-Pesa message and paste it below</li>
          </ol>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="pasted">Paste full M-Pesa message (required)</Label>
              <textarea
                id="pasted"
                value={pastedMessage}
                onChange={(e) => setPastedMessage(e.target.value)}
                placeholder={`Paste the M-Pesa message you received.`}
                className="w-full rounded-md border px-3 py-2 text-muted-foreground resize-none"
                rows={5}
              />
            
            </div>

          {error && <div className="text-destructive text-sm">{error}</div>}

          <div className="flex justify-center">
            <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="bg-gradient-primary w-full sm:w-auto mx-auto">
              {isSubmitting ? 'Recording...' : "I've Paid — Record Payment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualTillPayment;
