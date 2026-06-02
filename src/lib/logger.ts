import { createAdminClient } from '@/lib/supabase/admin';

type ErrorLogContext = {
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  pageUrl?: string;
  activityContext?: string;
};

export async function logErrorToServer(error: any, context?: ErrorLogContext) {
  try {
    const adminClient = createAdminClient();

    const errorMessage = error instanceof Error ? error.message : (error?.message || String(error));
    const stackTrace = error instanceof Error ? error.stack : (error?.stack || undefined);

    await adminClient.from('system_error_logs').insert({
      user_id: context?.userId || null,
      user_email: context?.userEmail || null,
      ip_address: context?.ipAddress || null,
      error_message: errorMessage,
      stack_trace: stackTrace,
      page_url: context?.pageUrl || null,
      activity_context: context?.activityContext || null,
    });
  } catch (loggingError) {
    console.error('CRITICAL: Failed to write to system_error_logs', loggingError);
  }
}
