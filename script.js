// Utility to generate unique IDs
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

// Load saved notes from localStorage
const loadNotes = () => JSON.parse(localStorage.getItem('notes')) || [];

// Save notes to localStorage
const saveNotes = (notes) => localStorage.setItem('notes', JSON.stringify(notes));

// Render notes in the UI
const renderNotes = () => {
  const notesContainer = document.getElementById('notesContainer');
  notesContainer.innerHTML = '';

  const notes = loadNotes();
  notes.forEach((note) => {
    const noteElement = document.createElement('div');
    noteElement.className = 'note';
    noteElement.innerHTML = `
      <h1>${note.headline}</h1>
      <div style="background-color: ${note.color}">${note.content}</div>
      <div class="note-actions">
        <button onclick="editNote('${note.id}')">Edit</button>
        <button onclick="deleteNote('${note.id}')">Delete</button>
      </div>
    `;
    notesContainer.appendChild(noteElement);
  });
};

// Handle image upload and resize to 300x300
const handleImageUpload = (file) => {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 300;

      // Resize the image to 300x300
      ctx.drawImage(img, 0, 0, 300, 300);

      const resizedImage = canvas.toDataURL('image/jpeg');
      const noteEditor = document.getElementById('noteEditor');
      const imgTag = `<img src="${resizedImage}" alt="Uploaded Image">`;
      noteEditor.innerHTML += imgTag;
    };
  };
  reader.readAsDataURL(file);
};

// Apply bold text
document.getElementById('boldButton').addEventListener('click', () => {
  document.execCommand('bold');
});

// Apply or toggle green highlight
document.getElementById('highlightGreenButton').addEventListener('click', () => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const selectedText = range.startContainer;

  if (selectedText && selectedText.parentElement.style.backgroundColor === 'rgb(140, 255, 50)') {
    // Remove the highlight if it's already green
    document.execCommand('backColor', false, 'transparent');
  } else {
    // Apply the green highlight
    document.execCommand('backColor', false, '#8cff32');
  }
});

// Apply or toggle yellow highlight
document.getElementById('highlightYellowButton').addEventListener('click', () => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const selectedText = range.startContainer;

  if (selectedText && selectedText.parentElement.style.backgroundColor === 'rgb(253, 255, 50)') {
    // Remove the highlight if it's already yellow
    document.execCommand('backColor', false, 'transparent');
  } else {
    // Apply the yellow highlight
    document.execCommand('backColor', false, '#fdff32');
  }
});

// Apply font color
document.getElementById('fontColorSelect').addEventListener('change', (event) => {
  const color = event.target.value;
  document.execCommand('foreColor', false, color);
});

// Save the current note
document.getElementById('saveButton').addEventListener('click', () => {
  const noteEditor = document.getElementById('noteEditor');
  const headline = document.getElementById('noteHeadline').value.trim();
  const content = noteEditor.innerHTML.trim();
  const backgroundColor = noteEditor.style.backgroundColor || '#fff';  // Get the background color

  if (!content || !headline) {
    alert('Please add a headline and some content before saving.');
    return;
  }

  const notes = loadNotes();
  const existingNoteIndex = notes.findIndex((note) => note.isEditing);

  if (existingNoteIndex !== -1) {
    // Update the existing note
    notes[existingNoteIndex].content = content;
    notes[existingNoteIndex].headline = headline;
    notes[existingNoteIndex].color = backgroundColor;
    notes[existingNoteIndex].isEditing = false;
  } else {
    // Add a new note with the headline and color
    notes.push({ id: generateId(), headline, content, color: backgroundColor, isEditing: false });
  }

  saveNotes(notes);
  renderNotes();
  noteEditor.innerHTML = '';
  document.getElementById('noteHeadline').value = ''; // Clear headline input
  noteEditor.style.backgroundColor = ''; // Reset the background color
});

// Edit a note
window.editNote = (id) => {
  const notes = loadNotes();
  const note = notes.find((n) => n.id === id);

  if (note) {
    document.getElementById('noteEditor').innerHTML = note.content;
    document.getElementById('noteHeadline').value = note.headline; // Set the headline
    document.getElementById('noteEditor').style.backgroundColor = note.color;
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

// Change the note background color
document.querySelectorAll('.color-button').forEach((button) => {
  button.addEventListener('click', (event) => {
    const color = event.target.getAttribute('data-color');
    document.getElementById('noteEditor').style.backgroundColor = color;
  });
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  renderNotes();

  // Image upload handler
  const imageUploader = document.getElementById('imageUploader');
  imageUploader.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  });
});
