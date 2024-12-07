const addBookBtn = document.getElementById("addBookBtn");
const bookForm = document.getElementById("bookForm");
const bookGrid = document.getElementById("booksGrid");
const addBookModal = document.getElementById("addBookModal");

addBookBtn.addEventListener("click", () => addBookModal.classList.remove("hidden"));

function closeModal() {
  addBookModal.classList.add("hidden");
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

function saveBooksToLocalStorage() {
  const books = [];
  document.querySelectorAll('.book-card').forEach((card) => {
    const title = card.querySelector('h4').textContent.replace(/"/g, '');
    const author = card.querySelector('p:nth-child(2)').textContent;
    const pages = card.querySelector('p:nth-child(3)').textContent.split(' ')[0];
    const isRead = card.querySelector('.btn-read').textContent === 'Read';

    books.push({ title, author, pages, isRead });
  });
  localStorage.setItem('libraryBooks', JSON.stringify(books));
}

function loadBooksFromLocalStorage() {
  const storedBooks = JSON.parse(localStorage.getItem('libraryBooks')) || [];
  storedBooks.forEach((book) => {
    const bookCard = createBookCard(book.title, book.author, book.pages, book.isRead);
    bookGrid.appendChild(bookCard);
  });
}

function createBookCard(title, author, pages, isRead) {
  const bookCard = document.createElement('div');
  bookCard.className = 'book-card bg-white p-5 gap-5 rounded-lg shadow-md flex flex-col justify-between';

  const readButtonClass = isRead ? 'bg-green-700 text-white' : 'bg-yellow-500 text-white';
  const readStatus = isRead ? 'Read' : 'Not read';

  bookCard.innerHTML = `
    <h4 class="text-2xl font-semibold my-2 text-center break-words leading-6">"${title}"</h4>
    <p class="text-xl text-gray-600 font-semibold mb-1 break-words text-center">${author}</p>
    <p class="text-xl text-gray-600 font-semibold mb-1 text-center">${pages} pages</p>
    <div class="button-group mt-2 flex flex-col justify-center gap-2">
      <button class="btn-read ${readButtonClass} text-xl font-semibold py-3 px-4 rounded">${readStatus}</button>
      <button class="btn-remove bg-gray-200 text-xl font-semibold py-3 px-4 rounded">Remove</button>
    </div>
  `;

  return bookCard;
}

function isDuplicate(title) {
  const storedBooks = JSON.parse(localStorage.getItem('libraryBooks')) || [];
  return storedBooks.some((book) => book.title.toLowerCase() === title.toLowerCase());
}

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const errorMsg = document.getElementById("errorMsg");
  errorMsg.textContent = "";

  const title = document.getElementById("bookTitle").value.trim();
  const author = document.getElementById("bookAuthor").value.trim();
  const pages = document.getElementById("bookPages").value.trim();
  const isRead = document.getElementById("bookRead").checked;

  if (isDuplicate(title)) {
    errorMsg.textContent = "This book already exists!";
    return;
  }

  const newBookCard = createBookCard(title, author, pages, isRead);
  bookGrid.appendChild(newBookCard);

  saveBooksToLocalStorage();

  closeModal();
  bookForm.reset();
});

bookGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains('btn-read')) {
    const btn = e.target;
    btn.textContent = btn.textContent === "Read" ? "Not read" : "Read";
    btn.classList.toggle("bg-green-700");
    btn.classList.toggle("bg-yellow-500");
    saveBooksToLocalStorage();
  }

  if (e.target.classList.contains('btn-remove')) {
    e.target.closest('.book-card').remove();
    saveBooksToLocalStorage();
  }
});

document.addEventListener("DOMContentLoaded", loadBooksFromLocalStorage);