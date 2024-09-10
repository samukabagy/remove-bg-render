const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/remove-bg', upload.single('image'), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `output-${Date.now()}.png`;

  exec(`rembg i ${inputPath} ${outputPath}`, (err) => {
    if (err) {
      return res.status(500).send('Error processing image');
    }

    fs.readFile(outputPath, (err, data) => {
      if (err) {
        return res.status(500).send('Error reading processed image');
      }

      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.end(data, 'binary');

      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));
