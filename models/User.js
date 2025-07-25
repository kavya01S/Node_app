const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  dob:       { type: Date,   required: true },
  designation: { type: String },
  role:      { type: String },
  mobile:    { type: String, required: true },
  password:  { type: String, required: true }, // ✅ Password field
  createdAt: { type: Date, default: Date.now }
});


// ✅ Method to compare password
userSchema.methods.comparePassword = async function (plainPassword) {
  return await argon2.verify(this.password, plainPassword);
};

module.exports = mongoose.model('User', userSchema);
