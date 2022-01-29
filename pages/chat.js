import { Box, TextField } from '@skynexui/components'
import React, { useEffect, useState } from 'react'
import appConfig from '../config.json'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import { ButtonSendSticker } from '../src/components/ButtonSendStickers'
import MessageList from '../src/components/MessageList'
import Header from '../src/components/Header'

const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyNzAyNSwiZXhwIjoxOTU4OTAzMDI1fQ.9Wylutzf39Kg8Sk57HkR75SJsKMmqjgGhg46pfyPr88'

const SUPABASE_URL = 'https://dymknudbzsxahmpkyoxi.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function escutaMenssagemRealTime(adicionaMensagem) {
  return supabaseClient
    .from('mensagens')
    .on('INSERT', respostaLive => {
      adicionaMensagem(respostaLive.new)
    })
    .subscribe()
}

export default function ChatPage() {
  const roteamento = useRouter()
  const usuarioLogado = roteamento.query.username
  const [mensagem, setMensagem] = useState('')
  const [messageList, setMessageList] = useState([])

  useEffect(() => {
    supabaseClient
      .from('mensagens')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => {
        setMessageList(data)
      })
    escutaMenssagemRealTime(novaMensagem => {
      console.log('Nova mensagem', novaMensagem)
      setMessageList(valorAtualLista => {
        return [novaMensagem, ...valorAtualLista]
      })
    })
  }, [])

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      de: usuarioLogado,
      text: novaMensagem
    }

    supabaseClient
      .from('mensagens')
      .insert([mensagem])
      .then(() => {
        setMensagem('')
      })
  }

  return (
    <Box
      styleSheet={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://cdn-media-2.freecodecamp.org/w1280/5f9c9cfc740569d1a4ca3543.jpg)  `,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px'
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            width: '100%',
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px'
          }}
        >
          <MessageList mensagens={messageList} />

          <Box
            as="form"
            styleSheet={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <TextField
              value={mensagem}
              onChange={event => {
                const valor = event.target.value
                setMensagem(valor)
              }}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  handleNovaMensagem(mensagem)
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200]
              }}
            />
            <ButtonSendSticker
              onStickerClick={sticker => {
                handleNovaMensagem(':sticker:' + sticker)
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box
        styleSheet={{
          position: 'relative',
          display: 'flex',
          color: appConfig.theme.colors.neutrals[300],
          padding: '5px',
          width: '23%',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[600],
          // border: '1px solid',
          margin: '0 10px',
          minHeight: '95%'
        }}
      >
        Participantes
      </Box>
    </Box>
  )
}
