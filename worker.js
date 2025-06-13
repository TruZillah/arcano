export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = `http://YOUR_RUNPOD_IP${url.pathname}`;
    const proxied = new Request(target, request);
    const response = await fetch(proxied);
    return new Response(response.body, {
      status: response.status,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}; 