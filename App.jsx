import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import {
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { notesCollection, db } from "./firebase";

export default function App() {
  // my states
  const [notes, setNotes] = React.useState([]);
  const [currentNoteId, setCurrentNoteId] = React.useState();
  const [newText, setNewText] = React.useState();

  const currentNote =
    notes.find((note) => note.id === currentNoteId) || notes[0];

  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);

  React.useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id);
    }
  }, [notes]);

  React.useEffect(() => {
    // localStorage.setItem("notes", JSON.stringify(notes))
    // onSnapshot is a listener
    const unSubscribe = onSnapshot(notesCollection, function (snapshot) {
      // sync online data with local data
      const notesArray = snapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        };
      });
      setNotes(notesArray);
    });
    return unSubscribe;
  }, []);

  //   Effect for debouncing
  React.useEffect(() => {
    const updateNote = setTimeout(async () => {
      if (newText !== await currentNote.body) {
        const noteRef = doc(db, "notes", currentNoteId);
        await updateDoc(noteRef, { body: newText, updatedAt: Date.now() });
      }
    }, 500);

    return () => clearTimeout(updateNote);
  }, [newText]);

  //   this Effect to send the note body in the Editor page
  React.useEffect(() => {
    if (currentNote) {
      setNewText(currentNote.body);
    }
  }, [currentNote]);

  async function createNewNote() {
    const newNote = {
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const noteRef = await addDoc(notesCollection, newNote);

    setCurrentNoteId(noteRef.id);
  }

  function updateText(value) {
    setNewText(value);
  }

  async function deleteNote(noteId) {
    const docRef = doc(db, "notes", noteId);
    await deleteDoc(docRef);
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={sortedNotes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />

          <Editor updateNote={updateText} text={newText} />
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
