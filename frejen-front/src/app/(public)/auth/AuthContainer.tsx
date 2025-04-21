import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { SignInContainer } from './SignInContainer'
import { SignUpContainer } from './SignUpContainer'

const TAB_SIGN_IN = 'signIn'
const TAB_SIGN_UP = 'signUp'

export function AuthContainer() {
  return (
    <main className="max-xs:items-start flex h-fit min-h-[calc(100dvh-4rem)] items-center justify-center py-8">
      <Tabs
        defaultValue={TAB_SIGN_IN}
        className="max-xs:w-full max-xs:px-2 w-[400px]"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value={TAB_SIGN_IN}>Sign-in</TabsTrigger>
          <TabsTrigger value={TAB_SIGN_UP}>Sign-up</TabsTrigger>
        </TabsList>
        <SignInContainer tab={TAB_SIGN_IN} />
        <SignUpContainer tab={TAB_SIGN_UP} />
      </Tabs>
    </main>
  )
}
