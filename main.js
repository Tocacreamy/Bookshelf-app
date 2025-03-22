let dataBuku = JSON.parse(localStorage.getItem("dataBuku")) || [];
let listSearchBook;

const addForm = document.getElementById("bookForm");
const searchForm = document.getElementById("searchBook");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");
let isSearch = false;

addForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let bookTitle = document.getElementById("bookFormTitle").value;
  let bookAuthor = document.getElementById("bookFormAuthor").value;
  let bookYear = document.getElementById("bookFormYear").value;
  let bookIsComplete = document.getElementById("bookFormIsComplete").checked;

  let bookId = crypto.randomUUID();

  let newBook = {
    id: bookId,
    title: bookTitle,
    author: bookAuthor,
    year: bookYear,
    isComplete: bookIsComplete,
  };

  dataBuku.push(newBook);
  localStorage.setItem("dataBuku", JSON.stringify(dataBuku));

  showMessage("buku berhasil ditambahkan");
  closeSearch();
  loadBooks();
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  isSearch = true;

  const searchTitle = document.getElementById("searchBookTitle").value;
  const headerSearch = document.getElementById("headerSearch");
  const containerSearch = document.getElementById("searchBookResult");
  const cancelSearchButton = document.getElementById("cancelSearch");

  cancelSearchButton.onclick = (e) => {
    e.preventDefault();
    closeSearch();
    loadBooks();
  };

  containerSearch.style.display = "flex";
  headerSearch.innerHTML = `Menampilkan hasil untuk "${searchTitle}"`;

  searchBook(searchTitle);
});

function closeSearch() {
  isSearch = false;
  const containerSearch = document.getElementById("searchBookResult");
  containerSearch.style.display = "none";
}

function searchBook(searchTitle) {
  listSearchBook = dataBuku.filter((buku) =>
    buku.title.toLowerCase().includes(searchTitle.toLowerCase())
  );

  loadBooks();
}

function loadBooks() {
  const renderDataBuku = isSearch ? listSearchBook : dataBuku;

  completeBookList.innerHTML = "";
  incompleteBookList.innerHTML = "";

  if (!renderDataBuku.some((book) => book.isComplete)) {
    completeBookList.innerHTML = `<p class="emptyMessage">Tidak ada buku selesai dibaca.</p>`;
  }

  if (!renderDataBuku.some((book) => !book.isComplete)) {
    incompleteBookList.innerHTML = `<p class="emptyMessage">Tidak ada buku yang belum selesai dibaca.</p>`;
  }

  renderDataBuku.forEach((book) => {
    let bookItem = document.createElement("div");
    bookItem.classList.add("bookCard");

    bookItem.innerHTML = `
      <div data-bookid="${
        book.id
      }" data-testid="bookItem">
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div class="buttonContainer">
          <button class="yellowButton" onclick="moveBook('${book.id}')">
            ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
          </button>
          <button class="redButton" onclick="showDeletePopup('${
            book.id
          }')">Hapus Buku</button>
          <button class="blueButton" onclick="editBook('${
            book.id
          }')">Edit Buku</button>
        </div>
      </div>
    `;

    if (book.isComplete) {
      completeBookList.appendChild(bookItem);
    } else {
      incompleteBookList.appendChild(bookItem);
    }
  });
}

function moveBook(bookId) {
  let bookIndex = dataBuku.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    dataBuku[bookIndex].isComplete = !dataBuku[bookIndex].isComplete;
    localStorage.setItem("dataBuku", JSON.stringify(dataBuku));
    loadBooks();
  }
}

function editBook(bookId) {
  let bookIndex = dataBuku.findIndex((book) => book.id === bookId);

  const bookEditTitle = document.getElementById("bookEditTitle");
  const bookEditAuthor = document.getElementById("bookEditAuthor");
  const bookEditYear = document.getElementById("bookEditYear");
  const bookEditIsComplete = document.getElementById("bookEditIsComplete");

  bookEditTitle.value = dataBuku[bookIndex].title;
  bookEditAuthor.value = dataBuku[bookIndex].author;
  bookEditYear.value = dataBuku[bookIndex].year;
  bookEditIsComplete.checked = dataBuku[bookIndex].isComplete;

  if (bookIndex !== -1) {
    showEditPopup(bookIndex);
  }
}

function showEditPopup(bookIndex) {
  const popup = document.getElementById("editPopup");
  popup.classList.remove("hideElement");

  const saveButton = document.getElementById("bookEditSave");
  const cancelButton = document.getElementById("bookEditCancel");

  cancelButton.onclick = (e) => {
    e.preventDefault();
    hidePopup(popup);
  };

  saveButton.onclick = (e) => {
    e.preventDefault();
    dataBuku[bookIndex].title = bookEditTitle.value;
    dataBuku[bookIndex].author = bookEditAuthor.value;
    dataBuku[bookIndex].year = bookEditYear.value;
    dataBuku[bookIndex].isComplete = bookEditIsComplete.checked;

    localStorage.setItem("dataBuku", JSON.stringify(dataBuku));
    loadBooks();
    showMessage("Buku Berhasil di Edit");
    hidePopup(popup);
  };
}

function showDeletePopup(bookId) {
  const popup = document.getElementById("deletePopup");
  popup.classList.remove("hideElement");

  const confirmDeleteButton = document.getElementById("confirmDelete");
  const cancelDeleteButton = document.getElementById("cancelDelete");
  confirmDeleteButton.onclick = () => {
    deleteBook(bookId);
    hidePopup(popup);
    showMessage("Buku Berhasil Dihapus");
  };
  cancelDeleteButton.onclick = () => {
    hidePopup(popup);
  };
}

function hidePopup(popup) {
  popup.classList.add("hideElement");
}

function deleteBook(id) {
  dataBuku = dataBuku.filter((book) => book.id !== id);
  localStorage.setItem("dataBuku", JSON.stringify(dataBuku));
  closeSearch();
  loadBooks();
}

function showMessage(message) {
  const messageContainer = document.getElementById("messageContainer");
  const popup = document.getElementById("messageAlert");
  const placeMessage = document.getElementById("Message");

  popup.classList.remove("hideElement");

  placeMessage.innerText = message;
  popup.classList.remove("hideElement");

  setTimeout(() => {
    hidePopup(popup);
  }, 2000);
}

window.addEventListener("load", loadBooks());
