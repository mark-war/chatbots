'use client';
import ChatWidget from '@/components/ChatWidget';

export default function Widget() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Embed This Widget</h1>
      <ChatWidget />
      <pre className="bg-gray-800 text-green-400 p-4 rounded mt-8 text-xs">
{`<script src="http://localhost:3000/widget-loader.js"></script>
<finance-chat data-user-id="user-123"></finance-chat>`}
      </pre>
    </div>
  );
}