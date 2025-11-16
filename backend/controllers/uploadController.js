function handleUpload (req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'File upload required' });
  }

  res.status(201).json({ url: req.file.publicUrl });
}

module.exports = {
  handleUpload
};
