export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/messages") {

      // POST a new anonymous message
      if (request.method === "POST") {
        const { text } = await request.json();
        const id = Date.now().toString();

        await env.MESSAGES.put(
          id,
          JSON.stringify({ text })
        );

        return new Response("ok");
      }

      // GET latest messages (global chat)
      if (request.method === "GET") {
        const list = await env.MESSAGES.list({ limit: 25 });
        const messages = [];

        for (const key of list.keys) {
          const value = await env.MESSAGES.get(key.name);
          messages.push(JSON.parse(value));
        }

        return Response.json(messages.reverse());
      }
    }

    return new Response("Not found", { status: 404 });
  }
};
