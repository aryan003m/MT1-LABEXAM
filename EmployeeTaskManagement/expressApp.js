
import express from "express";

const app = express();

const PORT = 4000;

app.use(express.json());

let tasks = [

    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending",
        priority: "High"
    },

    {
        id: 2,
        taskName: "Design Dashboard",
        assignedTo: "Priya Verma",
        status: "In Progress",
        priority: "Medium"
    },

    {
        id: 3,
        taskName: "Test Registration Form",
        assignedTo: "Amit Kumar",
        status: "Completed",
        priority: "Low"
    }

];

app.get("/tasks", (req, res) => {

    res.status(200).json(tasks);

});

app.get("/tasks/:id", (req, res) => {

    const id = req.params.id;

    const task = tasks.find(
        task => String(task.id) === id
    );

    if (!task) {

        return res.status(404).json({
            message: "Task not found"
        });

    }

    res.status(200).json(task);

});

app.post("/tasks", (req, res) => {

    const newTask = req.body;

    if (
        !newTask ||
        newTask.id === undefined ||
        !newTask.taskName ||
        !newTask.assignedTo ||
        !newTask.status ||
        !newTask.priority
    ) {

        return res.status(400).json({
            message: "All task fields are required"
        });

    }

    const exists = tasks.some(
        task => String(task.id) === String(newTask.id)
    );

    if (exists) {

        return res.status(409).json({
            message: "Task ID already exists"
        });

    }

    tasks.push(newTask);

    res.status(201).json({

        message: "Task added successfully",
        task: newTask

    });

});

app.put("/tasks/:id", (req, res) => {

    const id = req.params.id;

    const task = tasks.find(
        task => String(task.id) === id
    );

    if (!task) {

        return res.status(404).json({
            message: "Task not found"
        });

    }

    const {
        taskName,
        assignedTo,
        status,
        priority
    } = req.body;

    if (
        !taskName ||
        !assignedTo ||
        !status ||
        !priority
    ) {

        return res.status(400).json({
            message: "All task fields are required"
        });

    }

    task.taskName = taskName;
    task.assignedTo = assignedTo;
    task.status = status;
    task.priority = priority;

    res.status(200).json({

        message: "Task updated successfully",
        task: task

    });

});

app.delete("/tasks/:id", (req, res) => {

    const id = req.params.id;

    const index = tasks.findIndex(
        task => String(task.id) === id
    );

    if (index === -1) {

        return res.status(404).json({
            message: "Task not found"
        });

    }

    const deletedTask = tasks.splice(index, 1);

    res.status(200).json({

        message: "Task deleted successfully",
        task: deletedTask[0]

    });

});

// INVALID ROUTE
app.use((req, res) => {

    res.status(404).json({
        message: "Route not found"
    });

});

// START SERVER
app.listen(PORT, () => {

    console.log(
        `Express Server running at http://localhost:${PORT}`
    );

});
