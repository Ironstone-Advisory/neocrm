# Zoho CRM read-only adapter

`IMP-008 - Status: Implemented`

This adapter is the production-shaped Zoho boundary for EXP-001. It supports an injected `fetch`, validates regional/base URLs, obtains or refreshes OAuth credentials, discovers field API names, applies explicit module and field allowlists, caps pagination, retries safe GET requests, sanitizes failures, and emits CAP-001 adapter contracts with field-level provenance.

CRM requests are GET-only. The only POST path is OAuth token exchange to the exact endpoint registered for the selected Zoho region. API and token URL overrides must match that regional boundary exactly, redirects fail closed, and credentials are never sent to caller-selected hosts. Contacts map to Person identity candidates, Accounts to Company references, and Deals normally to Opportunity evidence. A Contact or Account is never inferred to be a Customer. Leads are optional and map to a Party plus Prospect role.

No method for create, update, delete, rename, or write-back is exported.
