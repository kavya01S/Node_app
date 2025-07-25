const User = require('../models/User');
const argon2 = require('argon2');

// ✅ SIGNUP (Create User securely)
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      dob,
      designation,
      role,
      mobile,
      password,
      reEnterPassword
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !dob || !mobile || !password || !reEnterPassword) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Check password match
    if (password !== reEnterPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check for existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await argon2.hash(password);

    // Save new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      dob,
      designation,
      role,
      mobile,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//login

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log(user);
    console.log('User from DB:', user);
console.log('Entered password:', password);
console.log('Stored hash:', user.password);


    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await argon2.verify(user.password, password); // password is plain text
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    res.json({ message: 'Login successful', userId: user._id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET ALL USERS (without password)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET SINGLE USER BY ID (without password)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE USER (hash password if changed)
exports.updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await argon2.hash(updateData.password);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User updated successfully', user });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
