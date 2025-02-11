'use client';

import React, { useState, useEffect, useRef} from 'react';
import Quill, { QuillOptions } from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill's Snow theme CSS
import { Download } from 'lucide-react';

// props
interface NoteText {
  id: number;
  content: string;
  date: string;
}

const NotesPage: React.FC = () => {
  // Quill editor
  const editorRef = useRef<HTMLDivElement>(null);
  //  store the Quill instance (instead of state)
  const quillRef = useRef<Quill | null>(null);

  //store all saved journal entries
  const [entries, setEntries] = useState<NoteText[]>([]);
//   const [isPanelVisible, setIsPanelVisible] = useState(false); thought about having a button for notes

  // Load any saved entries from localStorae
  useEffect(() => {
    const storedEntries = localStorage.getItem('noteText');
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  }, []);

  // Initialize Quill when the component mounts (only once)
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const options: QuillOptions = {
        theme: 'snow',
        placeholder: 'Write your entry here...',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
          ],
        },
      };

      // Create editor instance and store it in ref
      quillRef.current = new Quill(editorRef.current, options);
    }
  }, []); // mpty dependency array ensures this runs only once on mount

  // save entries to localStorage whenever itchanges
  useEffect(() => {
    localStorage.setItem('noteText', JSON.stringify(entries));
  }, [entries]);

  // handler to save the current journal entry
  const handleSave = () => {
    if (quillRef.current) {
      const content = quillRef.current.root.innerHTML;
      // Quill returns when empty
      if (content === '<p><br></p>' || !content.trim()) {
        return;
      }
      const newEntry: NoteText = {
        id: Date.now(),
        content,
        date: new Date().toLocaleString(),
      };

      // prepend the new entry to the list
      setEntries((prevEntries) => [newEntry, ...prevEntries]);
      // clears the editors
      quillRef.current.setContents([]);
    }
  };

  // Handler to download the notes as an HTML file;l used a bit of help
  const handleDownload = () => {
    const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>My Note Entries</title>
        </head>
        <body>
          ${entries
            .map(
              (entry) => `
                <section style="margin-bottom: 2rem; border-bottom: 1px solid #ccc; padding-bottom: 1rem;">
                  <h3>${entry.date}</h3>
                  <div>${entry.content}</div>
                </section>
              `
            )
            .join('')}
        </body>
      </html>
    `;
    // Create a Blob from the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger a download
    const link = document.createElement('a');
    link.href = url;
    link.download = `journal_${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
        {/* <button
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
        onClick={() => setIsPanelVisible(!isPanelVisible)}
      ></button> */}
      <h2 className="text-xl font-bold mb-4">Notes</h2>

      {/* TQuill editor */}
      <div ref={editorRef} className="bg-dark-1" style={{ height: '300px' }}></div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Save Entry
        </button>

        <button
        title='download'
        onClick={handleDownload}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          <Download  className="ml-22" size={20} />
        </button>
      </div>

      {/* list saved entries */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Saved Entries</h3>
        {entries.length === 0 ? (
          <p>No entries yet</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="mb-4 border p-2 rounded">
              <div className="text-sm text-gray-600">{entry.date}</div>
              <div
                className="mt-1"
                dangerouslySetInnerHTML={{ __html: entry.content }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesPage;
