import { useState } from 'react';
import { Plus, Search, Trash2, Edit, X, Check, StickyNote } from 'lucide-react';

const COLORS = [
  'bg-yellow-50 border-yellow-200',
  'bg-blue-50 border-blue-200',
  'bg-green-50 border-green-200',
  'bg-purple-50 border-purple-200',
  'bg-pink-50 border-pink-200',
  'bg-orange-50 border-orange-200',
];

export default function Notes({ notes, onUpdateNotes }) {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editColor, setEditColor] = useState(0);

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const addNote = () => {
    const note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      color: Math.floor(Math.random() * COLORS.length),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onUpdateNotes([note, ...notes]);
    startEditing(note);
  };

  const startEditing = (note) => {
    setEditing(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditColor(note.color);
  };

  const saveEdit = () => {
    onUpdateNotes(notes.map(n =>
      n.id === editing
        ? { ...n, title: editTitle, content: editContent, color: editColor, updatedAt: new Date().toISOString() }
        : n
    ));
    setEditing(null);
  };

  const deleteNote = (id) => {
    if (confirm('Delete this note?')) {
      onUpdateNotes(notes.filter(n => n.id !== id));
      if (editing === id) setEditing(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <button
          onClick={addNote}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          New Note
        </button>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Edit Note</h3>
            <div className="flex items-center gap-2">
              {COLORS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setEditColor(i)}
                  className={`w-5 h-5 rounded-full border-2 ${c} ${editColor === i ? 'ring-2 ring-offset-1 ring-gray-900' : ''}`}
                />
              ))}
            </div>
          </div>
          <input
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400"
            autoFocus
          />
          <textarea
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            placeholder="Write your note..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[150px] focus:outline-none focus:ring-2 focus:ring-orange-400 resize-y"
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
              <X size={14} className="inline mr-1" />Cancel
            </button>
            <button onClick={saveEdit} className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800">
              <Check size={14} className="inline mr-1" />Save
            </button>
          </div>
        </div>
      )}

      {/* Notes grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(note => (
            <div
              key={note.id}
              className={`border rounded-xl p-4 space-y-2 transition-shadow hover:shadow-md cursor-pointer ${COLORS[note.color] || COLORS[0]}`}
              onClick={() => { if (editing !== note.id) startEditing(note); }}
            >
              <div className="flex items-start justify-between">
                <h4 className="font-semibold text-sm text-gray-900 truncate flex-1">
                  {note.title || 'Untitled'}
                </h4>
                <button
                  onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                  className="p-1 hover:bg-white/60 rounded text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <p className="text-xs text-gray-600 line-clamp-4 whitespace-pre-wrap">{note.content || 'Empty note'}</p>
              <p className="text-xs text-gray-400">
                {new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <StickyNote size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">{search ? 'No notes match your search.' : 'No notes yet. Create your first one!'}</p>
        </div>
      )}
    </div>
  );
}
