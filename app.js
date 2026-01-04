// app.js  (task.html / memo.html 共通)
// - Firebase init
// - Google Auth (popup)
// - helpers: status, escape, normalize, parseTags, showPicker safe

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore, collection, doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export function createFirebaseContext(firebaseConfig) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  return { app, db, auth, provider };
}

// ---------- DOM helpers ----------
export function setStatusFactory(statusEl) {
  return function setStatus(text, isWarn = false) {
    statusEl.textContent = text;
    statusEl.className = "small" + (isWarn ? " warn" : "");
  };
}

export function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function normalize(s) {
  return String(s ?? "").trim();
}

export function parseTags(s) {
  return normalize(s)
    .split(",")
    .map(x => x.trim())
    .filter(Boolean)
    .slice(0, 30);
}

export function safeShowPicker(dateInputEl) {
  try { dateInputEl.showPicker?.(); } catch (e) {}
}

// ---------- Auth helpers ----------
export async function signInGoogle(auth, provider) {
  return await signInWithPopup(auth, provider);
}

export async function signOutGoogle(auth) {
  return await signOut(auth);
}

export function onUser(auth, handler) {
  return onAuthStateChanged(auth, handler);
}

// ---------- Firestore path helpers ----------
export function tasksCol(db, uid) {
  return collection(db, "users", uid, "tasks");
}
export function memosCol(db, uid) {
  return collection(db, "users", uid, "memos");
}
export function catsCol(db, uid) {
  return collection(db, "users", uid, "categories");
}
export function taskDoc(db, uid, id) {
  return doc(db, "users", uid, "tasks", id);
}
export function memoDoc(db, uid, id) {
  return doc(db, "users", uid, "memos", id);
}
export function catDoc(db, uid, id) {
  return doc(db, "users", uid, "categories", id);
}
