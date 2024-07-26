'use client'
import { Editor } from '@tiptap/react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="join">
      <button
        type="button"
        className="btn rounded mx-3 btn-sm join-item "
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
      >
        B
      </button>
      <button
        type="button"
        className="btn btn-sm join-item "
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
      >
        B
      </button>
    </div>
  )
};

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

  return (
    <div className="border-2 border-black-100 rounded-lg pt-2 w-full">
      {editor && <MenuBar editor={editor} />}
      <div className="textarea textarea-md ">
        <EditorContent
          className="p-4"
          editor={editor}
        />
      </div>
    </div>
  )
}

export default Tiptap
