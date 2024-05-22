import { PrismaClient, Question } from '@prisma/client';
import express from 'express';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { verifyJWT } from './middleware/verifyJWT';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const db = new PrismaClient();
const app = express();
const port = 3000;
const saltRounds = 10;

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ msg: "This is a public route" });
});

// ###############
// Users routes
// ###############

app.get("/users", verifyJWT, async (_, res) => {
  const users = await db.user.findMany({
    orderBy: {
      username: "asc",
    },
  });

  res.json(users);
});

app.get("/user/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ msg: "No id" })

  const user = await db.user.findUnique({
    where: { id }
  });

  if (!user) return res.status(500).json({ msg: "Could not found user" });
  res.status(500).json({ msg: "Could not found user" });
});

app.delete("/user/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ msg: "No id" })

  const user = await db.user.findUnique({
    where: { id }
  });

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  if (user.id !== req.user.id) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  await db.user.delete({
    where: { id }
  });

  res.json({ msg: "User deleted successfully" });
});

app.put("/user", verifyJWT, express.json(), async (req, res) => {
  const { username, password, id } = req.body;

  if (!username || !password || !id) return res.status(400).json({ msg: "Missing body fields" })

  if (id !== req.user.id) return res.status(401).json({ msg: "Unauthorized" });

  await db.user.update({
    where: { id },
    data: { username, password }
  });

  res.json({ msg: "User updated successfully" });
});

// ###############
// Auth routes
// ###############

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: "No username or password" });
  }

  const user = await db.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    return res.status(401).json({ msg: "User not found" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ msg: "Password is incorrect" });
  }

  const token = sign(
    { username: user.username, id: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: 60 * 5 } // Expires in 5 minutes
  );

  res.json({ token });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: "No username or password" });
  }

  if (username.length < 3) {
    return res.status(400).json({ msg: "Username too small" })
  }

  if (username.length > 20) {
    return res.status(400).json({ msg: "Username too large" });
  }

  if (password.length < 8) {
    return res.status(400).json({ msg: "Password too small" });
  }

  if (password.length > 128) {
    return res.status(400).json({ msg: "Passsword too large" });
  }

  const hash = await bcrypt.hash(password, saltRounds)

  const response = await db.user.create({
    data: { username, password: hash },
  });

  res.json(response);
});

app.get("/self", verifyJWT, (req, res) => {
  if (!req.user) {
    return res.status(401);
  }

  res.json({ user: req.user });
})

// ###############
// Quiz routes
// ###############

// TODO: Add verifyJWT to this route
app.get("/quizzes", async (_, res) => {
  const quizzes = await db.quiz.findMany({
    orderBy: { created_at: "desc" },
    include: {
      creator: {
        select: {
          username: true,
        }
      },
    },
  });

  res.json({ quizzes });
});

// TODO: Add verifyJWT in this route
app.get("/quiz/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ msg: "No id" })

  const quiz = await db.quiz.findUnique({
    where: { id },
    include: {
      questions: true,
      creator: {
        select: {
          username: true,
        }
      },
    },
  });

  res.json({ quiz });
});

app.post("/quiz", verifyJWT, async (req, res) => {
  const { title, description, questions } = req.body;

  if (!title || !description || !questions) {
    return res.status(400).json({ msg: "Missing body fields" });
  }

  await db.quiz.create({
    data: {
      title,
      description,
      questions: {
        create: questions.map((question: Question) => ({
          content: question.content,
          answers: question.answers,
          correct_answer: question.correct_answer,
        })),
      },
      creator_id: req.user.id,
    },
  });

  res.json({ msg: "Quiz created successfully" });
});

app.delete("/quiz/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ msg: "No id" });

  const quiz = await db.quiz.findUnique({
    where: { id }
  });

  if (!quiz) {
    return res.status(404).json({ msg: "Quiz not found" });
  }

  if (quiz?.creator_id !== req.user.id) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  await db.quiz.delete({
    where: { id }
  });

  res.json({ msg: "Quiz deleted successfully" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

