import Note from "../models/Note.js";
import User from "../models/User.js";

const getNotes = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const notes = await Note.find({
      owner: req.user._id,
    })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getSingleNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    const isOwner = note.owner.toString() === req.user._id.toString();

    const isShared = note.sharedWith.includes(req.user._id);

    if (!isOwner && !isShared) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createNote = async (req, res) => {
  try {
    const { title, content, isPinned, priority } = req.body;

    const note = await Note.create({
      title,
      content,
      owner: req.user._id,
      isPinned,
      priority,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (note.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    note.isPinned = req.body.isPinned ?? note.isPinned;
    note.priority = req.body.priority || note.priority;

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (note.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await note.deleteOne();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const shareNote = async (req, res) => {
  try {
    const { share_with_email } = req.body;

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (note.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const user = await User.findOne({
      email: share_with_email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!note.sharedWith.includes(user._id)) {
      note.sharedWith.push(user._id);
    }

    await note.save();

    res.status(200).json({
      message: "Note shared successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const searchNotes = async (req, res) => {
  try {
    const q = req.query.q;

    const notes = await Note.find({
      owner: req.user._id,
      $or: [
        {
          title: {
            $regex: q,
            $options: "i",
          },
        },
        {
          content: {
            $regex: q,
            $options: "i",
          },
        },
      ],
    });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export {
  getNotes,
  getSingleNote,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  searchNotes,
};