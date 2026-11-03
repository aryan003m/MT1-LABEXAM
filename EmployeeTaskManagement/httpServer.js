
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending"
    },
    {
        id: 2,
        taskName: "Design Dashboard",
        assignedTo: "Priya Verma",
        status: "In Progress"
    },
    {
        id: 3,
        taskName: "Test Registration Form",
        assignedTo: "Amit Kumar",
        status: "Completed"
    }
];

const server = http.createServer((req, res) => {

    if (req.method === "GET" && req.url === "/") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(`
            <h1>Welcome to Employee Task Management</h1>
            <p>Manage employee tasks easily.</p>
        `);
    }

    else if (req.method === "GET" && req.url === "/tasks") {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(tasks));
    }

    else if (req.method === "GET" && req.url === "/about") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(`
            <h1>About Application</h1>
            <p>Employee Task Management Application
            built using Node.js.</p>
        `);
    }

    else if (req.method === "GET" && req.url === "/home") {

        const filePath = path.join(
            __dirname,
            "public",
            "index.html"
        );

        fs.readFile(filePath, "utf8", (err, data) => {

            if (err) {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });

                res.end("Error loading HTML file");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);
        });
    }

    // ADD NEW TASK
    else if (
        req.method === "POST" &&
        req.url === "/add-task"
    ) {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {

            try {

                const newTask = JSON.parse(body);

                if (
                    newTask.id === undefined ||
                    !newTask.taskName ||
                    !newTask.assignedTo ||
                    !newTask.status
                ) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        message: "All required fields are necessary"
                    }));

                    return;
                }

                const exists = tasks.some(
                    task => String(task.id) === String(newTask.id)
                );

                if (exists) {
                    res.writeHead(409, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        message: "Task ID already exists"
                    }));

                    return;
                }

                tasks.push(newTask);

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Task added successfully",
                    task: newTask
                }));

            } catch (error) {

                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Invalid JSON request"
                }));
            }
        });
    }

    // INVALID ROUTE
    else {

        res.writeHead(404, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            message: "Route not found"
        }));
    }

});
server.listen(PORT, () => {
    console.log(
        `HTTP Server running at http://localhost:${PORT}`
    );
});
