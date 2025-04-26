// pages/dashboard.js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      } else {
        router.push('/login') // Если не залогинен — редиректим на login
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login') // После выхода кидаем на login
  }

  if (!user) {
    return <div>Загрузка...</div>
  }

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Добро пожаловать, {user.email}!</h1>
      <button
        onClick={handleLogout}
        style={{
          background: '#e74c3c',
          color: 'white',
          fontSize: 16,
          padding: '10px 20px',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          marginTop: 20
        }}
      >
        Выйти
      </button>
    </div>
  )
}