import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ManualTillPayment from './ManualTillPayment';

interface CollateralPaymentProps {
  onBack: () => void;
}

const CollateralPayment: React.FC<CollateralPaymentProps> = ({ onBack }) => {
  const [transactionState, setTransactionState] = useState<'idle' | 'success'>('idle');
  const { currentLoan, payCollateralFee, addNotification } = useAuth();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(amount);

  const handleManualSuccess = async () => {
    if (currentLoan) {
      try {
        await payCollateralFee(currentLoan.id, currentLoan.processingFee || 0);
        setTransactionState('success');
        addNotification('Payment recorded. Loan is now being processed.', 'success');
      } catch (err) {
        console.error('Failed to update loan status after manual payment:', err);
        setTransactionState('success');
        addNotification('Payment recorded. Please note verification is pending.', 'success');
      }
    } else {
      setTransactionState('success');
      addNotification('Payment recorded. Pending verification.', 'success');
    }
  };

  if (transactionState === 'success') {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-primary text-white p-6">
          <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Payment Successful</h1>
        </div>

        <div className="px-6 -mt-8">
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-bold text-success mb-2">Payment Recorded</h3>
              <p className="text-muted-foreground mb-6">
                Your processing fee of {formatCurrency(currentLoan?.processingFee || 0)} has been recorded and is pending verification.
              </p>
              <div className="bg-muted rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-2">Transaction Details</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">{formatCurrency(currentLoan?.processingFee || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction:</span>
                    <span className="font-medium">Manual Till payment recorded</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium text-success">Pending verification</span>
                  </div>
                </div>
              </div>
              <Button onClick={onBack} className="w-full bg-gradient-primary">
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-primary text-white p-6">
        <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Processing Fee Payment</h1>
        <p className="text-primary-foreground/80">Pay via M-Pesa to proceed</p>
      </div>

      <div className="px-6 pt-3 -mt-8">
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-warning mb-2">Upfront Fees Required</h4>
              <p className="text-sm text-muted-foreground mb-3">Pay processing fee to complete your loan application and proceed with loan processing.</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Loan Amount:</span>
                  <span className="text-sm font-medium">{formatCurrency(currentLoan?.amount || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Processing Fee (1%):</span>
                  <span className="text-sm font-medium">{formatCurrency(currentLoan?.processingFee || 0)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-sm font-medium">Total Upfront Payment:</span>
                  <span className="text-sm font-bold text-warning">{formatCurrency(currentLoan?.processingFee || 0)}</span>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <ManualTillPayment loanId={currentLoan?.id} amount={currentLoan?.processingFee || 0} onSuccess={handleManualSuccess} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { CollateralPayment };
export default CollateralPayment;