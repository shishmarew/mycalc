// pages/login.js
import { useEffect } from 'react'          // ⬅️ добавляем
import { useRouter } from 'next/router'     // ⬅️ добавляем
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const router = useRouter()               // ⬅️ добавляем

  useEffect(() => {
    // Ловим access_token после авторизации
    const hash = window.location.hash
    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      const access_token = params.get('access_token')
      if (access_token) {
        supabase.auth.getSession().then(() => {
          router.replace('/dashboard') // Перенаправляем на dashboard
        })
      }
    }
  }, [])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/dashboard', // ВАЖНО!
      }
    })
    if (error) console.error('Ошибка входа:', error.message)
  }

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Вход</h1>
      <button
        onClick={signInWithGoogle}
        style={{
          background: '#4a3e2d',
          color: 'white',
          fontSize: 16,
          padding: '10px 20px',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Войти через Google
      </button>
    </div>
  )
}