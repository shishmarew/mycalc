import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const router = useRouter()

  const handleLogin = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      router.push('/dashboard') // если пользователь есть, на дашборд
    } else {
      router.push('/login') // если нет — на страницу входа
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'sans-serif',
      backgroundColor: 'black',
      padding: '20px'
    }}>
      <h1 style={{ marginBottom: '40px', fontSize: '32px', color: 'white' }}>
        Добро пожаловать
      </h1>

      <button
        onClick={handleLogin}
        style={{
          backgroundColor: '#4a3e2d',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '15px 30px',
          fontSize: '18px',
          cursor: 'pointer'
        }}
      >
        Вход
      </button>
    </div>
  )
}