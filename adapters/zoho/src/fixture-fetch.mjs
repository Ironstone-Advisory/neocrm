export function createZohoFixtureFetch(dataset, options = {}) {
  const calls = [];
  const failures = [...(options.failures ?? [])];

  async function fetchImpl(input, init = {}) {
    const url = new URL(String(input));
    const method = String(init.method ?? "GET").toUpperCase();
    calls.push({ method, url: `${url.origin}${url.pathname}`, query: Object.fromEntries(url.searchParams) });
    const failure = failures.shift();
    if (failure) {
      return new Response(JSON.stringify({ code: "fixture_failure" }), {
        status: failure.status,
        headers: failure.headers ?? { "content-type": "application/json" }
      });
    }
    if (method !== "GET") return new Response("", { status: 405 });

    const fieldMatch = url.pathname.match(/\/crm\/v7\/settings\/fields$/);
    if (fieldMatch) {
      const module = url.searchParams.get("module");
      const first = dataset.zoho[module]?.[0] ?? {};
      return Response.json({ fields: Object.keys(first).map((api_name) => ({ api_name })) });
    }
    const search = url.pathname.match(/\/crm\/v7\/(Contacts|Leads)\/search$/);
    if (search) {
      const module = search[1];
      const word = String(url.searchParams.get("word") ?? "").toLowerCase();
      const data = (dataset.zoho[module] ?? []).filter((record) =>
        String(record.Full_Name).toLowerCase().includes(word.replace(/^.*?(alex|rivera).*$/i, "$1")) ||
        word.includes(String(record.Full_Name).toLowerCase())
      );
      return Response.json({ data, info: { more_records: false } });
    }
    const contactDeals = url.pathname.match(/\/crm\/v7\/Contacts\/([^/]+)\/Deals$/);
    if (contactDeals) {
      const data = dataset.zoho.Deals.filter((record) => record.Contact_Id === decodeURIComponent(contactDeals[1]));
      return Response.json({ data, info: { more_records: false } });
    }
    const contact = url.pathname.match(/\/crm\/v7\/(Contacts|Accounts|Leads)\/([^/]+)$/);
    if (contact) {
      const data = (dataset.zoho[contact[1]] ?? []).filter((record) => record.id === decodeURIComponent(contact[2]));
      return Response.json({ data, info: { more_records: false } });
    }
    return new Response(JSON.stringify({ code: "not_found" }), { status: 404 });
  }

  return { fetchImpl, calls };
}
