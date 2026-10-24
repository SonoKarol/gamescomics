import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between bg-gc-newsprint border-2 border-dashed border-gc-ink/40 p-4">
      <div>
        <h2 className="font-bold text-lg">Hai già un account?</h2>
        <p className="text-sm text-gc-ink/75">Accedi per ritrovare indirizzi e ordini.</p>
      </div>
      <LocalizedClientLink href="/account" className="btn btn-light h-11 text-lg" data-testid="sign-in-button">
        Accedi
      </LocalizedClientLink>
    </div>
  )
}

export default SignInPrompt
