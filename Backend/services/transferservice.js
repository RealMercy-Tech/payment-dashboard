import db from "../config/db.js"


export async function transferService(senderId, receiverAccount, amount) {
    const client = await db.connect();
    try{
  await client.query("BEGIN");

    // get sender
    const senderResult = await client.query("SELECT id, username, balance FROM users WHERE id = $1", 
        [senderId]
    );

    const sender = senderResult.rows[0];

    // get receiver 
    const receiverResult = await client.query("SELECT id, username, balance FROM users WHERE phone_num = $1",
        [receiverAccount]
    );

    // if receiver doesn't exist
    if(receiverResult.rows.length === 0){
      throw new Error ("Recipient not found");
    }

    const receiver = receiverResult.rows[0];
    
    //prevent self transfer
    if(sender.id === receiver.id){
        throw new Error ("You cannot send to your self");
    }

   // check if sender has enough money
   if(Number(sender.balance) < Number(amount)){
    throw new Error ("Insuficient balance")
   }

    // Debit sender
     const debit  = await client.query("UPDATE users SET balance = balance - $1 WHERE id = $2 RETURNING *",
        [amount, sender.id]
    );

    if(debit.rows.length === 0){
        throw new Error ("Insufficient balance");
    }

    // Credit receiver
    await client.query("UPDATE users SET balance = balance + $1 WHERE id = $2",
        [amount, receiver.id]
    );

    // save transaction
    await client.query(
        "INSERT INTO transaction (sender_id, receiver_id, amount, transfer_type, status) VALUES ($1, $2, $3, $4, $5)",
    [
        sender.id,
        receiver.id,
        amount,
        "transfer",
        "Successful"
    ]
    );

    await client.query("COMMIT");

    return{
        success: true,
        message: `${Number(amount).toLocaleString()} sent to ${receiver.username}`
    };


    }catch(err){
  await client.query("ROLLBACK");
   return {
    success: false,
    message: err.message
   }
    } finally {
        client.release();
    }
};


 export async function transactionHistory (userId) {
     try{
    const result = await db.query(
`SELECT t.id, t.amount, t.status, t.transfer_type, t.created_at, 
sender.username AS sender_name, receiver.username AS receiver_name 
         FROM "transaction" t 
JOIN users sender ON t.sender_id = sender.id
JOIN users receiver ON t.receiver_id = receiver.id
  WHERE t.sender_id = $1 OR  t.receiver_id = $1
   ORDER BY t.created_at DESC`,
    [userId]
    );

   return result.rows;
     }catch(error){
         console.error("DB ERROR:", error); 
  throw new Error ("failed to fetch transactions")
     }
}

// dashboard logic 

export  async function getDashboard(userId) {

   try{  
     const result = await db.query(
      "SELECT id, username, email, phone_num, balance FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error ("User not found");
    }

    const user = result.rows[0];

    return{
    
        id: user.id,
        username: user.username,
        email: user.email,
       // phonenum: user.phone_num,
        balance: Number(user.balance),

    };

} catch(error){
     throw new Error ("server Error");
}

}

// get username
export async function loadUser(accountInput) {

    try{

const result = await db.query("SELECT id, username FROM users WHERE phone_num = $1",
  [accountInput]
);

if(result.rows.length === 0){
 return null;
};

return result.rows[0].username;


}catch(error){
throw new Error ("Server error");
}

}
