const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;
const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const PUBLIC_DIR = path.join(__dirname, 'html');

let products = [];

fs.readFile(PRODUCTS_FILE, (err, data) => {
    if (err) {
        console.error('Error reading products file:', err);
        products = [];
    } else {
        products = JSON.parse(data);
    }
});

app.use(cors());

app.use(express.json());

app.use(express.static(PUBLIC_DIR));

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'admin.html'));
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
});

app.post('/api/products', (req, res) => {
    const newProduct = req.body;
    newProduct.id = products.length + 1;
    products.push(newProduct);
    fs.writeFile(PRODUCTS_FILE, JSON.stringify(products), (err) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.status(201).json(newProduct);
        }
    });
});

app.put('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const updatedProduct = req.body;
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        fs.writeFile(PRODUCTS_FILE, JSON.stringify(products), (err) => {
            if (err) {
                res.status(500).send('Internal Server Error');
            } else {
                res.json(products[index]);
            }
        });
    } else {
        res.status(404).send('Product not found');
    }
});

app.delete('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
        products.splice(index, 1);
        fs.writeFile(PRODUCTS_FILE, JSON.stringify(products), (err) => {
            if (err) {
                res.status(500).send('Internal Server Error');
            } else {
                res.status(204).send();
            }
        });
    } else {
        res.status(404).send('Product not found');
    }
});

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});