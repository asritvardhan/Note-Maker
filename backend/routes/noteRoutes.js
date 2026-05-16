import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  getNotes,
  getSingleNote,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  searchNotes,
} from "../controllers/notesController.js";

const router = express.Router();

router.get("/notes", protect, getNotes);

router.get("/notes/:id", protect, getSingleNote);

router.post("/notes", protect, createNote);

router.put("/notes/:id", protect, updateNote);

router.delete("/notes/:id", protect, deleteNote);

router.post("/notes/:id/share", protect, shareNote);

router.get("/search", protect, searchNotes);

export default router;