import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTransactionById, getJobById, getRentalById, updateTransaction, createTransaction } from '../mock-data';
import { formatDateTime, formatCurrency } from '../utils/helpers';
import { usePermissions } from '../utils/permissions';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import StatusBadge from '../components/common/StatusBadge';
import ConfirmModal from '../components/common/ConfirmModal';

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { can } = usePermissions(user?.role);
  const [txn, setTxn] = useState(getTransactionById(id));
  const [modal, setModal] = useState(null);

  if (!txn) {
    return (
      <div>
        <Header title="Transaction Not Found" />
        <div className="empty-state">
          <div className="empty-state-text">Transaction not found</div>
          <button className="btn btn-outline mt-4" onClick={() => navigate('/transactions')}>Back to Transactions</button>
        </div>
      </div>
    );
  }

  const relatedJob = txn.relatedType === 'job' ? getJobById(txn.relatedId) : null;
  const relatedRental = txn.relatedType === 'rental' ? getRentalById(txn.relatedId) : null;

  const handleReleaseEscrow = () => {
    const updated = updateTransaction(txn.id, { status: 'completed' });
    if (updated) {
      setTxn(updated);
      setModal(null);
    }
  };

  const handleProcessRefund = () => {
    const refundTxn = createTransaction({
      type: 'refund',
      amount: txn.amount,
      status: 'completed',
      paymentMethod: txn.paymentMethod,
      reference: `${txn.reference}-REF`,
      userId: txn.userId,
      userName: txn.userName,
      relatedId: txn.relatedId,
      relatedType: txn.relatedType,
      description: `Refund for ${txn.description}`,
      fee: 0,
      netAmount: txn.amount,
    });
    const updated = updateTransaction(txn.id, { status: 'completed' });
    if (updated) {
      setTxn(updated);
      setModal(null);
    }
  };

  const handleApprovePayout = () => {
    const updated = updateTransaction(txn.id, { status: 'completed' });
    if (updated) {
      setTxn(updated);
      setModal(null);
    }
  };

  return (
    <div>
      <Header title={`Transaction ${txn.id}`} />
      <div className="card mb-4">
        <div className="card-body">
          <div className="detail-grid">
            <div className="detail-field"><div className="detail-label">Transaction ID</div><div className="detail-value">{txn.id}</div></div>
            <div className="detail-field"><div className="detail-label">Type</div><div className="detail-value"><StatusBadge status={txn.type} /></div></div>
            <div className="detail-field"><div className="detail-label">Amount</div><div className="detail-value">{formatCurrency(txn.amount)}</div></div>
            <div className="detail-field"><div className="detail-label">Fee</div><div className="detail-value">{formatCurrency(txn.fee)}</div></div>
            <div className="detail-field"><div className="detail-label">Net Amount</div><div className="detail-value">{formatCurrency(txn.netAmount)}</div></div>
            <div className="detail-field"><div className="detail-label">Status</div><div className="detail-value"><StatusBadge status={txn.status} /></div></div>
            <div className="detail-field"><div className="detail-label">Payment Method</div><div className="detail-value">{txn.paymentMethod}</div></div>
            <div className="detail-field"><div className="detail-label">Reference</div><div className="detail-value" style={{ fontSize: 13 }}>{txn.reference}</div></div>
            <div className="detail-field"><div className="detail-label">User</div><div className="detail-value"><span className="cell-link" onClick={() => navigate(`/users/${txn.userId}`)}>{txn.userName}</span></div></div>
            <div className="detail-field"><div className="detail-label">Date</div><div className="detail-value">{formatDateTime(txn.createdAt)}</div></div>
            <div className="detail-field"><div className="detail-label">Description</div><div className="detail-value" style={{ gridColumn: 'span 2' }}>{txn.description}</div></div>
          </div>
        </div>
      </div>

      {/* Escrow / Trust Ledger */}
      {(txn.status === 'escrow' || txn.status === 'held') && (
        <div className="card mb-4">
          <div className="card-header"><h3>Escrow / Trust Ledger</h3></div>
          <div className="card-body">
            <div className="detail-grid">
              <div className="detail-field"><div className="detail-label">Status</div><div className="detail-value"><StatusBadge status={txn.status} /></div></div>
              <div className="detail-field"><div className="detail-label">Amount Held</div><div className="detail-value">{formatCurrency(txn.amount)}</div></div>
              <div className="detail-field"><div className="detail-label">Release Condition</div><div className="detail-value">Pending completion verification</div></div>
            </div>
            {can('releaseEscrow') && (
              <div style={{ marginTop: 16 }}>
                <button className="btn btn-success" onClick={() => setModal('release-escrow')}>
                  Release Escrow
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Escrow on deposits */}
      {txn.type === 'deposit' && txn.status === 'held' && can('releaseEscrow') && (
        <div className="card mb-4">
          <div className="card-header"><h3>Deposit Actions</h3></div>
          <div className="card-body">
            <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 12 }}>This deposit is currently held. You can release it back to the user or process a refund.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-success" onClick={() => setModal('release-escrow')}>
                Release Deposit
              </button>
              <button className="btn btn-accent" onClick={() => setModal('refund')}>
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund action for completed payments */}
      {txn.type !== 'refund' && txn.type !== 'deposit' && txn.type !== 'payout' && txn.status === 'completed' && can('processRefund') && (
        <div className="card mb-4">
          <div className="card-header"><h3>Actions</h3></div>
          <div className="card-body">
            <button className="btn btn-accent" onClick={() => setModal('refund')}>
              Initiate Refund
            </button>
          </div>
        </div>
      )}

      {/* Payout approval */}
      {txn.type === 'payout' && txn.status === 'pending' && can('approvePayout') && (
        <div className="card mb-4">
          <div className="card-header"><h3>Payout Action Required</h3></div>
          <div className="card-body">
            <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 12 }}>
              This payout of {formatCurrency(txn.amount)} to {txn.userName} is pending approval.
            </p>
            <button className="btn btn-success" onClick={() => setModal('approve-payout')}>
              Approve Payout
            </button>
          </div>
        </div>
      )}

      {relatedJob && (
        <div className="card mb-4">
          <div className="card-header"><h3>Related Job</h3></div>
          <div className="card-body">
            <div className="detail-field"><div className="detail-label">Job</div><div className="detail-value"><span className="cell-link" onClick={() => navigate(`/jobs/${relatedJob.id}`)}>{relatedJob.title}</span></div></div>
            <div className="detail-field" style={{ marginTop: 8 }}><div className="detail-label">Status</div><div className="detail-value"><StatusBadge status={relatedJob.status} /></div></div>
            <div className="detail-field" style={{ marginTop: 8 }}><div className="detail-label">Client</div><div className="detail-value">{relatedJob.clientName}</div></div>
            <div className="detail-field" style={{ marginTop: 8 }}><div className="detail-label">Budget</div><div className="detail-value">{formatCurrency(relatedJob.budget)}</div></div>
          </div>
        </div>
      )}

      {relatedRental && (
        <div className="card mb-4">
          <div className="card-header"><h3>Related Rental</h3></div>
          <div className="card-body">
            <div className="detail-field"><div className="detail-label">Rental</div><div className="detail-value">{relatedRental.listingTitle}</div></div>
            <div className="detail-field" style={{ marginTop: 8 }}><div className="detail-label">Status</div><div className="detail-value"><StatusBadge status={relatedRental.status} /></div></div>
            <div className="detail-field" style={{ marginTop: 8 }}><div className="detail-label">Renter</div><div className="detail-value">{relatedRental.renterName}</div></div>
            <div className="detail-field" style={{ marginTop: 8 }}><div className="detail-label">Owner</div><div className="detail-value">{relatedRental.ownerName}</div></div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={modal === 'release-escrow'}
        title="Release Escrow"
        message={`Are you sure you want to release ${formatCurrency(txn.amount)} from escrow? The funds will be transferred to the recipient.`}
        confirmLabel="Release"
        variant="success"
        onConfirm={handleReleaseEscrow}
        onCancel={() => setModal(null)}
      />

      <ConfirmModal
        open={modal === 'refund'}
        title="Process Refund"
        message={`This will create a refund of ${formatCurrency(txn.amount)} to ${txn.userName}. The original transaction will be marked as refunded. Continue?`}
        confirmLabel="Process Refund"
        variant="accent"
        onConfirm={handleProcessRefund}
        onCancel={() => setModal(null)}
      />

      <ConfirmModal
        open={modal === 'approve-payout'}
        title="Approve Payout"
        message={`Confirm payout of ${formatCurrency(txn.amount)} to ${txn.userName} via ${txn.paymentMethod}?`}
        confirmLabel="Approve"
        variant="success"
        onConfirm={handleApprovePayout}
        onCancel={() => setModal(null)}
      />
    </div>
  );
}
