"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Quill, { type QuillOptions } from "quill"
import "quill/dist/quill.snow.css" // Import Quill's Snow theme CSS
import { Download, Trash } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

// props
interface NoteText {
  id: number
  content: string
  date: string
}

const NotesPage: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<Quill | null>(null)
  const [entries, setEntries] = useState<NoteText[]>([])

  useEffect(() => {
    const storedEntries = localStorage.getItem("noteText")
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries))
    }
  }, [])

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const options: QuillOptions = {
        theme: "snow",
        placeholder: "Write your entry here...",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
      }

      quillRef.current = new Quill(editorRef.current, options)

      // Set the text color to white
      quillRef.current.root.style.color = "white"
    }
  }, [])

  const handleSave = () => {
    if (quillRef.current) {
      const content = quillRef.current.root.innerHTML
      if (content === "<p><br></p>" || !content.trim()) {
        return
      }
      const newEntry: NoteText = {
        id: Date.now(),
        content,
        date: new Date().toLocaleString(),
      }

      setEntries((prevEntries) => [...prevEntries, newEntry])
      localStorage.setItem("noteText", JSON.stringify([...entries, newEntry]))

      quillRef.current.setContents([])
    }
  }

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
              `,
            )
            .join("")}
        </body>
      </html>
    `
    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `journal_${Date.now()}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDelete = (id: number) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    setEntries(updatedEntries)
    localStorage.setItem("noteText", JSON.stringify(updatedEntries))
  }


  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-white">Notes</h2>

      <div ref={editorRef} className="bg-gray-800 mb-4" style={{ height: "300px" }}></div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Save Entry
        </button>

        <button
          title="download"
          onClick={handleDownload}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          <Download className="ml-22" size={20} />
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Saved Entries</h3>
        <div className="mt-6">
        <ScrollArea className="h-[400px] w-full rounded-md border border-gray-700 p-4">
          {entries.length === 0 ? (
            <p>No entries yet</p>
          ) : (
            <div className="pb-8">
              {entries.map((entry) => (
                <div key={entry.id} className="mb-4 border border-gray-700 p-4 rounded bg-gray-800 relative">
                  <div className="text-sm text-gray-400">{entry.date}</div>
                  <div className="mt-2" dangerouslySetInnerHTML={{ __html: entry.content }} />
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-700 transition-colors"
                    title="Delete entry"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
      </div>
    </div>
  )
}

export default NotesPage