import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export async function authSignup(req, res) {
  const { username, email, phonenum, password } = req.body;

  const saltRound = 10;

  try {

    // check if user exists
    const existingUser = await db.query(
      "SELECT * FROM users WHERE phone_num = $1",
      [phonenum]
    );

    // check if email exist 
    const existEmail = await db.query("SELECT * FROM users WHERE email = $1",
    [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    if(existEmail.rows.length > 0){
      return res.status(400).json({
        message: "email already exist"
      });
    }
    
    // hash password
    const hash = await bcrypt.hash(password, saltRound);

    // insert user
    const result = await db.query(
      `INSERT INTO users 
      (username, email, phone_num, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email`,
      [username, email, phonenum, hash]
    );

    return res.status(201).json({
      message: "User created successfully",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);

    return res.status(500).json({
      message: "Server error"
    });
  }
}

export async function authLogin(req, res) {
    
 const {username, password} = req.body;
   
    try { 
// check if username exist 

    const user = await db.query("SELECT * FROM users WHERE username = $1",
        [username]
    );
  
    if(user.rows.length === 0){
       return res.status(404).json({
        message: "User not found"
       });
    }

    if (!username || !password) {
  return res.status(400).json({
    message: "Username and password are required"
  });
}

     // compare password
     const matched = await bcrypt.compare(password, user.rows[0].password);

     if(!matched){
        return res.status(401).json({
            message: "Wrong password"
        });
     }

     const dbUser = user.rows[0];

       const token = jwt.sign(
      { id: dbUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
   
    return res.status(200).json({
        message: "Login successful",
        token,
         user: {
        userId: dbUser.id,
        username: dbUser.username
      }
     })

    } catch (error){
       console.error(error);
    res.status(500).json({message: "Server error"});
    }

}