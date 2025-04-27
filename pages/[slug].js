import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function CalculatorPage() {
  const router = useRouter()
  const { slug } = router.query
  const [calculator, setCalculator] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return // ждем, пока роутер загрузит slug

    async function fetchCalculator() {
      const { data, error } = await supabase
        .from('calculators')
        .select('*')
        .eq('slug', slug)
        .single() // потому что slug уникальный, нужен только 1 результат

      if (error) {
        console.error('Ошибка загрузки калькулятора:', error.message)
        setError('Калькулятор не найден')
      } else {
        setCalculator(data)
      }
    }

    fetchCalculator()
  }, [slug])

  if (error) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Ошибка</h1>
        <p>{error}</p>
      </div>
    )
  }

  if (!calculator) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Загрузка...</h1>
      </div>
    )
  }

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>{calculator.title}</h1>

      <h3>Функции калькулятора:</h3>
      {calculator.functions.length > 0 ? (
        <ul>
          {calculator.functions.map((func, index) => (
            <li key={index}>
              {func.name} — {func.price} ₽
            </li>
          ))}
        </ul>
      ) : (
        <p>Функций пока нет.</p>
      )}
    </div>
  )
}