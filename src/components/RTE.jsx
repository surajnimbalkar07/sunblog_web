import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Controller } from 'react-hook-form'
function RTE({
  name, control, label, defaultValue = ""
}) {
  return (
    <div className='w-full'>

      {label && <label
        className='inline-block mb-1 pl-1'
      >
        {label}
      </label>
      }

      {/* For third-party controlled components like TinyMCE, react-hook-form cannot directly manage their value and onChange events. 

The Controller component acts as a bridge between react-hook-form and TinyMCE.
It manages the internal state of TinyMCE and synchronizes it with the form state managed by react-hook-form.
The Controller binds the onChange event of TinyMCE to the form state, ensuring any changes in the editor are captured and reflected in the form.

*/}
      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange } }) => (
          <Editor
            apiKey="qdl4yqln3wlqcppmc9hg5quuz1lnoo8eq212y7id5r9j09c6"
            initialValue={defaultValue}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
                "anchor",

              ],
              toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
              content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
            }}
            onEditorChange={onChange}
          />
        )}
      />
    </div>
  )
}

export default RTE
