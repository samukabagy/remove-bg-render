const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Adicionando suporte a CORS
const app = express();
const upload = multer({ dest: 'uploads/' });

// Adiciona suporte a CORS
app.use(cors());

app.post('/remove-bg', upload.single('image'), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join('uploads', `output-${Date.now()}.png`);

  exec(`rembg i ${inputPath} ${outputPath}`, (err) => {
    if (err) {
      console.error('Error executing rembg:', err);
      return res.status(500).send('Erro ao processar a imagem');
    }

    fs.readFile(outputPath, (err, data) => {
      if (err) {
        console.error('Error reading processed image:', err);
        return res.status(500).send('Erro ao ler a imagem processada');
      }

      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.end(data, 'binary');

      // Limpa arquivos temporários
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
