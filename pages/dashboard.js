import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [calculators, setCalculators] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUserAndData() {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) {
        console.error('Ошибка получения юзера:', error.message)
        setLoading(false)
        return
      }

      setUser(user)
      if (user) {
        await loadCalculators(user.id)
      }
      setLoading(false)
    }

    loadUserAndData()
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading, user, router])

  async function loadCalculators(userId) {
    console.log('Пытаюсь загрузить калькуляторы для user_id:', userId)

    const { data, error } = await supabase
      .from('calculators')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Ошибка загрузки калькуляторов:', error.message)
    } else {
      console.log('Найденные калькуляторы:', data)
      setCalculators(data)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Вы уверены, что хотите удалить калькулятор?')
    if (!confirmDelete) return

    const { error } = await supabase
      .from('calculators')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Ошибка удаления калькулятора:', error.message)
    } else {
      setCalculators(prev => prev.filter(calc => calc.id !== id))
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
        <h1>Загрузка...</h1>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div style={{
        padding: 40,
        fontFamily: 'sans-serif',
        backgroundColor: 'white',
        minHeight: '100vh' // чтобы растягивался на весь экран даже если мало контента
      }}>
      <h1>Добро пожаловать, {user.user_metadata?.full_name || user.email}!</h1>

      <button
        onClick={handleLogout}
        style={{
          background: 'red',
          color: 'white',
          padding: '10px 20px',
          borderRadius: 8,
          border: 'none',
          cursor: 'pointer',
          marginBottom: 20
        }}
      >
        Выйти
      </button>

      <h2>Мои калькуляторы:</h2>

      <button
        onClick={() => router.push('/create')}
        style={{
          background: '#4a3e2d',
          color: 'white',
          padding: '10px 20px',
          borderRadius: 8,
          border: 'none',
          cursor: 'pointer',
          marginBottom: 20,
          marginTop: 10
        }}
      >
        ➕ Создать новый калькулятор
      </button>

      {calculators.length > 0 ? (
        <ul style={{ listStyle: 'none', paddingLeft: 0, width: '100%', maxWidth: 600 }}>
          {calculators.map((calc) => (
            <li
              key={calc.id}
              style={{
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'gray',
                padding: '12px 16px',
                borderRadius: '8px',
                color: 'white',
                fontSize: '18px'
              }}
            >
              <span style={{ wordBreak: 'break-word' }}>{calc.title}</span>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => router.push(`/edit/${calc.slug}`)}
                  style={{
                    background: '#4a90e2',
                    color: 'black',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  ✏️
                </button>

                <button
                  onClick={() => handleDelete(calc.id)}
                  style={{
                    background: '#ff4d4d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: 'black' }}>Пока нет калькуляторов.</p>
      )}
    </div>
  )
}