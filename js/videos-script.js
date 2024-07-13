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

const animationContent = document.querySelector(".animation-content");

// displayVideos();

const videosNav = document.querySelectorAll(".videos-nav a");

// document.querySelector(`.D-animated-videos`).style.textDecoration = "underline";

videosNav.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.className != "btn-quiz") {
      videosNav.forEach((btn1) => {
        btn1.style.textDecoration = "none";
      });

      btn.style.textDecoration = "underline";

      sessionStorage.setItem("videos-nav", btn.className);
      displayVideos();
    }
  });
});

displayVideos();

async function displayVideos() {
  const nav = sessionStorage.getItem("videos-nav") || "animated-videos";
  document.querySelector(`.${nav}`).style.textDecoration = "underline";

  const videosRef = ref(database, `videos`);
  animationContent.innerHTML = "";

  const snapshot = await get(videosRef);
  const snapshotData = snapshot.val();

  for (const ID in snapshotData) {
    const data = snapshotData[ID];

    if (
      data.type === nav ||
      (data.type === "2D-animated-videos" && nav === "animated-videos")
    ) {
      const videoContent = document.createElement("div");
      videoContent.classList.add("video-content");

      const iframe = document.createElement("iframe");
      iframe.src = `${data.link}`;
      iframe.allowFullscreen = true;

      const videoDiv = document.createElement("div");
      videoDiv.classList.add("video-title-description");

      const videoTitle = document.createElement("h1");
      videoTitle.classList.add("video-title");
      videoTitle.textContent = `${data.title}`;

      const videoDescription = document.createElement("p");
      videoDescription.classList.add("video-description");
      videoDescription.textContent = `${data.description}`;

      videoDiv.appendChild(videoTitle);
      videoDiv.appendChild(videoDescription);

      videoContent.appendChild(iframe);
      videoContent.appendChild(videoDiv);

      animationContent.appendChild(videoContent);
    }
  }
}

document.addEventListener("headerLoaded", () => {
  document.querySelector(".header-nav .btn-videos").style.textDecoration =
    "underline";
});
