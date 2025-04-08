enum STORAGE_KEY {
  CONFIG = 'config'
}

export async function GET() {
  try {
    const kv = await Deno.openKv();
    const config = await kv.get([STORAGE_KEY.CONFIG]);
    return Response.json(config || {
      widgets: [
        {
          widgetId: 'weather',
          instanceId: 'weather-1',
          config: {
            city: 'GuangZhou',
            unit: 'celsius'
          }
        },
        {
          widgetId: 'rss',
          instanceId: 'rss-1',
          config: {
            feeds: ['']
          }
        }
      ]
    });
  } catch (error) {
    console.error('Failed to get config:', error);
    return Response.json({ error: 'Failed to get config' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const kv = await Deno.openKv();
    const config = await request.json();
    await kv.set([STORAGE_KEY.CONFIG], config);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Failed to save config:', error);
    return Response.json({ error: 'Failed to save config' }, { status: 500 });
  }
}