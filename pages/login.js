// pages/login.js
import { Klee_One } from 'next/font/google'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
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