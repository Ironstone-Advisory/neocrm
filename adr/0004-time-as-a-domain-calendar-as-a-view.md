# ADR-0004: Time is a domain; calendar is a view

**Status:** Accepted for v0.1

## Decision

Events, intervals, commitments, availability, capacity, workload, and time series are canonical temporal concepts. Google Calendar, Outlook, and other calendars are adapters and views over parts of this domain.

## Consequences

- Time and load can be reasoned about alongside relationship and commercial context.
- Calendar providers do not become owners of NeoCRM's temporal semantics.
- Reporting can include momentum, allocation, capacity, and trend rather than only scheduled events.
