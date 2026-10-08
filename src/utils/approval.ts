import { ContentStatus, VALID_STATUS_TRANSITIONS } from '../types';

export function canTransition(from: ContentStatus, to: ContentStatus): boolean {
  const validTransitions = VALID_STATUS_TRANSITIONS[from] || [];
  return validTransitions.includes(to);
}

export function getValidTransitions(status: ContentStatus): ContentStatus[] {
  return VALID_STATUS_TRANSITIONS[status] || [];
}

export function getStatusLabel(status: ContentStatus): string {
  const labels: Record<ContentStatus, string> = {
    DRAFT: 'Draft',
    GENERATED: 'Generated',
    CLIENT_REVIEW: 'Client Review',
    CHANGES_REQUESTED: 'Changes Requested',
    APPROVED: 'Approved',
    SCHEDULED: 'Scheduled',
    PUBLISHED: 'Published',
    REJECTED: 'Rejected'
  };
  return labels[status] || status;
}

export function getStatusDescription(status: ContentStatus): string {
  const descriptions: Record<ContentStatus, string> = {
    DRAFT: 'Initial draft, not yet ready for review',
    GENERATED: 'AI-generated content, ready to send for review',
    CLIENT_REVIEW: 'Sent to client for approval',
    CHANGES_REQUESTED: 'Client requested revisions',
    APPROVED: 'Approved and ready to schedule',
    SCHEDULED: 'Scheduled for publishing',
    PUBLISHED: 'Live on social media',
    REJECTED: 'Rejected by client'
  };
  return descriptions[status] || '';
}

export function getNextStatusActions(currentStatus: ContentStatus): Array<{
  action: string;
  nextStatus: ContentStatus;
  label: string;
  variant: 'default' | 'destructive' | 'primary';
}> {
  const transitions = getValidTransitions(currentStatus);
  
  const actionMap: Record<ContentStatus, { label: string; variant: 'default' | 'destructive' | 'primary' }> = {
    DRAFT: { label: 'Generate', variant: 'primary' },
    GENERATED: { label: 'Send for Review', variant: 'primary' },
    CLIENT_REVIEW: { label: 'Approve', variant: 'primary' },
    CHANGES_REQUESTED: { label: 'Resubmit', variant: 'primary' },
    APPROVED: { label: 'Schedule', variant: 'default' },
    SCHEDULED: { label: 'Publish', variant: 'default' },
    PUBLISHED: { label: '', variant: 'default' },
    REJECTED: { label: 'Resubmit', variant: 'default' }
  };
  
  return transitions.map(nextStatus => ({
    action: nextStatus,
    nextStatus,
    label: actionMap[nextStatus]?.label || nextStatus,
    variant: actionMap[nextStatus]?.variant || 'default'
  }));
}