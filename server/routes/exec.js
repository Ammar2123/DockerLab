const express = require('express');
const router = express.Router();
const { PythonShell } = require('python-shell');

// POST /api/exec { command: 'docker pull ...' }
router.post('/', async (req, res) => {
  const { command } = req.body;
  let pyshell = new PythonShell('python/docker_runner.py', { mode: 'json' });
  let output = '';
  pyshell.send({ command });
  pyshell.on('message', function (message) {
    output = message;
  });
  pyshell.end(function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json(output);
  });
});

module.exports = router;