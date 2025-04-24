import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mmcossiwombaaffwfiss.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tY29zc2l3b21iYWFmZndmaXNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMTY4OTEsImV4cCI6MjA2MDg5Mjg5MX0.CWb_gp0nRUmAtuRBMHiCzKpmu1_-bsWFb5vdt77jFnI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)