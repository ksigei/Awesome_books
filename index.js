class Book {
  constructor({ title, author, id }) {
    this.title = title;
    this.author = author;
    this.id = id;
  }
}

const store = (initialData = []) => {
  let books;

  const saveToLocalStorage = (data) => {
    const booksString = JSON.stringify(data);
    localStorage.setItem('bookStoreData', booksString);
    return true;
  };

  const rawBooksData = localStorage.getItem('bookStoreData');
  if (rawBooksData) {
    books = JSON.parse(rawBooksData);
  } else {
    books = initialData;
    saveToLocalStorage(books);
  }

  const all = () => books;

  const add = (newData) => {
    if (!newData || !newData.id) {
      return false;
    }
    books.push(newData);
    return saveToLocalStorage(books);
  };

  const remove = (id) => {
    books = books.filter((book) => book.id !== id);
    return saveToLocalStorage(books);
  };

  return {
    all,
    add,
    remove,
  };
};
// Display book function:
// 1. accepts an object with {id, author, title}
// 2. creates a li element and populates the objects with it
// 3. query the ul element and appends the li to it
const displayBook = ({ title, author, id }, parentElement) => {
  const bookListItemElement = document.createElement('li');
  bookListItemElement.className = 'book-list-item';
  bookListItemElement.innerHTML = `
  <section class="book-store-section display-flex">
  <div class="display-flex">
    <h3>"${title}"</h3>&nbsp;
    <span>by</span>&nbsp;
    <p class="paragraph">${author}</p>
  </div>
  <button id="${id}" type="button" onclick="handleRemove('${id}')" class="remove-button">Remove</button>
</section>`;
  parentElement.appendChild(bookListItemElement);
};

const generateId = () => `id_${Math.random().toString(36).slice(2)}`;

const initialBooks = [
  {
    title: 'the boy with wings',
    author: 'Basit Korede',
    id: generateId(),
  },

  {
    title: 'Think Pythone',
    author: 'korede Basit',
    id: generateId(),
  },
];

const bookListElement = document.querySelector('ul.book-list');

const bookStore = store(initialBooks);
const books = bookStore.all();
books.forEach((book) => {
  displayBook(book, bookListElement);
});

const formElement = document.querySelector('#book-form');
const handleSubmition = (event) => {
  event.preventDefault();
  const title = document.querySelector('.title-input').value;
  const author = document.querySelector('.author-input').value;
  const id = generateId();
  const newBook = new Book({ title, author, id });
  if (bookStore.add(newBook)) {
    displayBook(newBook, bookListElement);
  }
};
formElement.addEventListener('submit', handleSubmition);

// eslint-disable-next-line no-unused-vars
const handleRemove = (currentId) => {
  if (bookStore.remove(currentId)) {
    const removeButton = document.getElementById(currentId);
    removeButton.parentElement.parentElement.remove();
  }
};
