import React, { useState } from "react";
import accountsService from "../services/accountsService";

function AddAccount({ fetchAccounts }) {

  const [account, setAccount] = useState({
    username: "",
    email: "",
    role: "STAFF",
    password: ""
  });

  const handleChange = (e) => {
    setAccount({
      ...account,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await accountsService.create(account);
      alert("Account Added Successfully");
      fetchAccounts(); // refresh list
      setAccount({
        username: "",
        email: "",
        role: "STAFF",
        password: ""
      });
    } catch (error) {
      console.error("Error adding account:", error);
      alert("Failed to add account. Please check the inputs.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Account</h2>

      <div className="form-group">
        <label>Username</label>
        <input type="text" name="username" placeholder="Username" value={account.username} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input type="email" name="email" placeholder="Email" value={account.email} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Role</label>
        <select name="role" value={account.role} onChange={handleChange} required>
          <option value="ADMIN">Admin</option>
          <option value="STAFF">Staff</option>
          <option value="SUPPLIER">Supplier</option>
        </select>
      </div>

      <div className="form-group">
        <label>Password</label>
        <input type="password" name="password" placeholder="Password" value={account.password} onChange={handleChange} required />
      </div>

      <button type="submit">Add Account</button>

    </form>
  );
}

export default AddAccount;
