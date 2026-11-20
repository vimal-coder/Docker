import { useEffect, useState } from 'react'
import './App.css'

const API_URL = '/api/users'
const emptyForm = { name: '', age: '', mobile: '' }

function App() {
  const [form, setForm] = useState(emptyForm)
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadUsers = async () => {
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error('Failed to load users')
      setUsers(await res.json())
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)

    if (!/^[0-9]{10}$/.test(form.mobile)) {
      setMessage({ type: 'error', text: 'Mobile number must be exactly 10 digits' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          age: Number(form.age),
          mobile: form.mobile,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        const detail = Array.isArray(data.detail)
          ? data.detail.map((d) => d.msg).join(', ')
          : data.detail
        throw new Error(detail || 'Failed to save user')
      }
      setMessage({ type: 'success', text: `Saved ${data.name} successfully` })
      setForm(emptyForm)
      loadUsers()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>User Details</h1>

      <form className="card" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </label>

        <label>
          Age
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="Enter your age"
            min="1"
            max="120"
            required
          />
        </label>

        <label>
          Mobile Number
          <input
            type="tel"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            placeholder="10 digit mobile number"
            maxLength={10}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Submit'}
        </button>

        {message && <p className={`message ${message.type}`}>{message.text}</p>}
      </form>

      <div className="card">
        <h2>Saved Users</h2>
        {users.length === 0 ? (
          <p className="empty">No users yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Mobile</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.age}</td>
                  <td>{u.mobile}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default App
