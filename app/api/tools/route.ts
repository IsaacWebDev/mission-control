import { NextResponse } from 'next/server';

// Mock database - replace with real DB
let tools: Array<{
  id: number;
  name: string;
  description: string;
  type: string;
  status: 'draft' | 'active' | 'archived';
  config: Record<string, any>;
  created: string;
}> = [
  {
    id: 1,
    name: 'Email Bot',
    description: 'Automated email processing and responses',
    type: 'webhook',
    status: 'active',
    config: { endpoint: '/api/webhooks/email' },
    created: '2026-03-02',
  },
  {
    id: 2,
    name: 'Calendar Manager',
    description: 'Sync and manage calendar events',
    type: 'scheduled',
    status: 'draft',
    config: { interval: '5m' },
    created: '2026-02-27',
  },
];

// GET /api/tools - Get all tools
export async function GET() {
  return NextResponse.json({ tools });
}

// POST /api/tools - Create new tool
export async function POST(request: Request) {
  const body = await request.json();

  const newTool = {
    id: Math.max(...tools.map((t) => t.id), 0) + 1,
    ...body,
    status: 'draft' as const,
    created: new Date().toISOString().split('T')[0],
  };

  tools.push(newTool);

  return NextResponse.json(newTool, { status: 201 });
}

// DELETE /api/tools/:id
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id') || '0');

  const index = tools.findIndex((t) => t.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
  }

  const deleted = tools.splice(index, 1)[0];
  return NextResponse.json(deleted);
}
