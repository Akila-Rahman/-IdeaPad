// Utility to generate unique IDs
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

// Load saved notes from localStorage
const loadNotes = () => {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  return notes;
};

// Save notes to localStorage
const saveNotes = (notes) => {
  localStorage.setItem('notes', JSON.stringify(notes));
};

// Render notes in the UI
const renderNotes = () => {
  const notesContainer = document.getElementById('notesContainer');
  notesContainer.innerHTML = '';

  const notes = loadNotes();
  notes.forEach((note) => {
    const noteElement = document.createElement('div');
    noteElement.className = 'note';
    noteElement.innerHTML = `
      <div>${note.content}</div>
      <div class="note-actions">
        <button onclick="editNote('${note.id}')">Edit</button>
        <button onclick="deleteNote('${note.id}')">Delete</button>
      </div>
    `;
    notesContainer.appendChild(noteElement);
  });
};

// Save the current note
document.getElementById('saveButton').addEventListener('click', () => {
  const noteEditor = document.getElementById('noteEditor');
  const content = noteEditor.innerHTML.trim();

  if (!content) {
    alert('Please write something before saving.');
    return;
  }

  const notes = loadNotes();
  const existingNoteIndex = notes.findIndex((note) => note.isEditing);

  if (existingNoteIndex !== -1) {
    // Update the existing note
    notes[existingNoteIndex].content = content;
    notes[existingNoteIndex].isEditing = false;
  } else {
    // Add a new note
    notes.push({ id: generateId(), content, isEditing: false });
  }

  saveNotes(notes);
  renderNotes();
  noteEditor.innerHTML = '';
});

// Edit a note
window.editNote = (id) => {
  const notes = loadNotes();
  const note = notes.find((n) => n.id === id);

  if (note) {
    document.getElementById('noteEditor').innerHTML = note.content;
    note.isEditing = true;
    saveNotes(notes);
  }
};

// Delete a note
window.deleteNote = (id) => {
  const notes = loadNotes();
  const updatedNotes = notes.filter((note) => note.id !== id);
  saveNotes(updatedNotes);
  renderNotes();
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  renderNotes();
});
