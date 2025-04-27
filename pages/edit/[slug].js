import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

export default function EditCalculator() {
  const router = useRouter()
  const { slug } = router.query

  const [loading, setLoading] = useState(true)
  const [calculator, setCalculator] = useState(null)
  const [title, setTitle] = useState('')
  const [functions, setFunctions] = useState([])

  useEffect(() => {
    if (slug) {
      fetchCalculator()
    }
  }, [slug])

  async function fetchCalculator() {
    const { data, error } = await supabase
      .from('calculators')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Ошибка загрузки калькулятора:', error.message)
    } else {
      setCalculator(data)
      setTitle(data.title || '')
      setFunctions(data.functions || [])
    }
    setLoading(false)
  }

  const handleFunctionChange = (index, field, value) => {
    const updatedFunctions = [...functions]
    updatedFunctions[index][field] = value
    setFunctions(updatedFunctions)
  }

  const handleSave = async () => {
    const { error } = await supabase
      .from('calculators')
      .update({
        title,
        functions
      })
      .eq('slug', slug)

    if (error) {
      console.error('Ошибка сохранения:', error.message)
    } else {
      alert('Калькулятор успешно обновлён!')
      router.push('/dashboard')
    }
  }

  if (loading) {
    return <div style={{ padding: 40, fontFamily: 'sans-serif' }}><h1>Загрузка...</h1></div>
  }

  if (!calculator) {
    return <div style={{ padding: 40, fontFamily: 'sans-serif' }}><h1>Калькулятор не найден</h1></div>
  }

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Редактировать калькулятор</h1>

      <input
        type="text"
        placeholder="Название калькулятора"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: 20, padding: 10, width: '100%', fontSize: 16 }}
      />

      <h3>Функции:</h3>

      {functions.map((func, index) => (
        <div key={index} style={{ marginBottom: 10 }}>
          <input
            type="text"
            placeholder="Название функции"
            value={func.name}
            onChange={(e) => handleFunctionChange(index, 'name', e.target.value)}
            style={{ marginRight: 10, padding: 8, fontSize: 14 }}
          />
          <input
            type="number"
            placeholder="Цена"
            value={func.price}
            onChange={(e) => handleFunctionChange(index, 'price', e.target.value)}
            style={{ padding: 8, fontSize: 14 }}
          />
        </div>
      ))}

      <br />

      <button
        onClick={handleSave}
        style={{
          background: '#2ecc71',
          color: 'white',
          padding: '10px 20px',
          fontSize: 16,
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          marginRight: 10
        }}
      >
        💾 Сохранить изменения
      </button>

      <button
        onClick={() => router.push('/dashboard')}
        style={{
          background: '#4a3e2d',
          color: 'white',
          padding: '10px 20px',
          fontSize: 16,
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer'
        }}
      >
        🔙 Назад
      </button>
    </div>
  )
}