import { useState } from "react";
import Button from "../../components/ui/Button";
import { InputField, TextAreaField } from "../../components/ui/Fields";

export default function TeacherAnnouncements(props: {
  onCreate: (title: string, content: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Elan yaratma</h2>
          <p className="pageSubtitle">
            Yaradılan elan admin tərəfindən təsdiqlənəndən sonra görünəcək
          </p>
        </div>
      </div>

      <div className="card">
        <div className="stack">
          <InputField
            label="Başlıq"
            value={title}
            onChange={setTitle}
            placeholder="Məs: İmtahan cədvəli"
          />
          <TextAreaField
            label="Mətn"
            value={content}
            onChange={setContent}
            placeholder="Elanın detalları..."
          />
          <div className="actionsRow">
            <Button
              variant="primary"
              onClick={() => {
                props.onCreate(title, content);
                setTitle("");
                setContent("");
              }}
              disabled={!title.trim() || !content.trim()}
            >
              Elanı göndər
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
