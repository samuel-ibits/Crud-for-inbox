const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const multer = require("multer");
const swaggerDocs = require('./swagger');
require('dotenv').config();

const app = express();
const port = 5000;
// const uri = "mongodb://localhost:27017";


const uri = process.env.MONGODB_URI; // Access MongoDB connection string from environment variable

async function main() {
  try {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    const db = client.db('test');
    const usersCollection = db.collection('users');
    const messagesCollection = db.collection('messages');

    app.use(cors());
    const upload = multer();
    swaggerDocs(app);

    app.get("/", (req, res) => {
      res.send("Hello, welcome to the Mail Inbox API!");
    });
    
    app.get("/api/users/:userId", async (req, res) => {
      const userId = req.params.userId;
      try {
        const user = await usersCollection.findOne({
          _id: new ObjectId(userId),
        });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        const userMessages = await messagesCollection
          .find({ receiverId: userId })
          .toArray();

        const readMessages = userMessages.filter(
          (message) => message.isRead
        ).length;
        const unreadMessages = userMessages.filter(
          (message) => !message.isRead
        ).length;

        const userWithMessageCounts = {
          ...user,
          readMessages,
          unreadMessages,
          totalMessages: userMessages.length,
        };

        res.json(userWithMessageCounts);
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    
    app.get("/api/messages", async (req, res) => {
      try {
        const messages = await messagesCollection.find().toArray();
        res.json(messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    
    app.post(
      "/api/messages/:messageId/send",
      upload.none(),
      async (req, res) => {
        const messageId = req.params.messageId;

        const message = req.body.message;
        const sender = req.body.sender;

        try {
          const existingMessage = await messagesCollection.findOne({
            _id: new ObjectId(messageId),
          });

          if (!existingMessage) {
            return res.status(404).json({ error: "Message not found" });
          }

          await messagesCollection.updateOne(
            { _id: new ObjectId(messageId) },
            { $push: { conversation: { message, sender } } }
          );

          const updatedMessage = await messagesCollection.findOne({
            _id: new ObjectId(messageId),
          });

          res.json(updatedMessage);
        } catch (error) {
          console.error("Error sending message:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      }
    );

    app.get("/api/messages/:messageId", async (req, res) => {
      const messageId = req.params.messageId;
      const messages = await messagesCollection
        .find({ _id: new ObjectId(messageId) })
        .toArray();
      res.json(messages);
    });
    
    app.get("/api/receiver/:receiverId", async (req, res) => {
      const receiverId = req.params.receiverId;
      const messages = await messagesCollection
        .find({ receiverId: receiverId })
        .toArray();
      res.json(messages);
    });

    app.put("/api/messages/:messageId", upload.none(), async (req, res) => {
      const messageId = req.params.messageId;

      try {
        const isRead = req.body.isRead === "true";

        await messagesCollection.updateOne(
          { _id: new ObjectId(messageId) },
          { $set: { isRead } }
        );

        res.json({ message: "Message status updated successfully" });
      } catch (error) {
        console.error("Error updating message status:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.listen(port, () => {
      console.log(`Server is running on port: http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

main().catch(console.error);
