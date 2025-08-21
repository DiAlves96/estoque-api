import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o banco Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Rota de teste
app.get("/", (req, res) => {
  res.send("API de Controle de Estoque 🚀");
});

// Rota para listar produtos
app.get("/produtos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM produtos");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar produtos");
  }
});

// Rota para adicionar produto
app.post("/produtos", async (req, res) => {
  const { nome, quantidade, localizacao } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO produtos (nome, quantidade, localizacao) VALUES ($1, $2, $3) RETURNING *",
      [nome, quantidade, localizacao]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao adicionar produto");
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
