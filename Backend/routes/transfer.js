import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import { transferService, transactionHistory, getDashboard, loadUser} from "../services/transferservice.js";
import { transferLimiter } from "../middleware/ratelimiter.js";
import env from "dotenv";


env.config();

const router = express.Router();



router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id; 
        
    const user = await getDashboard(userId);
    
    return res.status(200).json({
      user,
    });
   
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
});

// get user name 
router.post("/user", authMiddleware, async (req, res) => {
  const {accountInput} = req.body;

try{

const username = await loadUser(accountInput);

if (!username) {
  return res.status(404).json({
    message: "User doesn't exist"
  });
}

res.status(200).json({
  username,
});


}catch(error){
console.error(error);
res.status(500).json({
  message: "Server error"
})
}


})

// transfer 
router.post("/transfer", transferLimiter, authMiddleware, async (req, res) => {

  const senderId = req.user.id;
  const {receiverAccount, amount} = req.body;

  if(!receiverAccount || !amount){
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  if(amount <= 0){
    return res.status(400).json({
      message: "Invalid amount"
    });
  }
 
  const result = await transferService(
   senderId,
   receiverAccount,
   amount
  );

  if(!result.success){
    return res.status(400).json({
   message: result.message
    });
  }

  res.status(200).json({
    message: result.message
  });

});

//transaction route
router.get("/history", authMiddleware, async (req, res) => {
  try{ 
  const userId = req.user.id;

  if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }


  const transactions = await transactionHistory(userId);

  res.status(200).json({
  transactions
  });
}catch(error){
  console.error("ROUTE ERROR:", error);
  res.status(500).json({
    message: "Server error"
  });
}
})

export default router;