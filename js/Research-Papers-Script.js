import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  set,
  child,
  push,
  onValue,
  query,
  orderByChild,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  listAll,
  deleteObject,
  uploadBytes,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAPgWFqszS_2o_40rIUbZhSDPgsxl3u5n0",
  authDomain: "interidentity-90d32.firebaseapp.com",
  databaseURL: "https://interidentity-90d32-default-rtdb.firebaseio.com",
  projectId: "interidentity-90d32",
  storageBucket: "interidentity-90d32.appspot.com",
  messagingSenderId: "564846928127",
  appId: "1:564846928127:web:abf02f06edd576fcd12cca",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getDatabase();
const storage = getStorage(firebaseApp);

const papersMainContainer = document.querySelector(".papers-container");
const mainContainer = document.querySelector(".main-container");
const prevPageButton = document.getElementById("prev-page");
const nextPageButton = document.getElementById("next-page");
const pageButtonsContainer = document.getElementById("page-buttons");

let currentPage = sessionStorage.getItem("currentPage")
  ? parseInt(sessionStorage.getItem("currentPage"))
  : 1;
const itemsPerPage = 9;

prevPageButton.addEventListener("click", () => changePage(currentPage - 1));
nextPageButton.addEventListener("click", () => changePage(currentPage + 1));

async function displayNewsContent(page = 1) {
  papersMainContainer.innerHTML = "";

  const papersRef = ref(database, "researchPapers");
  const snapshot = await get(papersRef);
  const snapshotData = snapshot.val();

  if (!snapshotData) {
    prevPageButton.style.display = "none";
    nextPageButton.style.display = "none";
    return;
  }

  const papersArray = Object.keys(snapshotData).map((key) => ({
    id: key,
    data: snapshotData[key],
  }));

  papersArray.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));

  const totalPages = Math.ceil(papersArray.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = page * itemsPerPage;

  const paginatedNews = papersArray.slice(startIndex, endIndex);

  paginatedNews.forEach(({ id, data }) => {
    const papersContent = document.createElement("div");
    papersContent.classList.add("papers-content");

    const h1 = document.createElement("h1");
    h1.textContent = `${data.title}`;

    const author = document.createElement("p");
    author.classList.add("author-text");
    author.textContent = `${data.author}`;

    const papers = document.createElement("p");
    papers.classList.add("papers-text");
    papers.textContent = `${data.content}`;

    const btnDownload = document.createElement("button");
    btnDownload.classList.add("btn-download");
    btnDownload.textContent = "Download PDF";

    papersContent.appendChild(h1);
    papersContent.appendChild(author);
    papersContent.appendChild(papers);
    papersContent.appendChild(btnDownload);

    papersMainContainer.appendChild(papersContent);

    btnDownload.addEventListener("click", async () => {
      try {
        const papersFileRef = storageRef(
          storage,
          `researchPapers/${id}/${data.fileName}`
        );

        const fileUrl = await getDownloadURL(papersFileRef);
        const response = await fetch(fileUrl);
        const blob = await response.blob();

        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = data.fileName; // Specify the file name to be downloaded
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } catch (error) {
        console.error("Failed to download file:", error);
      }
    });
  });

  updatePageButtons(totalPages);
  updateNavButtons(totalPages);
  sessionStorage.setItem("currentPage", currentPage);
}

function updatePageButtons(totalPages) {
  pageButtonsContainer.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    if (i === currentPage) {
      pageButton.style.fontWeight = "bold";
    }
    pageButton.addEventListener("click", () => changePage(i));
    pageButtonsContainer.appendChild(pageButton);
  }
}

function updateNavButtons(totalPages) {
  prevPageButton.style.display = currentPage > 1 ? "inline-block" : "none";
  nextPageButton.style.display =
    currentPage < totalPages ? "inline-block" : "none";
}

function changePage(page) {
  currentPage = page;
  displayNewsContent(currentPage);
}

displayNewsContent(currentPage);
