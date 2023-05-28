const {nanoid} = require('nanoid');
const notes = require('./notes');

// menambahkan notes
const addNoteHandler = (request, h) => {
  const {title, tags, body} = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id == id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// menampilkan notes
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

// menampilkan notes berdasarkan id
const getNoteByIdHandler = (request, h) => {
  const {id} = request.params;

  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

// edit note menggunakan id handler
const editNoteByIdHandler = (request, h) => {
  // mendapatkan nilai id menggunakan path params
  const {id} = request.params;

  // mendapatkan data notes terbaru yg dikirimkan oleh client
  const {title, tags, body} = request.payload;
  // memperbarui nilai properti setelah di edit
  const updatedAt = new Date().toISOString();

  // find index array sesuai id yg ditentukan
  const index = notes.findIndex((note) => note.id === id);

  // jika index bukan -1, maka index bernilai array dari objek notes
  if (index !== -1) {
    notes[index] = {
    // spread operator
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    // respons catatan jika berhasil diperbarui
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  // respons catatan jika gagal diperbarui, atau index = -1
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// menghapus data pada array berdasarkan index
const deleteNoteByIdHandler = (request, h) => {
  // dapatkan nilai id yg dikirimkan melalui path params
  const {id} = request.params;

  // mendapatkan index dari objek note sesuai dengan id
  const index = notes.findIndex((note) => note.id === id);

  // menghapus data pada array berdasarkan index dengan splice()
  if (index !==-1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// export handler yang digunakan
module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
