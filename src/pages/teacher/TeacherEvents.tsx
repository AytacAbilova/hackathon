import { useState } from "react";
import Button from "../../components/ui/Button";
import { InputField, TextAreaField } from "../../components/ui/Fields";

export default function TeacherEvents(props: {
  onCreate: (
    title: string,
    location: string,
    startsAt: string,
    description: string,
  ) => void;
}) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Event əlavə etmə</h2>
          <p className="pageSubtitle">
            Tələbələr dashboard-da eventləri görəcək
          </p>
        </div>
      </div>

      <div className="card">
        <div className="stack">
          <InputField
            label="Başlıq"
            value={title}
            onChange={setTitle}
            placeholder="Məs: Backend meetup"
          />
          <InputField
            label="Məkan"
            value={location}
            onChange={setLocation}
            placeholder="Məs: B zalı"
          />
          <InputField
            label="Tarix/Saat"
            type="datetime-local"
            value={startsAt}
            onChange={setStartsAt}
          />
          <TextAreaField
            label="Təsvir"
            value={description}
            onChange={setDescription}
            placeholder="Qısa məlumat..."
          />
          <Button
            variant="primary"
            onClick={() => {
              const iso = startsAt ? new Date(startsAt).toISOString() : "";
              props.onCreate(title, location, iso, description);
              setTitle("");
              setLocation("");
              setStartsAt("");
              setDescription("");
            }}
            disabled={!title.trim() || !location.trim() || !startsAt}
          >
            Event əlavə et
          </Button>
        </div>
      </div>
    </div>
  );
}
