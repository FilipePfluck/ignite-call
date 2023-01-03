import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { signIn, useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { ArrowRight } from 'phosphor-react'

import { Header, Container } from '../styles'
import * as S from './styles'

const ConnectCalendar = () => {
  const session = useSession()
  const router = useRouter()

  const hasAuthError = !!router.query.error
  const isSignedIn = session.status === 'authenticated'

  const navigateToNextStep = async () => {
    await router.push('/register/time-intervals')
  }

  return (
    <>
      <NextSeo title="Conecte sua agenda | Ignite Call" noindex />
      <Container>
        <Header>
          <Heading as="strong">Conecte sua agenda</Heading>
          <Text>
            Conecte o seu calendário para verificar automaticamente as horas
            ocupadas e os novos eventos à medida em que são agendados
          </Text>

          <MultiStep size={4} currentStep={2} />
        </Header>

        <S.ConnectBox>
          <S.ConnectItem>
            <Text>Google Calendar</Text>
            {isSignedIn ? (
              <Button size="sm" disabled>
                Conectado
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => signIn('google')}
              >
                Conectar
              </Button>
            )}
          </S.ConnectItem>

          {hasAuthError && (
            <S.AuthError size="sm">
              Falha ao se conectar ao Google, verifique se você habilitou as
              permissões de acesso ao Google Calendar
            </S.AuthError>
          )}

          <Button
            type="submit"
            disabled={!isSignedIn}
            onClick={navigateToNextStep}
          >
            Próximo passo
            <ArrowRight />
          </Button>
        </S.ConnectBox>
      </Container>
    </>
  )
}

export default ConnectCalendar
