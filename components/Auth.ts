import {
  useState
} from 'react'
import {
  supabase
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../utils/supabaseClient' or it... Remove this comment to see the full error message
} from '../utils/supabaseClient'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (email: any) => {
    try {
      setLoading(true)
      const {
        error
      } = await supabase.auth.signIn({
        email
      })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
      div className = "row flex flex-center" >
      <
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
      div className = "col-6 form-widget" >
      <
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'h1'.
      h1 className = "header" > Supabase + Next.js < /h1> <
      // @ts-expect-error ts-migrate(1101) FIXME: 'with' statements are not allowed in strict mode.
      p className = "description" > Sign in via magic link with your email below < /p> <
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
      div >
      <
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'input'.
      input className = "inputField"
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'type'.
      type = "email"
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'placeholder'.
      placeholder = "Your email"
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'value'.
      value = {
        email
      }
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'onChange'.
      onChange = {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'e'.
        (e) => setEmail(e.target.value)
      }
      // @ts-expect-error ts-migrate(2362) FIXME: The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
      /> <
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
      /div> <
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
      div >
      <
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'button'.
      button onClick = {
        (e: any) => {
          e.preventDefault()
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'handleLogin'.
          handleLogin(email)
        }
      }
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'className'.
      className = "button block"
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'disabled'.
      disabled = {
        // @ts-expect-error ts-migrate(18004) FIXME: No value exists in scope for the shorthand propert... Remove this comment to see the full error message
        loading
      } >
      <
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'span'.
      span > {
        // @ts-expect-error ts-migrate(18004) FIXME: No value exists in scope for the shorthand propert... Remove this comment to see the full error message
        loading ? 'Loading' : 'Send magic link'
      // @ts-expect-error ts-migrate(2362) FIXME: The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
      } < /span> <
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'button'.
      /button> <
      /div> <
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
      /div> <
      /div>
  );
}