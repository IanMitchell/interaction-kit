export function getAuditLogHeaders(auditLogReason: string | undefined) {
	const headers = new Headers();

	if (auditLogReason != null) {
		headers.set("X-Audit-Log-Reason", auditLogReason);
	}

	return headers;
}
