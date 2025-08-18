import express from "express";
//the funciton of theis file is to create an Express application
//Express is a web framework for Node.js that simplifies the process of building web applications
const app = express();

app.get("/", (req, res) => {//app.get is used to define a route for GET requests
    res.send("Hello World");
});

export default app;
