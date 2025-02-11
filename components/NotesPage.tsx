'use client';

import React, { useEffect, useRef, useState } from 'react';
import Quill, { QuillOptions } from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill's Snow theme CSS

// Define the interface for a journal entry
interface NoteText {
  id: number;
  content: string;
  date: string;
}

const NotesPage: React.FC = () => {
  // A ref for the div that will become the Quill editor
  const editorRef = useRef<HTMLDivElement>(null);
  // A ref to store the Quill instance (instead of state)
  const quillRef = useRef<Quill | null>(null);

  // State to store all saved journal entries
  const [entries, setEntries] = useState<NoteText[]>([]);

  // Load any saved entries from localStorage on mount
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

      // Create the Quill editor instance and store it in the ref
      quillRef.current = new Quill(editorRef.current, options);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('noteText', JSON.stringify(entries));
  }, [entries]);

  // Handler to save the current journal entry
  const handleSave = () => {
    if (quillRef.current) {
      const content = quillRef.current.root.innerHTML;
      // Quill returns '<p><br></p>' when empty; avoid saving if so
      if (content === '<p><br></p>' || !content.trim()) {
        return;
      }
      const newEntry: NoteText = {
        id: Date.now(),
        content,
        date: new Date().toLocaleString(),
      };

      // Prepend the new entry to the list
      setEntries((prevEntries) => [newEntry, ...prevEntries]);
      // Clear the editor contents
      quillRef.current.setContents([]);
    }
  };

  // Handler to download the notes as an HTML file
  const handleDownload = () => {
    // Create an HTML string that includes all saved entries
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
      <h2 className="text-xl font-bold mb-4">Notes</h2>

      {/* The div below will be turned into a Quill editor */}
      <div ref={editorRef} className="bg-dark-1" style={{ height: '300px' }}></div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Save Entry
        </button>

        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Download Notes
        </button>
      </div>

      {/* Display the list of saved entries */}
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
