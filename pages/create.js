import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function CreateCalculator() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [functions, setFunctions] = useState([{ name: '', price: '' }])
  const router = useRouter()

  const handleAddFunction = () => {
    setFunctions([...functions, { name: '', price: '' }])
  }

  const handleFunctionChange = (index, field, value) => {
    const updatedFunctions = [...functions]
    updatedFunctions[index][field] = value
    setFunctions(updatedFunctions)
  }

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    if (!slug.trim()) {
      alert('Введите адрес калькулятора (slug)')
      return
    }

    // Проверяем, есть ли уже такой slug
    const { data: existingSlug } = await supabase
      .from('calculators')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingSlug) {
      alert('Такой адрес уже занят. Придумайте другой.')
      return
    }

    const { error } = await supabase.from('calculators').insert([
      {
        user_id: user.id,
        title,
        slug,
        functions,
      }
    ])

    if (error) {
      alert('Ошибка сохранения: ' + error.message)
      console.error('Ошибка сохранения:', error.message)
    } else {
      // После успешного сохранения — сразу переход на страницу калькулятора
      router.push(`/${slug}`)
    }
  }

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Создать калькулятор</h1>

      <input
        type="text"
        placeholder="Название калькулятора"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: 20, padding: 8, width: '100%', fontSize: 16 }}
      />

      <input
        type="text"
        placeholder="Адрес калькулятора (например: my-calc)"
        value={slug}
        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
        style={{ marginBottom: 20, padding: 8, width: '100%', fontSize: 16 }}
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

      <button
        onClick={handleAddFunction}
        style={{
          marginTop: 20,
          background: '#4a3e2d',
          color: 'white',
          padding: '10px 20px',
          fontSize: 16,
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer'
        }}
      >
        ➕ Добавить функцию
      </button>

      <br /><br />

      <button
        onClick={handleSave}
        style={{
          background: '#2ecc71',
          color: 'white',
          padding: '10px 20px',
          fontSize: 16,
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer'
        }}
      >
        💾 Сохранить калькулятор
      </button>
    </div>
  )
}