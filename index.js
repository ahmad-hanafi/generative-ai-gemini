const express = require("express");
const dotenv = require("dotenv")
const multer = require("multer")
const fs = require('fs')
const path = require('path')
const { GoogleGenerativeAI } = require('@google/generative-ai')

dotenv.config()
const app = express();
app.use(express.json())

const port = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.APIKEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash'})

const upload = multer({ dest: 'uploads/'})

// ENDPOINT UNTUK GENERATE TEXT
app.post("/generate-text", async (req,res) => {
    console.log(req, " <<<<<<< ini req");
    console.log(req.body, " <<<<<<< ini req.body");
    const { prompt } = req.body
    console.log(prompt, " <<<<<<< ini promp");
    try {
        const result = await model.generateContent(prompt)
        const response = result.response
        const text = response.text()
        res.status(200).json({ output: text })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message})
    }
})

// function untuk membaca file upload
const imageGenerativePart = (filePath, mimeType) => ({
    inlineData: {
        data: fs.readFileSync(filePath).toString('base64'),
        mimeType: mimeType
    }
})

// ENDPOINT UNTUK MEMBACA IMAGE
app.post("/generate-from-image", upload.single('image'), async (req, res) => {
    try {
        const { prompt } = req.body
        const image = imageGenerativePart(req.file.path, req.file.mimetype)

        const result = await model.generateContent([prompt, image])
        const response = result.response
        const text = response.text()

        res.status(200).json({ output : text})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message})
    } finally {
        fs.unlinkSync(req.file.path)
    }
})

// ENDPOINT UNTUK MEMBACA DOKUMEN
app.post("/generate-from-document", upload.single('document'), async (req, res) => {
    try {
        const { prompt } = req.body
        const document = imageGenerativePart(req.file.path, req.file.mimetype)

        const result = await model.generateContent([prompt, document])
        const response = result.response
        const text = response.text()

        res.status(200).json({ output : text})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message})
    } finally {
        fs.unlinkSync(req.file.path)
    }
})

// ENDPOINT UNTUK MEMBACA AUDIO
app.post("/generate-from-audio", upload.single('audio'), async (req, res) => {
    try {
        const { prompt } = req.body
        const audio = imageGenerativePart(req.file.path, req.file.mimetype)

        const result = await model.generateContent([prompt, audio])
        const response = result.response
        const text = response.text()

        res.status(200).json({ output : text})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message})
    } finally {
        fs.unlinkSync(req.file.path)
    }
})

app.listen(port, () => {
    console.log(`Gemini API server is running at http://localhost:${port}`);
})