'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

const Tiptap = ({ content, setContent }: {
  content: string
  setContent: (content: string) => void
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
  });
  
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content) // Set content if it changes externally
    }
  }, [editor, content])

  return <EditorContent editor={editor} />
}

export default Tiptap
