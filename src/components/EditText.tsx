import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import {
    EditorState,
    convertToRaw,
    ContentState,
    convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";

const EditText = (props: {
    content: string;
    setContent: (arg0: string) => void;
}) => {
    let contentDataState: any;

    if (props.content !== " ") {
        contentDataState = ContentState.createFromBlockArray(
            convertFromHTML(`${props.content}`).contentBlocks
        );
    }
    const [editorState, setEditorState] = useState(
        props.content !== " "
            ? EditorState.createWithContent(contentDataState)
            : EditorState.createEmpty()
    );
    const text = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    useEffect(() => {
        props.setContent(text);
    }, [text]);

    return (
        <div className="txt_edt" >
            <Editor
                toolbar={{
                    options: [
                        "inline",
                        "fontSize",
                        "list",
                        "textAlign",
                        "link",
                        "colorPicker",
                    ],
                    inline: {
                        options: ["bold", "italic", "underline"],
                    },
                    textAlign: {
                        options: ["left", "center"],
                    },
                    list: {
                        options: ["unordered"],
                    },
                }}
                editorState={editorState}
                onEditorStateChange={setEditorState}
                editorStyle={{
                    height: "40vh",
                    border: "1px solid #E6E8F0",
                    padding: 10,
                }}
            />
        </div>
    );
};
export default EditText;
