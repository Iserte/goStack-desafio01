// Importa o modulo do express
const express = require("express");

// Cria a instância do servidor
const server = express();

// Permite que o express aceite JSON em suas requisições
server.use(express.json());

// Constante para armazenar os projetos
const projects = [];

// Variável para armazenar a quantidade de requisições
let requests = 0;

// Função para logar as requisições feitas
function logRequests(req, res, next) {
  requests++;
  console.log(`Requisições feitas: ${requests};`);
  return next();
}

// Função para retornar o index do projeto
function getProject(req, res, next) {
  const { id } = req.params;
  var index = projects.map(e => e.id).indexOf(id);

  if (index == -1) {
    return res.status(400).json({ error: "Project not found" });
  }

  req.project = index;

  return next();
}

// Função para evitar duplicidade ao criar um novo projeto
function checkProjectExists(req, res, next) {
  const { id } = req.body;

  var index = projects.map(e => e.id).indexOf(id);

  if (index != -1) {
    return res.status(400).json({ error: "Project already exists" });
  }

  return next();
}

// Adiciona o Middleware de logs
server.use(logRequests);

// Cria um novo projeto
server.post("/projects", checkProjectExists, (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title, tasks: [] });

  return res.json(projects);
});

// Lista todos os projetos
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// Altera um projeto
server.put("/projects/:id", getProject, (req, res) => {
  const { title } = req.body;

  projects[req.project].title = title;

  return res.json(projects);
});

// Deleta um projeto
server.delete("/projects/:id", getProject, (req, res) => {
  projects.splice(req.project, 1);

  return res.json(projects);
});

// Cria uma task para o projeto
server.post("/projects/:id/tasks", getProject, (req, res) => {
  const { title } = req.body;

  projects[req.project].tasks.push(title);

  return res.json(projects);
});

// Faz a aplicação ouvir a porta 3000
server.listen(3000);
