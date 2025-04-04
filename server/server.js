const express = require("express")
const app = express()
const cors = require("cors"); 
const port = 3000
const db = require("./utils/db")
const jwt = require('jsonwebtoken')
require('dotenv').config();
const bcrypt = require('bcrypt')

const corsOptions ={
    origin: ['http://localhost:5173']
}
app.use(cors(corsOptions));


app.use(express.json());

app.post("/users", async (req, res) => {
    const {name, email, password} = req.body;
    try{

        const searchUser = "SELECT * FROM users WHERE email = $1";
        const foundUser = await db.query(searchUser, [email]);
        
        if(foundUser.rows.length > 0){
            return res.status(400).send("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const query = "INSERT INTO users (name, email, password, balance) VALUES($1, $2, $3, $4) RETURNING *"
        const result = await db.query(query, [name, email, hashedPassword, 0.00]);
        res.sendStatus(201);
    }
    catch(error){
        console.log(error.message);
        res.status(500).send("Internal Error");    
    }
})

app.post("/users/login", async (req, res)=>{
    const {email, password} = req.body;
    try{

        const query = "SELECT * FROM users WHERE email = $1";
        const result = await db.query(query, [email]);
        
        if(result.rows.length === 0){
            return res.status(404).send("User not found!");
        }


        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );
        
        res.json({ token: token });

    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal Error")
    }
})

app.put(`/users`, authToken, async (req, res) => {
    const {name, password} = req.body;
    const userId = req.user.id;

    try{
        if(!name && !password){
            return res.status(400).json({message: "At least one field must be provided for update"});
        }
        if(!name){
            const hashedPassword = await bcrypt.hash(password, 10);
            const query = "UPDATE users SET password = $1 WHERE id = $2 RETURNING *";
            const result = await db.query(query, [hashedPassword, userId]);
            res.status(200).json(result.rows[0]);
        }else{
            const query = "UPDATE users SET name = $1 WHERE id = $2 RETURNING *";
            const result = await db.query(query, [name, userId]);
            res.status(200).json(result.rows[0]);
        }

    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal Error")
    }
})

app.delete(`/users`, authToken, async(req, res) =>{
    const userId = req.user.id;
    try{
        const query = "DELETE FROM users WHERE id = $1 RETURNING *";
        const result = await db.query(query, [userId]);
        res.status(200).json(result.rows[0]);
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal Error")
    }
})

app.get("/expenses/categories", authToken, async(req, res)=>{
    try{
        const query = "SELECT categories FROM expenses WHERE user_id = $1 AND type = $2";
        const result = await db.query(query, [req.user.id, "Expense"]);
        res.send(result.rows);
    }catch(error){
        console.log(error);
        res.status(500).send("Internal Error")
    }
})

app.get("/expenses/date", authToken, async(req, res)=>{
    try{
        const query = "SELECT date FROM expenses WHERE user_id = $1";
        const result = await db.query(query, [req.user.id]);
        const dates = result.rows.map(row => row.date);
        res.send(dates)
        }catch(error){
        console.log(error)
        res.status(500).send("Internal Error")
    }
})
app.post(`/expenses`, authToken, async (req, res) => {
    const { amount, description, categories, type } = req.body;

    if (!amount || !description || !categories) {
        return res.status(400).json({ message: "Amount, description, and categories are required" });
    }

    try {
        const userId = req.user.id;
        const expenseType = type !== undefined ? type : "Expense";

        const query = "INSERT INTO expenses (user_id, amount, description, categories, type) VALUES ($1, $2, $3, $4, $5) RETURNING *";
        const result = await db.query(query, [userId, amount, description, categories, expenseType]);

        if (expenseType === "Expense") {
            const alterBalanceQuery = "UPDATE users SET balance = balance - $1 WHERE id = $2";
            await db.query(alterBalanceQuery, [amount, userId]);
        }

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Error");
    }
});

app.get(`/expenses`, authToken, async (req, res) =>{

    try{
        const userId = req.user.id;
        const query = "SELECT * FROM expenses WHERE user_id = $1";
        const result = await db.query(query, [userId]);
       
        res.status(200).json(result.rows);
    }catch(error){
        console.log(error);
        res.sendStatus(500).send("Internal Error")
    }
    
})

app.put("/expenses/:id", authToken, async (req, res) => {
    const { amount, description, categories, type } = req.body;
    const { id } = req.params;
    const userId = req.user.id;

    try {
        let fields = [];
        let values = [];
        let counter = 1;
        let oldAmount = 0;
        let oldType = "";

        const queryOld = "SELECT amount, type FROM expenses WHERE id = $1 AND user_id = $2";
        const resultOld = await db.query(queryOld, [id, userId]);

        if (resultOld.rows.length === 0) {
            return res.status(404).json({ message: "Expense not found or not authorized" });
        }

        oldAmount = resultOld.rows[0].amount;
        oldType = resultOld.rows[0].type;

        if (amount !== undefined) {
            fields.push(`amount = $${counter}`);
            values.push(amount);
            counter++;
        }
        if (description !== undefined) {
            fields.push(`description = $${counter}`);
            values.push(description);
            counter++;
        }
        if (categories !== undefined) {
            fields.push(`categories = $${counter}`);
            values.push(categories);
            counter++;
        }
        if (type !== undefined) {
            fields.push(`type = $${counter}`);
            values.push(type);
            counter++;
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: "At least one field must be provided for update" });
        }

        values.push(id);
        values.push(userId);

        const query = `UPDATE expenses SET ${fields.join(", ")} WHERE id = $${counter} AND user_id = $${counter + 1} RETURNING *`;
        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Expense not found or not authorized" });
        }

        const newAmount = result.rows[0].amount;
        const newType = result.rows[0].type;

        let balanceUpdateQuery;

        if (oldType === "Expense" && newType === "Expense") {
            const amountDifference = newAmount - oldAmount;
            balanceUpdateQuery = "UPDATE users SET balance = balance - $1 WHERE id = $2";
            await db.query(balanceUpdateQuery, [amountDifference, userId]);
        }
        else if (oldType === "Expense" && newType !== "Expense") {
            // reverter gasto anterior
            balanceUpdateQuery = "UPDATE users SET balance = balance + $1 WHERE id = $2";
            await db.query(balanceUpdateQuery, [oldAmount, userId]);
        }
        else if (oldType !== "Expense" && newType === "Expense") {
            // novo agora é gasto, subtrair
            balanceUpdateQuery = "UPDATE users SET balance = balance - $1 WHERE id = $2";
            await db.query(balanceUpdateQuery, [newAmount, userId]);
        }


        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Error");
    }
});

app.delete("/expenses/:id", authToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const query = "DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *";
        const result = await db.query(query, [id, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Expense not found or not authorized" });
        }

        const { amount, type } = result.rows[0];

        if (type === "Expense") {
            const alterBalanceQuery = "UPDATE users SET balance = balance + $1 WHERE id = $2";
            await db.query(alterBalanceQuery, [amount, userId]);
        }

        res.status(200).json({ message: "Expense deleted successfully", deletedExpense: result.rows[0] });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Error");
    }
});


function authToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err) return res.sendStatus(403)
        req.user = user
        next();
    })
}

app.listen(port, () =>{
    console.log(`Server at ${port}`);
})