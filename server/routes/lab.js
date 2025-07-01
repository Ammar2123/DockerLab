const express = require("express");
const router = express.Router();
const Lab = require("../models/Lab");
const { encrypt, decrypt } = require("../utils/encrypt");
const { isAdmin } = require("../middleware/auth");
const Analytics = require("../models/Analytics");

// Get Labs by semester (student)
router.get("/semester/:semesterId", async (req, res) => {
  const labs = await Lab.find({ semesterId: req.params.semesterId });
  const labsOut = labs.map((lab) => {
    const out = lab.toObject();
    ["ubuntu", "windows"].forEach((os) => {
      if (out.commands[os]) {
        ["pull", "run"].forEach((type) => {
          out.commands[os][type] = (out.commands[os][type] || []).map(decrypt);
        });
      }
    });
    return out;
  });
  res.json(labsOut);
});

// Search Labs (by name)
router.get("/search/:query", async (req, res) => {
  const labs = await Lab.find({ name: new RegExp(req.params.query, "i") });
  const labsOut = labs.map((lab) => {
    const out = lab.toObject();
    ["ubuntu", "windows"].forEach((os) => {
      if (out.commands[os]) {
        ["pull", "run"].forEach((type) => {
          out.commands[os][type] = (out.commands[os][type] || []).map(decrypt);
        });
      }
    });
    return out;
  });
  res.json(labsOut);
});

// CRUD (admin)
// Add Lab (admin)
router.post("/", isAdmin, async (req, res) => {
  console.log(req.body)
  const { name, semester, description, dockerImage, commands } = req.body;
  const encCmds = {};
  ["ubuntu", "windows"].forEach((os) => {
    encCmds[os] = { pull: [], run: [] };
    ["pull", "run"].forEach((type) => {
      encCmds[os][type] = (commands[os][type] || []).map((cmd) => encrypt(cmd));
    });
  });
  const lab = await Lab.create({
    name,
    semester,
    description,
    dockerImage,
    commands: encCmds,
  });
  res.json(lab);
});

//get labs in admin
router.get("/", async (req, res) => {
  const labs = await Lab.find();

  const decryptedLabs = labs.map((lab) => {
    const labObj = lab.toObject(); // Convert Mongoose document to plain JS object

    ["ubuntu", "windows"].forEach((os) => {
      if (labObj.commands?.[os]) {
        ["pull", "run"].forEach((type) => {
          labObj.commands[os][type] = (labObj.commands[os][type] || []).map(
            decrypt
          );
        });
      }
    });

    return labObj;
  });

  res.json(decryptedLabs);
});

//get lab by id
router.get("/:id", async (req, res) => {
  const lab = await Lab.findById(req.params.id);
  if (!lab) return res.status(404).json({ error: "Not found" });
  ["ubuntu", "windows"].forEach((os) => {
    if (lab.commands[os]) {
      ["pull", "run"].forEach((type) => {
        lab.commands[os][type] = (lab.commands[os][type] || []).map(decrypt);
      });
    }
  });
  res.json(lab);
});

//edit
router.put("/:id", isAdmin, async (req, res) => {
  const { name, semesterId, description, dockerImage, commands } = req.body;
  const encCmds = {};
  ["ubuntu", "windows"].forEach((os) => {
    encCmds[os] = { pull: [], run: [] };
    ["pull", "run"].forEach((type) => {
      encCmds[os][type] = (commands[os][type] || []).map((cmd) => encrypt(cmd));
    });
  });
  const lab = await Lab.findByIdAndUpdate(
    req.params.id,
    { name, semesterId, description, dockerImage, commands: encCmds },
    { new: true }
  );
  res.json(lab);
});

//delete
router.delete("/:id", isAdmin, async (req, res) => {
  await Lab.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Increment analytics (student)
router.post("/:id/analytics", async (req, res) => {
  await Lab.findByIdAndUpdate(req.params.id, {
    $inc: { "analytics.accessed": 1 },
  });
  await Analytics.create({ labId: req.params.id });
  res.json({ success: true });
});

module.exports = router;
