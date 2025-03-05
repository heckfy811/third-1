const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware для статических файлов
app.use(express.static(path.join(__dirname, 'html')));

// Маршрут для основной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Frontend server is running on http://localhost:${PORT}`);
});