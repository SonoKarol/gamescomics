import React from "react"


import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 small:py-12" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto flex flex-col">
        <div className="grid grid-cols-1 small:grid-cols-[240px_1fr] gap-8 py-10 panel p-6 small:p-10 mt-8 small:mt-0">
          <div>{customer && <AccountNav customer={customer} />}</div>
          <div className="flex-1">{children}</div>
        </div>
        <div className="flex flex-col small:flex-row items-end justify-between py-12 gap-8">
          <div>
            <h3 className="comic-title text-3xl mb-4">Hai domande?</h3>
            <span className="txt-medium">
              Per qualsiasi domanda scrivici: rispondiamo entro un giorno lavorativo.
            </span>
          </div>
          <div>
            <a href="mailto:info@gamescomics.it" className="btn btn-light h-11 text-lg">
              Scrivici
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
