app.post("/login", (req, res) => {
    const { email, password } = req.body;
    
    // Use UserModel to find the user by email
    UserModel.findOne({ email: email })
      .then(user => {
        if (user) {
          // Check if the password matches
          if (user.password === password) {
            res.json("Success"); // Login successful
          } else {
            res.json("Incorrect"); // Password does not match
          }
        } else {
          res.json("Not Registered"); // Email not found
        }
      })
      .catch(err => res.status(500).json("Error: " + err)); // Catch any errors
  });
  